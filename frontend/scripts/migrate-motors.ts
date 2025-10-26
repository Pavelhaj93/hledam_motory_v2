import {createClient} from '@sanity/client'
import fs from 'fs'
import path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({path: '.env.local'})

// Sanity client configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ekg3ngzk',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'test',
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-09-25',
})

// Types for the migration
interface ProductionMotor {
  _id: {$oid: string}
  markName: string
  slug: string
  name: string
  description: string
  price: number
  createdAt: {$date: string}
  updatedAt: {$date: string}
  images: string[]
}

interface SanityBrand {
  _id: string
  name: string
  slug: {current: string}
}

interface SanityRepasovanyMotor {
  _type: 'repasovanyMotor'
  name: string
  slug: {
    _type: 'slug'
    current: string
  }
  brand?: {
    _type: 'reference'
    _ref: string
  }
  engineCodes: string[]
  displacement?: number
  power?: string
  fuelType?: string
  description: string
  price: number
  currency: string
  inStock: boolean
  featured: boolean
  images?: {
    _type: 'image'
    asset: {
      _type: 'reference'
      _ref: string
    }
    alt?: string
  }[]
  specifications?: {
    label: string
    value: string
  }[]
  compatibility: string[]
  detailedDescription?: any[]
  warrantyPeriod?: string
  condition: string
}

// Helper function to extract engine codes from description
function extractEngineCodes(name: string, description: string): string[] {
  const codes: string[] = []

  // Extract from name - look for patterns like "kód motoru-XXX,YYY,ZZZ"
  const nameMatch = name.match(/kód motoru[-\s]*([A-Z0-9,\s]+)/i)
  if (nameMatch) {
    const codesFromName = nameMatch[1]
      .split(',')
      .map((code) => code.trim())
      .filter((code) => code.length > 0)
    codes.push(...codesFromName)
  }

  // Extract from description
  const descMatch = description.match(/kód motoru[-\s]*([A-Z0-9,\s]+)/i)
  if (descMatch) {
    const codesFromDesc = descMatch[1]
      .split(',')
      .map((code) => code.trim())
      .filter((code) => code.length > 0)
    codes.push(...codesFromDesc)
  }

  return [...new Set(codes)] // Remove duplicates
}

// Helper function to extract power from name/description
function extractPower(name: string): string | undefined {
  const powerMatch = name.match(/(\d+[-\s]*\d*)\s*KW/i)
  if (powerMatch) {
    return `${powerMatch[1]} kW`
  }
  return undefined
}

// Helper function to extract displacement from name
function extractDisplacement(name: string): number | undefined {
  const dispMatch = name.match(/(\d+\.?\d*)\s*[lL]?(?:\s|TDI|HDI|CDI|D)/i)
  if (dispMatch) {
    return parseFloat(dispMatch[1])
  }
  return undefined
}

// Helper function to extract fuel type
function extractFuelType(name: string): string {
  if (name.match(/TDI|HDI|CDI|JTD|dCI|D\s/i)) {
    return 'Diesel'
  }
  if (name.match(/TSI|TFSI|Turbo|Ecoboost/i)) {
    return 'Benzín'
  }
  return 'Diesel' // Default for most motors in the data
}

// Helper function to extract car models from description
function extractCompatibility(description: string): string[] {
  const models: string[] = []

  // Look for "modely aut-" pattern
  const modelMatch = description.match(/modely aut[-\s]*(.+?)(?:\n|rok výroby)/i)
  if (modelMatch) {
    const modelString = modelMatch[1]
    const extractedModels = modelString
      .split(',')
      .map((model) => model.trim())
      .filter((model) => model.length > 0)
    models.push(...extractedModels)
  }

  return models
}

// Helper function to create specifications from the motor data
function createSpecifications(motor: ProductionMotor): {label: string; value: string}[] {
  const specs: {label: string; value: string}[] = []

  const power = extractPower(motor.name)
  if (power) {
    specs.push({label: 'Výkon', value: power})
  }

  const displacement = extractDisplacement(motor.name)
  if (displacement) {
    specs.push({label: 'Objem', value: `${displacement}L`})
  }

  const fuelType = extractFuelType(motor.name)
  specs.push({label: 'Palivo', value: fuelType})

  // Extract year range if available
  const yearMatch = motor.description.match(/rok výroby[:\s]*(\d{4}[-\s]*\d{4}|\d{4})/i)
  if (yearMatch) {
    specs.push({label: 'Rok výroby', value: yearMatch[1]})
  }

  return specs
}

// Helper function to upload image to Sanity
async function uploadImageToSanity(imageUrl: string, altText: string): Promise<string> {
  try {
    console.log(`Uploading image: ${imageUrl}`)
    const response = await fetch(imageUrl)

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }

    const buffer = await response.arrayBuffer()
    const asset = await client.assets.upload('image', Buffer.from(buffer), {
      filename: `motor-${Date.now()}.jpg`,
    })

    return asset._id
  } catch (error) {
    console.error(`Failed to upload image ${imageUrl}:`, error)
    throw error
  }
}

// Helper function to find or create brand
async function findOrCreateBrand(markName: string): Promise<string> {
  try {
    // First, try to find existing brand
    const existingBrand = await client.fetch<SanityBrand | null>(
      `*[_type == "brand" && name == $name][0]`,
      {name: markName},
    )

    if (existingBrand) {
      console.log(`Found existing brand: ${markName}`)
      return existingBrand._id
    }

    // Create new brand if not found
    console.log(`Creating new brand: ${markName}`)
    const brandSlug = markName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    const brand = await client.create({
      _type: 'brand',
      name: markName,
      slug: {
        _type: 'slug',
        current: brandSlug,
      },
      isPopular: ['BMW', 'Audi', 'Volkswagen', 'Mercedes', 'Ford', 'Opel'].includes(markName),
    })

    return brand._id
  } catch (error) {
    console.error(`Failed to find/create brand ${markName}:`, error)
    throw error
  }
}

// Main migration function
export async function migrateMotorsToSanity(jsonFilePath: string) {
  try {
    console.log('Starting motor migration to Sanity...')

    // Read the JSON file
    const jsonData = fs.readFileSync(jsonFilePath, 'utf8')
    const motors: ProductionMotor[] = JSON.parse(jsonData)

    console.log(`Found ${motors.length} motors to migrate`)

    let successCount = 0
    let errorCount = 0

    for (const motor of motors) {
      try {
        console.log(`\nProcessing motor: ${motor.name}`)

        // Check if motor already exists
        const existingMotor = await client.fetch(
          `*[_type == "repasovanyMotor" && slug.current == $slug][0]`,
          {slug: motor.slug},
        )

        if (existingMotor) {
          console.log(`Motor with slug "${motor.slug}" already exists, skipping...`)
          continue
        }

        // Find or create brand
        const brandId = await findOrCreateBrand(motor.markName)

        // Extract engine codes
        const engineCodes = extractEngineCodes(motor.name, motor.description)

        // Extract compatibility
        const compatibility = extractCompatibility(motor.description)

        // Create specifications
        const specifications = createSpecifications(motor)

        // Upload images
        const imageAssets: any[] = []
        for (let i = 0; i < Math.min(motor.images.length, 5); i++) {
          // Limit to 5 images
          try {
            const imageUrl = motor.images[i]
            const assetId = await uploadImageToSanity(imageUrl, `${motor.name} - Image ${i + 1}`)
            imageAssets.push({
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: assetId,
              },
              alt: `${motor.name} - Obrázek ${i + 1}`,
            })
          } catch (imageError) {
            console.warn(`Failed to upload image ${i + 1} for motor ${motor.name}:`, imageError)
          }
        }

        // Create the repasovany motor document
        const repasovanyMotor: SanityRepasovanyMotor = {
          _type: 'repasovanyMotor',
          name: motor.name,
          slug: {
            _type: 'slug',
            current: motor.slug,
          },
          brand: {
            _type: 'reference',
            _ref: brandId,
          },
          engineCodes,
          displacement: extractDisplacement(motor.name),
          power: extractPower(motor.name),
          fuelType: extractFuelType(motor.name),
          description: motor.description,
          price: motor.price,
          currency: 'CZK',
          inStock: true, // Assume in stock
          featured: motor.price >= 60000, // Feature expensive motors
          images: imageAssets,
          specifications,
          compatibility,
          warrantyPeriod: '12 měsíců',
          condition: 'Po profesionální renovaci',
        }

        // Create the document in Sanity
        const result = await client.create(repasovanyMotor)
        console.log(`✅ Successfully created motor: ${result._id}`)
        successCount++

        // Add delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500))
      } catch (error) {
        console.error(`❌ Failed to migrate motor "${motor.name}":`, error)
        errorCount++
      }
    }

    console.log(`\n🎉 Migration completed!`)
    console.log(`✅ Successfully migrated: ${successCount} motors`)
    console.log(`❌ Failed: ${errorCount} motors`)
  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  }
}

// Helper function to run the migration
export async function runMigration() {
  const jsonFilePath = path.join(process.cwd(), 'prod.Motor.json')

  if (!fs.existsSync(jsonFilePath)) {
    console.error(`JSON file not found at: ${jsonFilePath}`)
    console.log('Please ensure the prod.Motor.json file is in the project root directory.')
    return
  }

  try {
    await migrateMotorsToSanity(jsonFilePath)
  } catch (error) {
    console.error('Migration script failed:', error)
    process.exit(1)
  }
}

// If this file is run directly
if (require.main === module) {
  runMigration()
}

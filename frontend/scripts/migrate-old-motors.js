const {createClient} = require('@sanity/client')
const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')

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

// Helper function to extract engine codes from name and description
function extractEngineCodes(name, description) {
  const codes = []

  // Extract from name - look for patterns like "AKL", "K4MA690", etc.
  const nameCodeMatch = name.match(/([A-Z0-9]{3,8})\s*(?:\d{4})?/g)
  if (nameCodeMatch) {
    codes.push(...nameCodeMatch.map((code) => code.trim()))
  }

  // Extract from description - look for "Kód motoru: XXX"
  const descMatch = description.match(/kód motoru[-\s]*:?\s*([A-Z0-9,\s]+)/i)
  if (descMatch) {
    const codesFromDesc = descMatch[1]
      .split(',')
      .map((code) => code.trim())
      .filter((code) => code.length > 0 && code.length <= 10)
    codes.push(...codesFromDesc)
  }

  return [...new Set(codes)].filter((code) => code.length >= 2) // Remove duplicates and very short codes
}

// Helper function to extract displacement from name
function extractDisplacement(name) {
  const dispMatch = name.match(/(\d+\.?\d*)\s*[lL]?(?:\s|i|TDI|HDI|CDI|MPI|V)/i)
  if (dispMatch) {
    return `${dispMatch[1]}L`
  }
  return undefined
}

// Helper function to extract power from name/description
function extractPower(name, description) {
  // Look in name first
  let powerMatch = name.match(/(\d+[-\s]*\d*)\s*[kK][wW]/i)
  if (powerMatch) {
    return `${powerMatch[1]} kW`
  }

  // Look in description
  powerMatch = description.match(/(\d+[-\s]*\d*)\s*[kK][wW]/i)
  if (powerMatch) {
    return `${powerMatch[1]} kW`
  }

  return undefined
}

// Helper function to extract fuel type
function extractFuelType(name) {
  if (name.match(/TDI|HDI|CDI|JTD|dCI|CRDI/i)) {
    return 'diesel'
  }
  if (name.match(/TSI|TFSI|MPI|GDI|FSI|16V|8V/i)) {
    return 'benzin'
  }
  // Default based on common patterns in the data
  return 'benzin'
}

// Helper function to extract mileage from description
function extractMileage(description) {
  const mileageMatch = description.match(/nájezdem?\s*(\d+[.\s]*\d*[xk]*\s*km)/i)
  if (mileageMatch) {
    return mileageMatch[1].replace(/\s+/g, ' ')
  }

  // Fallback pattern
  const mileageMatch2 = description.match(/(\d+[xk]+\s*km)/i)
  if (mileageMatch2) {
    return mileageMatch2[1]
  }

  return 'Neuvedeno'
}

// Helper function to extract year from description or name
function extractYear(name, description) {
  // Look for 4-digit year
  const yearMatch = name.match(/(\d{4})/) || description.match(/(\d{4})/)
  if (yearMatch) {
    const year = parseInt(yearMatch[1])
    if (year >= 1990 && year <= 2025) {
      return yearMatch[1]
    }
  }
  return undefined
}

// Helper function to determine condition from name and description
function determineCondition(name, description) {
  if (name.toLowerCase().includes('kompletní') || description.toLowerCase().includes('kompletní')) {
    return 'kompletni'
  }
  if (name.toLowerCase().includes('holý') || description.toLowerCase().includes('holý')) {
    return 'nekompletni'
  }
  if (
    description.toLowerCase().includes('funkční') ||
    description.toLowerCase().includes('plně funkční')
  ) {
    return 'funkcni'
  }
  return 'funkcni' // Default
}

// Helper function to extract compatibility/vehicle models
function extractCompatibility(name, description) {
  const models = []

  // Extract from name - look for car model names
  const nameModels = name.match(
    /(Škoda|Skoda|Volkswagen|Audi|BMW|Mercedes|Ford|Opel|Peugeot|Fiat|Seat|Dacia|Alfa Romeo|Hyundai|Kia)\s+([A-Za-z0-9\s]+)/gi,
  )
  if (nameModels) {
    nameModels.forEach((match) => {
      models.push(match.trim())
    })
  }

  // Extract specific vehicle mentions from description
  const vehiclePatterns = [
    /pasuje do[:\s]*(.+?)(?:\n|\.)/i,
    /kompatibilní[:\s]*(.+?)(?:\n|\.)/i,
    /vozidel[:\s]*(.+?)(?:\n|\.)/i,
  ]

  vehiclePatterns.forEach((pattern) => {
    const match = description.match(pattern)
    if (match) {
      const vehicles = match[1]
        .split(',')
        .map((v) => v.trim())
        .filter((v) => v.length > 0)
      models.push(...vehicles)
    }
  })

  return [...new Set(models)].slice(0, 10) // Remove duplicates and limit
}

// Helper function to create specifications
function createSpecifications(motor) {
  const specs = []

  const displacement = extractDisplacement(motor.name)
  if (displacement) {
    specs.push({label: 'Objem motoru', value: displacement})
  }

  const power = extractPower(motor.name, motor.description)
  if (power) {
    specs.push({label: 'Výkon', value: power})
  }

  const fuelType = extractFuelType(motor.name)
  specs.push({label: 'Typ paliva', value: fuelType === 'diesel' ? 'Diesel' : 'Benzín'})

  const mileage = extractMileage(motor.description)
  specs.push({label: 'Nájezd', value: mileage})

  const year = extractYear(motor.name, motor.description)
  if (year) {
    specs.push({label: 'Rok', value: year})
  }

  // Extract engine codes
  const engineCodes = extractEngineCodes(motor.name, motor.description)
  if (engineCodes.length > 0) {
    specs.push({label: 'Kód motoru', value: engineCodes.join(', ')})
  }

  return specs
}

// Helper function to upload image to Sanity
async function uploadImageToSanity(imageUrl, altText) {
  try {
    console.log(`Uploading image: ${imageUrl}`)
    const response = await fetch(imageUrl)

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }

    const buffer = await response.arrayBuffer()
    const asset = await client.assets.upload('image', Buffer.from(buffer), {
      filename: `old-motor-${Date.now()}.jpg`,
    })

    return asset._id
  } catch (error) {
    console.error(`Failed to upload image ${imageUrl}:`, error)
    throw error
  }
}

// Helper function to find or create brand
async function findOrCreateBrand(markName) {
  try {
    // Normalize brand name
    const normalizedName = markName === 'Alfa Romeo' ? 'Alfa Romeo' : markName

    // First, try to find existing brand
    const existingBrand = await client.fetch(`*[_type == "brand" && name == $name][0]`, {
      name: normalizedName,
    })

    if (existingBrand) {
      console.log(`Found existing brand: ${normalizedName}`)
      return existingBrand._id
    }

    // Create new brand if not found
    console.log(`Creating new brand: ${normalizedName}`)
    const brandSlug = normalizedName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    const brand = await client.create({
      _type: 'brand',
      name: normalizedName,
      slug: {
        _type: 'slug',
        current: brandSlug,
      },
      isPopular: [
        'BMW',
        'Audi',
        'Volkswagen',
        'Mercedes',
        'Ford',
        'Opel',
        'Škoda',
        'Skoda',
      ].includes(normalizedName),
    })

    return brand._id
  } catch (error) {
    console.error(`Failed to find/create brand ${markName}:`, error)
    throw error
  }
}

// Helper function to extract damage description
function extractDamageDescription(description) {
  const damagePatterns = [
    /demontované?\s+(.+?)(?:\n|\.)/i,
    /chybí\s+(.+?)(?:\n|\.)/i,
    /bez\s+(.+?)(?:\n|\.)/i,
    /POZOR\s+(.+?)(?:\n|\.)/i,
  ]

  for (const pattern of damagePatterns) {
    const match = description.match(pattern)
    if (match) {
      return match[1].trim()
    }
  }

  return undefined
}

// Main migration function
async function migrateOldMotorsToSanity(jsonFilePath) {
  try {
    console.log('Starting old motors migration to Sanity...')

    // Read the JSON file
    const jsonData = fs.readFileSync(jsonFilePath, 'utf8')
    const motors = JSON.parse(jsonData)

    console.log(`Found ${motors.length} old motors to migrate`)

    let successCount = 0
    let errorCount = 0

    for (const motor of motors) {
      try {
        console.log(`\nProcessing old motor: ${motor.name}`)

        // Create a new slug for stary motor to avoid conflicts
        const newSlug = `stary-${motor.slug}`

        // Check if motor already exists
        const existingMotor = await client.fetch(
          `*[_type == "staryMotor" && slug.current == $slug][0]`,
          {slug: newSlug},
        )

        if (existingMotor) {
          console.log(`Old motor with slug "${newSlug}" already exists, skipping...`)
          continue
        }

        // Find or create brand
        const brandId = await findOrCreateBrand(motor.markName)

        // Extract engine codes
        const engineCodes = extractEngineCodes(motor.name, motor.description)

        // Extract compatibility
        const compatibility = extractCompatibility(motor.name, motor.description)

        // Create specifications
        const specifications = createSpecifications(motor)

        // Extract mileage
        const mileage = extractMileage(motor.description)

        // Extract year
        const year = extractYear(motor.name, motor.description)

        // Determine condition
        const condition = determineCondition(motor.name, motor.description)

        // Extract damage description
        const damageDescription = extractDamageDescription(motor.description)

        // Upload images
        const imageAssets = []
        for (let i = 0; i < Math.min(motor.images.length, 5); i++) {
          try {
            const imageUrl = motor.images[i]
            const assetId = await uploadImageToSanity(imageUrl, `${motor.name} - Obrázek ${i + 1}`)
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

        // Create detailed description as block content
        const detailedDescription = [
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: motor.description,
                marks: [],
              },
            ],
            markDefs: [],
          },
        ]

        // Create the stary motor document
        const staryMotor = {
          _type: 'staryMotor',
          name: motor.name,
          slug: {
            _type: 'slug',
            current: newSlug,
          },
          brand: {
            _type: 'reference',
            _ref: brandId,
          },
          engineCodes,
          displacement: extractDisplacement(motor.name),
          power: extractPower(motor.name, motor.description),
          fuelType: extractFuelType(motor.name),
          description: motor.description.split('\n')[0] || motor.description.substring(0, 300), // Use first line or truncate
          detailedDescription,
          price: motor.price,
          currency: 'CZK',
          inStock: true,
          featured: motor.price >= 20000, // Feature more expensive motors
          images: imageAssets,
          specifications,
          compatibility,
          mileage,
          year,
          condition,
          damageDescription,
        }

        // Create the document in Sanity
        const result = await client.create(staryMotor)
        console.log(`✅ Successfully created old motor: ${result._id}`)
        successCount++

        // Add delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500))
      } catch (error) {
        console.error(`❌ Failed to migrate old motor "${motor.name}":`, error)
        errorCount++
      }
    }

    console.log(`\n🎉 Old motors migration completed!`)
    console.log(`✅ Successfully migrated: ${successCount} old motors`)
    console.log(`❌ Failed: ${errorCount} old motors`)
  } catch (error) {
    console.error('Old motors migration failed:', error)
    throw error
  }
}

// Helper function to run the migration
async function runOldMotorsMigration() {
  const jsonFilePath = path.join(process.cwd(), 'prod.OldMotor.json')

  if (!fs.existsSync(jsonFilePath)) {
    console.error(`JSON file not found at: ${jsonFilePath}`)
    console.log('Please ensure the prod.OldMotor.json file is in the project root directory.')
    return
  }

  try {
    await migrateOldMotorsToSanity(jsonFilePath)
  } catch (error) {
    console.error('Old motors migration script failed:', error)
    process.exit(1)
  }
}

// Run the migration automatically when this file is executed
runOldMotorsMigration()
  .then(() => {
    console.log('Migration completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Migration failed:', error)
    process.exit(1)
  })

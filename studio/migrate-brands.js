#!/usr/bin/env node

/**
 * This script imports brand data and migrates existing products to use brand references
 * Run with: node migrate-brands.js
 */

import {createClient} from '@sanity/client'
import fs from 'fs'
import path from 'path'
import {fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Initialize Sanity client
const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'ekg3ngzk',
  dataset: process.env.SANITY_STUDIO_DATASET || 'test',
  useCdn: false,
  token:
    process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
})

async function importBrands() {
  console.log('🚗 Importing brand data...')

  try {
    // Read brand data
    const brandsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'sample-brands.json'), 'utf8'),
    )

    // Import each brand
    for (const brand of brandsData) {
      const result = await client.createOrReplace(brand)
      console.log(`✅ Created/updated brand: ${brand.name}`)
    }

    console.log(`🎉 Successfully imported ${brandsData.length} brands!`)
  } catch (error) {
    console.error('❌ Error importing brands:', error)
  }
}

async function migrateProdutsBrands() {
  console.log('🔄 Migrating product brands to references...')

  try {
    // Get all products with string brand field
    const products = await client.fetch(`
      *[_type == "product" && defined(brand) && _type(brand) == "string"] {
        _id,
        brand,
        _rev
      }
    `)

    console.log(`Found ${products.length} products to migrate`)

    // Get all brands for lookup
    const brands = await client.fetch(`
      *[_type == "brand"] {
        _id,
        name
      }
    `)

    const brandLookup = brands.reduce((acc, brand) => {
      acc[brand.name] = brand._id
      return acc
    }, {})

    // Update each product
    for (const product of products) {
      const brandId = brandLookup[product.brand]

      if (brandId) {
        await client
          .patch(product._id)
          .set({
            brand: {
              _type: 'reference',
              _ref: brandId,
            },
          })
          .commit()

        console.log(`✅ Updated product ${product._id}: ${product.brand} -> reference`)
      } else {
        console.log(`⚠️  Brand not found for product ${product._id}: ${product.brand}`)
      }
    }

    console.log('🎉 Migration completed!')
  } catch (error) {
    console.error('❌ Error migrating products:', error)
  }
}

async function main() {
  console.log('🚀 Starting brand import and migration...')

  await importBrands()
  await migrateProdutsBrands()

  console.log('✨ All done!')
}

main().catch(console.error)

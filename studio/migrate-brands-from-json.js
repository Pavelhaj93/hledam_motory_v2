const fs = require('fs')
const {createClient} = require('@sanity/client')

// Initialize Sanity client
const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'ekg3ngzk',
  dataset: process.env.SANITY_STUDIO_DATASET || 'test',
  useCdn: false,
  token:
    process.env.SANITY_API_WRITE_TOKEN ||
    'sk7QMr8D7fFYSJ9P0BPPlF6V4k5KXTonN2NtpmcYjV16TqnhPsPbktoNJ4LL63y85WLbuBQAoSjFCYu0ueXvrhyK2FX73CNTOAeXmaBmuq03R1B6u80ovfSIBe9QVN8SYS1ZyN7owepoKlTTnUdzXvt6ZJ7hIsKukqf6CSE4R7HRtZBIshvL',
  apiVersion: '2024-01-01',
})

// Function to create URL-friendly slug
function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim('-') // Remove leading/trailing hyphens
}

// Your brand data from JSON
const brandNames = [
  'Morris',
  'ARO',
  'Vanden Plas',
  'Audi',
  'BMW',
  'Morgan',
  'Mini',
  'Humber',
  'Pontiac',
  'Hillman',
  'De Lorean',
  'Ford',
  'KTM',
  'Lada',
  'Maybach',
  'SsangYong',
  'Zastava',
  'Daewoo',
  'Pagani',
  'Proton',
  'Toyota',
  'ZIL',
  'DS Automobiles',
  'Felber',
  'Ferrari',
  'Izh',
  'Kia',
  'Koenigsegg',
  'Peugeot',
  'Alpine',
  'Saleen',
  'Tofas',
  'Alfa Romeo',
  'Austin',
  'BMW Alpina',
  'Buick',
  'Bristol',
  'Talbot',
  'Sunbeam',
  'Honda',
  'Land Rover',
  'LuAZ',
  'Lynx',
  'Artega',
  'Asia',
  'Aston Martin',
  'Rover',
  'Triumph',
  'Isuzu',
  'Lamborghini',
  'Mitsubishi',
  'Renault',
  'Samsung',
  'Volkswagen',
  'Caterham',
  'Citroën',
  'Innocenti',
  'UAZ',
  'Venturi',
  'Wiesmann',
  'Chrysler',
  'Simca',
  'Dacia',
  'Donkervoort',
  'Fiat',
  'Isdera',
  'Lancia',
  'Maserati',
  'Mazda',
  'Monteverdi',
  'Oltcit',
  'Opel',
  'Otosan',
  'Tesla',
  'Volvo',
  'Bitter',
  'Cizeta',
  'Daihatsu',
  'Fisker',
  'FSO',
  'Ginetta',
  'Iso',
  'Jaguar',
  'Moskwitch',
  'Opel / Vauxhall',
  'Porsche',
  'Santana',
  'Subaru',
  'Tatra',
  'De Tomaso',
  'TVR',
  'Cadillac',
  'Chevrolet',
  'GAZ',
  'GTA',
  'Wartburg',
  'Suzuki-Santana',
  'Seat',
  'Suzuki',
  'Bugatti',
  'Gumpert',
  'Hyundai',
  'Trabant',
  'Reliant',
  'Skoda',
  'Smart',
  'Chrysler (Spain)',
  'Infiniti',
  'Iveco',
  'Jeep',
  'Jensen',
  'Lotus',
  'Mercedes',
  'Panther',
  'Saab',
  'AC',
  'Dodge',
  'Autobianchi',
  'Bentley',
  'MG',
  'FSM',
  'Hummer',
  'Nissan',
  'ZAZ',
  'Lexus',
  'McLaren',
  'Rolls-Royce',
]

// Popular brands that should be featured in footer/katalog
const popularBrands = [
  'BMW',
  'Audi',
  'Mercedes',
  'Volkswagen',
  'Ford',
  'Toyota',
  'Honda',
  'Nissan',
  'Peugeot',
  'Renault',
  'Opel',
  'Fiat',
  'Skoda',
  'Hyundai',
  'Kia',
  'Mazda',
  'Mitsubishi',
  'Suzuki',
  'Subaru',
  'Volvo',
]

// Create brand documents with proper structure
function createBrandDocument(name, index) {
  const slug = createSlug(name)
  const isPopular = popularBrands.includes(name)

  return {
    _type: 'brand',
    name: name,
    slug: {
      _type: 'slug',
      current: slug,
    },
    isPopular: isPopular,
    // Logo will be added manually in Sanity Studio
  }
}

async function migrateBrands() {
  try {
    console.log('🚗 Starting brand migration...')
    console.log(`📊 Found ${brandNames.length} brands to migrate`)

    // Check if brands already exist
    const existingBrands = await client.fetch(`*[_type == "brand"]`)
    console.log(`📋 Found ${existingBrands.length} existing brands in Sanity`)

    if (existingBrands.length > 0) {
      console.log('⚠️  Warning: There are already brands in the database.')
      console.log('Do you want to continue? This will add new brands alongside existing ones.')
      // For now, we'll continue. In production, you might want to add a confirmation prompt.
    }

    // Create brand documents
    const brandDocuments = brandNames.map((name, index) => createBrandDocument(name, index))

    console.log('📝 Sample brand document:')
    console.log(JSON.stringify(brandDocuments[0], null, 2))

    // Create brands in batches
    const batchSize = 10
    let created = 0

    for (let i = 0; i < brandDocuments.length; i += batchSize) {
      const batch = brandDocuments.slice(i, i + batchSize)

      console.log(
        `🔄 Creating brands ${i + 1} to ${Math.min(i + batchSize, brandDocuments.length)}...`,
      )

      for (const brandDoc of batch) {
        try {
          // Check if brand with this slug already exists
          const existing = await client.fetch(`*[_type == "brand" && slug.current == $slug][0]`, {
            slug: brandDoc.slug.current,
          })

          if (existing) {
            console.log(`⏭️  Skipping "${brandDoc.name}" - already exists`)
            continue
          }

          const result = await client.create(brandDoc)
          console.log(`✅ Created: ${brandDoc.name} (${result._id})`)
          created++
        } catch (error) {
          console.error(`❌ Error creating ${brandDoc.name}:`, error.message)
        }
      }

      // Small delay between batches
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    console.log(`\\n🎉 Migration completed!`)
    console.log(`📊 Summary:`)
    console.log(`   • Total brands processed: ${brandNames.length}`)
    console.log(`   • New brands created: ${created}`)
    console.log(`   • Skipped (already exist): ${brandNames.length - created}`)

    console.log(`\\n📝 Next steps:`)
    console.log(`   1. Go to Sanity Studio`)
    console.log(`   2. Navigate to "Brands" section`)
    console.log(`   3. Add logos to each brand manually`)
    console.log(`   4. Mark popular brands if needed`)
    console.log(`   5. Alt text is automatically generated from brand name`)

    // Generate types after migration
    console.log(`\\n🔄 Regenerating TypeScript types...`)
    const {execSync} = require('child_process')
    try {
      execSync('npm run typegen', {cwd: '../frontend'})
      console.log(`✅ Types regenerated successfully`)
    } catch (error) {
      console.log(`⚠️  Please run 'npm run typegen' in the frontend directory manually`)
    }
  } catch (error) {
    console.error('💥 Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
migrateBrands()

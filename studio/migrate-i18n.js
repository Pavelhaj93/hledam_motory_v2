/**
 * One-off migration to introduce document-level internationalization (cs + de-AT).
 *
 * Phases (idempotent — safe to re-run):
 *   A. Tag every existing translated-collection document with language = 'cs'.
 *   S. Create per-locale singletons: homepage-{cs,de-AT}, siteSettings-{cs,de-AT}.
 *   B. Create a `translation.metadata` document linking each cs document.
 *   C. (only with --stubs) Duplicate each cs collection doc into a de-AT stub
 *      (currency EUR, slug/price kept as placeholders) and link it in the metadata.
 *
 * Usage:
 *   SANITY_API_WRITE_TOKEN=xxx node migrate-i18n.js            # phases A + S + B
 *   SANITY_API_WRITE_TOKEN=xxx node migrate-i18n.js --stubs    # + phase C
 *
 * The write token is read from the environment ONLY — never hardcode it.
 */

const {createClient} = require('@sanity/client')

const token = process.env.SANITY_API_WRITE_TOKEN
if (!token) {
  console.error('❌ Missing SANITY_API_WRITE_TOKEN environment variable.')
  process.exit(1)
}

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'ekg3ngzk'
const dataset = process.env.SANITY_STUDIO_DATASET || 'test'

const client = createClient({
  projectId,
  dataset,
  useCdn: false,
  token,
  apiVersion: '2024-01-01',
})

const CREATE_STUBS = process.argv.includes('--stubs')

// Collection types managed by @sanity/document-internationalization.
const COLLECTION_TYPES = [
  'repasovanyMotor',
  'staryMotor',
  'motorovaHlava',
  'prevodovka',
  'turbodmychadlo',
  'page',
  'post',
]

const stripDraft = (id) => id.replace(/^drafts\./, '')

/** Phase A — tag existing collection docs as Czech. */
async function tagExistingAsCs() {
  console.log('\n📍 Phase A — tagging existing documents as language = "cs"')
  for (const type of COLLECTION_TYPES) {
    const docs = await client.fetch(`*[_type == $type && !defined(language)]{_id}`, {type})
    if (!docs.length) {
      console.log(`   • ${type}: nothing to tag`)
      continue
    }
    let tx = client.transaction()
    for (const {_id} of docs) tx = tx.patch(_id, {set: {language: 'cs'}})
    await tx.commit()
    console.log(`   • ${type}: tagged ${docs.length} document(s)`)
  }
}

/** Phase S — create per-locale singleton documents for homepage and settings. */
async function createSingletons() {
  console.log('\n📍 Phase S — per-locale singletons (homepage, settings)')

  const seed = async (sourceId, type, baseFields) => {
    const source = await client.getDocument(sourceId).catch(() => null)
    for (const lang of ['cs', 'de-AT']) {
      const _id = `${sourceId}-${lang}`
      const existing = await client.getDocument(_id).catch(() => null)
      if (existing) {
        console.log(`   • ${_id}: already exists, skipping`)
        continue
      }
      const doc = {
        ...(source ? {...source} : baseFields),
        _id,
        _type: type,
        language: lang,
      }
      delete doc._rev
      delete doc._createdAt
      delete doc._updatedAt
      await client.createOrReplace(doc)
      console.log(`   • created ${_id}`)
    }
  }

  await seed('homepage', 'homepage', {title: 'Homepage'})
  await seed('siteSettings', 'settings', {title: 'Hledám motory'})
}

/** Phase B — create translation.metadata linking each cs document. */
async function linkTranslations() {
  console.log('\n📍 Phase B — creating translation.metadata for cs documents')
  for (const type of COLLECTION_TYPES) {
    const docs = await client.fetch(
      `*[_type == $type && language == "cs" && !(_id in path("drafts.**"))]{_id}`,
      {type},
    )
    for (const {_id} of docs) {
      const csId = stripDraft(_id)
      const metaId = `i18n.${csId}` // deterministic => idempotent
      const existing = await client.getDocument(metaId).catch(() => null)
      if (existing) continue
      await client.createOrReplace({
        _id: metaId,
        _type: 'translation.metadata',
        schemaTypes: [type],
        translations: [
          {_key: 'cs', value: {_type: 'reference', _ref: csId}},
        ],
      })
    }
    console.log(`   • ${type}: ensured metadata for ${docs.length} document(s)`)
  }
}

/** Phase C — duplicate each cs collection doc into a de-AT stub. */
async function createDeAtStubs() {
  console.log('\n📍 Phase C — creating de-AT stubs (currency EUR, placeholder price/slug)')
  for (const type of COLLECTION_TYPES) {
    const docs = await client.fetch(`*[_type == $type && language == "cs"]`, {type})
    let created = 0
    for (const source of docs) {
      const csId = stripDraft(source._id)
      const deId = `${csId}-de-AT`
      const existing = await client.getDocument(deId).catch(() => null)
      if (!existing) {
        const doc = {...source}
        delete doc._rev
        delete doc._createdAt
        delete doc._updatedAt
        doc._id = deId
        doc.language = 'de-AT'
        if ('currency' in doc) doc.currency = 'EUR'
        // slug & price are kept as placeholders for editors/AI to localize.
        await client.createOrReplace(doc)
        created++
      }
      // Link the de-AT doc into the existing metadata document.
      const metaId = `i18n.${csId}`
      const meta = await client.getDocument(metaId).catch(() => null)
      if (meta) {
        const hasDe = (meta.translations || []).some((t) => t._key === 'de-AT')
        if (!hasDe) {
          await client
            .patch(metaId)
            .setIfMissing({translations: []})
            .append('translations', [
              {_key: 'de-AT', value: {_type: 'reference', _ref: deId}},
            ])
            .commit()
        }
      }
    }
    console.log(`   • ${type}: ${created} stub(s) created / linked`)
  }
}

async function run() {
  console.log(`🌍 i18n migration on project ${projectId}, dataset "${dataset}"`)
  try {
    await tagExistingAsCs()
    await createSingletons()
    await linkTranslations()
    if (CREATE_STUBS) await createDeAtStubs()
    else console.log('\nℹ️  Skipped de-AT stubs (pass --stubs to create them).')
    console.log('\n🎉 Migration complete.')
    console.log('   Next: run `npm run typegen` in ../frontend, then translate de-AT content.')
  } catch (err) {
    console.error('💥 Migration failed:', err.message)
    process.exit(1)
  }
}

run()

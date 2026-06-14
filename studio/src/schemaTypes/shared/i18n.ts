import {defineField, type SlugIsUniqueValidator} from 'sanity'

/**
 * Supported content languages. Shared between the schema config and the
 * `documentInternationalization` plugin so they never drift.
 */
export const supportedLanguages = [
  {id: 'cs', title: 'Čeština'},
  {id: 'de-AT', title: 'Deutsch (Österreich)'},
] as const

/**
 * Document types that get a per-language document via document-internationalization
 * (real collections, where the plugin's translation UI/linking is valuable).
 *
 * `settings` and `homepage` are intentionally NOT here: they are singletons handled
 * as manual per-locale documents with fixed IDs (`siteSettings-cs`, `homepage-de-AT`, …)
 * and a `language` field, which avoids the plugin-vs-fixed-ID-singleton conflict.
 */
export const translatedTypes = [
  'repasovanyMotor',
  'staryMotor',
  'motorovaHlava',
  'prevodovka',
  'turbodmychadlo',
  'page',
  'post',
] as const

/**
 * Hidden, read-only language field. The documentInternationalization plugin manages
 * the value; we declare it explicitly so typegen and GROQ `language == $locale`
 * filters are type-safe.
 */
export const languageField = defineField({
  name: 'language',
  title: 'Language',
  type: 'string',
  readOnly: true,
  hidden: true,
})

/**
 * Slug uniqueness scoped to the document's language, so the Czech and German
 * versions of the same product may use independent (or even identical) slug
 * strings without colliding.
 */
export const isUniquePerLanguage: SlugIsUniqueValidator = (slug, context) => {
  const {document, getClient} = context
  const client = getClient({apiVersion: '2025-09-25'})
  const id = document?._id.replace(/^drafts\./, '')
  const params = {
    draft: `drafts.${id}`,
    published: id,
    slug,
    language: document?.language ?? null,
  }
  const query = `!defined(*[
    !(_id in [$draft, $published]) &&
    slug.current == $slug &&
    language == $language
  ][0]._id)`
  return client.fetch(query, params)
}

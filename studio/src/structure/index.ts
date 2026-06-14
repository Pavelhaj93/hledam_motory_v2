import {CogIcon, HomeIcon} from '@sanity/icons'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import {translatedTypes} from '../schemaTypes/shared/i18n'

/**
 * Structure builder is useful whenever you want to control how documents are grouped and
 * listed in the studio or for adding additional in-studio previews or content to documents.
 * Learn more: https://www.sanity.io/docs/structure-builder-introduction
 */

// Types fully managed elsewhere: singletons with fixed IDs, internal plugin types,
// and translated collection types (handled manually below with a cs-only filter).
const DISABLED_TYPES = [
  'settings',
  'homepage',
  'person',
  'post',
  'assist.instruction.context',
  // Managed by @sanity/document-internationalization; not edited directly.
  'translation.metadata',
  // Translated collection types are listed manually below with language == "cs" filter.
  ...translatedTypes,
]

// Product/content types to show in the sidebar (subset of translatedTypes — excludes post/page
// if they should not be visible as standalone lists).
const VISIBLE_TRANSLATED_TYPES = [
  'repasovanyMotor',
  'staryMotor',
  'motorovaHlava',
  'prevodovka',
  'turbodmychadlo',
  'page',
] as const

// Human-readable titles for each translated type.
const TYPE_TITLES: Record<string, string> = {
  repasovanyMotor: 'Repasované motory',
  staryMotor: 'Staré motory',
  motorovaHlava: 'Motorové hlavy',
  prevodovka: 'Převodovky',
  turbodmychadlo: 'Turbodmychadla',
  page: 'Stránky',
}

export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Website Content')
    .items([
      // Homepage singleton, one document per locale
      S.listItem()
        .title('Homepage (CS)')
        .child(S.document().schemaType('homepage').documentId('homepage-cs'))
        .icon(HomeIcon),
      S.listItem()
        .title('Homepage (DE-AT)')
        .child(S.document().schemaType('homepage').documentId('homepage-de-AT'))
        .icon(HomeIcon),
      S.divider(),

      // Translated collection types — list only the Czech (base) documents.
      // The @sanity/document-internationalization plugin adds a "Translations" panel
      // inside each document so editors can jump to / create the de-AT version from there.
      ...VISIBLE_TRANSLATED_TYPES.map((type) =>
        S.listItem()
          .title(TYPE_TITLES[type] ?? type)
          .child(
            S.documentList()
              .title(TYPE_TITLES[type] ?? type)
              .schemaType(type)
              .filter('_type == $type && language == "cs"')
              .params({type}),
          ),
      ),

      // Any remaining non-disabled, non-translated document types (auto-generated).
      ...S.documentTypeListItems().filter(
        (listItem: any) => !DISABLED_TYPES.includes(listItem.getId()),
      ),

      S.divider(),
      // Site Settings singleton, one document per locale
      S.listItem()
        .title('Site Settings (CS)')
        .child(S.document().schemaType('settings').documentId('siteSettings-cs'))
        .icon(CogIcon),
      S.listItem()
        .title('Site Settings (DE-AT)')
        .child(S.document().schemaType('settings').documentId('siteSettings-de-AT'))
        .icon(CogIcon),
    ])

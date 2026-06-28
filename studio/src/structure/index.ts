import {
  ArchiveIcon,
  CogIcon,
  ComponentIcon,
  ControlsIcon,
  DocumentsIcon,
  PackageIcon,
  PlugIcon,
} from '@sanity/icons'
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

export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Website Content')
    .items([
      // Pages — shows all CS pages (homepage, katalog, kontakt, cookies, o-nas…)
      // Use the Translations panel inside each doc to switch to the DE-AT version.
      S.listItem()
        .title('Stránky')
        .icon(DocumentsIcon)
        .child(
          S.documentList()
            .title('Stránky')
            .schemaType('page')
            .filter('_type == "page" && language == "cs"'),
        ),

      S.divider(),

      // Product / catalogue types — CS only; DE-AT via Translations panel
      S.listItem()
        .title('Repasované motory')
        .icon(PackageIcon)
        .child(
          S.documentList()
            .title('Repasované motory')
            .schemaType('repasovanyMotor')
            .filter('_type == "repasovanyMotor" && language == "cs"'),
        ),
      S.listItem()
        .title('Staré motory')
        .icon(ArchiveIcon)
        .child(
          S.documentList()
            .title('Staré motory')
            .schemaType('staryMotor')
            .filter('_type == "staryMotor" && language == "cs"'),
        ),
      S.listItem()
        .title('Motorové hlavy')
        .icon(ComponentIcon)
        .child(
          S.documentList()
            .title('Motorové hlavy')
            .schemaType('motorovaHlava')
            .filter('_type == "motorovaHlava" && language == "cs"'),
        ),
      S.listItem()
        .title('Převodovky')
        .icon(ControlsIcon)
        .child(
          S.documentList()
            .title('Převodovky')
            .schemaType('prevodovka')
            .filter('_type == "prevodovka" && language == "cs"'),
        ),
      S.listItem()
        .title('Turbodmychadla')
        .icon(PlugIcon)
        .child(
          S.documentList()
            .title('Turbodmychadla')
            .schemaType('turbodmychadlo')
            .filter('_type == "turbodmychadlo" && language == "cs"'),
        ),

      // Any remaining non-disabled, non-translated document types (auto-generated).
      ...S.documentTypeListItems().filter(
        (listItem: any) => !DISABLED_TYPES.includes(listItem.getId()),
      ),

      S.divider(),

      // Site Settings singletons
      S.listItem()
        .title('Nastavení webu (CS)')
        .icon(CogIcon)
        .child(S.document().schemaType('settings').documentId('siteSettings-cs')),
      S.listItem()
        .title('Nastavení webu (DE-AT)')
        .icon(CogIcon)
        .child(S.document().schemaType('settings').documentId('siteSettings-de-AT')),
    ])

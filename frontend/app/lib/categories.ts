import {categoryPathByType, withLocalePrefix, type Locale} from './i18n'

/** Catalog category keys (the Czech folder names, used as message keys too). */
export type CategoryKey =
  | 'repasovane-motory'
  | 'nove-motory'
  | 'stare-motory'
  | 'turbodmychadla'
  | 'motorove-hlavy'

/** Map a category key to its Sanity document `_type`. */
export const categoryTypeByKey: Record<CategoryKey, string> = {
  'repasovane-motory': 'repasovanyMotor',
  'nove-motory': 'novyMotor',
  'stare-motory': 'staryMotor',
  'turbodmychadla': 'turbodmychadlo',
  'motorove-hlavy': 'motorovaHlava',
}

/**
 * Locale-correct catalog path relative to the locale's own host (no leading slash), e.g.
 * `at/katalog/neue-motoren` on a single host, `katalog/neue-motoren` on motorfinden.at.
 */
export function categoryPath(key: CategoryKey, locale: Locale): string {
  return categoryPathForType(categoryTypeByKey[key], locale)
}

/** Same as `categoryPath()`, keyed by Sanity `_type`. Returns '' for unknown types. */
export function categoryPathForType(type: string, locale: Locale): string {
  const paths = categoryPathByType[type]
  return paths ? withLocalePrefix(locale, paths[locale]) : ''
}

/** Absolute (root-relative) URL path for a category, with `/` prefix. */
export function categoryHref(key: CategoryKey, locale: Locale): string {
  return `/${categoryPath(key, locale)}`
}

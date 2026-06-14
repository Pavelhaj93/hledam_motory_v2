/**
 * Locale constants shared across SEO/metadata/sitemap/JSON-LD code.
 *
 * NOTE: next-intl routing config lives in `frontend/i18n/routing.ts`. This module
 * is the single source of truth for building *absolute* URLs (canonical, hreflang,
 * sitemap, JSON-LD) — those do not go through next-intl's <Link>, so the localized
 * path mapping is duplicated here on purpose. Keep both in sync.
 */

export const locales = ['cs', 'de-AT'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'cs'

/** URL prefix per locale ('' for the default => existing Czech URLs stay unchanged). */
export const localePrefix: Record<Locale, string> = {
  'cs': '',
  'de-AT': '/at',
}

/** <html lang> attribute value per locale. */
export const htmlLang: Record<Locale, string> = {
  'cs': 'cs',
  'de-AT': 'de-AT',
}

/** Open Graph og:locale token per locale. */
export const ogLocale: Record<Locale, string> = {
  'cs': 'cs_CZ',
  'de-AT': 'de_AT',
}

/** Currency shown per locale (CZK for Czech, EUR for Austria). */
export const currencyFor: Record<Locale, string> = {
  'cs': 'CZK',
  'de-AT': 'EUR',
}

/**
 * Localized catalog path per product `_type`, per locale (no leading slash).
 * de-AT paths include the `at/` prefix because these build absolute URLs.
 * German segment wording is provisional — confirm with the content owner.
 */
export const categoryPathByType: Record<string, Record<Locale, string>> = {
  repasovanyMotor: {'cs': 'katalog/repasovane-motory', 'de-AT': 'at/katalog/generalueberholte-motoren'},
  staryMotor: {'cs': 'katalog/stare-motory', 'de-AT': 'at/katalog/gebrauchtmotoren'},
  motorovaHlava: {'cs': 'katalog/motorove-hlavy', 'de-AT': 'at/katalog/zylinderkoepfe'},
  prevodovka: {'cs': 'katalog/prevodovky', 'de-AT': 'at/katalog/getriebe'},
  turbodmychadlo: {'cs': 'katalog/turbodmychadla', 'de-AT': 'at/katalog/turbolader'},
}

/** Returns true for a valid supported locale. */
export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value)
}

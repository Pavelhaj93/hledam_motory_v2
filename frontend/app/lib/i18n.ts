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

/**
 * Domain-based routing switch. When `NEXT_PUBLIC_I18N_DOMAINS=true` (Vercel Production only),
 * `cs` lives on www.hledammotory.cz and `de-AT` on motorfinden.at, both WITHOUT a locale prefix.
 * Otherwise (localhost, preview deploys) everything runs on one host and de-AT sits under `/at`.
 * Read by `i18n/routing.ts` too — keep the env name in sync.
 */
export const localeDomainsEnabled = process.env.NEXT_PUBLIC_I18N_DOMAINS === 'true'

const CS_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hledammotory.cz'
const AT_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL_AT || 'https://motorfinden.at'

/** Host names per locale, used by next-intl `domains` and host-aware routes (sitemap, robots). */
export const localeDomain: Record<Locale, string> = {
  'cs': new URL(CS_SITE_URL).host,
  'de-AT': new URL(AT_SITE_URL).host,
}

/** Origin (no trailing slash) a locale is served from. */
export function siteUrlFor(locale: Locale): string {
  return locale === 'de-AT' && localeDomainsEnabled ? AT_SITE_URL : CS_SITE_URL
}

/**
 * URL prefix per locale ('' for the default => existing Czech URLs stay unchanged).
 * de-AT has no prefix once it is served from its own domain.
 */
export const localePrefix: Record<Locale, string> = {
  'cs': '',
  'de-AT': localeDomainsEnabled ? '' : '/at',
}

/**
 * Absolute URL for a path that is relative to the locale's own root, i.e. a path that already
 * went through `localePrefix` / `categoryPath()` (e.g. `/katalog/turbolader`).
 * Use for hreflang alternates, sitemap and JSON-LD — anything that crosses domains.
 */
export function absoluteUrl(locale: Locale, path = '/'): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return normalized === '/' ? `${siteUrlFor(locale)}/` : `${siteUrlFor(locale)}${normalized}`
}

/** Locale-correct home path on its own host ('/' or '/at'). */
export const homePath = (locale: Locale) => localePrefix[locale] || '/'

/*
 * Austrian branding (Motorfinden name, logo, mailbox) is tied to the domain switch, so merging this
 * code changes nothing on hledammotory.cz/at — everything flips together with NEXT_PUBLIC_I18N_DOMAINS.
 */
const atBranded = localeDomainsEnabled

/** Contact e-mail shown on the site and receiving contact-form enquiries. */
export const contactEmail: Record<Locale, string> = {
  'cs': 'info@hledammotory.cz',
  'de-AT': atBranded ? 'anfrage@motorfinden.at' : 'info@hledammotory.cz',
}

/** Brand name per market. */
export const brandName: Record<Locale, string> = {
  'cs': 'Hledám motory',
  'de-AT': atBranded ? 'Motorfinden' : 'Hledám motory',
}

/** Logo in /public per market. */
export const logoSrc: Record<Locale, string> = {
  'cs': '/images/logo.png',
  'de-AT': atBranded ? '/images/logo-motorfinden.png' : '/images/logo.png',
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
 * Localized catalog path per product `_type`, per locale (no leading slash, NO locale prefix).
 * Use `categoryPath()` from `./categories` to get the prefixed, host-relative path.
 * German segment wording is provisional — confirm with the content owner.
 */
export const categoryPathByType: Record<string, Record<Locale, string>> = {
  repasovanyMotor: {'cs': 'katalog/repasovane-motory', 'de-AT': 'katalog/generalueberholte-motoren'},
  novyMotor: {'cs': 'katalog/nove-motory', 'de-AT': 'katalog/neue-motoren'},
  staryMotor: {'cs': 'katalog/stare-motory', 'de-AT': 'katalog/gebrauchtmotoren'},
  motorovaHlava: {'cs': 'katalog/motorove-hlavy', 'de-AT': 'katalog/zylinderkoepfe'},
  turbodmychadlo: {'cs': 'katalog/turbodmychadla', 'de-AT': 'katalog/turbolader'},
}

/** Returns true for a valid supported locale. */
export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value)
}

/** Prefix a locale-root-relative path (no leading slash) with the locale prefix, no leading slash. */
export function withLocalePrefix(locale: Locale, path: string): string {
  const prefix = localePrefix[locale].replace(/^\//, '')
  return prefix ? `${prefix}/${path}` : path
}

/**
 * Locale served on a given host, for host-aware routes (sitemap.xml, robots.txt).
 * Returns null when domain routing is off — then one host serves both locales.
 * `www.` and ports are ignored, so www.motorfinden.at / hledammotory.cz also match.
 */
export function localeForHost(host: string | null | undefined): Locale | null {
  if (!localeDomainsEnabled) return null
  const bare = (h: string) => h.toLowerCase().split(':')[0].replace(/^www\./, '')
  return host && bare(host) === bare(localeDomain['de-AT']) ? 'de-AT' : 'cs'
}

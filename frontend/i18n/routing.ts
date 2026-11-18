import {defineRouting} from 'next-intl/routing'
import {localeDomain, localeDomainsEnabled} from '@/app/lib/i18n'

/**
 * next-intl routing config.
 *
 * - `cs` is the default locale and is served UNPREFIXED so existing Czech URLs
 *   (e.g. /katalog/repasovane-motory) are unchanged.
 * - `de-AT` is served under the `/at` prefix.
 * - `pathnames` localizes the static catalog segments. Physical route folders are
 *   NOT renamed; next-intl maps the German URL onto the same internal path.
 *   The dynamic product `[slug]` value itself comes from Sanity per-locale.
 * - `domains` (only when NEXT_PUBLIC_I18N_DOMAINS=true, i.e. Vercel Production): cs is served on
 *   www.hledammotory.cz and de-AT on motorfinden.at, each unprefixed. A request for the other
 *   locale's prefix (hledammotory.cz/at/...) is redirected to its domain — though the permanent
 *   301 for `/at/*` lives in next.config.ts, which runs before this middleware.
 *   Localhost and preview deploys keep the single-host `/at` setup.
 */
export const routing = defineRouting({
  locales: ['cs', 'de-AT'],
  defaultLocale: 'cs',
  localePrefix: {
    mode: 'as-needed',
    prefixes: {
      'de-AT': '/at',
    },
  },
  domains: localeDomainsEnabled
    ? [
        {domain: localeDomain['cs'], defaultLocale: 'cs', locales: ['cs']},
        {domain: localeDomain['de-AT'], defaultLocale: 'de-AT', locales: ['de-AT']},
      ]
    : undefined,
  pathnames: {
    '/': '/',
    '/katalog/repasovane-motory': {
      'cs': '/katalog/repasovane-motory',
      'de-AT': '/katalog/generalueberholte-motoren',
    },
    '/katalog/repasovane-motory/[slug]': {
      'cs': '/katalog/repasovane-motory/[slug]',
      'de-AT': '/katalog/generalueberholte-motoren/[slug]',
    },
    '/katalog/nove-motory': {
      'cs': '/katalog/nove-motory',
      'de-AT': '/katalog/neue-motoren',
    },
    '/katalog/nove-motory/[slug]': {
      'cs': '/katalog/nove-motory/[slug]',
      'de-AT': '/katalog/neue-motoren/[slug]',
    },
    '/katalog/stare-motory': {
      'cs': '/katalog/stare-motory',
      'de-AT': '/katalog/gebrauchtmotoren',
    },
    '/katalog/stare-motory/[slug]': {
      'cs': '/katalog/stare-motory/[slug]',
      'de-AT': '/katalog/gebrauchtmotoren/[slug]',
    },
    '/katalog/turbodmychadla': {
      'cs': '/katalog/turbodmychadla',
      'de-AT': '/katalog/turbolader',
    },
    '/katalog/turbodmychadla/[slug]': {
      'cs': '/katalog/turbodmychadla/[slug]',
      'de-AT': '/katalog/turbolader/[slug]',
    },
    '/katalog/motorove-hlavy': {
      'cs': '/katalog/motorove-hlavy',
      'de-AT': '/katalog/zylinderkoepfe',
    },
    '/katalog/motorove-hlavy/[slug]': {
      'cs': '/katalog/motorove-hlavy/[slug]',
      'de-AT': '/katalog/zylinderkoepfe/[slug]',
    },
    '/cookies': '/cookies',
    '/ochrana-osobnich-udaju': {
      'cs': '/ochrana-osobnich-udaju',
      'de-AT': '/datenschutz',
    },
    // CMS-backed pages (resolved via the [slug] catch-all). German keeps the same
    // slug for now; adjust here if a translated slug is created in Sanity.
    '/katalog': '/katalog',
    '/kontakt': '/kontakt',
    '/o-nas': {'cs': '/o-nas', 'de-AT': '/ueber-uns'},
    // CMS pages: the slug itself is resolved per-locale in Sanity.
    '/[slug]': '/[slug]',
  },
})

export type Locale = (typeof routing.locales)[number]

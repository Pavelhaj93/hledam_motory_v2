import {
  absoluteUrl,
  brandName as siteBrandName,
  contactEmail,
  currencyFor,
  homePath,
  withLocalePrefix,
  type Locale,
} from '@/app/lib/i18n'

/** Breadcrumb labels (Home / Catalog), passed in translated from the page. */
type BreadcrumbLabels = {home: string; catalog: string}

const inLanguageFor = (locale: Locale) => (locale === 'de-AT' ? 'de-AT' : 'cs')
// All URLs are absolute on the locale's own domain (motorfinden.at for de-AT in production).
const catalogUrl = (locale: Locale) => absoluteUrl(locale, `/${withLocalePrefix(locale, 'katalog')}`)
const homeUrl = (locale: Locale) => absoluteUrl(locale, homePath(locale))

type ProductJsonLdProps = {
  name: string
  description?: string | null
  imageUrl?: string | null
  brandName?: string | null
  price?: number | null
  currency?: string | null
  inStock?: boolean | null
  slug: string
  /** Host-relative catalog path from `categoryPath()` (no leading slash). */
  categoryPath: string
  categoryLabel: string
  locale: Locale
  labels: BreadcrumbLabels
}

export function productJsonLd({
  name,
  description,
  imageUrl,
  brandName,
  price,
  currency,
  inStock,
  slug,
  categoryPath,
  categoryLabel,
  locale,
  labels,
}: ProductJsonLdProps) {
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    inLanguage: inLanguageFor(locale),
    ...(description && {description}),
    ...(imageUrl && {image: imageUrl}),
    ...(brandName && {brand: {'@type': 'Brand', name: brandName}}),
    offers: {
      '@type': 'Offer',
      priceCurrency: currency || currencyFor[locale],
      ...(price != null && {price: price.toString()}),
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: absoluteUrl(locale, `/${categoryPath}/${slug}`),
      seller: {'@type': 'Organization', name: siteBrandName[locale]},
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {'@type': 'ListItem', position: 1, name: labels.home, item: homeUrl(locale)},
      {'@type': 'ListItem', position: 2, name: labels.catalog, item: catalogUrl(locale)},
      {
        '@type': 'ListItem',
        position: 3,
        name: categoryLabel,
        item: absoluteUrl(locale, `/${categoryPath}`),
      },
      {'@type': 'ListItem', position: 4, name},
    ],
  }

  return [productSchema, breadcrumbSchema]
}

export function categoryBreadcrumbJsonLd(
  categoryLabel: string,
  categoryPath: string,
  locale: Locale,
  labels: BreadcrumbLabels,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {'@type': 'ListItem', position: 1, name: labels.home, item: homeUrl(locale)},
      {'@type': 'ListItem', position: 2, name: labels.catalog, item: catalogUrl(locale)},
      {'@type': 'ListItem', position: 3, name: categoryLabel, item: absoluteUrl(locale, `/${categoryPath}`)},
    ],
  }
}

export function organizationJsonLd(phone: string | null | undefined, locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    name: siteBrandName[locale],
    url: homeUrl(locale),
    inLanguage: inLanguageFor(locale),
    telephone: (phone || '+420 792 644 755').replace(/\s/g, ''),
    email: contactEmail[locale],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Prachnerova 642/10',
      addressLocality: 'Praha 5',
      postalCode: '150 00',
      addressCountry: 'CZ',
    },
    ...(locale === 'de-AT' && {areaServed: 'AT'}),
    description:
      locale === 'de-AT'
        ? 'Größter Online-Katalog für generalüberholte und neue Motoren, Turbolader und Zylinderköpfe für Personenkraftwagen.'
        : 'Největší online katalog repasovaných a nových motorů, turbodmychadel a motorových hlav pro osobní automobily v České republice.',
  }
}

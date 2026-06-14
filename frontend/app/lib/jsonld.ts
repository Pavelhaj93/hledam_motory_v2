import {siteUrl} from '@/sanity/lib/api'
import {currencyFor, localePrefix, type Locale} from '@/app/lib/i18n'

const BASE_URL = siteUrl

/** Breadcrumb labels (Home / Catalog), passed in translated from the page. */
type BreadcrumbLabels = {home: string; catalog: string}

const inLanguageFor = (locale: Locale) => (locale === 'de-AT' ? 'de-AT' : 'cs')
const catalogPath = (locale: Locale) => (locale === 'de-AT' ? 'at/katalog' : 'katalog')
const homeUrl = (locale: Locale) => `${BASE_URL}${localePrefix[locale] || ''}`

type ProductJsonLdProps = {
  name: string
  description?: string | null
  imageUrl?: string | null
  brandName?: string | null
  price?: number | null
  currency?: string | null
  inStock?: boolean | null
  slug: string
  /** Locale-correct catalog path (no leading slash), e.g. `at/katalog/getriebe`. */
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
      url: `${BASE_URL}/${categoryPath}/${slug}`,
      seller: {'@type': 'Organization', name: 'Hledám motory'},
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {'@type': 'ListItem', position: 1, name: labels.home, item: homeUrl(locale)},
      {'@type': 'ListItem', position: 2, name: labels.catalog, item: `${BASE_URL}/${catalogPath(locale)}`},
      {
        '@type': 'ListItem',
        position: 3,
        name: categoryLabel,
        item: `${BASE_URL}/${categoryPath}`,
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
      {'@type': 'ListItem', position: 2, name: labels.catalog, item: `${BASE_URL}/${catalogPath(locale)}`},
      {'@type': 'ListItem', position: 3, name: categoryLabel, item: `${BASE_URL}/${categoryPath}`},
    ],
  }
}

export function organizationJsonLd(phone: string | null | undefined, locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    name: 'Hledám motory',
    url: homeUrl(locale),
    inLanguage: inLanguageFor(locale),
    telephone: (phone || '+420 792 644 755').replace(/\s/g, ''),
    email: 'info@hledammotory.cz',
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
        ? 'Größter Online-Katalog für generalüberholte Motoren, Getriebe, Turbolader und Zylinderköpfe für Personenkraftwagen.'
        : 'Největší online katalog repasovaných motorů, převodovek, turbodmychadel a motorových hlav pro osobní automobily v České republice.',
  }
}

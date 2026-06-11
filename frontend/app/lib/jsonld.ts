const BASE_URL = 'https://hledammotory.cz'

type ProductJsonLdProps = {
  name: string
  description?: string | null
  imageUrl?: string | null
  brandName?: string | null
  price?: number | null
  currency?: string | null
  inStock?: boolean | null
  slug: string
  categoryPath: string
  categoryLabel: string
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
}: ProductJsonLdProps) {
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    ...(description && {description}),
    ...(imageUrl && {image: imageUrl}),
    ...(brandName && {brand: {'@type': 'Brand', name: brandName}}),
    offers: {
      '@type': 'Offer',
      priceCurrency: currency || 'CZK',
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
      {'@type': 'ListItem', position: 1, name: 'Domů', item: BASE_URL},
      {'@type': 'ListItem', position: 2, name: 'Katalog', item: `${BASE_URL}/katalog`},
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

export function categoryBreadcrumbJsonLd(categoryLabel: string, categoryPath: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {'@type': 'ListItem', position: 1, name: 'Domů', item: BASE_URL},
      {'@type': 'ListItem', position: 2, name: 'Katalog', item: `${BASE_URL}/katalog`},
      {'@type': 'ListItem', position: 3, name: categoryLabel, item: `${BASE_URL}/${categoryPath}`},
    ],
  }
}

export function organizationJsonLd(phone?: string | null) {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    name: 'Hledám motory',
    url: BASE_URL,
    telephone: (phone || '+420 792 644 755').replace(/\s/g, ''),
    email: 'info@hledammotory.cz',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Prachnerova 642/10',
      addressLocality: 'Praha 5',
      postalCode: '150 00',
      addressCountry: 'CZ',
    },
    description:
      'Největší online katalog repasovaných motorů, převodovek, turbodmychadel a motorových hlav pro osobní automobily v České republice.',
  }
}

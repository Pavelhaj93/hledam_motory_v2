import {getTranslations} from 'next-intl/server'
import {brandName, currencyFor, type Locale} from './i18n'
import type {CategoryKey} from './categories'

const MAX_DESCRIPTION = 160

/** Cut at a word boundary so Google does not truncate mid-word. */
export function clampDescription(text: string, max = MAX_DESCRIPTION): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max - 1)
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`
}

type ProductMeta = {
  name?: string | null
  price?: number | null
  inStock?: boolean | null
  warrantyPeriod?: string | null
}

/**
 * Fallback meta description for a product detail page, used when the editor left
 * `seo.metaDescription` empty. Built from the fields buyers compare (price, warranty, stock)
 * instead of the long renovation list in `description`, which is identical across products.
 */
export async function productMetaDescription(
  locale: Locale,
  category: CategoryKey,
  product: ProductMeta,
): Promise<string> {
  const t = await getTranslations({locale, namespace: 'Seo'})
  const tCategories = await getTranslations({locale, namespace: 'Categories'})

  const price = product.price
    ? new Intl.NumberFormat(locale === 'de-AT' ? 'de-AT' : 'cs-CZ', {
        style: 'currency',
        currency: currencyFor[locale],
        maximumFractionDigits: 0,
      }).format(product.price)
    : null

  const lead = `${tCategories(category)}: ${product.name ?? ''}${price ? ` ${t('productPrice', {price})}` : ''}.`
  const facts = [
    // Used engines are sold without the renovation warranty.
    category !== 'stare-motory' && product.warrantyPeriod
      ? t('productWarranty', {warranty: product.warrantyPeriod})
      : null,
    product.inStock ? t('productInStock') : null,
  ]
    .filter(Boolean)
    .join(', ')

  return clampDescription(
    [lead, facts ? `${facts.charAt(0).toUpperCase()}${facts.slice(1)}.` : '', t('productCta', {brand: brandName[locale]})]
      .filter(Boolean)
      .join(' '),
  )
}

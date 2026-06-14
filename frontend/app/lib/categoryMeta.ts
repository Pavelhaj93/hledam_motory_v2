import type {Metadata} from 'next'
import {getTranslations} from 'next-intl/server'
import {ogLocale, type Locale} from './i18n'
import {categoryPath, type CategoryKey} from './categories'

type AltSlug = {slug?: string | null; language?: string | null} | null | undefined

/**
 * Self-referential canonical + reciprocal hreflang for a product detail page.
 * The de-AT alternate uses the TRANSLATED German slug (from `altSlug`), never a
 * naive prefix. Alternates are emitted only when the counterpart exists.
 */
export function productAlternates(
  locale: Locale,
  key: CategoryKey,
  slug: string,
  altSlug: AltSlug,
) {
  const csKeyPath = categoryPath(key, 'cs')
  const deKeyPath = categoryPath(key, 'de-AT')
  const csSlug = locale === 'cs' ? slug : altSlug?.slug
  const deSlug = locale === 'de-AT' ? slug : altSlug?.slug
  const languages: Record<string, string> = {}
  if (csSlug) {
    languages['cs'] = `/${csKeyPath}/${csSlug}`
    languages['x-default'] = `/${csKeyPath}/${csSlug}`
  }
  if (deSlug) languages['de-AT'] = `/${deKeyPath}/${deSlug}`
  return {canonical: `/${categoryPath(key, locale)}/${slug}`, languages}
}

/**
 * Locale-aware metadata for a catalog category page, including reciprocal
 * hreflang and a self-referential canonical.
 */
export async function buildCategoryMetadata(locale: Locale, key: CategoryKey): Promise<Metadata> {
  const t = await getTranslations({locale, namespace: 'CategoryPage'})
  const csPath = `/${categoryPath(key, 'cs')}`
  const dePath = `/${categoryPath(key, 'de-AT')}`
  const self = `/${categoryPath(key, locale)}`
  const title = t(`${key}.metaTitle`)
  const description = t(`${key}.metaDescription`)
  return {
    title,
    description,
    alternates: {
      canonical: self,
      languages: {'cs': csPath, 'de-AT': dePath, 'x-default': csPath},
    },
    openGraph: {
      title,
      description,
      type: 'website',
      images: [{url: '/images/logo.png'}],
      locale: ogLocale[locale],
      alternateLocale: locale === 'cs' ? ['de_AT'] : ['cs_CZ'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/logo.png'],
    },
  }
}

import {MetadataRoute} from 'next'
import {headers} from 'next/headers'

export const revalidate = 3600
import {sanityFetch} from '@/sanity/lib/live'
import {sitemapData, sitemapProductsData} from '@/sanity/lib/queries'
import {
  absoluteUrl,
  categoryPathByType,
  homePath,
  localeForHost,
  withLocalePrefix,
  type Locale,
} from '@/app/lib/i18n'

/** Build a reciprocal hreflang map (renders xhtml:link alternates). */
function languages(cs?: string, de?: string) {
  const map: Record<string, string> = {}
  if (cs) {
    map['cs'] = cs
    map['x-default'] = cs
  }
  if (de) map['de-AT'] = de
  return map
}

/** Absolute URL for a locale-root-relative path without prefix, e.g. `katalog/turbolader`. */
const urlFor = (locale: Locale, path: string) =>
  absoluteUrl(locale, `/${withLocalePrefix(locale, path)}`)

/**
 * With domain routing on, each host (www.hledammotory.cz / motorfinden.at) gets a sitemap with
 * only its own URLs; hreflang alternates still point across to the other domain. Without domain
 * routing (localhost, previews) one sitemap lists both locales, as before.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const h = await headers()
  const hostLocale = localeForHost(h.get('x-forwarded-host') ?? h.get('host'))
  const include = (locale: Locale) => hostLocale === null || hostLocale === locale

  const [allPostsAndPages, allProducts] = await Promise.all([
    sanityFetch({query: sitemapData}),
    sanityFetch({query: sitemapProductsData}),
  ])

  const result: MetadataRoute.Sitemap = []

  /** Push the cs and/or de-AT entry of one page, both carrying the same alternates map. */
  function pushPair(
    cs: string | undefined,
    de: string | undefined,
    entry: Omit<MetadataRoute.Sitemap[number], 'url' | 'alternates'>,
  ) {
    const langs = languages(cs, de)
    if (cs && include('cs')) result.push({url: cs, ...entry, alternates: {languages: langs}})
    if (de && include('de-AT')) result.push({url: de, ...entry, alternates: {languages: langs}})
  }

  // Root page (cs + de-AT)
  pushPair(absoluteUrl('cs', homePath('cs')), absoluteUrl('de-AT', homePath('de-AT')), {
    lastModified: new Date(),
    priority: 1,
    changeFrequency: 'monthly',
  })

  // Catalog + category index pages, derived from the type→path map
  const categoryPairs: Array<[string, string]> = [
    ['katalog', 'katalog'],
    ...Object.values(categoryPathByType).map((m) => [m['cs'], m['de-AT']] as [string, string]),
  ]
  for (const [csPath, dePath] of categoryPairs) {
    pushPair(urlFor('cs', csPath), urlFor('de-AT', dePath), {
      lastModified: new Date(),
      priority: 0.9,
      changeFrequency: 'weekly',
    })
  }

  // Product detail pages — iterate cs docs, derive de-AT from the linked translation
  if (allProducts?.data?.length) {
    for (const product of allProducts.data) {
      const paths = categoryPathByType[product._type]
      if (!paths || !product.slug) continue
      const deSlug = (product as any).alt?.slug as string | undefined
      pushPair(
        urlFor('cs', `${paths['cs']}/${product.slug}`),
        deSlug ? urlFor('de-AT', `${paths['de-AT']}/${deSlug}`) : undefined,
        {lastModified: product._updatedAt || new Date(), priority: 0.8, changeFrequency: 'weekly'},
      )
    }
  }

  // CMS pages and posts (cs docs; pages also emit a de-AT URL when translated)
  if (allPostsAndPages?.data?.length) {
    for (const p of allPostsAndPages.data) {
      if (!p.slug) continue
      const deSlug = (p as any).alt?.slug as string | undefined
      if (p._type === 'page') {
        pushPair(urlFor('cs', p.slug), deSlug ? urlFor('de-AT', deSlug) : undefined, {
          lastModified: p._updatedAt || new Date(),
          priority: 0.8,
          changeFrequency: 'monthly',
        })
      } else if (p._type === 'post' && include('cs')) {
        result.push({
          url: urlFor('cs', `posts/${p.slug}`),
          lastModified: p._updatedAt || new Date(),
          priority: 0.5,
          changeFrequency: 'never',
        })
      }
    }
  }

  return result
}

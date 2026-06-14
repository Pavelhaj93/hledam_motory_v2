import {MetadataRoute} from 'next'

export const revalidate = 3600
import {sanityFetch} from '@/sanity/lib/live'
import {sitemapData, sitemapProductsData} from '@/sanity/lib/queries'
import {siteUrl} from '@/sanity/lib/api'
import {categoryPathByType} from '@/app/lib/i18n'

const domain = siteUrl

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [allPostsAndPages, allProducts] = await Promise.all([
    sanityFetch({query: sitemapData}),
    sanityFetch({query: sitemapProductsData}),
  ])

  const result: MetadataRoute.Sitemap = []

  // Root page (cs + de-AT)
  {
    const cs = domain
    const de = `${domain}/at`
    const langs = languages(cs, de)
    result.push({url: cs, lastModified: new Date(), priority: 1, changeFrequency: 'monthly', alternates: {languages: langs}})
    result.push({url: de, lastModified: new Date(), priority: 1, changeFrequency: 'monthly', alternates: {languages: langs}})
  }

  // Category index pages, cs + de-AT, derived from the type→path map
  const categoryPairs: Array<[string, string]> = [
    ['katalog', 'at/katalog'],
    ...Object.values(categoryPathByType).map(
      (m) => [m['cs'], m['de-AT']] as [string, string],
    ),
  ]
  for (const [csPath, dePath] of categoryPairs) {
    const cs = `${domain}/${csPath}`
    const de = `${domain}/${dePath}`
    const langs = languages(cs, de)
    result.push({url: cs, lastModified: new Date(), priority: 0.9, changeFrequency: 'weekly', alternates: {languages: langs}})
    result.push({url: de, lastModified: new Date(), priority: 0.9, changeFrequency: 'weekly', alternates: {languages: langs}})
  }

  // Product detail pages — iterate cs docs, derive de-AT from the linked translation
  if (allProducts?.data?.length) {
    for (const product of allProducts.data) {
      const paths = categoryPathByType[product._type]
      if (!paths || !product.slug) continue
      const cs = `${domain}/${paths['cs']}/${product.slug}`
      const deSlug = (product as any).alt?.slug as string | undefined
      const de = deSlug ? `${domain}/${paths['de-AT']}/${deSlug}` : undefined
      const langs = languages(cs, de)
      result.push({
        url: cs,
        lastModified: product._updatedAt || new Date(),
        priority: 0.8,
        changeFrequency: 'weekly',
        alternates: {languages: langs},
      })
      if (de) {
        result.push({
          url: de,
          lastModified: product._updatedAt || new Date(),
          priority: 0.8,
          changeFrequency: 'weekly',
          alternates: {languages: langs},
        })
      }
    }
  }

  // CMS pages and posts (cs docs; pages also emit a de-AT URL when translated)
  if (allPostsAndPages?.data?.length) {
    for (const p of allPostsAndPages.data) {
      if (!p.slug) continue
      const deSlug = (p as any).alt?.slug as string | undefined
      if (p._type === 'page') {
        const cs = `${domain}/${p.slug}`
        const de = deSlug ? `${domain}/at/${deSlug}` : undefined
        const langs = languages(cs, de)
        result.push({url: cs, lastModified: p._updatedAt || new Date(), priority: 0.8, changeFrequency: 'monthly', alternates: {languages: langs}})
        if (de) {
          result.push({url: de, lastModified: p._updatedAt || new Date(), priority: 0.8, changeFrequency: 'monthly', alternates: {languages: langs}})
        }
      } else if (p._type === 'post') {
        result.push({
          url: `${domain}/posts/${p.slug}`,
          lastModified: p._updatedAt || new Date(),
          priority: 0.5,
          changeFrequency: 'never',
        })
      }
    }
  }

  return result
}

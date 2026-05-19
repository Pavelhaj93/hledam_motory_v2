import {MetadataRoute} from 'next'
import {sanityFetch} from '@/sanity/lib/live'
import {sitemapData, sitemapProductsData} from '@/sanity/lib/queries'
import {headers} from 'next/headers'

const productTypeToPath: Record<string, string> = {
  repasovanyMotor: 'katalog/repasovane-motory',
  staryMotor: 'katalog/stare-motory',
  motorovaHlava: 'katalog/motorove-hlavy',
  prevodovka: 'katalog/prevodovky',
  turbodmychadlo: 'katalog/turbodmychadla',
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [allPostsAndPages, allProducts] = await Promise.all([
    sanityFetch({query: sitemapData}),
    sanityFetch({query: sitemapProductsData}),
  ])

  const headersList = await headers()
  const domain = `https://${headersList.get('host')}` || 'https://hledammotory.cz'
  const result: MetadataRoute.Sitemap = []

  // Root page
  result.push({
    url: domain,
    lastModified: new Date(),
    priority: 1,
    changeFrequency: 'monthly',
  })

  // Category pages (once, no duplicates)
  const categories = [
    'katalog',
    'katalog/repasovane-motory',
    'katalog/stare-motory',
    'katalog/turbodmychadla',
    'katalog/prevodovky',
    'katalog/motorove-hlavy',
  ]
  categories.forEach((category) => {
    result.push({
      url: `${domain}/${category}`,
      lastModified: new Date(),
      priority: 0.9,
      changeFrequency: 'weekly',
    })
  })

  // Product detail pages
  if (allProducts?.data?.length) {
    for (const product of allProducts.data) {
      const basePath = productTypeToPath[product._type]
      if (!basePath || !product.slug) continue
      result.push({
        url: `${domain}/${basePath}/${product.slug}`,
        lastModified: product._updatedAt || new Date(),
        priority: 0.8,
        changeFrequency: 'weekly',
      })
    }
  }

  // CMS pages and posts
  if (allPostsAndPages?.data?.length) {
    for (const p of allPostsAndPages.data) {
      if (!p.slug) continue
      if (p._type === 'page') {
        result.push({
          url: `${domain}/${p.slug}`,
          lastModified: p._updatedAt || new Date(),
          priority: 0.8,
          changeFrequency: 'monthly',
        })
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


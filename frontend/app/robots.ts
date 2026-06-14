import {MetadataRoute} from 'next'
import {siteUrl} from '@/sanity/lib/api'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/studio/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}

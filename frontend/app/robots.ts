import {MetadataRoute} from 'next'
import {headers} from 'next/headers'
import {absoluteUrl, localeForHost} from '@/app/lib/i18n'

/** Host-aware: motorfinden.at points crawlers at its own sitemap, hledammotory.cz at its own. */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const h = await headers()
  const locale = localeForHost(h.get('x-forwarded-host') ?? h.get('host')) ?? 'cs'
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/studio/'],
    },
    sitemap: absoluteUrl(locale, '/sitemap.xml'),
  }
}

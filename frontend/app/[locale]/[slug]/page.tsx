import type {Metadata} from 'next'
import {getTranslations, setRequestLocale} from 'next-intl/server'

import PageBuilderPage from '@/app/components/PageBuilder'
import CategoryHero from '@/app/components/CategoryHero'
import {sanityFetch} from '@/sanity/lib/live'
import {getPageQuery, pagesSlugs} from '@/sanity/lib/queries'
import {GetPageQueryResult} from '@/sanity.types'
import {PageOnboarding} from '@/app/components/Onboarding'
import {localePrefix, type Locale} from '@/app/lib/i18n'

type Props = {
  params: Promise<{locale: Locale; slug: string}>
}

/**
 * Static params for both locales — pagesSlugs returns each page's language,
 * which maps 1:1 to the routing locale.
 */
export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: pagesSlugs,
    perspective: 'published',
    stega: false,
  })
  return data
    .filter((p) => p.slug && p.language)
    .map((p) => ({locale: p.language as Locale, slug: p.slug as string}))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const {locale, slug} = await props.params
  const {data: page} = await sanityFetch({
    query: getPageQuery,
    params: {locale, slug},
    stega: false,
  })

  const base = localePrefix[locale]
  return {
    title: page?.name,
    description: page?.heading,
    alternates: {
      canonical: `${base}/${slug}`,
    },
  } satisfies Metadata
}

export default async function Page(props: Props) {
  const {locale, slug} = await props.params
  setRequestLocale(locale)
  const t = await getTranslations('Common')

  const [{data: page}] = await Promise.all([
    sanityFetch({query: getPageQuery, params: {locale, slug}}),
  ])

  console.log('ttt slug', slug, 'locale', locale, 'page', page)

  if (!page?._id) {
    return (
      <div className="py-40">
        <PageOnboarding />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Catalog-style UI */}
      <CategoryHero
        title={page.heading || 'Page'}
        description={page.subheading || ''}
        breadcrumbs={[{label: t('home'), href: '/'}, {label: page.heading || 'Page'}]}
      />

      {/* Page Content */}
      <div className="container mx-auto px-4 py-12">
        <PageBuilderPage page={page as GetPageQueryResult} />
      </div>
    </div>
  )
}

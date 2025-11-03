import type {Metadata} from 'next'
import Head from 'next/head'

import PageBuilderPage from '@/app/components/PageBuilder'
import CategoryHero from '@/app/components/CategoryHero'
import {sanityFetch} from '@/sanity/lib/live'
import {getPageQuery, pagesSlugs} from '@/sanity/lib/queries'
import {GetPageQueryResult} from '@/sanity.types'
import {PageOnboarding} from '@/app/components/Onboarding'

type Props = {
  params: Promise<{slug: string}>
}

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: pagesSlugs,
    // // Use the published perspective in generateStaticParams
    perspective: 'published',
    stega: false,
  })
  return data
}

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const {data: page} = await sanityFetch({
    query: getPageQuery,
    params,
    // Metadata should never contain stega
    stega: false,
  })

  return {
    title: page?.name,
    description: page?.heading,
  } satisfies Metadata
}

export default async function Page(props: Props) {
  const params = await props.params
  const [{data: page}] = await Promise.all([sanityFetch({query: getPageQuery, params})])

  if (!page?._id) {
    return (
      <div className="py-40">
        <PageOnboarding />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{page.heading}</title>
      </Head>

      {/* Hero Section with Catalog-style UI */}
      <CategoryHero
        title={page.heading || 'Page'}
        description={page.subheading || ''}
        breadcrumbs={[{label: 'Domů', href: '/'}, {label: page.heading || 'Page'}]}
      />

      {/* Page Content */}
      <div className="container mx-auto px-4 py-12">
        <PageBuilderPage page={page as GetPageQueryResult} />
      </div>
    </div>
  )
}

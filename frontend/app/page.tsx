import type {Metadata} from 'next'
import BlockRenderer from '@/app/components/BlockRenderer'
import {homepageQuery, settingsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import {organizationJsonLd} from '@/app/lib/jsonld'

export async function generateMetadata(): Promise<Metadata> {
  const {data: homepage} = await sanityFetch({
    query: homepageQuery,
    stega: false,
  })

  return {
    title: homepage?.seo?.metaTitle || 'Homepage',
    description: homepage?.seo?.metaDescription || 'Welcome to our engine parts catalog',
  }
}

export default async function Page() {
  const [{data: homepage}, {data: settings}] = await Promise.all([
    sanityFetch({query: homepageQuery}),
    sanityFetch({query: settingsQuery, stega: false}),
  ])

  // If homepage content exists, use page builder
  if (homepage?.pageBuilder && homepage.pageBuilder.length > 0) {
    return (
      <div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(organizationJsonLd(settings?.phone))}} />
        {homepage.pageBuilder.map((block: any, index: number) => (
          <BlockRenderer
            key={block._key}
            index={index}
            block={block}
            pageId={homepage._id}
            pageType={homepage._type}
          />
        ))}
      </div>
    )
  }
}

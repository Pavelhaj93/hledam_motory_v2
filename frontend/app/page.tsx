import type {Metadata} from 'next'
import BlockRenderer from '@/app/components/BlockRenderer'
import {homepageQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'

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
  const [{data: homepage}] = await Promise.all([sanityFetch({query: homepageQuery})])

  // If homepage content exists, use page builder
  if (homepage?.pageBuilder && homepage.pageBuilder.length > 0) {
    return (
      <div>
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

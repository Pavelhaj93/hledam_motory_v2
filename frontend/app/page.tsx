import {Suspense} from 'react'
import Link from 'next/link'
import {PortableText} from '@portabletext/react'
import type {Metadata} from 'next'
import {ExternalLink} from 'lucide-react'

import GetStartedCode from '@/app/components/GetStartedCode'
import SideBySideIcons from '@/app/components/SideBySideIcons'
import BlockRenderer from '@/app/components/BlockRenderer'
import {settingsQuery, homepageQuery} from '@/sanity/lib/queries'
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
  const [{data: settings}, {data: homepage}] = await Promise.all([
    sanityFetch({query: settingsQuery}),
    sanityFetch({query: homepageQuery}),
  ])

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

  // Fallback to original homepage content if no page builder content exists
  return (
    <>
      <div className="relative">
        <div className="relative bg-[url(/images/tile-1-black.png)] bg-size-[5px]">
          <div className="bg-gradient-to-b from-white w-full h-full absolute top-0"></div>
          <div className="container">
            <div className="relative min-h-[40vh] mx-auto max-w-2xl pt-10 xl:pt-20 pb-30 space-y-6 lg:max-w-4xl lg:px-12 flex flex-col items-center justify-center">
              <div className="flex flex-col gap-4 items-center">
                <div className="text-md leading-6 prose uppercase py-1 px-3 bg-white font-mono italic">
                  A starter template for
                </div>
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-black">
                  <Link
                    className="underline decoration-brand hover:text-brand underline-offset-8 hover:underline-offset-4 transition-all ease-out"
                    href="https://sanity.io/"
                  >
                    Sanity
                  </Link>
                  +
                  <Link
                    className="underline decoration-black text-framework underline-offset-8 hover:underline-offset-4 transition-all ease-out"
                    href="https://nextjs.org/"
                  >
                    Next.js
                  </Link>
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className=" flex flex-col items-center">
          <SideBySideIcons />
          <div className="container relative mx-auto max-w-2xl pb-20 pt-10 space-y-6 lg:max-w-4xl lg:px-12 flex flex-col items-center">
            <div className="prose sm:prose-lg md:prose-xl xl:prose-2xl text-gray-700 prose-a:text-gray-700 font-light text-center">
              {settings?.description && <PortableText value={settings.description} />}
              <div className="flex items-center flex-col gap-4">
                <GetStartedCode />
                <Link
                  href="https://www.sanity.io/docs"
                  className="inline-flex text-brand text-xs md:text-sm underline hover:text-gray-900"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Sanity Documentation
                  <ExternalLink className="w-4 h-4 ml-1 inline" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="container">
          <aside className="py-12 sm:py-20">{/* <Suspense>{await AllPosts()}</Suspense> */}</aside>
        </div>
      </div>
    </>
  )
}

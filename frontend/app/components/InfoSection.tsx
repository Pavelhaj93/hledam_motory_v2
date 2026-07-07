import {type PortableTextBlock} from 'next-sanity'

import PortableText from '@/app/components/PortableText'
import {InfoSection} from '@/sanity.types'

type InfoProps = {
  block: InfoSection
  index: number
}

export default function CTA({block}: InfoProps) {
  return (
    <div className="container py-12">
      <div className="max-w-3xl">
        {block?.heading && (
          <h2 className="text-3xl md:text-4xl font-bold">{block.heading}</h2>
        )}
        {block?.subheading && (
          <span className="block mt-4 mb-8 text-lg uppercase font-light text-gray-900/70">
            {block.subheading}
          </span>
        )}
        <div className="mt-4">
          {block?.content?.length && (
            <PortableText className="" value={block.content as PortableTextBlock[]} />
          )}
        </div>
      </div>
    </div>
  )
}

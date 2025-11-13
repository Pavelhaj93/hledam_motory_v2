import React from 'react'

import Cta from '@/app/components/Cta'
import Info from '@/app/components/InfoSection'
import HeroSection from '@/app/components/HeroSection'
import HeroSectionCarousel from '@/app/components/HeroSectionCarousel'
import ProductShowcase from '@/app/components/ProductShowcase'
import ContactSection from '@/app/components/ContactSection'
import RichTextSection from '@/app/components/RichTextSection'
import HowItWorksSection from '@/app/components/HowItWorksSection'
import HomepageTeaserSection from '@/app/components/HomepageTeaserSection'
import BenefitsSection from '@/app/components/BenefitsSection'
import CategoryGrid from '@/app/components/CategoryGrid'
import FeatureGrid from '@/app/components/FeatureGrid'
import CtaBanner from '@/app/components/CtaBanner'
import {dataAttr} from '@/sanity/lib/utils'

type BlocksType = {
  [key: string]: React.FC<any>
}

type BlockType = {
  _type: string
  _key: string
}

type BlockProps = {
  index: number
  block: BlockType
  pageId: string
  pageType: string
}

const Blocks: BlocksType = {
  callToAction: Cta,
  infoSection: Info,
  heroSection: HeroSection,
  heroSectionCarousel: HeroSectionCarousel,
  productShowcase: ProductShowcase,
  contactSection: ContactSection,
  richTextSection: RichTextSection,
  howItWorksSection: HowItWorksSection,
  homepageTeaserSection: HomepageTeaserSection,
  benefitsSection: BenefitsSection,
  categoryGrid: CategoryGrid,
  featureGrid: FeatureGrid,
  ctaBanner: CtaBanner,
}

/**
 * Used by the <PageBuilder>, this component renders a the component that matches the block type.
 */
export default function BlockRenderer({block, index, pageId, pageType}: BlockProps) {
  // Block does exist
  if (typeof Blocks[block._type] !== 'undefined') {
    return (
      <div
        key={block._key}
        data-sanity={dataAttr({
          id: pageId,
          type: pageType,
          path: `pageBuilder[_key=="${block._key}"]`,
        }).toString()}
      >
        {React.createElement(Blocks[block._type], {
          key: block._key,
          block: block,
          index: index,
        })}
      </div>
    )
  }
  // Block doesn't exist yet
  return React.createElement(
    () => (
      <div className="w-full bg-gray-100 text-center text-gray-500 p-20 rounded">
        A &ldquo;{block._type}&rdquo; block hasn&apos;t been created
      </div>
    ),
    {key: block._key},
  )
}

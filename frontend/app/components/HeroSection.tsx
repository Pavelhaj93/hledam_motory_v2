import React from 'react'
import Image from 'next/image'
import {urlForImage} from '@/sanity/lib/utils'
import ResolvedLink from './ResolvedLink'
import {Button} from './ui/button'

type HeroSectionProps = {
  block: {
    _type: 'heroSection'
    headline?: string
    subheadline?: string
    description?: string
    heroImage?: {
      asset: any
      alt: string
      hotspot?: any
    }
    imagePosition?: 'left' | 'right' | 'background'
    primaryButton?: {
      text?: string
      link?: any
    }
    secondaryButton?: {
      text?: string
      link?: any
    }
  }
}

export default function HeroSection({block}: HeroSectionProps) {
  const {
    headline,
    subheadline,
    description,
    heroImage,
    imagePosition = 'right',
    primaryButton,
    secondaryButton,
  } = block

  if (imagePosition === 'background') {
    return (
      <section className="relative min-h-[600px] flex items-center justify-center text-white">
        {/* Background Image */}
        {heroImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={urlForImage(heroImage)?.width(1920).height(1080).url() || ''}
              alt={heroImage.alt || ''}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
          {headline && (
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">{headline}</h1>
          )}
          {subheadline && <p className="text-xl md:text-2xl mb-6 opacity-90">{subheadline}</p>}
          {description && (
            <p className="text-lg mb-8 opacity-80 max-w-2xl mx-auto">{description}</p>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {primaryButton?.text && primaryButton?.link && (
              <ResolvedLink link={primaryButton.link}>
                <Button>{primaryButton.text}</Button>
              </ResolvedLink>
            )}
            {secondaryButton?.text && secondaryButton?.link && (
              <ResolvedLink link={secondaryButton.link}>
                <Button variant="outline">{secondaryButton.text}</Button>
              </ResolvedLink>
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div
          className={`flex flex-col lg:flex-row items-center gap-12 ${
            imagePosition === 'left' ? 'lg:flex-row-reverse' : ''
          }`}
        >
          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            {headline && (
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
                {headline}
              </h1>
            )}
            {subheadline && <p className="text-xl md:text-2xl mb-6 text-gray-700">{subheadline}</p>}
            {description && (
              <p className="text-lg mb-8 text-gray-600 leading-relaxed">{description}</p>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {primaryButton?.text && primaryButton?.link && (
                <ResolvedLink link={primaryButton.link}>
                  <Button size="lg">{primaryButton.text}</Button>
                </ResolvedLink>
              )}
              {secondaryButton?.text && secondaryButton?.link && (
                <ResolvedLink link={secondaryButton.link}>
                  <Button size="lg" variant="outline">
                    {secondaryButton.text}
                  </Button>
                </ResolvedLink>
              )}
            </div>
          </div>

          {/* Image */}
          {heroImage && (
            <div className="flex-1 max-w-lg">
              <Image
                src={urlForImage(heroImage)?.width(600).height(400).url() || ''}
                alt={heroImage.alt || ''}
                width={600}
                height={400}
                className="w-full h-auto rounded-lg shadow-lg"
                priority
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

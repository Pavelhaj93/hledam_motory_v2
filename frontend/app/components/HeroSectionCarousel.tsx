'use client'

import React, {useEffect} from 'react'
import Image from 'next/image'
import {urlForImage} from '@/sanity/lib/utils'
import ResolvedLink from './ResolvedLink'
import {Button} from './ui/button'
import {Carousel, CarouselContent, CarouselItem, type CarouselApi} from './ui/carousel'
import Autoplay from 'embla-carousel-autoplay'

type HeroSectionCarouselProps = {
  block: {
    _type: 'heroSectionCarousel'
    headline?: string
    subheadline?: string
    description?: string
    images?: Array<{
      asset: any
      alt?: string
      hotspot?: any
      _key: string
    }>
    primaryButton?: {
      text?: string
      link?: any
    }
    secondaryButton?: {
      text?: string
      link?: any
    }
    autoplayDelay?: number
  }
}

export default function HeroSectionCarousel({block}: HeroSectionCarouselProps) {
  const {
    headline,
    subheadline,
    description,
    images = [],
    primaryButton,
    secondaryButton,
    autoplayDelay = 5000,
  } = block

  const [api, setApi] = React.useState<CarouselApi>()

  useEffect(() => {
    if (!api) {
      return
    }

    // Optional: Add any custom carousel behavior here
  }, [api])

  if (!images || images.length === 0) {
    return (
      <section className="relative min-h-[600px] flex items-center text-white bg-gray-900">
        <div className="relative z-10 container mx-auto px-4 pl-8 md:pl-16 max-w-4xl">
          {headline && (
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-left">
              {headline}
            </h1>
          )}
          {subheadline && (
            <p className="text-xl md:text-2xl mb-6 opacity-90 text-left">{subheadline}</p>
          )}
          {description && (
            <p className="text-lg mb-8 opacity-80 max-w-2xl text-left">{description}</p>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
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
    <section className="relative min-h-[600px] overflow-hidden">
      <Carousel
        setApi={setApi}
        className="w-full h-full"
        opts={{
          align: 'start',
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: autoplayDelay,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          }),
        ]}
      >
        <CarouselContent className="h-full">
          {images.map((image, index) => (
            <CarouselItem key={image._key || index} className="relative">
              <div className="relative min-h-[600px] flex items-center justify-center text-white">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={urlForImage(image)?.width(1920).height(1080).url() || ''}
                    alt={image.alt || `Hero image ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-black/50" />
                </div>

                {/* Content - Only show on first slide to avoid duplication */}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Content overlay for all slides */}
      <div className="absolute inset-0 z-20 flex items-center  pointer-events-none">
        <div className="container mx-auto px-4 max-w-6xl">
          {headline && (
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-left text-white">
              {headline}
            </h1>
          )}
          {subheadline && (
            <p className="text-xl md:text-2xl mb-6 opacity-90 text-left text-white">
              {subheadline}
            </p>
          )}
          {description && (
            <p className="text-lg mb-8 opacity-80 max-w-2xl text-left text-white">{description}</p>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pointer-events-auto">
            {primaryButton?.text && primaryButton?.link && (
              <ResolvedLink link={primaryButton.link}>
                <Button size="lg">{primaryButton.text}</Button>
              </ResolvedLink>
            )}
            {secondaryButton?.text && secondaryButton?.link && (
              <ResolvedLink link={secondaryButton.link}>
                <Button variant="outline" size="lg">
                  {secondaryButton.text}
                </Button>
              </ResolvedLink>
            )}
          </div>
        </div>
      </div>

      {/* Carousel indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className="w-3 h-3 rounded-full bg-white/50 hover:bg-white/80 transition-all duration-200 cursor-pointer"
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

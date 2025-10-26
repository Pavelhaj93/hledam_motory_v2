'use client'

import * as React from 'react'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'
import {Carousel, CarouselContent, CarouselItem} from '@/app/components/ui/Carousel'
import {Badge} from '@/app/components/ui/Badge'
import {BookButton} from '@/app/components/others/BookButton'
import {HomepagePicturesQueryResult} from '@/sanity.types'
import {urlForImage} from '@/sanity/lib/utils'

export default function HeroSectionCarousel({pictures}: {pictures?: HomepagePicturesQueryResult}) {
  const plugin = React.useRef(Autoplay({delay: 5000, stopOnInteraction: false}))

  return (
    <section className="relative h-[700px] flex items-center justify-center overflow-hidden">
      <Carousel
        plugins={[plugin.current]}
        className="absolute inset-0 h-screen w-full"
        opts={{loop: true}}
      >
        <CarouselContent className="h-screen">
          {pictures?.image?.map((src, idx) => (
            <CarouselItem key={idx} className="relative h-full w-full">
              <Image
                src={
                  urlForImage(src)
                    ?.height(1600)
                    .width(2400)
                    .fit('crop')
                    .auto('format')
                    .quality(100)
                    .url() as string
                }
                sizes="100vw"
                fill
                alt={src?.alt || 'Medifree'}
                priority={idx === 0}
                quality={100}
                className="object-cover"
              />
            </CarouselItem>
          ))}

          {/* <CarouselItem key={"test"} className="relative h-full w-full">
            <Image
              src={
                urlForImage(pictures?.image[0])
                  ?.height(700)
                  .width(1600)
                  .fit("crop")
                  .auto("format")
                  .quality(100)
                  .url() as string
              }
              sizes="100vw"
              fill
              alt={"Hero image"}
              priority
              quality={100}
              className="object-cover"
            />
          </CarouselItem> */}
        </CarouselContent>
      </Carousel>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="relative container mx-auto h-full justify-center items-center my-auto px-4 md:px-10 text-center md:text-left text-white pb-10 flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center mt-10">
          <div className="max-w-3xl">
            <Badge variant="primary" className="mb-4 inline-block opacity-0 animate-fade-in">
              Medifree
            </Badge>
            <h1 className="text-5xl md:text-6xl leading-tight mb-8 opacity-0 animate-fade-in-up animation-delay-200">
              Váš prostor pro zdraví a rovnováhu
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-0 animate-fade-in-up animation-delay-400">
              Nabízíme celostní terapeutické přístupy, které vás podpoří na cestě k plnohodnotnému
              životu.
            </p>
            <div className="opacity-0 animate-fade-in-up animation-delay-600">
              <BookButton />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

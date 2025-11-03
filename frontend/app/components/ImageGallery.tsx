'use client'

import {useState, useEffect, useCallback} from 'react'
import Image from 'next/image'
import {ChevronLeft, ChevronRight} from 'lucide-react'
import {urlForImage} from '@/sanity/lib/utils'

interface ImageGalleryProps {
  images: any[]
  productName: string
}

export default function ImageGallery({images, productName}: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchEndX, setTouchEndX] = useState(0)

  const handlePrevious = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  const handleNext = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }, [images.length])

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index)
  }

  // Handle touch gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return

    const distance = touchStartX - touchEndX
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && images.length > 1) {
      handleNext()
    }
    if (isRightSwipe && images.length > 1) {
      handlePrevious()
    }
  }

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        handlePrevious()
      } else if (event.key === 'ArrowRight') {
        handleNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrevious])

  // Early return after all hooks
  if (!images || images.length === 0) return null

  const currentImage = images[currentImageIndex]

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={urlForImage(currentImage)?.width(600).height(600).url() || ''}
          alt={currentImage?.alt || productName}
          width={600}
          height={600}
          className="h-full w-full object-cover object-center"
          priority
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg transition-colors hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg transition-colors hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-1 text-xs text-white">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`aspect-square overflow-hidden rounded-lg bg-gray-100 ring-2 transition-all focus:outline-none focus:ring-red-500 focus:ring-offset-2 ${
                index === currentImageIndex
                  ? 'ring-red-500 ring-offset-2'
                  : 'ring-transparent hover:ring-gray-300'
              }`}
            >
              <Image
                src={urlForImage(image)?.width(150).height(150).url() || ''}
                alt={image?.alt || `${productName} view ${index + 1}`}
                width={150}
                height={150}
                className="h-full w-full object-cover object-center transition-opacity hover:opacity-80"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

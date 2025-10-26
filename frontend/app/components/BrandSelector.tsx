'use client'

import Link from 'next/link'
import Image from 'next/image'
import {urlForImage} from '@/sanity/lib/utils'
import {AllBrandsWithLogosQueryResult} from '@/sanity.types'

type BrandSelectorProps = {
  brands: AllBrandsWithLogosQueryResult
  category?: string
  layout?: 'grid' | 'list' | 'compact'
  showLogos?: boolean
  showDescriptions?: boolean
  maxBrands?: number
  className?: string
}

export default function BrandSelector({
  brands: allBrands,
  category,
  layout = 'grid',
  showLogos = true,
  maxBrands,
  className = '',
}: BrandSelectorProps) {
  // Apply maxBrands limit if specified
  const brands = maxBrands ? allBrands.slice(0, maxBrands) : allBrands

  if (brands.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        <p>No brands available</p>
      </div>
    )
  }

  const getGridClasses = () => {
    switch (layout) {
      case 'list':
        return 'space-y-4'
      case 'compact':
        return 'grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-2'
      default:
        return 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'
    }
  }

  const getItemClasses = () => {
    switch (layout) {
      case 'list':
        return 'flex items-center space-x-4 p-4 bg-white border rounded-lg hover:shadow-md transition-shadow'
      case 'compact':
        return 'bg-white border rounded-lg p-2 text-center hover:bg-gray-50 transition-colors'
      default:
        return 'bg-white border rounded-lg p-4 text-center hover:shadow-md transition-shadow'
    }
  }

  const brandUrl = (brand: {slug: string}) => {
    if (category) {
      // Link to the category page since we no longer have brand-specific routing
      return `/katalog/${category}`
    }
    return `/katalog/repasovane-motory`
  }

  return (
    <div className={`${getGridClasses()} ${className}`}>
      {brands.map((brand) => (
        <Link key={brand._id} href={brandUrl(brand)} className={getItemClasses()}>
          {showLogos && brand.logo && (
            <div
              className={`${layout === 'list' ? 'w-auto h-16' : layout === 'compact' ? 'w-8 h-8 mx-auto mb-1' : 'w-auto h-14 mx-auto mb-3'} relative`}
            >
              <Image
                src={urlForImage(brand.logo)?.url() || ''}
                alt={`${brand.name} logo`}
                fill
                className="object-contain"
                sizes="100px"
              />
            </div>
          )}

          <div className={layout === 'list' ? 'flex-1' : ''}>
            <h3
              className={`font-semibold text-gray-900 ${
                layout === 'compact' ? 'text-xs' : layout === 'list' ? 'text-lg' : 'text-sm'
              }`}
            >
              {brand.name}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  )
}

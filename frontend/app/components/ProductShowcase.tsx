'use client'

import React from 'react'
import {useTranslations} from 'next-intl'
import {Link} from '@/i18n/navigation'
import {Zap, Cog, Truck, Sparkles} from 'lucide-react'

type CategoryShowcaseProps = {
  block: {
    _type: 'productShowcase'
    heading?: string
    description?: string
    layout?: 'grid' | 'featured' | 'carousel'
    maxCategories?: number
  }
}

// Category list for the showcase. Titles and descriptions come from next-intl
// (Categories / CategoryPage) so both the Czech and German sites stay translated.
const categoryData = [
  {slug: 'repasovane-motory', href: '/katalog/repasovane-motory', icon: Zap, color: 'bg-red-500'},
  {slug: 'turbodmychadla', href: '/katalog/turbodmychadla', icon: Cog, color: 'bg-green-500'},
  {slug: 'nove-motory', href: '/katalog/nove-motory', icon: Sparkles, color: 'bg-blue-500'},
  {slug: 'motorove-hlavy', href: '/katalog/motorove-hlavy', icon: Truck, color: 'bg-orange-500'},
  {slug: 'stare-motory', href: '/katalog/stare-motory', icon: Truck, color: 'bg-yellow-500'},
] as const

function CategoryCard({
  category,
  featured = false,
}: {
  category: (typeof categoryData)[number]
  featured?: boolean
}) {
  const tCat = useTranslations('Categories')
  const tPage = useTranslations('CategoryPage')
  const IconComponent = category.icon

  const cardClass = featured
    ? 'group bg-white rounded-xl shadow-sm border-2 border-red-200 hover:shadow-lg transition-all duration-300 p-8'
    : 'group bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 p-6'

  return (
    <Link href={category.href} className="block h-full">
      <div className={cardClass}>
        <div
          className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
        >
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        <h3
          className={`font-semibold text-gray-900 mb-2 group-hover:text-red-600 ${featured ? 'text-xl' : 'text-lg'}`}
        >
          {tCat(category.slug)}
        </h3>
        <p className={`text-gray-600 ${featured ? 'text-base' : 'text-sm'}`}>
          {tPage(`${category.slug}.description`)}
        </p>
      </div>
    </Link>
  )
}

export default function ProductShowcase({block}: CategoryShowcaseProps) {
  const {heading, description, layout = 'grid', maxCategories} = block

  // Use all categories or limit based on maxCategories
  const displayCategories = maxCategories ? categoryData.slice(0, maxCategories) : categoryData

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {(heading || description) && (
          <div className="text-center mb-12">
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{heading}</h2>
            )}
            {description && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">{description}</p>
            )}
          </div>
        )}

        {layout === 'featured' && displayCategories.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CategoryCard category={displayCategories[0]} featured={true} />
            </div>
            <div className="space-y-6">
              {displayCategories.slice(1).map((category) => (
                <CategoryCard key={category.slug} category={category} />
              ))}
            </div>
          </div>
        ) : layout === 'carousel' ? (
          <div className="overflow-x-auto">
            <div className="flex space-x-6 pb-4">
              {displayCategories.map((category) => (
                <div key={category.slug} className="flex-none w-80">
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayCategories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

'use client'

import Link from 'next/link'
import {Zap, Cog, Settings, Wrench, Car, Truck, Package} from 'lucide-react'

interface Category {
  title: string
  slug: string
  description: string
  icon: string
  color: string
  itemCount: string
  featured: boolean
}

interface CategoryGridData {
  heading?: string
  subheading?: string
  categories?: Category[]
}

interface CategoryGridProps {
  block?: CategoryGridData
}

const iconMap = {
  zap: Zap,
  cog: Cog,
  settings: Settings,
  wrench: Wrench,
  car: Car,
  truck: Truck,
  package: Package,
}

export default function CategoryGrid({block}: CategoryGridProps) {
  const {heading, subheading, categories} = block ?? {}

  if (!categories || categories.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-16">
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && (
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{heading}</h2>
            )}
            {subheading && <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subheading}</p>}
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Cog
            return (
              <Link
                key={category.slug}
                href={`/katalog/${category.slug}`}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {category.featured && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold z-10">
                    Populární
                  </div>
                )}

                <div className="p-8">
                  <div
                    className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                      {category.title}
                    </h3>
                    <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {category.itemCount}
                    </span>
                  </div>

                  <p className="text-gray-600 leading-relaxed mb-4">{category.description}</p>

                  <div className="flex items-center text-red-600 font-semibold">
                    <span>Prohlédnout kategori</span>
                    <svg
                      className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

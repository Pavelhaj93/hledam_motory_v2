import React from 'react'
import Link from 'next/link'
import {Zap, Cog, Settings, Truck} from 'lucide-react'

type Category = {
  slug: string
  title: string
  description: string
  icon: any
  color: string
  count?: number
}

type CategoryShowcaseProps = {
  block: {
    _type: 'productShowcase'
    heading?: string
    description?: string
    layout?: 'grid' | 'featured' | 'carousel'
    maxCategories?: number
  }
}

const categoryData: Category[] = [
  {
    slug: 'repasovane-motory',
    title: 'Repasované motory',
    description:
      'Kompletní repasované motory s plnou zárukou. Profesionální renovace s výměnou všech opotřebovaných dílů.',
    icon: Zap,
    color: 'bg-red-500',
  },
  {
    slug: 'turbodmychadla',
    title: 'Turbodmychadla',
    description:
      'Repasovaná turbodmychadla pro všechny typy vozidel. Kompletní renovace s novými ložisky a těsněními.',
    icon: Cog,
    color: 'bg-green-500',
  },
  {
    slug: 'prevodovky',
    title: 'Převodovky',
    description:
      'Manuální a automatické převodovky po kompletní renovaci. Výměna všech opotřebovaných komponentů.',
    icon: Settings,
    color: 'bg-purple-500',
  },
  {
    slug: 'motorove-hlavy',
    title: 'Motorové hlavy',
    description: 'Repasované motorové hlavy s nově zabroušenými ventily a novými těsněními.',
    icon: Truck,
    color: 'bg-orange-500',
  },
  {
    slug: 'stare-motory',
    title: 'Staré motory',
    description:
      'Široký výběr starých motorů pro různé značky a modely vozidel. Ideální pro renovace a opravy.',
    icon: Truck,
    color: 'bg-yellow-500',
  },
]

function CategoryCard({category, featured = false}: {category: Category; featured?: boolean}) {
  const IconComponent = category.icon

  const cardClass = featured
    ? 'group bg-white rounded-lg shadow-lg border-2 border-red-200 hover:shadow-xl transition-all duration-300 p-8'
    : 'group bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-300 p-6'

  return (
    <Link href={`/katalog/${category.slug}`} className="block h-full">
      <div className={cardClass}>
        <div
          className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
        >
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        <h3
          className={`font-semibold text-gray-900 mb-2 group-hover:text-red-600 ${featured ? 'text-xl' : 'text-lg'}`}
        >
          {category.title}
        </h3>
        <p className={`text-gray-600 ${featured ? 'text-base' : 'text-sm'}`}>
          {category.description}
        </p>
        {category.count && (
          <div className="mt-4 text-sm text-red-600 font-medium">{category.count} produktů</div>
        )}
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
            {heading && <h2 className="text-3xl font-bold text-gray-900 mb-4">{heading}</h2>}
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
              {displayCategories.slice(1).map((category, index) => (
                <CategoryCard key={category.slug} category={category} />
              ))}
            </div>
          </div>
        ) : layout === 'carousel' ? (
          <div className="overflow-x-auto">
            <div className="flex space-x-6 pb-4">
              {displayCategories.map((category, index) => (
                <div key={category.slug} className="flex-none w-80">
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayCategories.map((category, index) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

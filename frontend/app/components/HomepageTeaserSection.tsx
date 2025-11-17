import Link from 'next/link'
import type {LatestProductsQueryResult} from '@/sanity.types'
import ResolvedLink from './ResolvedLink'
import Image from 'next/image'
import {urlForImage} from '@/sanity/lib/utils'
import {Button} from './ui/button'

// Format price function
const formatPrice = (price?: number, currency = 'CZK'): string => {
  if (!price) return 'Cena na dotaz'
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

type HomepageTeaserSectionData = {
  title?: string
  description?: string
  primaryButton?: {
    text?: string
    link?: any
  }
  secondaryButton?: {
    text?: string
    link?: any
  }
  products?: LatestProductsQueryResult
}

type HomepageTeaserSectionProps = {
  block?: HomepageTeaserSectionData
}

export default function HomepageTeaserSection({block}: HomepageTeaserSectionProps) {
  const {
    title = 'Nejnovější repasované motory',
    description = 'Podívejte se na nejnovější repasované motory v našem katalogu. Vyberte si z široké nabídky kvalitních a důkladně zkontrolovaných motorů.',
    primaryButton,
    secondaryButton,
    products,
  } = block ?? {}

  if (!products || products.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">{description}</p>
        </div>

        {/* Products Grid */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {products.map((product, index) => (
              <Link
                key={product._id}
                href={`/katalog/repasovane-motory/${product.slug}`}
                className={`group ${index >= 3 ? 'hidden' : ''} ${
                  index >= 3 && index < 6 ? 'sm:block' : ''
                } ${index >= 6 && index < 9 ? 'lg:block' : ''} ${
                  index >= 9 && index < 12 ? 'xl:block' : ''
                } ${index >= 12 ? '2xl:block' : ''}`}
              >
                <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow h-full flex flex-col">
                  {/* Product Image */}
                  <div className="aspect-square w-full overflow-hidden rounded-t-lg bg-gray-100">
                    {product.images?.[0] ? (
                      <Image
                        src={urlForImage(product.images?.[0])?.width(400).height(400).url() || ''}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">Bez obrázku</span>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
                        {product.name}
                      </h3>

                      {/* Brand - handle both old string format and new reference format */}
                      {(product as any).brand && (
                        <p className="text-sm text-red-600 font-medium mt-1">
                          {typeof (product as any).brand === 'string'
                            ? (product as any).brand
                            : (product as any).brand?.name || ''}
                        </p>
                      )}

                      <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium mt-2">
                        Repasované motory
                      </span>

                      {product.description && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-end">
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(product.price, 'CZK')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Žádné produkty nebyly nalezeny.</p>
          </div>
        )}

        {/* Call to Action Buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-4 md:mt-8 lg:mt-12">
          {primaryButton?.link && (
            <ResolvedLink link={primaryButton.link}>
              <Button size="lg" className="w-full md:w-auto">
                {primaryButton.text || 'Zobrazit katalog'}
              </Button>
            </ResolvedLink>
          )}
          {secondaryButton?.link && (
            <ResolvedLink link={secondaryButton.link}>
              <Button variant="outline" size="lg" className="w-full md:w-auto">
                {secondaryButton.text || 'Kontaktujte nás'}
              </Button>
            </ResolvedLink>
          )}
        </div>
      </div>
    </section>
  )
}

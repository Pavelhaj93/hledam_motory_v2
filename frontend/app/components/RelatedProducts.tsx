import Link from 'next/link'
import Image from 'next/image'
import type {RelatedProductsQueryResult} from '@/sanity.types'
import {urlForImage} from '@/sanity/lib/utils'
import {currencyFor, type Locale} from '@/app/lib/i18n'
import MissingImage from './MissingImage'

const formatPrice = (price: number | null | undefined, locale: Locale): string => {
  if (!price) return 'Cena na dotaz'
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: currencyFor[locale],
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

type RelatedProductsProps = {
  products: RelatedProductsQueryResult
  categoryHref: string
  categoryLabel: string
  heading: string
  locale: Locale
}

export default function RelatedProducts({
  products,
  categoryHref,
  categoryLabel,
  heading,
  locale,
}: RelatedProductsProps) {
  if (!products || products.length === 0) {
    return null
  }

  return (
    <div className="mt-16">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{heading}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product._id} href={`${categoryHref}/${product.slug}`} className="group">
            <div className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-shadow h-full flex flex-col">
              <div className="aspect-square w-full overflow-hidden rounded-t-xl bg-gray-100">
                {product.images?.[0] ? (
                  <Image
                    src={urlForImage(product.images[0])?.width(300).height(300).url() || ''}
                    alt={product.name ?? ''}
                    width={300}
                    height={300}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <MissingImage />
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
                  {product.name}
                </h4>
                {product.brand?.name && (
                  <p className="text-xs text-red-600 font-medium mt-1">{product.brand.name}</p>
                )}
                <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium mt-2 self-start">
                  {categoryLabel}
                </span>
                <div className="mt-auto pt-3">
                  <span className="text-sm font-bold text-gray-900">
                    {formatPrice(product.price, locale)}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

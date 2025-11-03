import {useEffect, useState} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {sanityFetch} from '@/sanity/lib/live'
import {urlForImage} from '@/sanity/lib/utils'

type Product = {
  _id: string
  title: string
  slug?: {current: string}
  mainImage?: any
  price?: number
}

export default function LatestProductsShowcase({limit = 10}: {limit?: number}) {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    async function fetchProducts() {
      const {data} = await sanityFetch({
        query: `*[_type == "product"] | order(_createdAt desc)[0...$limit]{_id, title, slug, mainImage, price}`,
        params: {limit},
        perspective: 'published',
        stega: false,
      })
      setProducts(data)
    }
    fetchProducts()
  }, [limit])

  if (!products.length) return null

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
      {products.map((product) => (
        <Link
          key={product._id}
          href={`/products/${product.slug?.current}`}
          className="block bg-white rounded-lg shadow hover:shadow-lg transition p-4 border"
        >
          {product.mainImage && (
            <div className="relative w-full h-32 mb-3">
              <Image
                src={urlForImage(product.mainImage)?.url() || ''}
                alt={product.title}
                fill
                className="object-cover rounded"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 20vw"
              />
            </div>
          )}
          <h3 className="font-semibold text-gray-900 mb-1 text-base">{product.title}</h3>
          {product.price && (
            <div className="text-red-600 font-bold text-sm">{product.price} Kč</div>
          )}
        </Link>
      ))}
    </div>
  )
}

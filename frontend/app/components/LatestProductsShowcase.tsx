import {useEffect, useState} from 'react'
import Link from 'next/link'
import {sanityFetch} from '@/sanity/lib/live'

type Product = {
  _id: string
  title: string
  slug?: {current: string}
  mainImage?: {asset?: {url: string}}
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
            <img
              src={product.mainImage?.asset?.url || ''}
              alt={product.title}
              className="w-full h-32 object-cover rounded mb-3"
            />
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

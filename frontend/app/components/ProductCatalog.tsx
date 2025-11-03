'use client'

import {useState, useEffect, useMemo} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight} from 'lucide-react'
import {urlForImage} from '@/sanity/lib/utils'

type Product = {
  _id: string
  name: string
  slug: string
  brand: {
    name: string
    slug: string
    logo: any | null
  } | null
  category: string
  partNumber: string[]
  description: string | null
  mainImage: any | null
  price: number
  currency: string
  inStock: boolean
  featured: boolean
  specifications: Array<{
    label: string
    value: string
  }> | null
  compatibility: string[] | null
}

type ProductCatalogProps = {
  products: Product[]
}

const categoryLabels: Record<string, string> = {
  'motorove-hlavy': 'Motorové hlavy',
  'repasovane-motory': 'Repasované motory',
  'stare-motory': 'Staré motory',
  'turbodmychadla': 'Turbodmychadla',
  'prevodovky': 'Převodovky',
}

const sortOptions = [
  {label: 'Název (A-Z)', value: 'name-asc'},
  {label: 'Název (Z-A)', value: 'name-desc'},
  {label: 'Cena (nejlevnější)', value: 'price-asc'},
  {label: 'Cena (nejdražší)', value: 'price-desc'},
  {label: 'Kategorie', value: 'category'},
]

function formatPrice(price: number, currency: string) {
  const currencySymbols: Record<string, string> = {
    CZK: 'Kč',
  }

  const symbol = currencySymbols[currency] || currency
  const formattedPrice = new Intl.NumberFormat('cs-CZ', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)

  return `${formattedPrice} ${symbol}`
}

function ProductCard({product}: {product: Product}) {
  return (
    <Link href={`/katalog/${product.category}/${product.slug}`} className="group">
      <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow h-full flex flex-col">
        {/* Product Image */}
        <div className="aspect-square w-full overflow-hidden rounded-t-lg bg-gray-100">
          {product.mainImage ? (
            <Image
              src={urlForImage(product.mainImage)?.width(400).height(400).url() || ''}
              alt={product.mainImage.alt || product.name}
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

            {product.category && (
              <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium mt-2">
                {categoryLabels[product.category] || product.category}
              </span>
            )}

            {product.description && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-end">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price, product.currency || 'CZK')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function ProductCatalog({products}: ProductCatalogProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [sortBy, setSortBy] = useState('name-asc')
  const [priceRange, setPriceRange] = useState({min: 0, max: 100000})
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Get unique brands - with compatibility for string and reference types
  const uniqueBrands = useMemo(() => {
    const brands = products
      .map((p) => {
        // Handle both old string format and new reference format
        const brand = (p as any).brand
        if (typeof brand === 'string') {
          return brand
        } else if (brand && brand.name) {
          return brand.name
        }
        return null
      })
      .filter(Boolean)
      .filter((brand, index, arr) => arr.indexOf(brand) === index)
      .sort()
    return brands as string[]
  }, [products])

  // Set initial price range based on products
  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map((p) => p.price)
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      setPriceRange({min: minPrice, max: maxPrice})
    }
  }, [products])

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      // Search filter
      const searchMatch =
        searchTerm === '' ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // Handle brand search for both string and reference types
        (() => {
          const brand = (product as any).brand
          if (typeof brand === 'string') {
            return brand.toLowerCase().includes(searchTerm.toLowerCase())
          } else if (brand && brand.name) {
            return brand.name.toLowerCase().includes(searchTerm.toLowerCase())
          }
          return false
        })() ||
        (Array.isArray(product.partNumber) &&
          product.partNumber.some((pn) => pn.toLowerCase().includes(searchTerm.toLowerCase())))

      // Brand filter - handle both string and reference types
      const brandMatch =
        selectedBrand === 'all' ||
        (() => {
          const brand = (product as any).brand
          if (typeof brand === 'string') {
            return brand === selectedBrand
          } else if (brand && brand.name) {
            return brand.name === selectedBrand
          }
          return false
        })()

      // Price filter
      const priceMatch = product.price >= priceRange.min && product.price <= priceRange.max

      return searchMatch && brandMatch && priceMatch
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'category':
          return (a.category || '').localeCompare(b.category || '')
        default:
          return 0
      }
    })

    return filtered
  }, [products, searchTerm, selectedBrand, priceRange, sortBy])

  // Pagination calculations
  const totalItems = filteredAndSortedProducts.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = filteredAndSortedProducts.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedBrand, priceRange, sortBy])

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedBrand('all')
    setSortBy('name-asc')
    setCurrentPage(1)
    if (products.length > 0) {
      const prices = products.map((p) => p.price)
      setPriceRange({min: Math.min(...prices), max: Math.max(...prices)})
    }
  }

  return (
    <div>
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Hledat produkty podle názvu, značky, popisu nebo čísla dílu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        {/* Filter Toggle Button (Mobile) */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filtry</span>
          </button>
        </div>

        {/* Filters */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${showFilters ? 'block' : 'hidden lg:grid'}`}
        >
          {/* Brand Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Značka</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">Všechny značky</option>
              {uniqueBrands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Řadit podle</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Actions */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {totalItems > 0 && totalPages > 1 ? (
              <>
                Nalezeno {totalItems} produktů (stránka {currentPage} z {totalPages})
              </>
            ) : (
              <>
                Zobrazeno {totalItems} z {products.length} produktů
              </>
            )}
          </div>
          <button
            onClick={clearFilters}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Vymazat filtry
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Filter className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Žádné produkty nenalezeny</h3>
          <p className="text-gray-600">Zkuste změnit filtry nebo hledaný výraz.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {currentProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Zobrazeno {startIndex + 1}-{Math.min(endIndex, totalItems)} z {totalItems} produktů
              </div>

              <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Předchozí
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({length: totalPages}, (_, index) => {
                    const pageNumber = index + 1
                    const isCurrentPage = pageNumber === currentPage

                    // Show first page, last page, current page, and 2 pages around current
                    const showPage =
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      Math.abs(pageNumber - currentPage) <= 2

                    if (!showPage) {
                      // Show ellipsis for gaps
                      if (pageNumber === currentPage - 3 || pageNumber === currentPage + 3) {
                        return (
                          <span key={pageNumber} className="px-2 py-1 text-gray-400">
                            ...
                          </span>
                        )
                      }
                      return null
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          isCurrentPage
                            ? 'bg-red-600 text-white'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    )
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Další
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

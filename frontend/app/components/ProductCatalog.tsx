'use client'

import {useState, useEffect, useMemo} from 'react'
import {useLocale, useTranslations} from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import {toPlainText} from 'next-sanity'
import {Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight} from 'lucide-react'
import {urlForImage} from '@/sanity/lib/utils'
import type {BlockContent} from '@/sanity.types'
import {categoryPath, type CategoryKey} from '@/app/lib/categories'
import {type Locale} from '@/app/lib/i18n'
import MissingImage from './MissingImage'
import {Button} from './ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'

type Product = {
  _id: string
  name: string | null
  slug: string | null
  brand: {
    name: string | null
    slug: string | null
    logo: any | null
  } | null
  category: string
  partNumber: string[]
  description: BlockContent | null
  mainImage: any | null
  price: number | null
  currency: string
  inStock: boolean | null
  featured: boolean | null
  specifications: Array<{
    label: string | null
    value: string | null
  }> | null
  compatibility: string[] | null
  fuelType?: string | null
  displacement?: string | null
}

type ProductCatalogProps = {
  products: Product[]
}

function formatPrice(price: number, currency: string, locale: string) {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency || 'CZK',
      maximumFractionDigits: 0,
    }).format(price)
  } catch {
    return `${price} ${currency}`
  }
}

function ProductCard({product}: {product: Product}) {
  const locale = useLocale() as Locale
  const tCat = useTranslations('Categories')
  const t = useTranslations('Catalog')
  const href = `/${categoryPath(product.category as CategoryKey, locale)}/${product.slug}`
  return (
    <Link href={href} className="group">
      <div className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-shadow h-full flex flex-col">
        {/* Product Image */}
        <div className="aspect-square w-full overflow-hidden rounded-t-xl bg-gray-100">
          {product.mainImage ? (
            <Image
              src={urlForImage(product.mainImage)?.width(400).height(400).url() || ''}
              alt={product.mainImage.alt || product.name || ''}
              width={400}
              height={400}
              className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <MissingImage label={t('noImage')} />
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
                {tCat(product.category)}
              </span>
            )}

            {product.compatibility && product.compatibility.length > 0 ? (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {product.compatibility.slice(0, 3).join(', ')}
              </p>
            ) : product.description ? (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {toPlainText(product.description)}
              </p>
            ) : null}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-end">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price ?? 0, product.currency || 'CZK', locale)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function ProductCatalog({products}: ProductCatalogProps) {
  const t = useTranslations('Catalog')
  const sortOptions = [
    {label: t('sortNameAsc'), value: 'name-asc'},
    {label: t('sortNameDesc'), value: 'name-desc'},
    {label: t('sortPriceAsc'), value: 'price-asc'},
    {label: t('sortPriceDesc'), value: 'price-desc'},
  ]
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [selectedFuelType, setSelectedFuelType] = useState('all')
  const [selectedDisplacement, setSelectedDisplacement] = useState('all')
  const [sortBy, setSortBy] = useState('name-asc')
  const [priceRange, setPriceRange] = useState({min: 0, max: 100000})
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

  const uniqueFuelTypes = useMemo(() => {
    return products
      .map((p) => p.fuelType)
      .filter((v): v is string => !!v)
      .filter((v, i, arr) => arr.indexOf(v) === i)
      .sort()
  }, [products])

  const uniqueDisplacements = useMemo(() => {
    return products
      .map((p) => p.displacement)
      .filter((v): v is string => !!v)
      .filter((v, i, arr) => arr.indexOf(v) === i)
      .sort((a, b) => (parseInt(a) || 0) - (parseInt(b) || 0))
  }, [products])

  // Set initial price range based on products
  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map((p) => p.price ?? 0)
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
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description &&
          toPlainText(product.description).toLowerCase().includes(searchTerm.toLowerCase())) ||
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
      const priceMatch = (product.price ?? 0) >= priceRange.min && (product.price ?? 0) <= priceRange.max

      // Fuel type filter
      const fuelTypeMatch = selectedFuelType === 'all' || product.fuelType === selectedFuelType

      // Displacement filter
      const displacementMatch =
        selectedDisplacement === 'all' || product.displacement === selectedDisplacement

      return searchMatch && brandMatch && priceMatch && fuelTypeMatch && displacementMatch
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return (a.name ?? '').localeCompare(b.name ?? '')
        case 'name-desc':
          return (b.name ?? '').localeCompare(a.name ?? '')
        case 'price-asc':
          return (a.price ?? 0) - (b.price ?? 0)
        case 'price-desc':
          return (b.price ?? 0) - (a.price ?? 0)
        case 'category':
          return (a.category || '').localeCompare(b.category || '')
        default:
          return 0
      }
    })

    return filtered
  }, [products, searchTerm, selectedBrand, selectedFuelType, selectedDisplacement, priceRange, sortBy])

  const activeFilterCount = [
    selectedBrand !== 'all',
    selectedFuelType !== 'all',
    selectedDisplacement !== 'all',
    sortBy !== 'name-asc',
  ].filter(Boolean).length

  // Pagination calculations
  const totalItems = filteredAndSortedProducts.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = filteredAndSortedProducts.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedBrand, selectedFuelType, selectedDisplacement, priceRange, sortBy])

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedBrand('all')
    setSelectedFuelType('all')
    setSelectedDisplacement('all')
    setSortBy('name-asc')
    setCurrentPage(1)
    if (products.length > 0) {
      const prices = products.map((p) => p.price ?? 0)
      setPriceRange({min: Math.min(...prices), max: Math.max(...prices)})
    }
  }

  const filterFields = (
    <>
      {/* Brand Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('brand')}</label>
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        >
          <option value="all">{t('allBrands')}</option>
          {uniqueBrands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      {/* Fuel Type Filter — only shown when products have fuelType data */}
      {uniqueFuelTypes.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('fuelType')}</label>
          <select
            value={selectedFuelType}
            onChange={(e) => setSelectedFuelType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="all">{t('allFuelTypes')}</option>
            {uniqueFuelTypes.map((fuel) => (
              <option key={fuel} value={fuel}>
                {fuel}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Displacement Filter — only shown when products have displacement data */}
      {uniqueDisplacements.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('displacement')}
          </label>
          <select
            value={selectedDisplacement}
            onChange={(e) => setSelectedDisplacement(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="all">{t('allDisplacements')}</option>
            {uniqueDisplacements.map((d) => (
              <option key={d} value={d}>
                {d} ccm
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Sort */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('sortBy')}</label>
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
    </>
  )

  return (
    <div>
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        {/* Filter Toggle Button (Mobile) — opens a slide-in sheet */}
        <div className="lg:hidden mb-4 flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <SlidersHorizontal className="h-4 w-4" />
                <span>{t('filters')}</span>
                {activeFilterCount > 0 && (
                  <span className="flex items-center justify-center h-5 w-5 rounded-full bg-red-600 text-white text-xs font-medium">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>{t('filters')}</SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-1 gap-4 mt-4">{filterFields}</div>
              <SheetFooter className="mt-6 flex-row gap-2">
                <Button variant="outline" onClick={clearFilters} className="flex-1">
                  {t('clearFilters')}
                </Button>
                <SheetClose asChild>
                  <Button className="flex-1">{t('showResults', {count: totalItems})}</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              {t('clearFilters')}
            </button>
          )}
        </div>

        {/* Filters (desktop) */}
        <div className="hidden lg:grid grid-cols-4 gap-4">{filterFields}</div>

        {/* Filter Actions */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">{t('foundCount', {count: totalItems})}</div>
          <button
            onClick={clearFilters}
            className="hidden lg:block text-sm text-red-600 hover:text-red-700 font-medium"
          >
            {t('clearFilters')}
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Filter className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noResultsTitle')}</h3>
          <p className="text-gray-600 mb-4">{t('noResultsBody')}</p>
          <Button variant="outline" onClick={clearFilters}>
            {t('clearFilters')}
          </Button>
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
                {startIndex + 1}-{Math.min(endIndex, totalItems)} / {totalItems}
              </div>

              <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {t('prev')}
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
                        aria-current={isCurrentPage ? 'page' : undefined}
                        aria-label={`Strana ${pageNumber}`}
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
                  {t('next')}
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

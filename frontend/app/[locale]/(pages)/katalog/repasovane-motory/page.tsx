import {Metadata} from 'next'
import {getTranslations, setRequestLocale} from 'next-intl/server'
import {sanityFetch} from '@/sanity/lib/live'
import {allRepasovaneMotoryQuery} from '@/sanity/lib/queries'
import ProductCatalog from '@/app/components/ProductCatalog'
import CatalogNotFoundBanner from '@/app/components/CatalogNotFoundBanner'
import CategoryHero from '@/app/components/CategoryHero'
import {categoryBreadcrumbJsonLd} from '@/app/lib/jsonld'
import {buildCategoryMetadata} from '@/app/lib/categoryMeta'
import {categoryPath} from '@/app/lib/categories'
import {localePrefix, type Locale} from '@/app/lib/i18n'

const CATEGORY = 'repasovane-motory' as const
type Props = {params: Promise<{locale: Locale}>}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params
  return buildCategoryMetadata(locale, CATEGORY)
}

export default async function EnginesPage({params}: Props) {
  const {locale} = await params
  setRequestLocale(locale)
  const tCat = await getTranslations('Categories')
  const tPage = await getTranslations('CategoryPage')
  const tCommon = await getTranslations('Common')

  const {data: products} = await sanityFetch({
    query: allRepasovaneMotoryQuery,
    params: {locale},
    stega: false,
  })

  const katalogHref = `${localePrefix[locale]}/katalog`
  const breadcrumb = categoryBreadcrumbJsonLd(tCat(CATEGORY), categoryPath(CATEGORY, locale), locale, {
    home: tCommon('home'),
    catalog: tCommon('catalog'),
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumb)}} />
      {/* Hero Section */}
      <CategoryHero
        title={tPage(`${CATEGORY}.title`)}
        description={tPage(`${CATEGORY}.description`)}
        breadcrumbs={[
          {label: tCommon('home'), href: '/'},
          {label: tCommon('catalog'), href: katalogHref},
          {label: tCat(CATEGORY)},
        ]}
      />

      <div className="container mx-auto px-4 py-12">
        {/* Product Catalog */}
        <ProductCatalog
          products={(products || []).map((p) => ({
            _id: p._id,
            name: p.name,
            slug: p.slug,
            brand: p.brand,
            category: 'repasovane-motory',
            partNumber: p.engineCodes || [],
            description: p.description,
            mainImage: p.mainImage,
            price: p.price || 0,
            currency: p.currency || 'CZK',
            inStock: p.inStock || false,
            featured: p.featured || false,
            specifications: p.specifications,
            compatibility: p.compatibility,
            fuelType: p.fuelType,
            displacement: p.displacement,
          }))}
        />

        {/* SEO Content (Czech only until translated into Sanity per-locale fields) */}
        {locale === 'cs' && (
          <div className="mt-16 bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Proč si vybrat naše repasované motory?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Kompletní renovace</h3>
                <p className="text-gray-600">
                  Každý motor prochází kompletní demontáží a renovací. Vyměňujeme všechny opotřebované
                  díly včetně pístů, ventilů, ložisek a těsnění.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Záruka kvality</h3>
                <p className="text-gray-600">
                  Na všechny repasované motory poskytujeme záruku. Každý motor je před expedicí
                  důkladně otestován a zkontrolován.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Rychlé dodání</h3>
                <p className="text-gray-600">
                  Většinu motorů máme na skladě pro okamžité dodání. Speciální motory renovujeme na
                  zakázku s rychlým termínem dokončení.
                </p>
              </div>
            </div>

            <div className="mt-8 border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Často renovované typy motorů
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Benzínové motory</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• BMW N47, N20, N55 motory</li>
                    <li>• Audi 2.0 TFSI, 1.8 TFSI motory</li>
                    <li>• VW 1.4 TSI, 2.0 TSI motory</li>
                    <li>• Mercedes M274, M276 motory</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Dieselové motory</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• BMW 320d N47, 530d M57 motory</li>
                    <li>• Audi A4 2.0 TDI, A6 3.0 TDI motory</li>
                    <li>• VW Golf 1.9 TDI, 2.0 TDI motory</li>
                    <li>• Ford 2.0 TDCi, 2.2 TDCi motory</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        <CatalogNotFoundBanner />
      </div>
    </div>
  )
}

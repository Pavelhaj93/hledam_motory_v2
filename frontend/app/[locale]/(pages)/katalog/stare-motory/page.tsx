import {Metadata} from 'next'
import {getTranslations, setRequestLocale} from 'next-intl/server'
import {sanityFetch} from '@/sanity/lib/live'
import {allStareMotoryQuery} from '@/sanity/lib/queries'
import ProductCatalog from '@/app/components/ProductCatalog'
import CatalogNotFoundBanner from '@/app/components/CatalogNotFoundBanner'
import CategoryHero from '@/app/components/CategoryHero'
import {categoryBreadcrumbJsonLd} from '@/app/lib/jsonld'
import {buildCategoryMetadata} from '@/app/lib/categoryMeta'
import {categoryPath} from '@/app/lib/categories'
import {localePrefix, type Locale} from '@/app/lib/i18n'

const CATEGORY = 'stare-motory' as const
type Props = {params: Promise<{locale: Locale}>}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params
  return buildCategoryMetadata(locale, CATEGORY)
}

export default async function UsedEnginesPage({params}: Props) {
  const {locale} = await params
  setRequestLocale(locale)
  const tCat = await getTranslations('Categories')
  const tPage = await getTranslations('CategoryPage')
  const tCommon = await getTranslations('Common')

  const {data: products} = await sanityFetch({
    query: allStareMotoryQuery,
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
            category: 'stare-motory',
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
              Proč si vybrat naše staré motory?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Kontrola kvality</h3>
                <p className="text-gray-600">
                  Každý starý motor prochází důkladnou kontrolou stavu a funkčnosti. Testujeme
                  kompresí, těsnost a celkový technický stav před prodejem.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Záruka funkčnosti</h3>
                <p className="text-gray-600">
                  Na všechny staré motory poskytujeme záruku funkčnosti. Každý motor je před expedicí
                  důkladně otestován a zkontrolován.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Výhodné ceny</h3>
                <p className="text-gray-600">
                  Nabízíme nejlepší poměr cena/výkon na trhu. Staré motory jsou ideální řešení pro
                  rychlou a ekonomickou opravu vozidla.
                </p>
              </div>
            </div>

            <div className="mt-8 border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Často dostupné typy motorů</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Benzínové motory</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• BMW N46, N52, N54 motory</li>
                    <li>• Audi 1.8T, 2.0 TFSI motory</li>
                    <li>• VW 1.6, 2.0 TSI motory</li>
                    <li>• Mercedes M271, M272 motory</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Dieselové motory</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• BMW 318d N47, 320d N47 motory</li>
                    <li>• Audi A4 1.9 TDI, A6 2.5 TDI motory</li>
                    <li>• VW Golf 1.9 TDI, Passat 2.0 TDI motory</li>
                    <li>• Ford 1.8 TDCi, 2.0 TDCi motory</li>
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

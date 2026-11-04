import {Metadata} from 'next'
import {getTranslations, setRequestLocale} from 'next-intl/server'
import {sanityFetch} from '@/sanity/lib/live'
import {allNoveMotoryQuery} from '@/sanity/lib/queries'
import ProductCatalog from '@/app/components/ProductCatalog'
import CatalogNotFoundBanner from '@/app/components/CatalogNotFoundBanner'
import CategoryHero from '@/app/components/CategoryHero'
import {categoryBreadcrumbJsonLd} from '@/app/lib/jsonld'
import {buildCategoryMetadata} from '@/app/lib/categoryMeta'
import {categoryPath} from '@/app/lib/categories'
import {localePrefix, type Locale} from '@/app/lib/i18n'

const CATEGORY = 'nove-motory' as const
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
    query: allNoveMotoryQuery,
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
            category: 'nove-motory',
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
              Proč si vybrat naše nové motory?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Zcela nové díly</h3>
                <p className="text-gray-600">
                  Nové motory dodáváme nepoužité, s originálními díly a plnou životností. Žádné
                  opotřebení, žádné kompromisy.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Záruka výrobce</h3>
                <p className="text-gray-600">
                  Na nové motory se vztahuje plná záruka. Každý kus je dodáván s dokumentací a
                  připraven k okamžité montáži.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Spolehlivé dodání</h3>
                <p className="text-gray-600">
                  Nové motory zajišťujeme na objednávku v krátkých termínech. Poradíme s výběrem
                  správného typu pro vaše vozidlo.
                </p>
              </div>
            </div>
          </div>
        )}
        <CatalogNotFoundBanner />
      </div>
    </div>
  )
}

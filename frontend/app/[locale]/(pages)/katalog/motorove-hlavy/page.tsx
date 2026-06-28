import {Metadata} from 'next'
import {getTranslations, setRequestLocale} from 'next-intl/server'
import {sanityFetch} from '@/sanity/lib/live'
import {allMotoroveHlavyQuery} from '@/sanity/lib/queries'
import ProductCatalog from '@/app/components/ProductCatalog'
import CatalogNotFoundBanner from '@/app/components/CatalogNotFoundBanner'
import CategoryHero from '@/app/components/CategoryHero'
import {categoryBreadcrumbJsonLd} from '@/app/lib/jsonld'
import {buildCategoryMetadata} from '@/app/lib/categoryMeta'
import {categoryPath} from '@/app/lib/categories'
import {localePrefix, type Locale} from '@/app/lib/i18n'

const CATEGORY = 'motorove-hlavy' as const
type Props = {params: Promise<{locale: Locale}>}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params
  return buildCategoryMetadata(locale, CATEGORY)
}

export default async function EngineHeadsPage({params}: Props) {
  const {locale} = await params
  setRequestLocale(locale)
  const tCat = await getTranslations('Categories')
  const tPage = await getTranslations('CategoryPage')
  const tCommon = await getTranslations('Common')

  const {data: products} = await sanityFetch({
    query: allMotoroveHlavyQuery,
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
            category: 'motorove-hlavy',
            partNumber: p.engineCodes || [],
            description: p.description,
            mainImage: p.mainImage,
            price: p.price || 0,
            currency: p.currency || 'CZK',
            inStock: p.inStock || false,
            featured: p.featured || false,
            specifications: p.specifications,
            compatibility: p.compatibility,
          }))}
        />

        {/* SEO Content (Czech only until translated into Sanity per-locale fields) */}
        {locale === 'cs' && (
          <div className="mt-16 bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Proč si vybrat naše repasované motorové hlavy?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Profesionální broušení</h3>
                <p className="text-gray-600">
                  Každá motorová hlava je profesionálně zabroušena na specializovaných strojích.
                  Broušíme sedla ventilů pro dokonalé těsnění a optimální výkon motoru.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Nové komponenty</h3>
                <p className="text-gray-600">
                  Při renovaci vyměňujeme všechny opotřebované díly včetně ventilů, vodítek, pružin a
                  těsnění. Používáme pouze kvalitní originální díly.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Kontrola kvality</h3>
                <p className="text-gray-600">
                  Každá renovovaná hlava prochází důkladnou kontrolou těsnosti a tlakovou zkouškou.
                  Garantujeme perfektní funkčnost a spolehlivost.
                </p>
              </div>
            </div>

            <div className="mt-8 border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Často renovované typy motorových hlav
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Benzínové motory</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>
                      • <strong>BMW:</strong> N20, N26, N55, S55 motorové hlavy
                    </li>
                    <li>
                      • <strong>Audi:</strong> EA888, EA113 TFSI motorové hlavy
                    </li>
                    <li>
                      • <strong>VW:</strong> TSI, FSI motorové hlavy
                    </li>
                    <li>
                      • <strong>Mercedes:</strong> M274, M276 motorové hlavy
                    </li>
                    <li>
                      • <strong>Ford:</strong> EcoBoost 1.0, 1.6, 2.0 hlavy
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Dieselové motory</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>
                      • <strong>BMW:</strong> N47, N57 dieselové hlavy
                    </li>
                    <li>
                      • <strong>Audi:</strong> TDI motorové hlavy všech typů
                    </li>
                    <li>
                      • <strong>VW:</strong> TDI, SDI motorové hlavy
                    </li>
                    <li>
                      • <strong>Mercedes:</strong> CDI motorové hlavy
                    </li>
                    <li>
                      • <strong>Ford:</strong> TDCi motorové hlavy
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Proces renovace motorové hlavy
              </h3>
              <div className="grid md:grid-cols-6 gap-4">
                <div className="text-center">
                  <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-red-600 font-bold">1</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Demontáž</h4>
                  <p className="text-sm text-gray-600">Demontáž ventilů a příslušenství</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Čištění</h4>
                  <p className="text-sm text-gray-600">Důkladné vyčištění všech kanálů</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Kontrola</h4>
                  <p className="text-sm text-gray-600">Měření rovinnosti a trhlin</p>
                </div>
                <div className="text-center">
                  <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-orange-600 font-bold">4</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Broušení</h4>
                  <p className="text-sm text-gray-600">Broušení hlavy a sedel ventilů</p>
                </div>
                <div className="text-center">
                  <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-red-600 font-bold">5</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Montáž</h4>
                  <p className="text-sm text-gray-600">Instalace nových komponentů</p>
                </div>
                <div className="text-center">
                  <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-indigo-600 font-bold">6</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Testování</h4>
                  <p className="text-sm text-gray-600">Tlaková zkouška těsnosti</p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Známky poškození motorové hlavy
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Symptomy poškození</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Bílý kouř z výfuku</li>
                    <li>• Ztráta chladicí kapaliny</li>
                    <li>• Mléčný olej</li>
                    <li>• Přehřívání motoru</li>
                    <li>• Ztráta výkonu</li>
                    <li>• Bublání v expanzní nádobě</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Možné příčiny</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Poškození těsnění hlavy</li>
                    <li>• Deformace hlavy přehřátím</li>
                    <li>• Poškození ventilů</li>
                    <li>• Opotřebení vodítek ventilů</li>
                    <li>• Praskliny v hlavě</li>
                    <li>• Koroze kanálů</li>
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

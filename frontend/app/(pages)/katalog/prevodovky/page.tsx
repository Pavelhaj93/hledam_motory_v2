import Link from 'next/link'
import {Metadata} from 'next'
import {sanityFetch} from '@/sanity/lib/live'
import {allPrevodovkyQuery} from '@/sanity/lib/queries'
import ProductCatalog from '@/app/components/ProductCatalog'
import CategoryHero from '@/app/components/CategoryHero'

export const metadata: Metadata = {
  title: 'Repasované převodovky | Manuální a automatické převodovky',
  description:
    'Široký výběr repasovaných převodovek - manuální i automatické. Profesionální renovace s výměnou všech opotřebovaných dílů a plnou zárukou.',
  keywords:
    'repasované převodovky, renovované převodovky, náhradní převodovky, manuální převodovky, automatické převodovky',
  openGraph: {
    title: 'Repasované převodovky | Manuální a automatické převodovky',
    description: 'Široký výběr repasovaných převodovek pro všechny značky vozidel.',
    type: 'website',
  },
}

export default async function TransmissionsPage() {
  const {data: products} = await sanityFetch({
    query: allPrevodovkyQuery,
    stega: false,
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <CategoryHero
        title="Repasované převodovky"
        description="Objevte náš rozsáhlý katalog profesionálně repasovaných převodovek - manuálních i automatických. Plná záruka kvality a spolehlivosti."
        breadcrumbs={[
          {label: 'Domů', href: '/'},
          {label: 'Katalog', href: '/katalog'},
          {label: 'Převodovky'},
        ]}
      />

      <div className="container mx-auto px-4 py-12">
        {/* Page Description */}
        <div className="mb-12 max-w-4xl">
          <div className="text-lg text-gray-600">
            <p className="mb-4">
              Nabízíme široký výběr <strong>repasovaných převodovek</strong> - manuálních i
              automatických. Každá převodovka prochází kompletní renovací s výměnou všech
              opotřebovaných synchronizátorů, těsnění a dalších komponentů. Poskytujeme{' '}
              <strong>plnou záruku kvality</strong>.
            </p>
            <p>
              Specializujeme se na renovaci převodovek všech značek včetně BMW, Audi, Volkswagen,
              Mercedes-Benz, Ford a dalších. Naše repasované převodovky jsou ideální náhradou za
              poškozené nebo opotřebované převodovky.
            </p>
          </div>
        </div>

        {/* Product Catalog */}
        <ProductCatalog
          products={(products || []).map((p) => ({
            _id: p._id,
            name: p.name,
            slug: p.slug,
            brand: p.brand,
            category: 'prevodovky',
            partNumber: p.transmissionCode ? [p.transmissionCode] : [],
            description: p.description,
            mainImage: p.mainImage,
            price: p.price || 0,
            currency: p.currency || 'Kč',
            inStock: p.inStock || false,
            featured: p.featured || false,
            specifications: p.specifications,
            compatibility: p.compatibility,
          }))}
        />

        {/* SEO Content */}
        <div className="mt-16 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Proč si vybrat naše repasované převodovky?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Manuální převodovky</h3>
              <p className="text-gray-600">
                Kompletní renovace manuálních převodovek s výměnou synchronizátorů, ložisek a
                těsnění. Každá převodovka je důkladně otestována na přesnost řazení.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Automatické převodovky</h3>
              <p className="text-gray-600">
                Specializujeme se na renovaci automatických převodovek včetně výměny spojek, filtrů
                a kompletní výměny hydraulického systému.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Záruka kvality</h3>
              <p className="text-gray-600">
                Na všechny repasované převodovky poskytujeme rozsáhlou záruku. Každá převodovka je
                před expedicí důkladně otestována.
              </p>
            </div>
          </div>

          <div className="mt-8 border-t pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Typy repasovaných převodovek
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Manuální převodovky</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>
                    • <strong>BMW:</strong> Getrag 220, 235, 250, 260 převodovky
                  </li>
                  <li>
                    • <strong>Audi/VW:</strong> 02J, 02M, 02Q převodovky
                  </li>
                  <li>
                    • <strong>Mercedes:</strong> 711, 712, 716 převodovky
                  </li>
                  <li>
                    • <strong>Ford:</strong> IB5, MT75, MT82 převodovky
                  </li>
                  <li>
                    • <strong>Opel:</strong> F13, F17, F23, F28 převodovky
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Automatické převodovky</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>
                    • <strong>BMW:</strong> ZF 6HP, 8HP automatické převodovky
                  </li>
                  <li>
                    • <strong>Audi/VW:</strong> 09G, 09M DSG převodovky
                  </li>
                  <li>
                    • <strong>Mercedes:</strong> 722.6, 722.9 automatické převodovky
                  </li>
                  <li>
                    • <strong>Ford:</strong> 6F35, PowerShift převodovky
                  </li>
                  <li>
                    • <strong>GM:</strong> 6T40, 6T45 automatické převodovky
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Proces renovace převodovky</h3>
            <div className="grid md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-red-600 font-bold">1</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Demontáž</h4>
                <p className="text-sm text-gray-600">Kompletní rozložení převodovky</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Kontrola</h4>
                <p className="text-sm text-gray-600">Měření opotřebení všech dílů</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Výměna dílů</h4>
                <p className="text-sm text-gray-600">Instalace nových komponentů</p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-orange-600 font-bold">4</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Montáž</h4>
                <p className="text-sm text-gray-600">Přesná montáž podle specifikací</p>
              </div>
              <div className="text-center">
                <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-red-600 font-bold">5</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Testování</h4>
                <p className="text-sm text-gray-600">Kontrola funkčnosti a kvality</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

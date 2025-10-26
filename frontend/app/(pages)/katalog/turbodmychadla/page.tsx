import Link from 'next/link'
import {Metadata} from 'next'
import {sanityFetch} from '@/sanity/lib/live'
import {allTurbodmychadlaQuery} from '@/sanity/lib/queries'
import ProductCatalog from '@/app/components/ProductCatalog'

export const metadata: Metadata = {
  title: 'Repasovaná turbodmychadla | Kvalitní renovace s zárukou',
  description:
    'Široký výběr repasovaných turbodmychadel pro všechny značky vozidel. Profesionální renovace, nová ložiska a těsnění, plná záruka.',
  keywords:
    'repasovaná turbodmychadla, renovovaná turbodmychadla, náhradní turbodmychadla, BMW turbo, Audi turbo, VW turbo',
  openGraph: {
    title: 'Repasovaná turbodmychadla | Kvalitní renovace s zárukou',
    description: 'Široký výběr repasovaných turbodmychadel pro všechny značky vozidel.',
    type: 'website',
  },
}

export default async function TurbochargersPage() {
  const {data: products} = await sanityFetch({
    query: allTurbodmychadlaQuery,
    stega: false,
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-gray-900">
          Domů
        </Link>
        <span className="mx-2">/</span>
        <Link href="/katalog" className="hover:text-gray-900">
          Katalog
        </Link>
        <span className="mx-2">/</span>
        <span>Turbodmychadla</span>
      </nav>

      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Repasovaná turbodmychadla</h1>
        <div className="text-lg text-gray-600 max-w-4xl">
          <p className="mb-4">
            Specializujeme se na <strong>repasovaná turbodmychadla</strong> pro všechny značky
            vozidel. Každé turbodmychadlo prochází kompletní renovací s výměnou ložisek, těsnění a
            dalších opotřebovaných dílů. Poskytujeme <strong>plnou záruku kvality</strong> a
            spolehlivosti.
          </p>
          <p>
            Naše repasovaná turbodmychadla projdou důkladnou kontrolou, vyvážením rotorů a
            testováním výkonu. Renovujeme turbodmychadla značek BMW, Audi, Volkswagen,
            Mercedes-Benz, Ford a mnoha dalších.
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
          category: 'turbodmychadla',
          partNumber: p.turboCode ? [p.turboCode] : [],
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
          Proč si vybrat naša repasovaná turbodmychadla?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Kompletní renovace</h3>
            <p className="text-gray-600">
              Každé turbodmychadlo prochází kompletní demontáží a renovací. Vyměňujeme všechny
              opotřebované díly včetně ložisek, těsnění a případně lopatek.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Vyvážení rotorů</h3>
            <p className="text-gray-600">
              Všechny rotory jsou profesionálně vyváženy na specializovaných strojích pro zajištění
              hladkého a tichého chodu turbodmychadla.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Záruka kvality</h3>
            <p className="text-gray-600">
              Na všechna repasovaná turbodmychadla poskytujeme záruku. Každé turbodmychadlo je před
              expedicí důkladně otestováno.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Často renovované typy turbodmychadel
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Variabilní geometrie (VTG/VGT)</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• BMW 320d, 530d turbodmychadla</li>
                <li>• Audi A4, A6 TDI turbodmychadla</li>
                <li>• VW Passat, Golf TDI turbodmychadla</li>
                <li>• Mercedes C, E třídy CDI turbodmychadla</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Pevná geometrie</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Ford Focus, Mondeo TDCi turbodmychadla</li>
                <li>• Opel Astra, Vectra CDTI turbodmychadla</li>
                <li>• Peugeot 307, 407 HDi turbodmychadla</li>
                <li>• Citroën C4, C5 HDi turbodmychadla</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Proces renovace turbodmychadla
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-red-600 font-bold">1</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Demontáž</h4>
              <p className="text-sm text-gray-600">
                Kompletní rozložení turbodmychadla na jednotlivé komponenty
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Čištění</h4>
              <p className="text-sm text-gray-600">
                Důkladné vyčištění všech dílů a kontrola opotřebení
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Výměna dílů</h4>
              <p className="text-sm text-gray-600">
                Instalace nových ložisek, těsnění a dalších komponentů
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-orange-600 font-bold">4</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Testování</h4>
              <p className="text-sm text-gray-600">Vyvážení, testování výkonu a kontrola kvality</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

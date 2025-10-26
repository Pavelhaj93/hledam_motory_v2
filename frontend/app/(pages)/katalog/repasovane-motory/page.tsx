import Link from 'next/link'
import {Metadata} from 'next'
import {sanityFetch} from '@/sanity/lib/live'
import {allRepasovaneMotoryQuery} from '@/sanity/lib/queries'
import ProductCatalog from '@/app/components/ProductCatalog'

export const metadata: Metadata = {
  title: 'Repasované motory | Kvalitní renovované motory s zárukou',
  description:
    'Široký výběr repasovaných motorů pro všechny značky vozidel. Profesionální renovace, plná záruka, rychlé dodání. BMW, Audi, VW, Mercedes a další.',
  keywords:
    'repasované motory, renovované motory, náhradní motory, BMW motor, Audi motor, VW motor, Mercedes motor',
  openGraph: {
    title: 'Repasované motory | Kvalitní renovované motory s zárukou',
    description:
      'Široký výběr repasovaných motorů pro všechny značky vozidel. Profesionální renovace, plná záruka.',
    type: 'website',
  },
}

export default async function EnginesPage() {
  const {data: products} = await sanityFetch({
    query: allRepasovaneMotoryQuery,
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
        <span>Repasované motory</span>
      </nav>

      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Repasované motory</h1>
        <div className="text-lg text-gray-600 max-w-4xl">
          <p className="mb-4">
            Nabízíme široký výběr <strong>repasovaných motorů</strong> pro všechny značky vozidel.
            Každý motor prochází kompletní renovací s výměnou všech opotřebovaných dílů. Všechny
            naše motory jsou dodávány s <strong>plnou zárukou kvality</strong> a spolehlivosti.
          </p>
          <p>
            Specializujeme se na renovaci motorů značek BMW, Audi, Volkswagen, Mercedes-Benz, Škoda,
            Ford a mnoha dalších. Použijte filtry níže pro nalezení motoru pro váš konkrétní model
            vozidla.
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
          category: 'repasovane-motory',
          partNumber: p.engineCodes || [],
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
              Na všechny repasované motory poskytujeme záruku. Každý motor je před expedicí důkladně
              otestován a zkontrolován.
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Často renovované typy motorů</h3>
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
    </div>
  )
}

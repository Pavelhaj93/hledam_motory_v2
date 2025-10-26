import Link from 'next/link'
import {Metadata} from 'next'
import {sanityFetch} from '@/sanity/lib/live'
import {allStareMotoryQuery} from '@/sanity/lib/queries'
import ProductCatalog from '@/app/components/ProductCatalog'

export const metadata: Metadata = {
  title: 'Staré motory | Kvalitní použité motory za výhodné ceny',
  description:
    'Široký výběr starých motorů pro všechny značky vozidel. Kvalitní použité motory, záruka funkčnosti, rychlé dodání. BMW, Audi, VW, Mercedes a další.',
  keywords:
    'staré motory, použité motory, náhradní motory, BMW motor, Audi motor, VW motor, Mercedes motor',
  openGraph: {
    title: 'Staré motory | Kvalitní použité motory za výhodné ceny',
    description:
      'Široký výběr starých motorů pro všechny značky vozidel. Kvalitní použité motory, záruka funkčnosti.',
    type: 'website',
  },
}

export default async function UsedEnginesPage() {
  const {data: products} = await sanityFetch({
    query: allStareMotoryQuery,
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
        <span>Staré motory</span>
      </nav>

      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Staré motory</h1>
        <div className="text-lg text-gray-600 max-w-4xl">
          <p className="mb-4">
            Nabízíme široký výběr <strong>starých motorů</strong> pro všechny značky vozidel. Každý
            motor je důkladně kontrolován a testován před prodejem. Všechny naše motory jsou
            dodávány se <strong>zárukou funkčnosti</strong> za výhodné ceny.
          </p>
          <p>
            Specializujeme se na prodej použitých motorů značek BMW, Audi, Volkswagen,
            Mercedes-Benz, Škoda, Ford a mnoha dalších. Použijte filtry níže pro nalezení motoru pro
            váš konkrétní model vozidla.
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
          category: 'stare-motory',
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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Proč si vybrat naše staré motory?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Kontrola kvality</h3>
            <p className="text-gray-600">
              Každý starý motor prochází důkladnou kontrolou stavu a funkčnosti. Testujeme kompresí,
              těsnost a celkový technický stav před prodejem.
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
    </div>
  )
}

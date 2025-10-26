import Link from 'next/link'
import {Metadata} from 'next'
import {sanityFetch} from '@/sanity/lib/live'
import {allBrandsWithLogosQuery} from '@/sanity/lib/queries'
import {
  Zap,
  Cog,
  Settings,
  Truck,
  Star,
  Shield,
  Clock,
  Users,
  CheckCircle,
  Package,
  Wrench,
  Car,
  Search,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Katalog náhradních dílů | Repasované motory a turbodmychadla',
  description:
    'Kompletní katalog repasovaných motorů, turbodmychadel, převodovek a motorových hlav. Najděte díly podle značky a modelu vozidla.',
  keywords:
    'katalog díly, repasované motory, turbodmychadla, převodovky, motorové hlavy, náhradní díly',
  openGraph: {
    title: 'Katalog náhradních dílů | Repasované motory a turbodmychadla',
    description:
      'Kompletní katalog repasovaných motorů, turbodmychadel, převodovek a motorových hlav.',
    type: 'website',
  },
}

const categoryData = [
  {
    slug: 'repasovane-motory',
    title: 'Repasované motory',
    description:
      'Kompletní repasované motory s plnou zárukou. Profesionální renovace s výměnou všech opotřebovaných dílů.',
    icon: Zap,
    color: 'bg-gradient-to-br from-red-500 to-red-600',
    count: '200+',
    featured: true,
  },
  {
    slug: 'turbodmychadla',
    title: 'Turbodmychadla',
    description:
      'Repasovaná turbodmychadla pro všechny typy vozidel. Kompletní renovace s novými ložisky a těsněními.',
    icon: Cog,
    color: 'bg-gradient-to-br from-green-500 to-green-600',
    count: '150+',
    featured: true,
  },
  {
    slug: 'prevodovky',
    title: 'Převodovky',
    description:
      'Manuální a automatické převodovky po kompletní renovaci. Výměna všech opotřebovaných komponentů.',
    icon: Settings,
    color: 'bg-gradient-to-br from-purple-500 to-purple-600',
    count: '80+',
    featured: false,
  },
  {
    slug: 'motorove-hlavy',
    title: 'Motorové hlavy',
    description: 'Repasované motorové hlavy s nově zabroušenými ventily a novými těsněními.',
    icon: Wrench,
    color: 'bg-gradient-to-br from-orange-500 to-orange-600',
    count: '120+',
    featured: false,
  },
  {
    slug: 'stare-motory',
    title: 'Staré motory',
    description:
      'Široký výběr starých motorů pro různé značky a modely vozidel. Ideální pro renovace a opravy.',
    icon: Car,
    color: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
    count: '300+',
    featured: true,
  },
]

const features = [
  {
    icon: Shield,
    title: 'Plná záruka kvality',
    description: 'Na všechny repasované díly poskytujeme 12měsíční záruku',
  },
  {
    icon: Wrench,
    title: 'Profesionální renovace',
    description: 'Zkušení technici s dlouholetou praxí v oboru',
  },
  {
    icon: Package,
    title: 'Rychlá expedice',
    description: 'Díly na skladě expedujeme do 24 hodin',
  },
  {
    icon: Star,
    title: 'Kvalitní komponenty',
    description: 'Používáme pouze originální a ověřené náhradní díly',
  },
]

export default async function katalogPage() {
  const {data: brands} = await sanityFetch({
    query: allBrandsWithLogosQuery,
    stega: false,
  })

  const popularBrands = ['BMW', 'Audi', 'Volkswagen', 'Mercedes-Benz', 'Škoda', 'Ford']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Gradient Background */}
      <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          {/* Breadcrumbs */}
          <nav className="text-sm text-red-100 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Domů
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">Katalog</span>
          </nav>

          {/* Hero Content */}
          <div className="max-w-4xl">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Katalog náhradních dílů
            </h1>
            <p className="text-xl lg:text-2xl text-red-100 mb-8 leading-relaxed">
              Objevte náš rozsáhlý katalog profesionálně repasovaných motorů, turbodmychadel a
              dalších dílů.
              <span className="text-white font-semibold"> Záruka kvality a spolehlivosti.</span>
            </p>

            {/* Search Bar */}
            {/* <div className="flex max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Hledat podle značky nebo modelu..."
                  className="w-full pl-10 pr-4 py-3 rounded-l-lg border-0 text-gray-900 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
              <button className="bg-white text-red-600 px-6 py-3 rounded-r-lg font-semibold hover:bg-gray-50 transition-colors">
                Hledat
              </button>
            </div> */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Main Categories Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Kategorie produktů
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Vyberte si z našich hlavních kategorií produktů, všechny díly jsou profesionálně
              renovované
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryData.map((category) => {
              const IconComponent = category.icon
              return (
                <Link
                  key={category.slug}
                  href={`/katalog/${category.slug}`}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  {category.featured && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold z-10">
                      Populární
                    </div>
                  )}

                  <div className="p-8">
                    <div
                      className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                        {category.title}
                      </h3>
                      <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {category.count}
                      </span>
                    </div>

                    <p className="text-gray-600 leading-relaxed mb-4">{category.description}</p>

                    <div className="flex items-center text-red-600 font-semibold">
                      <span>Prohlédnout kategori</span>
                      <svg
                        className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Proč si vybrat nás?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Jsme lídrem v oblasti repasovaných automobilových dílů s dlouholetou tradicí
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Popular Brands Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Populární značky</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Specializujeme se na díly pro nejpopulárnější automobilové značky
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {(brands || [])
              .filter((brand) => popularBrands.includes(brand.name))
              .slice(0, 12)
              .map((brand) => (
                <div
                  key={brand._id}
                  className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-all duration-300 group cursor-pointer"
                >
                  {brand.logo ? (
                    <div className="h-12 w-12 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-xs text-gray-600 font-semibold">{brand.name}</span>
                    </div>
                  ) : (
                    <div className="h-12 w-12 mx-auto mb-3 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Car className="w-6 h-6 text-gray-600" />
                    </div>
                  )}
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                    {brand.name}
                  </h3>
                </div>
              ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 lg:p-12 text-white text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Nenašli jste co hledáte?</h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Kontaktujte nás a naši odborníci vám pomohou najít správný díl pro vaše vozidlo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/kontakt"
              className="bg-white text-red-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
            >
              <Users className="w-5 h-5 mr-2" />
              Kontakujte nás
            </Link>
            {/* <Link
              href="/katalog"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-red-600 transition-colors inline-flex items-center justify-center"
            >
              <Search className="w-5 h-5 mr-2" />
              Pokračovat v hledání
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  )
}

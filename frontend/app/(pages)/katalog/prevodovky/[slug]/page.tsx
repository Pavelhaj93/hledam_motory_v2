import {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import {prevodovkaQuery} from '@/sanity/lib/queries'
import {urlForImage} from '@/sanity/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import {ArrowLeft, Mail, Phone, Check, X} from 'lucide-react'
import CustomPortableText from '@/app/components/PortableText'
import ImageGallery from '@/app/components/ImageGallery'

type Props = {
  params: Promise<{slug: string}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const {data: prevodovka} = await sanityFetch({
    query: prevodovkaQuery,
    params: {slug},
    stega: false,
  })
  if (!prevodovka) {
    return {
      title: 'Převodovka nenalezena',
      description: 'Požadovaná převodovka nebyla nalezena.',
    }
  }
  return {
    title: `${prevodovka.name} | Převodovka ${prevodovka.brand?.name || ''}`,
    description: prevodovka.description || '',
    openGraph: {
      title: `${prevodovka.name} | Převodovka ${prevodovka.brand?.name || ''}`,
      description: prevodovka.description || '',
      type: 'website',
      images: prevodovka.mainImage
        ? [
            {
              url: urlForImage(prevodovka.mainImage)?.width(800).height(600).url() || '',
              width: 800,
              height: 600,
              alt: prevodovka.mainImage.alt || prevodovka.name,
            },
          ]
        : [],
    },
  }
}

export default async function PrevodovkaDetailPage({params}: Props) {
  const {slug} = await params
  const {data: prevodovka} = await sanityFetch({
    query: prevodovkaQuery,
    params: {slug},
    stega: false,
  })
  if (!prevodovka) notFound()
  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="text-sm text-gray-600 mb-6">
        <Link href="/katalog/prevodovky" className="hover:text-gray-900">
          Převodovky
        </Link>
        <span className="mx-2">/</span>
        <span>{prevodovka.name}</span>
      </nav>
      <Link
        href="/katalog/prevodovky"
        className="inline-flex items-center text-red-600 hover:text-red-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Zpět na katalog
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          {prevodovka.images && prevodovka.images.length > 0 ? (
            <ImageGallery images={prevodovka.images} productName={prevodovka.name} />
          ) : prevodovka.mainImage ? (
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={urlForImage(prevodovka.mainImage)?.width(600).height(600).url() || ''}
                alt={prevodovka.mainImage.alt || prevodovka.name}
                width={600}
                height={600}
                className="h-full w-full object-cover object-center"
                priority
              />
            </div>
          ) : (
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
              <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">Bez obrázku</span>
              </div>
            </div>
          )}
        </div>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{prevodovka.name}</h1>
          <p className="text-lg text-red-600 font-medium">{prevodovka.brand?.name}</p>
          {prevodovka.transmissionCode && (
            <p className="text-sm text-gray-500">Kód převodovky: {prevodovka.transmissionCode}</p>
          )}
          {prevodovka.engineCodes && prevodovka.engineCodes.length > 0 && (
            <p className="text-sm text-gray-500">
              Kompatibilní motory: {prevodovka.engineCodes.join(', ')}
            </p>
          )}
          <div className="border-t border-b py-6">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900">
                {prevodovka.price} {prevodovka.currency || 'Kč'}
              </span>
              <div className="flex items-center space-x-2">
                {prevodovka.inStock ? (
                  <>
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-green-600 font-medium">Skladem</span>
                  </>
                ) : (
                  <>
                    <X className="h-5 w-5 text-red-500" />
                    <span className="text-red-600 font-medium">Není skladem</span>
                  </>
                )}
              </div>
            </div>
          </div>
          {prevodovka.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Popis</h3>
              <p className="text-gray-600">{prevodovka.description}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            {prevodovka.transmissionType && (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">Typ převodovky</h4>
                <p className="text-sm text-gray-600">{prevodovka.transmissionType}</p>
              </div>
            )}
            {prevodovka.gearCount && (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">Počet rychlostí</h4>
                <p className="text-sm text-gray-600">{prevodovka.gearCount} rychlostí</p>
              </div>
            )}
            {prevodovka.driveType && (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">Typ pohonu</h4>
                <p className="text-sm text-gray-600">{prevodovka.driveType}</p>
              </div>
            )}
            {prevodovka.condition && (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">Stav</h4>
                <p className="text-sm text-gray-600">{prevodovka.condition}</p>
              </div>
            )}
          </div>
          {prevodovka.specifications && prevodovka.specifications.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Technické údaje</h3>
              <div className="space-y-2">
                {prevodovka.specifications.map((spec, index) => (
                  <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">{spec.label}</span>
                    <span className="text-gray-600">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {prevodovka.detailedDescription && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Detailní informace</h3>
              <div className="prose prose-sm max-w-none text-gray-600">
                <CustomPortableText value={prevodovka.detailedDescription as any} />
              </div>
            </div>
          )}
          {prevodovka.mileage && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Kilometrage</h3>
              <p className="text-gray-600">{prevodovka.mileage.toLocaleString()} km</p>
            </div>
          )}
          {prevodovka.fluidType && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Typ oleje</h3>
              <p className="text-gray-600">{prevodovka.fluidType}</p>
            </div>
          )}
          {prevodovka.warrantyPeriod && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Záruka</h3>
              <p className="text-gray-600">{prevodovka.warrantyPeriod}</p>
            </div>
          )}
          <div className="bg-red-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Objednávka</h3>
            <p className="text-gray-600 mb-4">Pro objednání nebo více informací nás kontaktujte:</p>
            <div className="flex flex-col items-start space-y-2">
              <a
                href="tel:+420792644755"
                className="inline-flex items-center space-x-2 text-red-600 hover:text-red-700"
              >
                <Phone className="h-4 w-4" />
                <span>+420 792 644 755</span>
              </a>
              <a
                href="mailto:info@hledammotory.cz"
                className="inline-flex items-center space-x-2 text-red-600 hover:text-red-700"
              >
                <Mail className="h-4 w-4" />
                <span>info@hledammotory.cz</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

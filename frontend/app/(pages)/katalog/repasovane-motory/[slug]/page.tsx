import {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import {repasovanyMotorQuery} from '@/sanity/lib/queries'
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
  const {data: motor} = await sanityFetch({
    query: repasovanyMotorQuery,
    params: {slug},
    stega: false,
  })
  if (!motor) {
    return {
      title: 'Motor nenalezen',
      description: 'Požadovaný motor nebyl nalezen.',
    }
  }
  return {
    title: `${motor.name} | Repasovaný motor ${motor.brand?.name || ''}`,
    description: motor.description || '',
    openGraph: {
      title: `${motor.name} | Repasovaný motor ${motor.brand?.name || ''}`,
      description: motor.description || '',
      type: 'website',
      images: motor.mainImage
        ? [
            {
              url: urlForImage(motor.mainImage)?.width(800).height(600).url() || '',
              width: 800,
              height: 600,
              alt: motor.mainImage.alt || motor.name,
            },
          ]
        : [],
    },
  }
}

export default async function RepasovanyMotorDetailPage({params}: Props) {
  const {slug} = await params
  const {data: motor} = await sanityFetch({
    query: repasovanyMotorQuery,
    params: {slug},
    stega: false,
  })
  if (!motor) notFound()
  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="text-sm text-gray-600 mb-6">
        <Link href="/katalog/repasovane-motory" className="hover:text-gray-900">
          Repasované motory
        </Link>
        <span className="mx-2">/</span>
        <span>{motor.name}</span>
      </nav>
      <Link
        href="/katalog/repasovane-motory"
        className="inline-flex items-center text-red-600 hover:text-red-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Zpět na katalog
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          {motor.images && motor.images.length > 0 ? (
            <ImageGallery images={motor.images} productName={motor.name} />
          ) : motor.mainImage ? (
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={urlForImage(motor.mainImage)?.width(600).height(600).url() || ''}
                alt={motor.mainImage.alt || motor.name}
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{motor.name}</h1>
          <p className="text-lg text-red-600 font-medium">{motor.brand?.name}</p>
          {motor.engineCodes && motor.engineCodes.length > 0 && (
            <p className="text-sm text-gray-500">Kódy motorů: {motor.engineCodes.join(', ')}</p>
          )}
          <div className="border-t border-b py-6">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900">
                {motor.price} {motor.currency || 'Kč'}
              </span>
              <div className="flex items-center space-x-2">
                {motor.inStock ? (
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
          {motor.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Popis</h3>
              <p className="text-gray-600">{motor.description}</p>
            </div>
          )}
          {motor.specifications && motor.specifications.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Technické údaje</h3>
              <div className="space-y-2">
                {motor.specifications.map((spec, index) => (
                  <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">{spec.label}</span>
                    <span className="text-gray-600">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {motor.detailedDescription && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Detailní informace</h3>
              <div className="prose prose-sm max-w-none text-gray-600">
                <CustomPortableText value={motor.detailedDescription as any} />
              </div>
            </div>
          )}
          {motor.relatedTurbochargers && motor.relatedTurbochargers.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Doporučená turbodmychadla
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                K tomuto motoru doporučujeme následující turbodmychadla:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {motor.relatedTurbochargers.map((turbo: any) => (
                  <div
                    key={turbo._id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start space-x-3">
                      {turbo.mainImage && (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={urlForImage(turbo.mainImage)?.width(64).height(64).url() || ''}
                            alt={turbo.mainImage.alt || turbo.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{turbo.name}</h4>
                        <p className="text-sm text-gray-500">{turbo.brand}</p>
                        {turbo.turboCode && (
                          <p className="text-xs text-gray-400">{turbo.turboCode}</p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-semibold text-red-600">
                            {turbo.price} {turbo.currency || 'Kč'}
                          </span>
                          {turbo.inStock ? (
                            <span className="text-xs text-green-600">Skladem</span>
                          ) : (
                            <span className="text-xs text-red-600">Není skladem</span>
                          )}
                        </div>
                        <Link
                          href={`/katalog/turbodmychadla/${turbo.slug}`}
                          className="inline-block mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          Zobrazit detail →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="bg-red-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Objednávka</h3>
            <p className="text-gray-600 mb-4">Pro objednání nebo více informací nás kontaktujte:</p>
            <div className="flex flex-col items-start space-y-2">
              <a
                href="tel:+420724704764"
                className="inline-flex items-center space-x-2 text-red-600 hover:text-red-700"
              >
                <Phone className="h-4 w-4" />
                <span>+420 724 704 764</span>
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

import {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import {turbodmychadloQuery} from '@/sanity/lib/queries'
import {urlForImage} from '@/sanity/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import {ArrowLeft, Mail, Phone, Check, X} from 'lucide-react'
import CustomPortableText from '@/app/components/PortableText'

type Props = {
  params: Promise<{slug: string}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const {data: turbodmychadlo} = await sanityFetch({
    query: turbodmychadloQuery,
    params: {slug},
    stega: false,
  })
  if (!turbodmychadlo) {
    return {
      title: 'Turbodmychadlo nenalezeno',
      description: 'Požadované turbodmychadlo nebylo nalezeno.',
    }
  }
  return {
    title: `${turbodmychadlo.name} | Turbodmychadlo ${turbodmychadlo.brand?.name || ''}`,
    description: turbodmychadlo.description || '',
    openGraph: {
      title: `${turbodmychadlo.name} | Turbodmychadlo ${turbodmychadlo.brand?.name || ''}`,
      description: turbodmychadlo.description || '',
      type: 'website',
      images: turbodmychadlo.mainImage
        ? [
            {
              url: urlForImage(turbodmychadlo.mainImage)?.width(800).height(600).url() || '',
              width: 800,
              height: 600,
              alt: turbodmychadlo.mainImage.alt || turbodmychadlo.name,
            },
          ]
        : [],
    },
  }
}

export default async function TurbodmychadloDetailPage({params}: Props) {
  const {slug} = await params
  const {data: turbodmychadlo} = await sanityFetch({
    query: turbodmychadloQuery,
    params: {slug},
    stega: false,
  })
  if (!turbodmychadlo) notFound()
  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="text-sm text-gray-600 mb-6">
        <Link href="/katalog/turbodmychadla" className="hover:text-gray-900">
          Turbodmychadla
        </Link>
        <span className="mx-2">/</span>
        <span>{turbodmychadlo.name}</span>
      </nav>
      <Link
        href="/katalog/turbodmychadla"
        className="inline-flex items-center text-red-600 hover:text-red-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Zpět na katalog
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
            {turbodmychadlo.mainImage ? (
              <Image
                src={urlForImage(turbodmychadlo.mainImage)?.width(600).height(600).url() || ''}
                alt={turbodmychadlo.mainImage.alt || turbodmychadlo.name}
                width={600}
                height={600}
                className="h-full w-full object-cover object-center"
                priority
              />
            ) : (
              <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">Bez obrázku</span>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{turbodmychadlo.name}</h1>
          <p className="text-lg text-red-600 font-medium">{turbodmychadlo.brand?.name}</p>
          {turbodmychadlo.turboCode && (
            <p className="text-sm text-gray-500">
              Kód turbodmychadla: {turbodmychadlo.turboCode}
            </p>
          )}
          <div className="border-t border-b py-6">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900">
                {turbodmychadlo.price} {turbodmychadlo.currency || 'Kč'}
              </span>
              <div className="flex items-center space-x-2">
                {turbodmychadlo.inStock ? (
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
          {turbodmychadlo.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Popis</h3>
              <p className="text-gray-600">{turbodmychadlo.description}</p>
            </div>
          )}
          {turbodmychadlo.specifications && turbodmychadlo.specifications.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Technické údaje</h3>
              <div className="space-y-2">
                {turbodmychadlo.specifications.map((spec: any, index: number) => (
                  <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">{spec.label}</span>
                    <span className="text-gray-600">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {turbodmychadlo.detailedDescription && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Detailní informace</h3>
              <div className="prose prose-sm max-w-none text-gray-600">
                <CustomPortableText value={turbodmychadlo.detailedDescription as any} />
              </div>
            </div>
          )}
          <div className="bg-red-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Objednávka</h3>
            <p className="text-gray-600 mb-4">Pro objednání nebo více informací nás kontaktujte:</p>
            <div className="space-y-2">
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

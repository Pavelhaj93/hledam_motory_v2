import {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {getFormatter, getTranslations, setRequestLocale} from 'next-intl/server'
import {sanityFetch} from '@/sanity/lib/live'
import {motorovaHlavaQuery, motoroveHlavyPagesSlugs, settingsQuery} from '@/sanity/lib/queries'
import {urlForImage} from '@/sanity/lib/utils'
import Image from 'next/image'
import {Link} from '@/i18n/navigation'
import {ArrowLeft, Mail, Phone, Check, X} from 'lucide-react'
import CustomPortableText from '@/app/components/PortableText'
import ImageGallery from '@/app/components/ImageGallery'
import {productJsonLd} from '@/app/lib/jsonld'
import {productAlternates} from '@/app/lib/categoryMeta'
import {categoryPath} from '@/app/lib/categories'
import {ogLocale, type Locale} from '@/app/lib/i18n'

const CATEGORY = 'motorove-hlavy' as const
type Props = {params: Promise<{locale: Locale; slug: string}>}

export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: motoroveHlavyPagesSlugs,
    perspective: 'published',
    stega: false,
  })
  return data
    .filter((p) => p.slug && p.language)
    .map((p) => ({locale: p.language as Locale, slug: p.slug as string}))
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale, slug} = await params
  const t = await getTranslations({locale, namespace: 'Product'})
  const {data: hlava} = await sanityFetch({
    query: motorovaHlavaQuery,
    params: {locale, slug},
    stega: false,
  })
  if (!hlava) {
    return {title: t('notFound'), description: t('notFoundDescription')}
  }
  const title = hlava.seo?.metaTitle || `${hlava.name} | ${hlava.brand?.name || ''}`
  const description = hlava.seo?.metaDescription || hlava.description || ''
  return {
    title,
    description,
    alternates: productAlternates(locale, CATEGORY, slug, hlava.altSlug),
    openGraph: {
      title,
      description,
      type: 'website',
      locale: ogLocale[locale],
      alternateLocale: hlava.altSlug?.slug ? [locale === 'cs' ? 'de_AT' : 'cs_CZ'] : [],
      images: hlava.mainImage
        ? [
            {
              url: urlForImage(hlava.mainImage)?.width(800).height(600).url() || '',
              width: 800,
              height: 600,
              alt: hlava.mainImage.alt || hlava.name || undefined,
            },
          ]
        : [],
    },
  }
}

export default async function MotorovaHlavaDetailPage({params}: Props) {
  const {locale, slug} = await params
  setRequestLocale(locale)
  const t = await getTranslations('Product')
  const tCommon = await getTranslations('Common')
  const format = await getFormatter()

  const [{data: hlava}, {data: settings}] = await Promise.all([
    sanityFetch({query: motorovaHlavaQuery, params: {locale, slug}, stega: false}),
    sanityFetch({query: settingsQuery, params: {locale}, stega: false}),
  ])
  if (!hlava) notFound()
  const phone = settings?.phone || '+420 792 644 755'
  const schemas = productJsonLd({
    name: hlava.name ?? '',
    description: hlava.description,
    imageUrl: hlava.mainImage ? urlForImage(hlava.mainImage)?.width(800).height(600).url() : null,
    brandName: hlava.brand?.name,
    price: hlava.price,
    currency: hlava.currency,
    inStock: hlava.inStock,
    slug,
    categoryPath: categoryPath(CATEGORY, locale),
    categoryLabel: tCommon('catalog'),
    locale,
    labels: {home: tCommon('home'), catalog: tCommon('catalog')},
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}} />
      ))}
      <nav className="text-sm text-gray-600 mb-6">
        <Link href="/katalog/motorove-hlavy" className="hover:text-gray-900">
          {tCommon('catalog')}
        </Link>
        <span className="mx-2">/</span>
        <span>{hlava.name}</span>
      </nav>

      <Link
        href="/katalog/motorove-hlavy"
        className="inline-flex items-center text-red-600 hover:text-red-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t('backToCatalog')}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          {hlava.images && hlava.images.length > 0 ? (
            <ImageGallery images={hlava.images} productName={hlava.name} />
          ) : hlava.mainImage ? (
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={urlForImage(hlava.mainImage)?.width(600).height(600).url() || ''}
                alt={hlava.mainImage.alt || hlava.name || ''}
                width={600}
                height={600}
                className="h-full w-full object-cover object-center"
                priority
              />
            </div>
          ) : (
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
              <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">{t('noImage')}</span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{hlava.name}</h1>
          <p className="text-lg text-red-600 font-medium">{hlava.brand?.name}</p>

          {hlava.engineCodes && hlava.engineCodes.length > 0 && (
            <p className="text-sm text-gray-500">
              {t('engineCodes')}: {hlava.engineCodes.join(', ')}
            </p>
          )}

          <div className="border-t border-b py-6">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900">
                {hlava.price != null ? format.number(hlava.price, 'price') : ''}
              </span>
              <div className="flex items-center space-x-2">
                {hlava.inStock ? (
                  <>
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-green-600 font-medium">{t('inStock')}</span>
                  </>
                ) : (
                  <>
                    <X className="h-5 w-5 text-red-500" />
                    <span className="text-red-600 font-medium">{t('outOfStock')}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {hlava.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('description')}</h3>
              <p className="text-gray-600">{hlava.description}</p>
            </div>
          )}

          {hlava.specifications && hlava.specifications.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('specs')}</h3>
              <div className="space-y-2">
                {hlava.specifications.map((spec: any, index: number) => (
                  <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">{spec.label}</span>
                    <span className="text-gray-600">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hlava.valveCount && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('specs')}</h3>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">{t('valveCount')}</span>
                  <span className="text-gray-600">{hlava.valveCount}</span>
                </div>
              </div>
            </div>
          )}

          {hlava.detailedDescription && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('detailedInfo')}</h3>
              <div className="prose prose-sm max-w-none text-gray-600">
                <CustomPortableText value={hlava.detailedDescription as any} />
              </div>
            </div>
          )}

          <div className="bg-red-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('order')}</h3>
            <p className="text-gray-600 mb-4">{t('orderHelp')}</p>
            <div className="flex flex-col items-start space-y-2">
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="inline-flex items-center space-x-2 text-red-600 hover:text-red-700"
              >
                <Phone className="h-4 w-4" />
                <span>{phone}</span>
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

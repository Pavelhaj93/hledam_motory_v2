import {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {getFormatter, getTranslations, setRequestLocale} from 'next-intl/server'
import {sanityFetch} from '@/sanity/lib/live'
import {turbodmychadloQuery, turbodmychadlaPagesSlugs, settingsQuery} from '@/sanity/lib/queries'
import {urlForImage} from '@/sanity/lib/utils'
import Image from 'next/image'
import {Link} from '@/i18n/navigation'
import {Mail, Phone, Check, X, MessageSquare} from 'lucide-react'
import BackButton from '@/app/components/BackButton'
import {Button} from '@/app/components/ui/button'
import CatalogNotFoundBanner from '@/app/components/CatalogNotFoundBanner'
import CustomPortableText from '@/app/components/PortableText'
import ImageGallery from '@/app/components/ImageGallery'
import {productJsonLd} from '@/app/lib/jsonld'
import {productAlternates} from '@/app/lib/categoryMeta'
import {categoryPath} from '@/app/lib/categories'
import {ogLocale, type Locale} from '@/app/lib/i18n'

const CATEGORY = 'turbodmychadla' as const
type Props = {params: Promise<{locale: Locale; slug: string}>}

export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: turbodmychadlaPagesSlugs,
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
  const {data: turbodmychadlo} = await sanityFetch({
    query: turbodmychadloQuery,
    params: {locale, slug},
    stega: false,
  })
  if (!turbodmychadlo) {
    return {title: t('notFound'), description: t('notFoundDescription')}
  }
  const title =
    turbodmychadlo.seo?.metaTitle || `${turbodmychadlo.name} | ${turbodmychadlo.brand?.name || ''}`
  const description = turbodmychadlo.seo?.metaDescription || turbodmychadlo.description || ''
  return {
    title,
    description,
    alternates: productAlternates(locale, CATEGORY, slug, turbodmychadlo.altSlug),
    openGraph: {
      title,
      description,
      type: 'website',
      locale: ogLocale[locale],
      alternateLocale: turbodmychadlo.altSlug?.slug ? [locale === 'cs' ? 'de_AT' : 'cs_CZ'] : [],
      images: turbodmychadlo.mainImage
        ? [
            {
              url: urlForImage(turbodmychadlo.mainImage)?.width(800).height(600).url() || '',
              width: 800,
              height: 600,
              alt: turbodmychadlo.mainImage.alt || turbodmychadlo.name || undefined,
            },
          ]
        : [],
    },
  }
}

export default async function TurbodmychadloDetailPage({params}: Props) {
  const {locale, slug} = await params
  setRequestLocale(locale)
  const t = await getTranslations('Product')
  const tCommon = await getTranslations('Common')
  const format = await getFormatter()

  const [{data: turbodmychadlo}, {data: settings}] = await Promise.all([
    sanityFetch({query: turbodmychadloQuery, params: {locale, slug}, stega: false}),
    sanityFetch({query: settingsQuery, params: {locale}, stega: false}),
  ])
  if (!turbodmychadlo) notFound()
  const phone = settings?.phone || '+420 792 644 755'
  const schemas = productJsonLd({
    name: turbodmychadlo.name ?? '',
    description: turbodmychadlo.description,
    imageUrl: turbodmychadlo.mainImage ? urlForImage(turbodmychadlo.mainImage)?.width(800).height(600).url() : null,
    brandName: turbodmychadlo.brand?.name,
    price: turbodmychadlo.price,
    currency: turbodmychadlo.currency,
    inStock: turbodmychadlo.inStock,
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
        <Link href="/katalog/turbodmychadla" className="hover:text-gray-900">
          {tCommon('catalog')}
        </Link>
        <span className="mx-2">/</span>
        <span>{turbodmychadlo.name}</span>
      </nav>
      <BackButton fallbackHref="/katalog/turbodmychadla" label={t('backToCatalog')} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          {turbodmychadlo.images && turbodmychadlo.images.length > 0 ? (
            <ImageGallery images={turbodmychadlo.images} productName={turbodmychadlo.name} />
          ) : turbodmychadlo.mainImage ? (
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={urlForImage(turbodmychadlo.mainImage)?.width(600).height(600).url() || ''}
                alt={turbodmychadlo.mainImage.alt || turbodmychadlo.name || ''}
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{turbodmychadlo.name}</h1>
          <p className="text-lg text-red-600 font-medium">{turbodmychadlo.brand?.name}</p>
          {turbodmychadlo.turboCode && (
            <p className="text-sm text-gray-500">
              {t('turboCode')}: {turbodmychadlo.turboCode}
            </p>
          )}
          <div className="border-t border-b py-6">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900">
                {turbodmychadlo.price != null ? format.number(turbodmychadlo.price, 'price') : ''}
              </span>
              <div className="flex items-center space-x-2">
                {turbodmychadlo.inStock ? (
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
          {turbodmychadlo.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('description')}</h3>
              <p className="text-gray-600">{turbodmychadlo.description}</p>
            </div>
          )}
          {turbodmychadlo.specifications && turbodmychadlo.specifications.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('specs')}</h3>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('detailedInfo')}</h3>
              <div className="prose prose-sm max-w-none text-gray-600">
                <CustomPortableText value={turbodmychadlo.detailedDescription as any} />
              </div>
            </div>
          )}
          <div className="bg-red-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('order')}</h3>
            <p className="text-gray-600 mb-4">{t('orderHelp')}</p>
            <Link
              href={{pathname: '/kontakt', query: {motor: turbodmychadlo.name ?? ''}}}
              className="block mb-4"
            >
              <Button className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white">
                <MessageSquare className="h-4 w-4 mr-2" />
                {t('inquireButton')}
              </Button>
            </Link>
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
      <CatalogNotFoundBanner />
    </div>
  )
}

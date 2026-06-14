import {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {getFormatter, getTranslations, setRequestLocale} from 'next-intl/server'
import {sanityFetch} from '@/sanity/lib/live'
import {repasovanyMotorQuery, repasovaneMotoryPagesSlugs, settingsQuery} from '@/sanity/lib/queries'
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

const CATEGORY = 'repasovane-motory' as const
type Props = {params: Promise<{locale: Locale; slug: string}>}

export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: repasovaneMotoryPagesSlugs,
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
  const {data: motor} = await sanityFetch({
    query: repasovanyMotorQuery,
    params: {locale, slug},
    stega: false,
  })
  if (!motor) {
    return {title: t('notFound'), description: t('notFoundDescription')}
  }
  const title = motor.seo?.metaTitle || `${motor.name} | ${motor.brand?.name || ''}`
  const description = motor.seo?.metaDescription || motor.description || ''
  return {
    title,
    description,
    alternates: productAlternates(locale, CATEGORY, slug, motor.altSlug),
    openGraph: {
      title,
      description,
      type: 'website',
      locale: ogLocale[locale],
      alternateLocale: motor.altSlug?.slug ? [locale === 'cs' ? 'de_AT' : 'cs_CZ'] : [],
      images: motor.mainImage
        ? [
            {
              url: urlForImage(motor.mainImage)?.width(800).height(600).url() || '',
              width: 800,
              height: 600,
              alt: motor.mainImage.alt || motor.name || undefined,
            },
          ]
        : [],
    },
  }
}

export default async function RepasovanyMotorDetailPage({params}: Props) {
  const {locale, slug} = await params
  setRequestLocale(locale)
  const t = await getTranslations('Product')
  const tCommon = await getTranslations('Common')
  const format = await getFormatter()

  const [{data: motor}, {data: settings}] = await Promise.all([
    sanityFetch({query: repasovanyMotorQuery, params: {locale, slug}, stega: false}),
    sanityFetch({query: settingsQuery, params: {locale}, stega: false}),
  ])
  if (!motor) notFound()
  const phone = settings?.phone || '+420 792 644 755'
  const turboPath = categoryPath('turbodmychadla', locale)
  const schemas = productJsonLd({
    name: motor.name ?? '',
    description: motor.description,
    imageUrl: motor.mainImage ? urlForImage(motor.mainImage)?.width(800).height(600).url() : null,
    brandName: motor.brand?.name,
    price: motor.price,
    currency: motor.currency,
    inStock: motor.inStock,
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
        <Link href="/" className="hover:text-gray-900">
          {tCommon('home')}
        </Link>
        <span className="mx-2">/</span>
        <Link href="/katalog/repasovane-motory" className="hover:text-gray-900">
          {tCommon('catalog')}
        </Link>
        <span className="mx-2">/</span>
        <span>{motor.name}</span>
      </nav>
      <Link
        href="/katalog/repasovane-motory"
        className="inline-flex items-center text-red-600 hover:text-red-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t('backToCatalog')}
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          {motor.images && motor.images.length > 0 ? (
            <ImageGallery images={motor.images} productName={motor.name} />
          ) : motor.mainImage ? (
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={urlForImage(motor.mainImage)?.width(600).height(600).url() || ''}
                alt={motor.mainImage.alt || motor.name || ''}
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{motor.name}</h1>
          <p className="text-lg text-red-600 font-medium">{motor.brand?.name}</p>
          {motor.engineCodes && motor.engineCodes.length > 0 && (
            <p className="text-sm text-gray-500">
              {t('engineCodes')}: {motor.engineCodes.join(', ')}
            </p>
          )}
          <div className="border-t border-b py-6">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900">
                {motor.price != null ? format.number(motor.price, 'price') : ''}
              </span>
              <div className="flex items-center space-x-2">
                {motor.inStock ? (
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
          {motor.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('description')}</h3>
              <p className="text-gray-600">{motor.description}</p>
            </div>
          )}
          {motor.specifications && motor.specifications.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('specs')}</h3>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('detailedInfo')}</h3>
              <div className="prose prose-sm max-w-none text-gray-600">
                <CustomPortableText value={motor.detailedDescription as any} />
              </div>
            </div>
          )}
          {motor.relatedTurbochargers && motor.relatedTurbochargers.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('relatedTurbos')}</h3>
              <p className="text-sm text-gray-600 mb-4">{t('relatedTurbosHelp')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {motor.relatedTurbochargers.map((turbo: any) => (
                  <div
                    key={turbo._id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start space-x-3">
                      {turbo.mainImage && (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
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
                            {turbo.price != null ? format.number(turbo.price, 'price') : ''}
                          </span>
                          {turbo.inStock ? (
                            <span className="text-xs text-green-600">{t('inStock')}</span>
                          ) : (
                            <span className="text-xs text-red-600">{t('outOfStock')}</span>
                          )}
                        </div>
                        <a
                          href={`/${turboPath}/${turbo.slug}`}
                          className="inline-block mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          {t('viewDetail')}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
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

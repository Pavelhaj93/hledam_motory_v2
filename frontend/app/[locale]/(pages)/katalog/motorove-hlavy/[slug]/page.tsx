import {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {getFormatter, getTranslations, setRequestLocale} from 'next-intl/server'
import {toPlainText} from 'next-sanity'
import {sanityFetch} from '@/sanity/lib/live'
import {
  motorovaHlavaQuery,
  motoroveHlavyPagesSlugs,
  settingsQuery,
  relatedProductsQuery,
} from '@/sanity/lib/queries'
import {urlForImage} from '@/sanity/lib/utils'
import Image from 'next/image'
import {Link} from '@/i18n/navigation'
import {Mail, Phone, Check, X, MessageSquare, ShieldCheck} from 'lucide-react'
import BackButton from '@/app/components/BackButton'
import {Button} from '@/app/components/ui/button'
import CatalogNotFoundBanner from '@/app/components/CatalogNotFoundBanner'
import CustomPortableText from '@/app/components/PortableText'
import ImageGallery from '@/app/components/ImageGallery'
import MissingImage from '@/app/components/MissingImage'
import RelatedProducts from '@/app/components/RelatedProducts'
import {productJsonLd} from '@/app/lib/jsonld'
import {productAlternates} from '@/app/lib/categoryMeta'
import {categoryPath, categoryTypeByKey} from '@/app/lib/categories'
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
  const description = hlava.seo?.metaDescription || toPlainText(hlava.description as any) || ''
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
  const tCat = await getTranslations('Categories')
  const format = await getFormatter()

  const [{data: hlava}, {data: settings}] = await Promise.all([
    sanityFetch({query: motorovaHlavaQuery, params: {locale, slug}, stega: false}),
    sanityFetch({query: settingsQuery, params: {locale}, stega: false}),
  ])
  if (!hlava) notFound()
  const phone = settings?.phone || '+420 792 644 755'
  const catPath = categoryPath(CATEGORY, locale)
  const {data: relatedProducts} = await sanityFetch({
    query: relatedProductsQuery,
    params: {type: categoryTypeByKey[CATEGORY], locale, skip: hlava._id},
    stega: false,
  })
  const schemas = productJsonLd({
    name: hlava.name ?? '',
    description: toPlainText(hlava.description as any),
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
        <Link href="/" className="hover:text-gray-900">
          {tCommon('home')}
        </Link>
        <span className="mx-2">/</span>
        <Link href="/katalog" className="hover:text-gray-900">
          {tCommon('catalog')}
        </Link>
        <span className="mx-2">/</span>
        <Link href="/katalog/motorove-hlavy" className="hover:text-gray-900">
          {tCat(CATEGORY)}
        </Link>
        <span className="mx-2">/</span>
        <span>{hlava.name}</span>
      </nav>

      <BackButton fallbackHref="/katalog/motorove-hlavy" label={t('backToCatalog')} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
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
              <MissingImage label={t('noImage')} />
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
            {hlava.warrantyPeriod && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-3">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                <span>
                  {t('warranty')}: {hlava.warrantyPeriod}
                </span>
              </div>
            )}
          </div>

          {hlava.description && hlava.description.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('description')}</h3>
              <div className="prose prose-sm max-w-none text-gray-600">
                <CustomPortableText value={hlava.description as any} />
              </div>
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

          <div className="bg-red-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('order')}</h3>
            <p className="text-gray-600 mb-4">{t('orderHelp')}</p>
            <Link
              href={{pathname: '/kontakt', query: {motor: hlava.name ?? ''}}}
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
      <RelatedProducts
        products={relatedProducts}
        categoryHref={`/${catPath}`}
        categoryLabel={tCat(CATEGORY)}
        heading={t('similarProducts')}
        locale={locale}
      />
      <CatalogNotFoundBanner />
    </div>
  )
}

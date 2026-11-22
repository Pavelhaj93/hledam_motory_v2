import type {Metadata} from 'next'
import {getTranslations, setRequestLocale} from 'next-intl/server'
import BlockRenderer from '@/app/components/BlockRenderer'
import {homepageQuery, settingsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import {organizationJsonLd} from '@/app/lib/jsonld'
import {absoluteUrl, brandName, homePath, ogLocale, type Locale} from '@/app/lib/i18n'

type Props = {params: Promise<{locale: Locale}>}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params
  const t = await getTranslations({locale, namespace: 'Seo'})
  // `homepage.name` is the internal document name ("Homepage"/"Startseite"), not SEO copy.
  const title = t('homeTitle', {brand: brandName[locale]})
  const description = t('homeDescription')

  return {
    title: {absolute: title},
    description,
    alternates: {
      canonical: homePath(locale),
      languages: {
        'cs': absoluteUrl('cs', homePath('cs')),
        'de-AT': absoluteUrl('de-AT', homePath('de-AT')),
        'x-default': absoluteUrl('cs', homePath('cs')),
      },
    },
    openGraph: {
      title,
      description,
      locale: ogLocale[locale],
      alternateLocale: locale === 'cs' ? ['de_AT'] : ['cs_CZ'],
    },
  }
}

export default async function Page({params}: Props) {
  const {locale} = await params
  setRequestLocale(locale)

  const [{data: homepage}, {data: settings}] = await Promise.all([
    sanityFetch({query: homepageQuery, params: {locale}}),
    sanityFetch({query: settingsQuery, params: {locale}, stega: false}),
  ])

  // If homepage content exists, use page builder
  if (homepage?.pageBuilder && homepage.pageBuilder.length > 0) {
    return (
      <div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(organizationJsonLd(settings?.phone, locale))}}
        />
        {homepage.pageBuilder.map((block: any, index: number) => (
          <BlockRenderer
            key={block._key}
            index={index}
            block={block}
            pageId={homepage._id}
            pageType={homepage._type}
          />
        ))}
      </div>
    )
  }
}

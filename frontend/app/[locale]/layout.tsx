import '../globals.css'
import {SpeedInsights} from '@vercel/speed-insights/next'
import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import {draftMode} from 'next/headers'
import {notFound} from 'next/navigation'
import {VisualEditing} from 'next-sanity/visual-editing'
import {toPlainText} from 'next-sanity'
import {NextIntlClientProvider, hasLocale} from 'next-intl'
import {setRequestLocale} from 'next-intl/server'
import {Toaster} from 'sonner'
import Script from 'next/script'
import DraftModeToast from '@/app/components/DraftModeToast'
import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'
import CookieBanner from '@/app/components/CookieBanner'
import * as demo from '@/sanity/lib/demo'
import {siteUrl} from '@/sanity/lib/api'
import {sanityFetch, SanityLive} from '@/sanity/lib/live'
import {settingsQuery, popularBrandsWithLogosQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'
import {htmlLang, ogLocale, localePrefix, type Locale} from '@/app/lib/i18n'
import {routing} from '@/i18n/routing'
import {handleError} from '../client-utils'

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: Locale}>
}): Promise<Metadata> {
  const {locale} = await params
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
    params: {locale},
    // Metadata should never contain stega
    stega: false,
  })
  const title = settings?.title || demo.title
  const description = settings?.description || demo.description

  const ogImage = resolveOpenGraphImage(settings?.ogImage)
  let metadataBase: URL | undefined = undefined
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : new URL(siteUrl)
  } catch {
    metadataBase = new URL(siteUrl)
  }
  const home = localePrefix[locale] || '/'
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: toPlainText(description),
    alternates: {
      canonical: home,
      languages: {
        'cs': '/',
        'de-AT': '/at',
        'x-default': '/',
      },
    },
    openGraph: {
      images: ogImage ? [ogImage] : [],
      locale: ogLocale[locale],
      alternateLocale: locale === 'cs' ? ['de_AT'] : ['cs_CZ'],
    },
    twitter: {
      card: 'summary_large_image',
      images: ogImage ? [ogImage] : [],
    },
    verification: {
      google: ['48d390b9748589f4', '52fe5e4697a16ec5'],
    },
  }
}

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{locale: string}>
}) {
  const {locale} = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  // Enable static rendering of child server components for this locale.
  setRequestLocale(locale)

  const {isEnabled: isDraftMode} = await draftMode()

  // Fetch settings and popular brands for Header and Footer
  const [{data: settings}, {data: brands}] = await Promise.all([
    sanityFetch({
      query: settingsQuery,
      params: {locale},
    }),
    sanityFetch({
      query: popularBrandsWithLogosQuery,
      stega: false,
    }),
  ])

  return (
    <html lang={htmlLang[locale]} className={`${inter.variable} bg-white text-black`}>
      <head>
        {/* Google Analytics - Initialize with denied consent */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-ND4D88XRC9"
          strategy="afterInteractive"
        />
        <Script id="google-analytics-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            // Default consent to denied
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied'
            });
            
            gtag('config', 'G-ND4D88XRC9');
          `}
        </Script>

        {/* Google Analytics - Additional Tracking */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-PLBFP71HBC"
          strategy="afterInteractive"
        />
        <Script id="google-analytics-secondary" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PLBFP71HBC');
          `}
        </Script>

        {/* Seznam.cz Retargeting */}
        <Script
          type="text/javascript"
          src="https://c.seznam.cz/js/rc.js"
          strategy="afterInteractive"
        />
        <Script id="seznam-analytics" strategy="afterInteractive">
          {`
            if (window.sznIVA && window.sznIVA.IS) {
              window.sznIVA.IS.updateIdentities({
                eid: null
              });
            }

            var retargetingConf = {
              rtgId: 1558266,
              consent: null
            };

            if (window.rc && window.rc.retargetingHit) {
              window.rc.retargetingHit(retargetingConf);
            }
          `}
        </Script>
      </head>
      <body>
        <NextIntlClientProvider>
          <section>
            {/* The <Toaster> component is responsible for rendering toast notifications used in /app/client-utils.ts and /app/components/DraftModeToast.tsx */}
            <Toaster />
            {isDraftMode && (
              <>
                <DraftModeToast />
                {/*  Enable Visual Editing, only to be rendered when Draft Mode is enabled */}
                <VisualEditing />
              </>
            )}
            {/* The <SanityLive> component is responsible for making all sanityFetch calls in your application live, so should always be rendered. */}
            <SanityLive onError={handleError} />
            <Header settings={settings || undefined} brands={brands || []} />
            <main className="min-h-[calc(100vh-29rem)]">{children}</main>
            <Footer settings={settings || undefined} brands={brands || []} />
            <CookieBanner isDraftMode={isDraftMode} />
          </section>
          <SpeedInsights />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

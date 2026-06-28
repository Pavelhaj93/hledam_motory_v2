'use client'

import {useState, useEffect} from 'react'
import {useTranslations} from 'next-intl'
import Cookies from 'js-cookie'
import {Link} from '@/i18n/navigation'
import {Cookie, X} from 'lucide-react'
import {Button} from './ui/button'

interface ConsentHandler {
  (consent: boolean): void
}

interface CookieBannerProps {
  isDraftMode?: boolean
}

export default function CookieBanner({isDraftMode = false}: CookieBannerProps) {
  const t = useTranslations('Cookies')
  const [openBanner, setOpenBanner] = useState(false)

  useEffect(() => {
    // Don't show cookie banner in draft/editing mode
    if (isDraftMode) {
      return
    }

    const consentCookie = Cookies.get('cookie-consent')
    if (consentCookie === undefined) {
      // Show banner after a short delay for better UX
      setTimeout(() => setOpenBanner(true), 1000)
    }

    // Allow the cookies page to reopen the banner via a custom event
    const handleOpen = () => setOpenBanner(true)
    window.addEventListener('open-cookie-banner', handleOpen)
    return () => window.removeEventListener('open-cookie-banner', handleOpen)
  }, [isDraftMode])

  const handleConsent: ConsentHandler = (consent: boolean) => {
    // Store consent for 1 year
    Cookies.set('cookie-consent', consent ? 'accepted' : 'rejected', {expires: 365})
    setOpenBanner(false)

    // Handle analytics based on consent
    if (consent) {
      // Enable analytics tracking
      if (typeof window !== 'undefined' && (window as any).gtag) {
        ;(window as any).gtag('consent', 'update', {
          analytics_storage: 'granted',
          ad_storage: 'granted',
        })
      }
    } else {
      // Disable analytics tracking
      if (typeof window !== 'undefined' && (window as any).gtag) {
        ;(window as any).gtag('consent', 'update', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
        })
      }
    }
  }

  // Don't render anything in draft/editing mode
  if (isDraftMode) {
    return null
  }

  return (
    <>

      {/* Cookie Consent Banner */}
      {openBanner && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:p-6 pointer-events-none">
          <div className="pointer-events-auto w-full max-w-4xl bg-white text-gray-800 shadow-2xl rounded-lg border border-gray-200 overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="relative p-6 md:p-8">
              {/* Close button */}
              <button
                type="button"
                onClick={() => setOpenBanner(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={t('close')}
              >
                <X className="size-5" />
              </button>

              {/* Icon and Content */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="shrink-0">
                  <div className="bg-red-100 rounded-full p-3">
                    <Cookie className="size-8 text-red-600" />
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('title')}</h3>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                      {t('message')}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 items-center">
                    <Button size="lg" type="button" onClick={() => handleConsent(true)}>
                      {t('acceptAll')}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleConsent(false)}
                      size="lg"
                      className="bg-gray-200 hover:bg-gray-300 transition-colors text-gray-800 text-sm md:text-base font-medium px-6 py-3 rounded-lg"
                    >
                      {t('rejectAll')}
                    </Button>
                    <Link
                      href="/cookies"
                      className="text-sm md:text-base text-red-600 hover:text-red-700 font-medium underline hover:no-underline transition-colors"
                    >
                      {t('details')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

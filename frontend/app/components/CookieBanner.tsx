'use client'

import {useState, useEffect} from 'react'
import Cookies from 'js-cookie'
import Link from 'next/link'
import {Cookie, X} from 'lucide-react'
import {Button} from './ui/button'

interface ConsentHandler {
  (consent: boolean): void
}

export default function CookieBanner() {
  const [openBanner, setOpenBanner] = useState(false)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const consentCookie = Cookies.get('cookie-consent')
    if (consentCookie === undefined) {
      // Show banner after a short delay for better UX
      setTimeout(() => setOpenBanner(true), 1000)
    } else {
      // Show the floating button if consent was already given
      setShowButton(true)
    }
  }, [])

  const handleConsent: ConsentHandler = (consent: boolean) => {
    // Store consent for 1 year
    Cookies.set('cookie-consent', consent ? 'accepted' : 'rejected', {expires: 365})
    setOpenBanner(false)
    setShowButton(true)

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

  return (
    <>
      {/* Floating Cookie Button */}
      {showButton && !openBanner && (
        <div className="group fixed bottom-6 left-6 z-50 flex items-center">
          <button
            type="button"
            aria-label="Spravovat souhlas s nastavením cookies"
            className="flex items-center justify-center text-white transition-all bg-red-600 hover:bg-red-700 rounded-full p-3 cursor-pointer size-14 shadow-lg hover:shadow-xl hover:scale-105"
            onClick={() => setOpenBanner(!openBanner)}
          >
            <Cookie className="size-7" />
          </button>
          <span className="hidden group-hover:inline-block ml-3 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap">
            Spravovat cookies
          </span>
        </div>
      )}

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
                aria-label="Zavřít"
              >
                <X className="size-5" />
              </button>

              {/* Icon and Content */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="bg-red-100 rounded-full p-3">
                    <Cookie className="size-8 text-red-600" />
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Souhlas se zpracováním cookies
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                      Tato stránka používá soubory cookie pro sledování konverzí, personalizované
                      reklamy a zlepšení uživatelského zážitku. Zpracování provádíme my a naši
                      partneři včetně Seznam.cz a Google Analytics.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 items-center">
                    <Button size="lg" type="button" onClick={() => handleConsent(true)}>
                      Přijmout vše
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleConsent(false)}
                      size="lg"
                      className="bg-gray-200 hover:bg-gray-300 transition-colors text-gray-800 text-sm md:text-base font-medium px-6 py-3 rounded-lg"
                    >
                      Odmítnout vše
                    </Button>
                    <Link
                      href="/cookies"
                      className="text-sm md:text-base text-red-600 hover:text-red-700 font-medium underline hover:no-underline transition-colors"
                    >
                      Podrobnosti o cookies
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

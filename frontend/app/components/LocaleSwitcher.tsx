'use client'

import {useLocale} from 'next-intl'
import {useParams} from 'next/navigation'
import {useTransition} from 'react'
import {usePathname, useRouter} from '@/i18n/navigation'
import {routing} from '@/i18n/routing'
import {absoluteUrl, homePath, localeDomainsEnabled, type Locale} from '@/app/lib/i18n'

const LABELS: Record<string, string> = {
  'cs': 'CZ',
  'de-AT': 'AT',
}

/**
 * Switches locale while preserving the current route. For dynamic routes
 * (product/CMS slugs differ per locale) next-intl keeps the params, which works
 * for static segments; product detail pages additionally expose hreflang links
 * so search engines always find the translated URL.
 *
 * With domain routing (cs on hledammotory.cz, de-AT on motorfinden.at) a client-side
 * router transition cannot cross origins, so we do a full navigation to the page's own
 * `<link rel="alternate" hreflang>` URL — absolute and, on product pages, carrying the
 * translated slug. Falls back to the other domain's home page.
 */
export default function LocaleSwitcher({className = ''}: {className?: string}) {
  const locale = useLocale()
  const pathname = usePathname()
  const params = useParams()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function onSelect(next: string) {
    if (next === locale) return
    if (localeDomainsEnabled) {
      const alternate = document.querySelector<HTMLLinkElement>(
        `link[rel="alternate"][hreflang="${next}"]`,
      )?.href
      window.location.assign(alternate || absoluteUrl(next as Locale, homePath(next as Locale)))
      return
    }
    startTransition(() => {
      // @ts-expect-error -- params shape is route-dependent
      router.replace({pathname, params}, {locale: next})
    })
  }

  return (
    <div className={`flex items-center gap-1 ${className}`} role="group" aria-label="Language">
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onSelect(l)}
          disabled={isPending}
          aria-current={l === locale ? 'true' : undefined}
          className={`px-2 py-1 text-sm rounded transition-opacity disabled:opacity-40 disabled:cursor-wait ${
            l === locale ? 'font-semibold text-red-600' : 'text-gray-600 hover:text-red-600'
          }`}
        >
          {LABELS[l] ?? l}
        </button>
      ))}
    </div>
  )
}

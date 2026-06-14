'use client'

import {useLocale} from 'next-intl'
import {useParams} from 'next/navigation'
import {useTransition} from 'react'
import {usePathname, useRouter} from '@/i18n/navigation'
import {routing} from '@/i18n/routing'

const LABELS: Record<string, string> = {
  'cs': 'CZ',
  'de-AT': 'AT',
}

/**
 * Switches locale while preserving the current route. For dynamic routes
 * (product/CMS slugs differ per locale) next-intl keeps the params, which works
 * for static segments; product detail pages additionally expose hreflang links
 * so search engines always find the translated URL.
 */
export default function LocaleSwitcher({className = ''}: {className?: string}) {
  const locale = useLocale()
  const pathname = usePathname()
  const params = useParams()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function onSelect(next: string) {
    if (next === locale) return
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
          className={`px-2 py-1 text-sm rounded ${
            l === locale ? 'font-semibold text-red-600' : 'text-gray-600 hover:text-red-600'
          }`}
        >
          {LABELS[l] ?? l}
        </button>
      ))}
    </div>
  )
}

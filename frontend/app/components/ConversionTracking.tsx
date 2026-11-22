'use client'

import {useEffect} from 'react'
import {trackEvent} from '@/app/lib/analytics'

/**
 * Tracks clicks on every `tel:` and `mailto:` link on the site (header, footer, product order
 * box, contact section…) with one delegated listener, so new links are covered automatically.
 */
export default function ConversionTracking() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null
      const link = target?.closest?.('a[href^="tel:"], a[href^="mailto:"]')
      if (!link) return
      const href = link.getAttribute('href') ?? ''
      trackEvent(href.startsWith('tel:') ? 'click_phone' : 'click_email', {
        link_url: href,
        page_path: window.location.pathname,
      })
    }
    document.addEventListener('click', onClick, {capture: true})
    return () => document.removeEventListener('click', onClick, {capture: true})
  }, [])

  return null
}

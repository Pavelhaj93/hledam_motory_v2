/**
 * GA4 event helper. Sends to every GA tag configured in the layout (gtag queues events until
 * the script loads; consent mode decides whether they carry cookies). No-op on the server.
 *
 * Mark `generate_lead`, `click_phone` and `click_email` as key events in GA4 Admin so they show
 * up as conversions.
 */
type EventParams = Record<string, string | number | boolean | undefined>

export function trackEvent(name: string, params: EventParams = {}): void {
  if (typeof window === 'undefined') return
  const gtag = (window as unknown as {gtag?: (...args: unknown[]) => void}).gtag
  if (typeof gtag === 'function') {
    gtag('event', name, params)
  }
}

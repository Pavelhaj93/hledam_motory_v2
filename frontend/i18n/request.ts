import {getRequestConfig} from 'next-intl/server'
import {hasLocale} from 'next-intl'
import {routing} from './routing'

/**
 * Per-request i18n config. Loads the message catalog for the active locale and
 * defines shared formats (currency follows the locale: CZK for cs, EUR for de-AT).
 */
export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    formats: {
      number: {
        price: {
          style: 'currency',
          currency: locale === 'de-AT' ? 'EUR' : 'CZK',
          maximumFractionDigits: 0,
        },
      },
    },
  }
})

import {createNavigation} from 'next-intl/navigation'
import {routing} from './routing'

/**
 * Locale-aware navigation APIs. Import `Link` from here (instead of `next/link`)
 * so localized pathnames and the `/at` prefix are applied automatically.
 */
export const {Link, redirect, usePathname, useRouter, getPathname} = createNavigation(routing)

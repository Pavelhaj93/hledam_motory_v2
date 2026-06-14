import createMiddleware from 'next-intl/middleware'
import {routing} from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  /**
   * Run on everything EXCEPT:
   *  - /api/* (route handlers — locale handled via request body)
   *  - /_next, /_vercel (framework internals)
   *  - /studio (embedded Sanity studio, if mounted)
   *  - sitemap.xml / robots.txt (root metadata routes)
   *  - any path containing a dot (static files: images, fonts, verification html…)
   */
  matcher: ['/((?!api|_next|_vercel|studio|sitemap.xml|robots.txt|.*\\..*).*)'],
}

import type {NextConfig} from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

// Old repasovanyMotor slugs → new SEO-optimized slugs.
// Both the Czech (/katalog/repasovane-motory/) and Austrian (/at/katalog/generalueberholte-motoren/) paths are covered.
const repasovanyMotorSlugRedirects: {source: string; destination: string}[] = [
  ['motor-bmw-20d-n47-656dfd90c4ffb8d2116f14ed', 'repasovany-motor-bmw-2-0d-n47'],
  ['motor-citroen-2-0-bluehdi-96-132-kw-eu6-kod-motoru-4h03-ahp-ahm-ahn-ah03-10dyzz-blfa-ynfa', 'repasovany-motor-citroen-2-0-bluehdi-4h03'],
  ['motor-citron-22-tdci-63114-kw-eu4-kd-motoru4hv4hu-6707bca4c084e2525651d819', 'repasovany-motor-citroen-2-2-tdci-eu4-4hv'],
  ['motor-citron-22-tdci-63114-kw-eu5-kd-motoru4hh-4hj-4hg4hm-6707bd21c084e2525651d81a', 'repasovany-motor-citroen-2-2-tdci-eu5-4hh'],
  ['motor-ford-20bluehdi-96132-kwue6-kd-motorublfa-67079ac4be8ca575aa16584e', 'repasovany-motor-ford-2-0-bluehdi-blfa'],
  ['motor-fiat-13-jtd-66-kw-kd-motoru263a2000-a13dte-199a9000-330a1000--6707a63ba4843d6658c21013', 'repasovany-motor-fiat-1-3-jtd-a13dte'],
  ['motor-fiat-ducato-20-d-85-kw-eu5-kd-motoru250a1000-6707a500a4843d6658c21012', 'repasovany-motor-fiat-ducato-2-0d-250a1000'],
  ['motor-fiat-ducato-23-jtd-95110-kw-eu5-kd-motoruf1ae3481-6707aaa93c457d683c0accf9', 'repasovany-motor-fiat-ducato-2-3-jtd-eu5-f1ae3481'],
  ['motor-fiat-ducato-23-jtd-95110-kw-eu6-kd-motoruf1agl411af1agl411bf1agl411cf1agl411d-6707a92ea4843d6658c21014', 'repasovany-motor-fiat-ducato-2-3-jtd-eu6-f1agl411'],
  ['motor-fiat-ducato-30-jtd-euro-5-670672f70ea3777f683600ef', 'repasovany-motor-fiat-ducato-3-0-jtd-eu5-f1cfl411'],
  ['motor-fiat-ducato-30-jtd-euro-4-670673580ea3777f683600f0', 'repasovany-motor-fiat-ducato-3-0-jtd-eu4-f1ceo481'],
  ['motor-ford-10-ecoboost-7492-kw-kd-motorum1dam2dam1jasfjasfjbm1ddm1je-6707acdf3c457d683c0accfa', 'repasovany-motor-ford-1-0-ecoboost-m1da'],
  ['motor-ford-22-tdci-63114-kw-eu4-kd-motorup8fasrfa-6707bb6fc084e2525651d817', 'repasovany-motor-ford-2-2-tdci-eu4-p8fa'],
  ['motor-ford-22-tdci-63114-kw-eu5-kd-motorudrfacyrbcyfa-6707bc38c084e2525651d818', 'repasovany-motor-ford-2-2-tdci-eu5-drfa'],
  ['motor-mercedes-22-cdi-654xxx-67066ac67405b95617c9b826', 'repasovany-motor-mercedes-2-0-cdi-654'],
  ['motor-mercedes-22-cdi-646xxx-67066a537405b95617c9b825', 'repasovany-motor-mercedes-2-2-cdi-646'],
  ['motor-mercedes-22-cdi-651xxx-6569d77fe92a1778dd88de5e', 'repasovany-motor-mercedes-2-2-cdi-651'],
  ['motor-opel-20-cdti-a20dth-6569d807e92a1778dd88de5f', 'repasovany-motor-opel-2-0-cdti-a20dth'],
  ['motor-fiat-20-hdi-ah03-655e7b564e3a4e6ed2366227', 'repasovany-motor-peugeot-2-0-bluehdi-4h03'],
  ['motor-renault-20-dci-m9r-6569d84be92a1778dd88de60', 'repasovany-motor-renault-2-3-dci-eu6-m9t'],
  ['motor-renault-23-dci-16v-74125-kw-eu5-kd-motoru-m9t702-67079ebf5fc8fcb6382265f4', 'repasovany-motor-renault-2-3-dci-eu5-m9t702'],
  ['motor-transit-22-tdci-drf5-drff-4h03-67066d467405b95617c9b827', 'repasovany-motor-ford-transit-2-2-tdci-drf5'],
  ['motor-transit-24-tdci-74104-kw-eu-4-kd-motoru-jxfa-phfah9fb-670793535fc8fcb6382265f3', 'repasovany-motor-ford-transit-2-4-tdci-eu4-jxfa'],
  ['motor-volkswagen-19-bls-6569da331dbab8ee66ec660f', 'repasovany-motor-volkswagen-1-9-tdi-bxe'],
  ['motor-volkswagen-19-bls-670652c9c7b3d820245bd86f', 'repasovany-motor-volkswagen-1-9-tdi-bls'],
  ['motor-volkswagen-20-tdi-csh-6569d8b41dbab8ee66ec660d', 'repasovany-motor-volkswagen-2-0-bi-tdi-csh'],
  ['motor-volkswagen-20-tdi-cfc-64ef0a69087bd0efa3c9be70', 'repasovany-motor-volkswagen-2-0-bi-tdi-cfc'],
  ['motor-volkswagen-20-tdi-bmmbmp-670653d3c7b3d820245bd870', 'repasovany-motor-volkswagen-2-0-tdi-bmm'],
  ['motor-volkswagen-20-tdi-caa-670651dcc7b3d820245bd86e', 'repasovany-motor-volkswagen-2-0-tdi-caa'],
  ['motor-20-tdi-ckt', 'repasovany-motor-volkswagen-2-0-tdi-ckt'],
  ['motor-volkswagen-20-tdi-cupacunacupcun-67065f86fac34a8b0dd72b9b', 'repasovany-motor-volkswagen-2-0-tdi-cupa'],
  ['motor-volkswagen-20-tdi-dfm-6569d9981dbab8ee66ec660e', 'repasovany-motor-volkswagen-2-0-tdi-dfm'],
].flatMap(([oldSlug, newSlug]) => [
  {
    source: `/katalog/repasovane-motory/${oldSlug}`,
    destination: `/katalog/repasovane-motory/${newSlug}`,
  },
  {
    source: `/at/katalog/generalueberholte-motoren/${oldSlug}`,
    destination: `/at/katalog/generalueberholte-motoren/${newSlug}`,
  },
])

const nextConfig: NextConfig = {
  async redirects() {
    return repasovanyMotorSlugRedirects.map((r) => ({...r, permanent: true}))
  },
  env: {
    // Matches the behavior of `sanity dev` which sets styled-components to use the fastest way of inserting CSS rules in both dev and production. It's default behavior is to disable it in dev mode.
    SC_DISABLE_SPEEDY: 'false',
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 365,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
}

export default withNextIntl(nextConfig)

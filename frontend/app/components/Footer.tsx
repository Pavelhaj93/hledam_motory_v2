import {getTranslations} from 'next-intl/server'
import {Link} from '@/i18n/navigation'
import {Mail, Phone, MapPin, Building2} from 'lucide-react'
import {AllBrandsWithLogosQueryResult} from '@/sanity.types'
import Image from 'next/image'

interface FooterProps {
  settings?: {
    title?: string | null
    phone?: string | null
    dic?: string | null
  } | null
  brands: AllBrandsWithLogosQueryResult
}

const CATEGORY_KEYS = [
  'repasovane-motory',
  'stare-motory',
  'turbodmychadla',
  'prevodovky',
  'motorove-hlavy',
] as const

const CATEGORY_HREFS = {
  'repasovane-motory': '/katalog/repasovane-motory',
  'stare-motory': '/katalog/stare-motory',
  'turbodmychadla': '/katalog/turbodmychadla',
  'prevodovky': '/katalog/prevodovky',
  'motorove-hlavy': '/katalog/motorove-hlavy',
} as const

export default async function Footer({settings}: FooterProps) {
  const currentYear = new Date().getFullYear()
  const phone = settings?.phone || '+420 792 644 755'
  const t = await getTranslations('Common')
  const tFooter = await getTranslations('Footer')
  const tCat = await getTranslations('Categories')

  return (
    <footer className="bg-gray-800 text-white">
      <div className="mx-auto container px-4">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-2">
                  <Image
                    src="/images/logo.png"
                    alt="Hledám motory – prodej repasovaných motorů"
                    width={240}
                    height={60}
                    className="h-20 w-auto hover:scale-105 transition-transform"
                  />
                </Link>
              </div>
              <p className="text-gray-300 text-sm mb-4">{tFooter('companyBlurb')}</p>
              <div className="text-gray-400 text-xs space-y-1">
                <div className="font-medium text-gray-300">Neuro s.r.o.</div>
                {settings?.dic && <div>DIČ: {settings.dic}</div>}
              </div>
            </div>

            {/* Navigation Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{tFooter('navigation')}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm">
                    {t('home')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/katalog"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {t('catalog')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/kontakt"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {t('contact')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/o-nas"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {t('about')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Product Categories */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{tFooter('categories')}</h3>
              <ul className="space-y-2">
                {CATEGORY_KEYS.map((key) => (
                  <li key={key}>
                    <Link
                      href={CATEGORY_HREFS[key]}
                      className="text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      {tCat(key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{tFooter('contactInfo')}</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-red-400 shrink-0" />
                  <a
                    href="mailto:info@hledammotory.cz"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    info@hledammotory.cz
                  </a>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-red-400 shrink-0" />
                  <a
                    href={`tel:${phone.replace(/\s/g, '')}`}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {phone}
                  </a>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <div className="text-gray-300 text-sm">
                    Prachnerova 642/10
                    <br />
                    Praha 5, 150 00
                    <br />
                    Česká republika
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Building2 className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <div className="text-gray-300 text-sm">
                    <div className="font-medium">Neuro s.r.o.</div>
                    {settings?.dic && <div className="text-gray-400">DIČ: {settings.dic}</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col xl:flex-row justify-between items-center gap-4 md:gap-2">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © {currentYear} {settings?.title || 'Motorové díly'}. {tFooter('rights')}.
            </div>

            {/* Legal Links */}
            <div className="flex space-x-6">
              <Link
                href="/ochrana-osobnich-udaju"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                {tFooter('privacy')}
              </Link>
              <Link
                href="/cookies"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                {tFooter('cookies')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

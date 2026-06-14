'use client'

import {useState, useEffect, useRef} from 'react'
import {useTranslations} from 'next-intl'
import {Link} from '@/i18n/navigation'
import {Mail, Phone, Menu, X, ChevronDown} from 'lucide-react'
import Image from 'next/image'
import BrandSelector from './BrandSelector'
import LocaleSwitcher from './LocaleSwitcher'
import {AllBrandsWithLogosQueryResult} from '@/sanity.types'
import {Button} from './ui/button'

interface HeaderProps {
  settings?: {
    title?: string | null
    phone?: string | null
  } | null
  brands: AllBrandsWithLogosQueryResult
}

const CATEGORY_KEYS = [
  'repasovane-motory',
  'turbodmychadla',
  'prevodovky',
  'motorove-hlavy',
  'stare-motory',
] as const

// Localized pathnames for the category links (declared in i18n/routing.ts).
const CATEGORY_HREFS = {
  'repasovane-motory': '/katalog/repasovane-motory',
  'turbodmychadla': '/katalog/turbodmychadla',
  'prevodovky': '/katalog/prevodovky',
  'motorove-hlavy': '/katalog/motorove-hlavy',
  'stare-motory': '/katalog/stare-motory',
} as const

// Client-side Header Component
export default function Header({settings, brands}: HeaderProps) {
  const t = useTranslations('Common')
  const tCat = useTranslations('Categories')
  const tHeader = useTranslations('Header')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const phone = settings?.phone || '+420 792 644 755'

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false)
        setIsMobileMenuOpen(false)
      }
    }
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handlePhoneClick = () => {
    // Track Sklik phone call conversion (ID: 100221747)
    if (typeof window !== 'undefined' && (window as any).sznIVA && (window as any).rc) {
      try {
        ;(window as any).sznIVA.IS.updateIdentities({
          eid: null,
        })

        const conversionConf = {
          id: 100221747,
          value: null,
          consent: null,
        }
        ;(window as any).rc.conversionHit(conversionConf)
      } catch (e) {
        console.error('Sklik tracking error:', e)
      }
    }
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 justify-between items-center">
          {/* Logo */}
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

          {/* Contact Info - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-6  text-gray-600">
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              onClick={handlePhoneClick}
              className="flex items-center space-x-2 hover:text-red-600"
            >
              <Phone className="size-6 text-red-600" />
              <span>{phone}</span>
            </a>
            <a
              href="mailto:info@hledammotory.cz"
              className="flex items-center space-x-2 hover:text-red-600"
            >
              <Mail className="size-6 text-red-600" />
              <span>info@hledammotory.cz</span>
            </a>
          </div>

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link href="/" className="text-gray-900 hover:text-red-600 font-medium">
              {t('home')}
            </Link>
            <Link href="/o-nas" className="text-gray-900 hover:text-red-600 font-medium">
              {t('about')}
            </Link>
            <div className="relative group" ref={dropdownRef}>
              <div className="flex items-center">
                <Link href="/katalog" className="text-gray-900 hover:text-red-600 font-medium">
                  {t('catalog')}
                </Link>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-haspopup="true"
                  aria-expanded={isDropdownOpen}
                  aria-controls="katalog-dropdown"
                  aria-label={t('catalog')}
                  className="ml-1 text-gray-500 hover:text-red-600"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              <div
                id="katalog-dropdown"
                className={`absolute top-full left-0 mt-1 w-48 bg-white shadow-lg border rounded-md transition-all duration-200 z-50 ${isDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'}`}
              >
                <div className="py-2">
                  {CATEGORY_KEYS.map((key) => (
                    <Link
                      key={key}
                      href={CATEGORY_HREFS[key]}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {tCat(key)}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/kontakt">
              <Button size="lg">{t('contact')}</Button>
            </Link>
            <LocaleSwitcher />
          </nav>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <LocaleSwitcher />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? tHeader('closeMenu') : tHeader('openMenu')}
              className="text-gray-900 hover:text-red-600"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="lg:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              <Link
                href="/"
                className="block text-gray-900 hover:text-red-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('home')}
              </Link>
              <Link
                href="/katalog"
                className="block text-gray-900 hover:text-red-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('catalog')}
              </Link>
              <div className="pl-4 space-y-2">
                {CATEGORY_KEYS.map((key) => (
                  <Link
                    key={key}
                    href={CATEGORY_HREFS[key]}
                    className="block text-sm text-gray-600 hover:text-red-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {tCat(key)}
                  </Link>
                ))}
              </div>

              {/* Popular Brands */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-2">{tHeader('popularBrands')}</h3>
                <BrandSelector
                  brands={brands}
                  layout="compact"
                  showLogos={false}
                  maxBrands={6}
                  className="text-sm"
                />
              </div>

              {/* Contact info in mobile menu */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <a
                  href="mailto:info@hledammotory.cz"
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-red-600"
                >
                  <Mail className="h-4 w-4" />
                  <span>info@hledammotory.cz</span>
                </a>
                <a
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  onClick={handlePhoneClick}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-red-600"
                >
                  <Phone className="h-4 w-4" />
                  <span>{phone}</span>
                </a>
              </div>

              <Link href="/kontakt" onClick={() => setIsMobileMenuOpen(false)}>
                <Button size="lg">{t('contact')}</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

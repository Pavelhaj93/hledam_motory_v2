'use client'

import {useState} from 'react'
import Link from 'next/link'
import {Mail, Phone, Menu, Cross, X} from 'lucide-react'
import Image from 'next/image'
import BrandSelector from './BrandSelector'
import {AllBrandsWithLogosQueryResult} from '@/sanity.types'
import {Button} from './ui/button'

interface HeaderProps {
  settings?: {
    title?: string
  }
  brands: AllBrandsWithLogosQueryResult
}

// Client-side Header Component
export default function Header({settings, brands}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={240}
                height={60}
                className="h-20 w-auto hover:scale-105 transition-transform"
              />
            </Link>
          </div>

          {/* Contact Info - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-6  text-gray-600">
            <a href="tel:+420792644755" className="flex items-center space-x-2 hover:text-red-600">
              <Phone className="size-6 text-red-600" />
              <span>+420 792 644 755</span>
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
              Domů
            </Link>
            <Link href="/o-nas" className="text-gray-900 hover:text-red-600 font-medium">
              O nás
            </Link>
            <div className="relative group">
              <Link href="/katalog" className="text-gray-900 hover:text-red-600 font-medium">
                Katalog
              </Link>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white shadow-lg border rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link
                    href="/katalog/repasovane-motory"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Repasované motory
                  </Link>
                  <Link
                    href="/katalog/turbodmychadla"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Turbodmychadla
                  </Link>
                  <Link
                    href="/katalog/prevodovky"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Převodovky
                  </Link>
                  <Link
                    href="/katalog/motorove-hlavy"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Motorové hlavy
                  </Link>
                  <Link
                    href="/katalog/stare-motory"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Staré motory
                  </Link>
                </div>
              </div>
            </div>
            <Link href="/kontakt">
              <Button size="lg">Kontakt</Button>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            {isMobileMenuOpen ? (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-900 hover:text-red-600"
              >
                <X className="h-6 w-6" />
              </button>
            ) : (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-900 hover:text-red-600"
              >
                <Menu className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              <Link
                href="/"
                className="block text-gray-900 hover:text-red-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Domů
              </Link>
              <Link
                href="/katalog"
                className="block text-gray-900 hover:text-red-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Katalog
              </Link>
              <div className="pl-4 space-y-2">
                <Link
                  href="/katalog/repasovane-motory"
                  className="block text-sm text-gray-600 hover:text-red-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Repasované motory
                </Link>
                <Link
                  href="/katalog/turbodmychadla"
                  className="block text-sm text-gray-600 hover:text-red-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Turbodmychadla
                </Link>
                <Link
                  href="/katalog/prevodovky"
                  className="block text-sm text-gray-600 hover:text-red-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Převodovky
                </Link>
                <Link
                  href="/katalog/motorove-hlavy"
                  className="block text-sm text-gray-600 hover:text-red-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Motorové hlavy
                </Link>
                <Link
                  href="/katalog/stare-motory"
                  className="block text-sm text-gray-600 hover:text-red-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Staré motory
                </Link>
              </div>

              {/* Popular Brands */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Populární značky</h3>
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
                  href="tel:+420123456789"
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-red-600"
                >
                  <Phone className="h-4 w-4" />
                  <span>+420 123 456 789</span>
                </a>
              </div>

              <Link href="/kontakt" onClick={() => setIsMobileMenuOpen(false)}>
                <Button size="lg">Kontakt</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

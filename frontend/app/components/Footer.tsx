'use client'

import Link from 'next/link'
import {Mail, Phone, MapPin, Building2} from 'lucide-react'
import BrandSelector from './BrandSelector'
import {AllBrandsWithLogosQueryResult, Brand} from '@/sanity.types'
import Image from 'next/image'

interface FooterProps {
  settings?: {
    title?: string
  }
  brands: AllBrandsWithLogosQueryResult
}

export default function Footer({settings, brands}: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-800 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
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
              <p className="text-gray-300 text-sm mb-4">
                Specializujeme se na prodej kvalitních motorových dílů, repasovaných motorů a
                příslušenství. Nabízíme široký sortiment pro všechny typy vozidel.
              </p>
              <div className="text-gray-400 text-xs space-y-1">
                <div className="font-medium text-gray-300">Neuro s.r.o.</div>
                <div>DIČ: CZ19679041</div>
              </div>
            </div>

            {/* Navigation Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Navigace</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    Domů
                  </Link>
                </li>
                <li>
                  <Link
                    href="/katalog"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    Katalog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    Kontakt
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    O nás
                  </Link>
                </li>
              </ul>
            </div>

            {/* Product Categories */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Kategorie</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/repasovane-motory"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    Repasované motory
                  </Link>
                </li>
                <li>
                  <Link
                    href="/turbodmychadla"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    Turbodmychadla
                  </Link>
                </li>
                <li>
                  <Link
                    href="/prevodovky"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    Převodovky
                  </Link>
                </li>
                <li>
                  <Link
                    href="/motorove-hlavy"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    Motorové hlavy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Kontaktní údaje</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-red-400 flex-shrink-0" />
                  <a
                    href="mailto:info@hledammotory.cz"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    info@hledammotory.cz
                  </a>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-red-400 flex-shrink-0" />
                  <a
                    href="tel:+420724704764"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    +420 724 704 764
                  </a>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="text-gray-300 text-sm">
                    Prachnerova 642/10
                    <br />
                    Praha 5, 150 00
                    <br />
                    Česká republika
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Building2 className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="text-gray-300 text-sm">
                    <div className="font-medium">Neuro s.r.o.</div>
                    <div className="text-gray-400">DIČ: CZ19679041</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col xl:flex-row justify-between items-center space-y-4 md:space-y-2">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © {currentYear} {settings?.title || 'Motorové díly'}. Všechna práva vyhrazena.
            </div>

            {/* Legal Links */}
            <div className="flex space-x-6">
              <Link
                href="/ochrana-osobnich-udaju"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Ochrana osobních údajů
              </Link>
              <Link
                href="/cookies"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

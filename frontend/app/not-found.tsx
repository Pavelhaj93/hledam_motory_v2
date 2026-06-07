import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <p className="text-6xl font-black text-red-600 mb-4">404</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">Stránka nenalezena</h1>
      <p className="text-gray-500 mb-10 max-w-md mx-auto">
        Stránka, kterou hledáte, neexistuje nebo byla přesunuta.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors"
        >
          Zpět na úvod
        </Link>
        <Link
          href="/katalog"
          className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
        >
          Procházet katalog
        </Link>
      </div>
    </div>
  )
}

import {getTranslations} from 'next-intl/server'
import {Link} from '@/i18n/navigation'
import {MessageSquare} from 'lucide-react'

export default async function CatalogNotFoundBanner() {
  const t = await getTranslations('CatalogNotFound')

  return (
    <div className="mt-12 rounded-2xl bg-linear-to-r from-red-600 to-red-700 p-8 lg:p-12 text-white text-center">
      <h2 className="text-2xl lg:text-3xl font-bold mb-3">{t('heading')}</h2>
      <p className="text-white/90 text-lg mb-6 max-w-xl mx-auto">{t('description')}</p>
      <Link
        href="/kontakt"
        className="inline-flex items-center gap-2 bg-white text-red-600 hover:bg-red-50 font-semibold px-6 py-3 rounded-lg transition-colors"
      >
        <MessageSquare className="h-5 w-5" />
        {t('button')}
      </Link>
    </div>
  )
}

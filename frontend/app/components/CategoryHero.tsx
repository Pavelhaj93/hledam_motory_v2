import Link from 'next/link'

interface Breadcrumb {
  label: string
  href?: string
}

interface CategoryHeroProps {
  title: string
  description: string
  breadcrumbs: Breadcrumb[]
}

export default function CategoryHero({title, description, breadcrumbs}: CategoryHeroProps) {
  return (
    <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Breadcrumbs */}
        <nav className="text-sm text-red-100 mb-6">
          {breadcrumbs.map((breadcrumb, index) => (
            <span key={index}>
              {index > 0 && <span className="mx-2">/</span>}
              {breadcrumb.href ? (
                <Link href={breadcrumb.href} className="hover:text-white transition-colors">
                  {breadcrumb.label}
                </Link>
              ) : (
                <span className="text-white">{breadcrumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        {/* Hero Content */}
        <div className="max-w-4xl">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">{title}</h1>
          <p className="text-xl lg:text-2xl text-red-100 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  )
}

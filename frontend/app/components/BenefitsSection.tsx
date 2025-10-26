import {
  CheckCircle,
  Database,
  MapPin,
  Users,
  Star,
  Zap,
  Shield,
  Clock,
  SearchIcon,
} from 'lucide-react'
import Link from 'next/link'
import {Button} from './ui/button'
import ResolvedLink from './ResolvedLink'
import {urlForImage} from '@/sanity/lib/utils'
import Image from 'next/image'

// Icon mapping for dynamic icon selection
const iconMap = {
  users: Users,
  database: Database,
  checkCircle: CheckCircle,
  mapPin: MapPin,
  star: Star,
  zap: Zap,
  shield: Shield,
  clock: Clock,
}

type BenefitsSectionData = {
  eyebrow?: string
  heading?: string
  benefits?: Array<{
    icon?: keyof typeof iconMap
    title?: string
    description?: string
  }>
  footerText?: string
  primaryButton?: {
    text?: string
    link?: any
  }
  backgroundImage?: any
}

type BenefitsSectionProps = {
  block?: BenefitsSectionData
}

const BenefitsSection = ({block}: BenefitsSectionProps) => {
  const {eyebrow, heading, benefits, footerText, primaryButton, backgroundImage} = block ?? {}

  return (
    <section className="w-full py-20 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {backgroundImage && (
        <div className="absolute inset-0 opacity-5">
          <Image
            src={urlForImage(backgroundImage)?.url() || ''}
            alt=""
            fill
            className="object-cover"
          />
        </div>
      )}
      {!backgroundImage && (
        <div className="absolute inset-0 bg-[url('/images/frontend/benefitsBg.png')] bg-cover bg-center opacity-5"></div>
      )}
      <div className="absolute top-10 right-10 w-32 h-32 bg-red-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-red-500 text-lg font-semibold mb-2 tracking-wide uppercase">
            {eyebrow}
          </h2>
          <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
            {heading}
          </h3>
          <div className="w-24 h-1 bg-red-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits?.map((benefit, index) => {
            const IconComponent = benefit.icon ? iconMap[benefit.icon] : Users
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-red-200"
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-red-50 rounded-2xl group-hover:bg-red-100 transition-colors duration-300 group-hover:scale-110 transform">
                    <IconComponent className="size-9 text-red-500" />
                  </div>
                </div>

                <h4 className="text-xl font-bold text-gray-900 text-center mb-4 leading-tight">
                  {benefit.title}
                </h4>

                <p className="text-gray-600 text-center text-sm leading-relaxed">
                  {benefit.description}
                </p>

                <div className="mt-6 flex justify-center">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-red-500 to-red-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600 text-lg mb-6">{footerText}</p>
          {primaryButton?.link ? (
            <ResolvedLink link={primaryButton.link}>
              <Button variant="default" size="lg">
                <SearchIcon className="size-6" />
                {primaryButton.text}
              </Button>
            </ResolvedLink>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default BenefitsSection

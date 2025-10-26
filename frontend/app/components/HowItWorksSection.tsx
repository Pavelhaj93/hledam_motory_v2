'use client'

import {
  ClipboardCheck,
  Mail,
  Handshake,
  Megaphone,
  Target,
  Package,
  ChevronRight,
  Search,
  Phone,
  Settings,
  CheckCircle,
} from 'lucide-react'
import {Button} from './ui/button'
import ResolvedLink from './ResolvedLink'

type Step = {
  title: string
  description: string
  icon: string
}

type HowItWorksSectionData = {
  heading?: string
  subheading?: string
  steps?: Step[]
  ctaText?: string
  ctaLink?: any
}

type HowItWorksSectionProps = {
  block?: HowItWorksSectionData
} & HowItWorksSectionData

const iconMap = {
  ClipboardCheck,
  Mail,
  Handshake,
  Megaphone,
  Target,
  Package,
  Search,
  Phone,
  Settings,
  CheckCircle,
}

export default function HowItWorksSection({block}: HowItWorksSectionProps) {
  // Use block data if available, otherwise use direct props

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || ClipboardCheck
    return <IconComponent className="size-9 text-red-600" />
  }

  const {heading, subheading, steps, ctaText, ctaLink} = block ?? {}

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">{heading}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{subheading}</p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-red-100 transform -translate-x-1/2" />

          <div className="space-y-12">
            {steps?.map((step, index) => (
              <div key={index} className="relative">
                <div
                  className={`lg:flex items-center ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-red-600 z-10">
                    <span className="flex items-center justify-center h-full text-white font-bold">
                      {index + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <div
                    className={`lg:w-1/2 ${
                      index % 2 === 0 ? 'lg:pr-16 lg:text-right' : 'lg:pl-16'
                    }`}
                  >
                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-4 lg:hidden">
                        <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center mr-3">
                          <span className="text-white font-bold">{index + 1}</span>
                        </div>
                        <h3 className="text-xl font-semibold">{step.title}</h3>
                      </div>
                      <div className="hidden lg:block mb-3">
                        <h3 className="text-xl font-semibold">{step.title}</h3>
                      </div>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>

                  {/* Icon */}
                  <div
                    className={`hidden lg:flex lg:w-1/2 ${
                      index % 2 === 0 ? 'lg:justify-start lg:pl-16' : 'lg:justify-end lg:pr-16'
                    } items-center`}
                  >
                    <div className="bg-white p-4 rounded-full shadow-sm">{getIcon(step.icon)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          {ctaLink ? (
            <ResolvedLink link={ctaLink}>
              <Button size="lg">
                {ctaText}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </ResolvedLink>
          ) : (
            <Button size="lg">
              {ctaText}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}

'use client'

import {Shield, Wrench, Package, Star, Clock, Users, CheckCircle, Truck} from 'lucide-react'

interface Feature {
  title: string
  description: string
  icon: string
}

interface FeatureGridData {
  heading?: string
  subheading?: string
  features?: Feature[]
}

interface FeatureGridProps {
  block?: FeatureGridData
}

const iconMap = {
  shield: Shield,
  wrench: Wrench,
  package: Package,
  star: Star,
  clock: Clock,
  users: Users,
  checkCircle: CheckCircle,
  truck: Truck,
}

export default function FeatureGrid({block}: FeatureGridProps) {
  const {heading, subheading, features} = block ?? {}

  if (!features || features.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-16">
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && (
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{heading}</h2>
            )}
            {subheading && <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subheading}</p>}
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon as keyof typeof iconMap] || Shield
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-linear-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

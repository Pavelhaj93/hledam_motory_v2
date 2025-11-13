'use client'

import ResolvedLink from './ResolvedLink'
import {Users, Mail, Phone, MessageCircle, Search, ArrowRight, ExternalLink} from 'lucide-react'
import {Button} from './ui/button'

interface ButtonData {
  text?: string
  link?: any
  icon?: string
}

interface CtaBannerData {
  heading?: string
  description?: string
  primaryButton?: ButtonData
  secondaryButton?: ButtonData
  backgroundColor?: string
}

interface CtaBannerProps {
  block?: CtaBannerData
}

const iconMap = {
  users: Users,
  mail: Mail,
  phone: Phone,
  messageCircle: MessageCircle,
  search: Search,
  arrowRight: ArrowRight,
  externalLink: ExternalLink,
  none: null,
}

export default function CtaBanner({block}: CtaBannerProps) {
  const {heading, description, primaryButton, secondaryButton, backgroundColor} = block ?? {}

  if (!heading && !description) {
    return null
  }

  const bgClass = backgroundColor || 'bg-gradient-to-r from-red-600 to-red-700'

  const PrimaryIcon = primaryButton?.icon
    ? iconMap[primaryButton.icon as keyof typeof iconMap]
    : null
  const SecondaryIcon = secondaryButton?.icon
    ? iconMap[secondaryButton.icon as keyof typeof iconMap]
    : null

  return (
    <div className="container mx-auto px-4 py-12">
      <div className={`${bgClass} rounded-2xl p-8 lg:p-12 text-white text-center`}>
        {heading && <h2 className="text-3xl lg:text-4xl font-bold mb-4">{heading}</h2>}
        {description && (
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">{description}</p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {primaryButton?.text && primaryButton?.link && (
            <ResolvedLink link={primaryButton.link}>
              <Button variant="secondary" size="lg">
                {PrimaryIcon && <PrimaryIcon className="size-6" />}
                {primaryButton.text}
              </Button>
            </ResolvedLink>
          )}
          {secondaryButton?.text && secondaryButton?.link && (
            <ResolvedLink link={secondaryButton.link}>
              <Button variant="default" size="lg">
                {SecondaryIcon && <SecondaryIcon className="size-6" />}
                {secondaryButton.text}
              </Button>
            </ResolvedLink>
          )}
        </div>
      </div>
    </div>
  )
}

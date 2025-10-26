'use client'

import {useState} from 'react'
import {Mail, Phone, MapPin, Building2, SendIcon, SendHorizonalIcon, MailIcon} from 'lucide-react'
import {Button} from './ui/button'

interface ContactSectionProps {
  heading?: string
  description?: string
  layout?: 'form-info' | 'form-only' | 'info-only'
  showContactInfo?: boolean
  contactInfo?: {
    email?: string
    phone?: string
    address?: string
    companyName?: string
    vatNumber?: string
  }
  formConfiguration?: {
    submitButtonText?: string
    successMessage?: string
  }
}

export default function ContactSection({
  heading = 'Kontaktujte nás',
  description,
  layout = 'form-info',
  showContactInfo = true,
  contactInfo = {},
  formConfiguration = {},
}: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const {
    submitButtonText = 'Odeslat zprávu',
    successMessage = 'Děkujeme za váš zájem! Brzy se vám ozveme.',
  } = formConfiguration

  const {
    email = 'info@hledammotory.cz',
    phone = '+420 724 704 764',
    address = 'Prachnerova 642/10, Praha 5, 150 00',
    companyName = 'Neuro s.r.o.',
    vatNumber = 'IČO: 12345678',
  } = contactInfo

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    setShowSuccess(true)
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
    })

    // Hide success message after 5 seconds
    setTimeout(() => setShowSuccess(false), 5000)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const renderContactForm = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 lg:p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Napište nám</h3>

      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Jméno a příjmení *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Telefon
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Zpráva *
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            value={formData.message}
            onChange={handleChange}
            placeholder="Popište vaši poptávku nebo dotaz..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
          {isSubmitting ? 'Odesílání...' : submitButtonText}
          <MailIcon className="size-6 ml-2" />
        </Button>
      </form>
    </div>
  )

  const renderContactInfo = () => (
    <div className="bg-red-50 rounded-lg p-6 lg:p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Kontaktní údaje</h3>

      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Spojte se s námi</h4>
          <div className="space-y-3">
            <a
              href={`mailto:${email}`}
              className="flex items-center space-x-3 text-gray-700 hover:text-red-600 transition-colors"
            >
              <Mail className="h-5 w-5 text-red-600" />
              <span>{email}</span>
            </a>

            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="flex items-center space-x-3 text-gray-700 hover:text-red-600 transition-colors"
            >
              <Phone className="h-5 w-5 text-red-600" />
              <span>{phone}</span>
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Adresa</h4>
          <div className="flex items-start space-x-3 text-gray-700">
            <MapPin className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="whitespace-pre-line">{address}</div>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Údaje o společnosti</h4>
          <div className="space-y-2">
            <div className="flex items-start space-x-3 text-gray-700">
              <Building2 className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <div className="font-medium">{companyName}</div>
                <div className="text-sm text-gray-600">{vatNumber}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{heading}</h2>
          {description && <p className="text-lg text-gray-600 max-w-2xl mx-auto">{description}</p>}
        </div>

        {/* Content based on layout */}
        {layout === 'form-info' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {renderContactForm()}
            {showContactInfo && renderContactInfo()}
          </div>
        )}

        {layout === 'form-only' && <div className="max-w-2xl mx-auto">{renderContactForm()}</div>}

        {layout === 'info-only' && showContactInfo && (
          <div className="max-w-2xl mx-auto">{renderContactInfo()}</div>
        )}
      </div>
    </section>
  )
}

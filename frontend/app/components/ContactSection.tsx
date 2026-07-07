'use client'

import {useState, useEffect, useRef, Suspense} from 'react'
import {useSearchParams} from 'next/navigation'
import {useLocale} from 'next-intl'
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  SendIcon,
  SendHorizonalIcon,
  MailIcon,
  X,
} from 'lucide-react'
import {Button} from './ui/button'
import Link from 'next/link'

interface ContactSectionProps {
  block?: {
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
}

function MotorParam({onRead}: {onRead: (v: string | null) => void}) {
  const searchParams = useSearchParams()
  useEffect(() => {
    onRead(searchParams.get('motor'))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}

export default function ContactSection({block}: ContactSectionProps) {
  const {
    heading,
    description,
    layout = 'form-info',
    showContactInfo = true,
    contactInfo = {},
    formConfiguration = {},
  } = block || {}
  const locale = useLocale()
  const inquiryPrefix = locale === 'de-AT' ? 'Ich interessiere mich für' : 'Mám zájem o'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    gdprConsent: false,
  })

  const handleMotorParam = (motor: string | null) => {
    if (motor) setFormData((prev) => ({...prev, message: `${inquiryPrefix}: ${motor}`}))
  }
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{name?: string; email?: string; message?: string}>(
    {},
  )
  const formMessageRef = useRef<HTMLDivElement>(null)

  const validate = () => {
    const errors: {name?: string; email?: string; message?: string} = {}
    if (!formData.name.trim()) {
      errors.name = 'Zadejte prosím jméno a příjmení'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Zadejte prosím platnou emailovou adresu'
    }
    if (formData.message.trim().length < 10) {
      errors.message = 'Zpráva musí mít alespoň 10 znaků'
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  useEffect(() => {
    if (showSuccess || showError) {
      formMessageRef.current?.scrollIntoView({behavior: 'smooth', block: 'nearest'})
    }
  }, [showSuccess, showError])

  const {
    submitButtonText = 'Odeslat zprávu',
    successMessage = 'Děkujeme za váš zájem! Brzy se vám ozveme.',
  } = formConfiguration

  const {email, phone, address, companyName, vatNumber} = contactInfo

  const handlePhoneClick = () => {
    // Track Sklik phone call conversion (ID: 100221747)
    if (typeof window !== 'undefined' && (window as any).sznIVA && (window as any).rc) {
      try {
        ;(window as any).sznIVA.IS.updateIdentities({
          eid: null,
        })

        const conversionConf = {
          id: 100221747,
          value: null,
          consent: null,
        }
        ;(window as any).rc.conversionHit(conversionConf)
      } catch (e) {
        console.error('Sklik tracking error:', e)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      return
    }
    setIsSubmitting(true)
    setShowError(false)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...formData, locale}),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      // Track Sklik form conversion (ID: 100221746)
      if (typeof window !== 'undefined' && (window as any).sznIVA && (window as any).rc) {
        try {
          ;(window as any).sznIVA.IS.updateIdentities({
            eid: formData.email || null,
          })

          const conversionConf = {
            id: 100221746,
            value: null,
            consent: formData.gdprConsent ? 1 : 0,
          }
          ;(window as any).rc.conversionHit(conversionConf)
        } catch (e) {
          console.error('Sklik tracking error:', e)
        }
      }

      setShowSuccess(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        gdprConsent: false,
      })
      setFieldErrors({})
    } catch (error) {
      console.error('Error submitting form:', error)
      setShowError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    if (e.target.name in fieldErrors) {
      setFieldErrors((prev) => ({...prev, [e.target.name]: undefined}))
    }
  }

  const renderContactForm = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 lg:p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Napište nám</h3>

      <div ref={formMessageRef}>
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-start justify-between gap-4">
            <p className="text-green-700">{successMessage}</p>
            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              aria-label="Zavřít zprávu"
              className="text-green-700 hover:text-green-900 shrink-0"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        {showError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start justify-between gap-4">
            <p className="text-red-700">
              Nepodařilo se odeslat zprávu. Zkuste to prosím znovu nebo nás kontaktujte přímo na
              email.
            </p>
            <button
              type="button"
              onClick={() => setShowError(false)}
              aria-label="Zavřít zprávu"
              className="text-red-700 hover:text-red-900 shrink-0"
            >
              <X className="size-4" />
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Jméno a příjmení *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              aria-invalid={!!fieldErrors.name}
              aria-describedby={fieldErrors.name ? 'name-error' : undefined}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${fieldErrors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {fieldErrors.name && (
              <p id="name-error" className="mt-1 text-sm text-red-600">
                {fieldErrors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {fieldErrors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600">
                {fieldErrors.email}
              </p>
            )}
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
            value={formData.message}
            onChange={handleChange}
            placeholder="Popište vaši poptávku nebo dotaz..."
            aria-invalid={!!fieldErrors.message}
            aria-describedby={fieldErrors.message ? 'message-error' : undefined}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${fieldErrors.message ? 'border-red-500' : 'border-gray-300'}`}
          />
          {fieldErrors.message && (
            <p id="message-error" className="mt-1 text-sm text-red-600">
              {fieldErrors.message}
            </p>
          )}
        </div>

        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="gdprConsent"
            name="gdprConsent"
            required
            checked={formData.gdprConsent}
            onChange={(e) => setFormData((prev) => ({...prev, gdprConsent: e.target.checked}))}
            className="mt-1 h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
          />
          <label htmlFor="gdprConsent" className="text-sm text-gray-700">
            Souhlasím se{' '}
            <Link
              href="/ochrana-osobnich-udaju"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-700 underline"
            >
              zpracováním osobních údajů
            </Link>{' '}
            *
          </label>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !formData.gdprConsent}
          size="lg"
          className="w-full"
        >
          {isSubmitting ? 'Odesílání...' : submitButtonText}
          <MailIcon className="size-6 ml-2" />
        </Button>
        {!isSubmitting && !formData.gdprConsent && (
          <p className="text-sm text-gray-500 text-center">
            Zaškrtněte souhlas výše pro odeslání
          </p>
        )}
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
              href={`tel:${phone?.replace(/\s/g, '')}`}
              onClick={handlePhoneClick}
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

        {(companyName || vatNumber) && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Údaje o společnosti</h4>
            <div className="space-y-2">
              <div className="flex items-start space-x-3 text-gray-700">
                <Building2 className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  {companyName && <div className="font-medium">{companyName}</div>}
                  {vatNumber && <div className="text-sm text-gray-600">{vatNumber}</div>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <section className="py-16 bg-gray-50">
      <Suspense fallback={null}>
        <MotorParam onRead={handleMotorParam} />
      </Suspense>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {(heading || description) && (
          <div className="text-center mb-12">
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{heading}</h2>
            )}
            {description && <p className="text-lg text-gray-600 max-w-2xl mx-auto">{description}</p>}
          </div>
        )}

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

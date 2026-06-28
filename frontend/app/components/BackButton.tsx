'use client'

import {useRouter} from 'next/navigation'
import {ArrowLeft} from 'lucide-react'

type BackButtonProps = {
  fallbackHref: string
  label: string
}

export default function BackButton({fallbackHref, label}: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push(fallbackHref)
    }
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center text-red-600 hover:text-red-700 mb-6"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      {label}
    </button>
  )
}

'use client'

import {Cookie} from 'lucide-react'
import {Button} from './ui/button'

export default function OpenCookieBannerButton({label}: {label: string}) {
  return (
    <Button
      type="button"
      size="lg"
      onClick={() => window.dispatchEvent(new CustomEvent('open-cookie-banner'))}
    >
      <Cookie className="h-4 w-4 mr-2" />
      {label}
    </Button>
  )
}

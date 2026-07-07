import {ImageOff} from 'lucide-react'

export default function MissingImage({
  label = 'Bez obrázku',
  className = '',
}: {
  label?: string
  className?: string
}) {
  return (
    <div
      className={`h-full w-full bg-gray-100 flex flex-col items-center justify-center gap-1.5 text-gray-400 ${className}`}
    >
      <ImageOff className="h-6 w-6" />
      <span className="text-xs font-medium">{label}</span>
    </div>
  )
}

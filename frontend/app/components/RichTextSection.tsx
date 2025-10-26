import CustomPortableText from '@/app/components/PortableText'

type RichTextSectionProps = {
  block: {
    _key: string
    _type: 'richTextSection'
    title?: string
    content: any[]
    backgroundColor?: string
    maxWidth?: string
  }
}

const backgroundColorClasses = {
  'white': 'bg-white',
  'gray-50': 'bg-gray-50',
  'gray-100': 'bg-gray-100',
  'blue-50': 'bg-red-50',
  'red-50': 'bg-red-50',
}

const maxWidthClasses = {
  'full': 'max-w-none',
  '7xl': 'max-w-7xl',
  '4xl': 'max-w-4xl',
  '2xl': 'max-w-2xl',
}

export default function RichTextSection({block}: RichTextSectionProps) {
  const {title, content, backgroundColor = 'white', maxWidth = '4xl'} = block

  const bgClass =
    backgroundColorClasses[backgroundColor as keyof typeof backgroundColorClasses] || 'bg-white'
  const maxWidthClass = maxWidthClasses[maxWidth as keyof typeof maxWidthClasses] || 'max-w-4xl'

  return (
    <section className={`py-12 ${bgClass}`}>
      <div className={`container mx-auto px-4 lg:px-8 ${maxWidthClass}`}>
        {title && <h2 className="text-3xl font-bold text-gray-900 mb-8 text-left">{title}</h2>}
        {content && content.length > 0 && (
          <CustomPortableText
            className="prose prose-lg max-w-none prose-a:text-red-600 prose-headings:text-gray-900"
            value={content}
          />
        )}
      </div>
    </section>
  )
}

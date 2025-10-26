import {defineType, defineField} from 'sanity'

export const richTextSection = defineType({
  name: 'richTextSection',
  title: 'Rich Text Section',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'Optional title for the rich text section',
    }),
    defineField({
      name: 'content',
      title: 'Rich Text Content',
      type: 'blockContent',
      description: 'Rich text content with formatting, links, and more',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          {title: 'White', value: 'white'},
          {title: 'Gray Light', value: 'gray-50'},
          {title: 'Gray', value: 'gray-100'},
          {title: 'Blue Light', value: 'blue-50'},
          {title: 'Red Light', value: 'red-50'},
        ],
        layout: 'dropdown',
      },
      initialValue: 'white',
    }),
    defineField({
      name: 'maxWidth',
      title: 'Maximum Width',
      type: 'string',
      options: {
        list: [
          {title: 'Full Width', value: 'full'},
          {title: 'Large (1200px)', value: '7xl'},
          {title: 'Medium (768px)', value: '4xl'},
          {title: 'Small (640px)', value: '2xl'},
        ],
        layout: 'dropdown',
      },
      initialValue: '4xl',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      content: 'content',
    },
    prepare({title, content}) {
      const block = (content || []).find((block: any) => block._type === 'block')
      const textContent = block
        ? block.children
            ?.filter((child: any) => child._type === 'span')
            ?.map((span: any) => span.text)
            ?.join('') || ''
        : ''

      return {
        title: title || 'Rich Text Section',
        subtitle: textContent.slice(0, 80) + (textContent.length > 80 ? '...' : ''),
      }
    },
  },
})

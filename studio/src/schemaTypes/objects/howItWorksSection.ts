import {defineField, defineType} from 'sanity'
import {ListIcon} from '@sanity/icons'

export const howItWorksSection = defineType({
  name: 'howItWorksSection',
  title: 'How It Works Section',
  type: 'object',
  icon: ListIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      initialValue: 'Jak získat motor v 6 jednoduchých krocích',
    }),
    defineField({
      name: 'subheading',
      title: 'Section Subheading',
      type: 'text',
      rows: 3,
      initialValue:
        'Náš proces je navržen tak, aby byl pro vás co nejjednodušší a nejefektivnější. Stačí sledovat těchto 6 kroků a brzy budete mít svůj motor.',
    }),
    defineField({
      name: 'steps',
      title: 'Process Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'step',
          title: 'Step',
          fields: [
            defineField({
              name: 'title',
              title: 'Step Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Step Description',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Icon name (e.g., ClipboardCheck, Mail, Handshake, etc.)',
              options: {
                list: [
                  {title: 'Clipboard Check', value: 'ClipboardCheck'},
                  {title: 'Mail', value: 'Mail'},
                  {title: 'Handshake', value: 'Handshake'},
                  {title: 'Megaphone', value: 'Megaphone'},
                  {title: 'Target', value: 'Target'},
                  {title: 'Package', value: 'Package'},
                  {title: 'Search', value: 'Search'},
                  {title: 'Phone', value: 'Phone'},
                  {title: 'Settings', value: 'Settings'},
                  {title: 'Check Circle', value: 'CheckCircle'},
                ],
              },
              initialValue: 'ClipboardCheck',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              description: 'description',
            },
            prepare({title, description}) {
              return {
                title: title || 'Untitled Step',
                subtitle: description,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).max(10),
    }),
    defineField({
      name: 'ctaText',
      title: 'Call to Action Text',
      type: 'string',
      initialValue: 'Poptat motor',
    }),
    defineField({
      name: 'ctaLink',
      title: 'Call to Action Link',
      type: 'link',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'subheading',
      steps: 'steps',
    },
    prepare({title, steps}) {
      const stepCount = steps?.length || 0
      return {
        title: title || 'How It Works Section',
        subtitle: `${stepCount} steps`,
      }
    },
  },
})

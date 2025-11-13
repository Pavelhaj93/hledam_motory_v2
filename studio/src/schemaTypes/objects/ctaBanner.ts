import {defineField, defineType} from 'sanity'
import {RocketIcon} from '@sanity/icons'

/**
 * CTA Banner - A prominent call-to-action section with gradient background.
 * Features heading, description, and multiple action buttons.
 */

export const ctaBanner = defineType({
  name: 'ctaBanner',
  title: 'CTA Banner',
  type: 'object',
  icon: RocketIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Nenašli jste co hledáte?',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      initialValue:
        'Kontaktujte nás a naši odborníci vám pomohou najít správný díl pro vaše vozidlo',
    }),
    defineField({
      name: 'primaryButton',
      title: 'Primary Button',
      type: 'object',
      fields: [
        defineField({
          name: 'text',
          title: 'Button Text',
          type: 'string',
          initialValue: 'Kontakujte nás',
        }),
        defineField({
          name: 'link',
          title: 'Button Link',
          type: 'link',
        }),
        defineField({
          name: 'icon',
          title: 'Icon',
          type: 'string',
          options: {
            list: [
              {title: 'Users (Contact)', value: 'users'},
              {title: 'Mail (Email)', value: 'mail'},
              {title: 'Phone (Call)', value: 'phone'},
              {title: 'MessageCircle (Chat)', value: 'messageCircle'},
              {title: 'None', value: 'none'},
            ],
          },
          initialValue: 'users',
        }),
      ],
    }),
    defineField({
      name: 'secondaryButton',
      title: 'Secondary Button (Optional)',
      type: 'object',
      fields: [
        defineField({
          name: 'text',
          title: 'Button Text',
          type: 'string',
        }),
        defineField({
          name: 'link',
          title: 'Button Link',
          type: 'link',
        }),
        defineField({
          name: 'icon',
          title: 'Icon',
          type: 'string',
          options: {
            list: [
              {title: 'Search', value: 'search'},
              {title: 'ArrowRight', value: 'arrowRight'},
              {title: 'ExternalLink', value: 'externalLink'},
              {title: 'None', value: 'none'},
            ],
          },
          initialValue: 'none',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      description: 'description',
    },
    prepare({heading, description}) {
      return {
        title: heading || 'CTA Banner',
        subtitle: description,
      }
    },
  },
})

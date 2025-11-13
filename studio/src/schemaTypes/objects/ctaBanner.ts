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
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          {title: 'Red Gradient', value: 'bg-gradient-to-r from-red-600 to-red-700'},
          {title: 'Blue Gradient', value: 'bg-gradient-to-r from-blue-600 to-blue-700'},
          {title: 'Green Gradient', value: 'bg-gradient-to-r from-green-600 to-green-700'},
          {title: 'Purple Gradient', value: 'bg-gradient-to-r from-purple-600 to-purple-700'},
          {title: 'Orange Gradient', value: 'bg-gradient-to-r from-orange-600 to-orange-700'},
        ],
      },
      initialValue: 'bg-gradient-to-r from-red-600 to-red-700',
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

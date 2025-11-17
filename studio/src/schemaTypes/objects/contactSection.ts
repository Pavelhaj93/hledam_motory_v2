import {defineField, defineType} from 'sanity'
import {EnvelopeIcon} from '@sanity/icons'

/**
 * Contact section for the page builder.
 * Includes contact form, company info, and map integration.
 */

export const contactSection = defineType({
  name: 'contactSection',
  title: 'Contact Section',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Section Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'layout',
      title: 'Layout Style',
      type: 'string',
      options: {
        list: [
          {title: 'Contact Form + Info', value: 'form-info'},
          {title: 'Form Only', value: 'form-only'},
          {title: 'Info Only', value: 'info-only'},
        ],
        layout: 'radio',
      },
      initialValue: 'form-info',
    }),
    defineField({
      name: 'showContactInfo',
      title: 'Show Contact Information',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'object',
      hidden: ({parent}) => !parent?.showContactInfo,
      fields: [
        defineField({
          name: 'email',
          title: 'Email Address',
          type: 'string',
          validation: (Rule) => Rule.email(),
        }),
        defineField({
          name: 'phone',
          title: 'Phone Number',
          type: 'string',
        }),
        defineField({
          name: 'address',
          title: 'Physical Address',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'companyName',
          title: 'Company Name',
          type: 'string',
        }),
        defineField({
          name: 'vatNumber',
          title: 'VAT Number / IČO',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'formConfiguration',
      title: 'Contact Form Configuration',
      type: 'object',
      fields: [
        defineField({
          name: 'submitButtonText',
          title: 'Submit Button Text',
          type: 'string',
          initialValue: 'Odeslat zprávu',
        }),
        defineField({
          name: 'successMessage',
          title: 'Success Message',
          type: 'text',
          rows: 2,
          initialValue: 'Děkujeme za váš zájem! Brzy se vám ozveme.',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'layout',
    },
    prepare(selection) {
      const {title, subtitle} = selection
      const layoutLabels: Record<string, string> = {
        'form-info': 'Form + Info',
        'form-only': 'Form Only',
        'info-only': 'Info Only',
      }
      return {
        title: title || 'Contact Section',
        subtitle: `Layout: ${layoutLabels[subtitle] || subtitle}`,
      }
    },
  },
})

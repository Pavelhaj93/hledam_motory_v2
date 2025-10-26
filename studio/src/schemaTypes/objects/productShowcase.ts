import {defineField, defineType} from 'sanity'
import {CubeIcon} from '@sanity/icons'

/**
 * Product showcase section for displaying engine parts and products.
 * Perfect for highlighting key products or categories.
 */

export const productShowcase = defineType({
  name: 'productShowcase',
  title: 'Product Showcase',
  type: 'object',
  icon: CubeIcon,
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
          {title: 'Grid (3 columns)', value: 'grid'},
          {title: 'Featured + Grid', value: 'featured'},
          {title: 'Carousel', value: 'carousel'},
        ],
        layout: 'radio',
      },
      initialValue: 'grid',
    }),
    defineField({
      name: 'maxProducts',
      title: 'Maximum Products to Show',
      type: 'number',
      initialValue: 6,
      validation: (Rule) => Rule.min(1).max(50),
      description: 'Limit the number of products displayed (shows all products by default)',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'layout',
    },
    prepare(selection) {
      const {title, subtitle} = selection
      return {
        title: title || 'Product Showcase',
        subtitle: `Layout: ${subtitle || 'grid'}`,
      }
    },
  },
})

import {defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons'

/**
 * Homepage schema - a singleton document for the homepage content.
 */

export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  icon: HomeIcon,
  initialValue: {
    title: 'Homepage',
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Homepage',
      readOnly: true,
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          validation: (Rule) => Rule.max(60),
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.max(160),
        }),
      ],
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page builder',
      type: 'array',
      of: [
        {type: 'callToAction'},
        {type: 'infoSection'},
        {type: 'heroSection'},
        {type: 'productShowcase'},
        {type: 'contactSection'},
        {type: 'richTextSection'},
        {type: 'howItWorksSection'},
        {type: 'homepageTeaserSection'},
        {type: 'benefitsSection'},
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Homepage',
        subtitle: 'Main website homepage',
      }
    },
  },
})

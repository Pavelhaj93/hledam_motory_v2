import {defineField, defineType} from 'sanity'
import {StarIcon} from '@sanity/icons'

export const homepageTeaserSection = defineType({
  name: 'homepageTeaserSection',
  title: 'Homepage Teaser Section',
  type: 'object',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      initialValue: 'Objevte nejnovější produkty',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Section Description',
      type: 'text',
      rows: 3,
      initialValue:
        'Podívejte se na nejnovější produkty v našem katalogu. Vyberte si z široké nabídky motorů a dílů.',
      validation: (Rule) => Rule.required(),
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
        }),
        defineField({
          name: 'link',
          title: 'Button Link',
          type: 'link',
        }),
      ],
    }),
    defineField({
      name: 'secondaryButton',
      title: 'Secondary Button',
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
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'Homepage Teaser Section',
        subtitle: subtitle ? subtitle.substring(0, 60) + '...' : 'Latest products showcase',
        media: StarIcon,
      }
    },
  },
})

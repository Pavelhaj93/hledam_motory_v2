import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'brand',
  title: 'Značky automobilů',
  type: 'document',
  icon: () => '🚗',
  fields: [
    defineField({
      name: 'name',
      title: 'Název značky',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Brand Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'isPopular',
      title: 'Je populární značka?',
      type: 'boolean',
      initialValue: false,
      description:
        'Označit jako populární pro zobrazení v doporučených sekcích značek (patička, zvýraznění katalogu)',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'logo',
    },
    prepare(selection) {
      const {title, media} = selection
      return {
        title,
        subtitle: 'Brand',
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Name A-Z',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
    {
      title: 'Popular First',
      name: 'popularFirst',
      by: [
        {field: 'isPopular', direction: 'desc'},
        {field: 'name', direction: 'asc'},
      ],
    },
  ],
})

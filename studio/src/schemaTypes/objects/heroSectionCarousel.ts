import {defineField, defineType} from 'sanity'
import {PlayIcon} from '@sanity/icons'

export default defineType({
  name: 'heroSectionCarousel',
  title: 'Hero Section Carousel',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      description: 'Main heading text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'string',
      description: 'Secondary heading text',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Supporting description text',
    }),
    defineField({
      name: 'images',
      title: 'Carousel Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
              description: 'Important for SEO and accessibility',
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.min(1).max(5).required(),
      description: 'Add 1-5 images for the carousel background. Images will rotate automatically.',
    }),
    defineField({
      name: 'autoplayDelay',
      title: 'Autoplay Delay (ms)',
      type: 'number',
      description: 'Time in milliseconds between automatic slide transitions',
      initialValue: 5000,
      validation: (Rule) => Rule.min(1000).max(10000),
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
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'link',
          title: 'Button Link',
          type: 'link',
          validation: (Rule) => Rule.required(),
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
      title: 'headline',
      subtitle: 'subheadline',
      imageCount: 'images',
    },
    prepare({title, subtitle, imageCount}) {
      const count = imageCount?.length || 0
      return {
        title: title || 'Hero Section Carousel',
        subtitle: subtitle ? `${subtitle} (${count} images)` : `${count} images`,
        media: PlayIcon,
      }
    },
  },
})

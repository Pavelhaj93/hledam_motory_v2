import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

/**
 * Page schema.  Define and edit the fields for the 'page' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page builder',
      type: 'array',
      of: [
        {type: 'callToAction'},
        {type: 'infoSection'},
        {type: 'heroSection'},
        {type: 'heroSectionCarousel'},
        {type: 'productShowcase'},
        {type: 'contactSection'},
        {type: 'richTextSection'},
        {type: 'howItWorksSection'},
        {type: 'homepageTeaserSection'},
        {type: 'benefitsSection'},
      ],
      options: {
        insertMenu: {
          // Configure the "Add Item" menu to display a thumbnail preview of the content type. https://www.sanity.io/docs/array-type#efb1fe03459d
          views: [
            {
              name: 'grid',
              previewImageUrl: (schemaTypeName) => {
                // Check if SVG exists first, then fallback to WebP
                const svgPath = `/static/page-builder-thumbnails/${schemaTypeName}.svg`
                const webpPath = `/static/page-builder-thumbnails/${schemaTypeName}.webp`

                // For heroSection, heroSectionCarousel, productShowcase, richTextSection, howItWorksSection, homepageTeaserSection, and benefitsSection, use SVG, others use WebP
                if (
                  schemaTypeName === 'heroSection' ||
                  schemaTypeName === 'heroSectionCarousel' ||
                  schemaTypeName === 'productShowcase' ||
                  schemaTypeName === 'richTextSection' ||
                  schemaTypeName === 'howItWorksSection' ||
                  schemaTypeName === 'homepageTeaserSection' ||
                  schemaTypeName === 'benefitsSection'
                ) {
                  return svgPath
                }
                return webpPath
              },
            },
          ],
        },
      },
    }),
  ],
})

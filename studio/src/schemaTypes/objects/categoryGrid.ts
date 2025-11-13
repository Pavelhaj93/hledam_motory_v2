import {defineField, defineType} from 'sanity'
import {BlockElementIcon} from '@sanity/icons'

/**
 * Category Grid section for displaying product categories with icons.
 * Shows a grid of clickable category cards with icons, descriptions, and item counts.
 */

export const categoryGrid = defineType({
  name: 'categoryGrid',
  title: 'Category Grid',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      initialValue: 'Kategorie produktů',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subheading',
      title: 'Section Subheading',
      type: 'text',
      rows: 2,
      initialValue:
        'Vyberte si z našich hlavních kategorií produktů, všechny díly jsou profesionálně renovované',
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Category Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'slug',
              title: 'Category Slug',
              type: 'string',
              description: 'URL path (e.g., "repasovane-motory")',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                list: [
                  {title: 'Zap (Lightning)', value: 'zap'},
                  {title: 'Cog (Gear)', value: 'cog'},
                  {title: 'Settings', value: 'settings'},
                  {title: 'Wrench (Tool)', value: 'wrench'},
                  {title: 'Car', value: 'car'},
                  {title: 'Truck', value: 'truck'},
                  {title: 'Package', value: 'package'},
                ],
              },
              initialValue: 'cog',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'color',
              title: 'Color Theme',
              type: 'string',
              options: {
                list: [
                  {title: 'Red', value: 'bg-gradient-to-br from-red-500 to-red-600'},
                  {title: 'Green', value: 'bg-gradient-to-br from-green-500 to-green-600'},
                  {title: 'Purple', value: 'bg-gradient-to-br from-purple-500 to-purple-600'},
                  {title: 'Orange', value: 'bg-gradient-to-br from-orange-500 to-orange-600'},
                  {title: 'Yellow', value: 'bg-gradient-to-br from-yellow-500 to-yellow-600'},
                  {title: 'Blue', value: 'bg-gradient-to-br from-blue-500 to-blue-600'},
                ],
              },
              initialValue: 'bg-gradient-to-br from-red-500 to-red-600',
            }),
            defineField({
              name: 'itemCount',
              title: 'Item Count',
              type: 'string',
              description: 'Display count like "200+"',
              initialValue: '0+',
            }),
            defineField({
              name: 'featured',
              title: 'Featured',
              type: 'boolean',
              description: 'Show "Populární" badge',
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
              featured: 'featured',
            },
            prepare({title, subtitle, featured}) {
              return {
                title: `${title}${featured ? ' ⭐' : ''}`,
                subtitle,
              }
            },
          },
        },
      ],
      initialValue: [
        {
          title: 'Repasované motory',
          slug: 'repasovane-motory',
          description:
            'Kompletní repasované motory s plnou zárukou. Profesionální renovace s výměnou všech opotřebovaných dílů.',
          icon: 'zap',
          color: 'bg-gradient-to-br from-red-500 to-red-600',
          itemCount: '200+',
          featured: true,
        },
        {
          title: 'Turbodmychadla',
          slug: 'turbodmychadla',
          description:
            'Repasovaná turbodmychadla pro všechny typy vozidel. Kompletní renovace s novými ložisky a těsněními.',
          icon: 'cog',
          color: 'bg-gradient-to-br from-green-500 to-green-600',
          itemCount: '150+',
          featured: true,
        },
        {
          title: 'Převodovky',
          slug: 'prevodovky',
          description:
            'Manuální a automatické převodovky po kompletní renovaci. Výměna všech opotřebovaných komponentů.',
          icon: 'settings',
          color: 'bg-gradient-to-br from-purple-500 to-purple-600',
          itemCount: '80+',
          featured: false,
        },
        {
          title: 'Motorové hlavy',
          slug: 'motorove-hlavy',
          description: 'Repasované motorové hlavy s nově zabroušenými ventily a novými těsněními.',
          icon: 'wrench',
          color: 'bg-gradient-to-br from-orange-500 to-orange-600',
          itemCount: '120+',
          featured: false,
        },
        {
          title: 'Staré motory',
          slug: 'stare-motory',
          description:
            'Široký výběr starých motorů pro různé značky a modely vozidel. Ideální pro renovace a opravy.',
          icon: 'car',
          color: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
          itemCount: '300+',
          featured: true,
        },
      ],
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      categoryCount: 'categories',
    },
    prepare({heading, categoryCount}) {
      return {
        title: heading || 'Category Grid',
        subtitle: `${categoryCount?.length || 0} categories`,
      }
    },
  },
})

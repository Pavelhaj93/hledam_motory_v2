import {defineField, defineType} from 'sanity'
import {Users, Database, CheckCircle, MapPin, Star, Zap, Shield, Clock} from 'lucide-react'

export default defineType({
  name: 'benefitsSection',
  title: 'Benefits Section',
  type: 'object',
  icon: Star,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow Text',
      type: 'string',
      description: 'Small text above the main heading',
      initialValue: 'Proč?',
    }),
    defineField({
      name: 'heading',
      title: 'Main Heading',
      type: 'string',
      description: 'Main section heading',
      initialValue: 'Aplikace hledám díly?',
    }),
    defineField({
      name: 'benefits',
      title: 'Benefits List',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'benefit',
          title: 'Benefit',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Choose an icon for this benefit',
              options: {
                list: [
                  {title: 'Users', value: 'users'},
                  {title: 'Database', value: 'database'},
                  {title: 'Check Circle', value: 'checkCircle'},
                  {title: 'Map Pin', value: 'mapPin'},
                  {title: 'Star', value: 'star'},
                  {title: 'Zap', value: 'zap'},
                  {title: 'Shield', value: 'shield'},
                  {title: 'Clock', value: 'clock'},
                ],
                layout: 'dropdown',
              },
              initialValue: 'users',
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              description: 'Benefit title',
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              description: 'Benefit description',
              rows: 3,
            }),
          ],
          preview: {
            select: {
              title: 'title',
              icon: 'icon',
            },
            prepare({title, icon}) {
              return {
                title: title || 'Untitled benefit',
                subtitle: `Icon: ${icon}`,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).max(6),
    }),
    defineField({
      name: 'footerText',
      title: 'Footer Text',
      type: 'string',
      description: 'Text displayed below the benefits',
      initialValue: 'Připojte se k tisícům spokojených zákazníků',
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
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      description: 'Optional background image for the section',
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      benefitsCount: 'benefits',
    },
    prepare({heading, benefitsCount}) {
      const count = benefitsCount?.length || 0
      return {
        title: heading || 'Benefits Section',
        subtitle: `${count} benefits`,
      }
    },
  },
})

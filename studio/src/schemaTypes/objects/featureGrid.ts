import {defineField, defineType} from 'sanity'
import {HeartIcon} from '@sanity/icons'

/**
 * Feature Grid section for displaying key features/benefits.
 * Shows a grid of features with icons, titles, and descriptions.
 */

export const featureGrid = defineType({
  name: 'featureGrid',
  title: 'Feature Grid',
  type: 'object',
  icon: HeartIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      initialValue: 'Proč si vybrat nás?',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subheading',
      title: 'Section Subheading',
      type: 'text',
      rows: 2,
      initialValue: 'Jsme lídrem v oblasti repasovaných automobilových dílů s dlouholetou tradicí',
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Feature Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                list: [
                  {title: 'Shield (Protection)', value: 'shield'},
                  {title: 'Wrench (Tool)', value: 'wrench'},
                  {title: 'Package (Delivery)', value: 'package'},
                  {title: 'Star (Quality)', value: 'star'},
                  {title: 'Clock (Speed)', value: 'clock'},
                  {title: 'Users (Team)', value: 'users'},
                  {title: 'CheckCircle (Verified)', value: 'checkCircle'},
                  {title: 'Truck (Shipping)', value: 'truck'},
                ],
              },
              initialValue: 'shield',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
            },
          },
        },
      ],
      initialValue: [
        {
          icon: 'shield',
          title: 'Plná záruka kvality',
          description: 'Na všechny repasované díly poskytujeme 12měsíční záruku',
        },
        {
          icon: 'wrench',
          title: 'Profesionální renovace',
          description: 'Zkušení technici s dlouholetou praxí v oboru',
        },
        {
          icon: 'package',
          title: 'Rychlá expedice',
          description: 'Díly na skladě expedujeme do 24 hodin',
        },
        {
          icon: 'star',
          title: 'Kvalitní komponenty',
          description: 'Používáme pouze originální a ověřené náhradní díly',
        },
      ],
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      featureCount: 'features',
    },
    prepare({heading, featureCount}) {
      return {
        title: heading || 'Feature Grid',
        subtitle: `${featureCount?.length || 0} features`,
      }
    },
  },
})

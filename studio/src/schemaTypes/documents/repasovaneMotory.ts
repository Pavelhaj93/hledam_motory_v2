import {defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons'

/**
 * Repasované motory (Refurbished engines) document schema.
 * Each document represents one refurbished engine with full details.
 */

export const repasovaneMotory = defineType({
  name: 'repasovanyMotor',
  title: 'Repasované motory',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Název motoru',
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
      name: 'brand',
      title: 'Značka',
      type: 'reference',
      to: [{type: 'brand'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'engineCodes',
      title: 'Kódy motorů',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      description: 'Kompatibilní kódy motorů (např. 1.9 TDI, 2.0 FSI, atd.)',
    }),
    defineField({
      name: 'displacement',
      title: 'Objem motoru',
      type: 'string',
      description: 'Např. 1.9L, 2.0L',
    }),
    defineField({
      name: 'power',
      title: 'Výkon',
      type: 'string',
      description: 'Např. 90 kW, 110 HP',
    }),
    defineField({
      name: 'fuelType',
      title: 'Typ paliva',
      type: 'string',
      options: {
        list: [
          {title: 'Benzín', value: 'benzin'},
          {title: 'Diesel', value: 'diesel'},
          {title: 'Hybrid', value: 'hybrid'},
          {title: 'Elektro', value: 'elektro'},
        ],
      },
    }),
    defineField({
      name: 'description',
      title: 'Krátký popis',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(500),
      description: 'Stručný popis pro karty produktů a výpisy',
    }),
    defineField({
      name: 'detailedDescription',
      title: 'Detailní popis',
      type: 'blockContent',
      description: 'Úplný popis produktu s formátováním',
    }),
    defineField({
      name: 'images',
      title: 'Obrázky motoru',
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
              title: 'Alt text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'caption',
              title: 'Popisek',
              type: 'string',
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
      description: 'První obrázek bude použit jako hlavní obrázek produktu',
    }),
    defineField({
      name: 'price',
      title: 'Cena',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'currency',
      title: 'Měna',
      type: 'string',
      initialValue: 'CZK',
      readOnly: true,
      options: {
        list: [{title: 'CZK (Kč)', value: 'CZK'}],
      },
    }),
    defineField({
      name: 'specifications',
      title: 'Technické specifikace',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Název specifikace',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'value',
              title: 'Hodnota',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'value',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'compatibility',
      title: 'Kompatibilita vozidel',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      description: 'Kompatibilní modely vozidel, roky, motory atd.',
    }),
    defineField({
      name: 'warrantyPeriod',
      title: 'Záruční doba',
      type: 'string',
      description: 'Např. 12 měsíců, 24 měsíců',
    }),
    defineField({
      name: 'mileage',
      title: 'Nájezd',
      type: 'string',
      description: 'Původní nájezd motoru',
    }),
    defineField({
      name: 'condition',
      title: 'Stav',
      type: 'string',
      options: {
        list: [
          {title: 'Repasovaný', value: 'repasovany'},
          {title: 'Generálně opravený', value: 'generalka'},
          {title: 'Testovaný', value: 'testovany'},
        ],
      },
      initialValue: 'repasovany',
    }),
    defineField({
      name: 'relatedTurbochargers',
      title: 'Doporučená turbodmychadla',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'turbodmychadlo'}],
        },
      ],
      description:
        'Vyberte turbodmychadla, která se k tomuto motoru hodí a můžou být nabídnuta jako doplněk',
    }),
    defineField({
      name: 'inStock',
      title: 'Skladem',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'featured',
      title: 'Doporučený produkt',
      type: 'boolean',
      initialValue: false,
      description: 'Zobrazit tento produkt v doporučených sekcích',
    }),
    defineField({
      name: 'seo',
      title: 'SEO nastavení',
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
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'engineCode',
      media: 'images.0',
      brand: 'brand.name',
      inStock: 'inStock',
    },
    prepare(selection) {
      const {title, subtitle, media, brand, inStock} = selection
      return {
        title: title || 'Nepojmenovaný motor',
        subtitle: `${brand || 'Bez značky'} ${subtitle ? `• ${subtitle}` : ''} ${!inStock ? '• Není skladem' : ''}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Název A-Z',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
    {
      title: 'Značka',
      name: 'brand',
      by: [{field: 'brand.name', direction: 'asc'}],
    },
    {
      title: 'Cena od nejnižší',
      name: 'priceAsc',
      by: [{field: 'price', direction: 'asc'}],
    },
  ],
})

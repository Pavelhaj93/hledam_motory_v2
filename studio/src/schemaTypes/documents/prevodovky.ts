import {defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons'

/**
 * Převodovky (Transmissions) document schema.
 * Each document represents one transmission with full details.
 */

export const prevodovky = defineType({
  name: 'prevodovka',
  title: 'Převodovky',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Název převodovky',
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
      name: 'transmissionCode',
      title: 'Kód převodovky',
      type: 'string',
      description: 'Např. 02T, 01M, 01N, atd.',
    }),
    defineField({
      name: 'transmissionType',
      title: 'Typ převodovky',
      type: 'string',
      options: {
        list: [
          {title: 'Manuální', value: 'manualni'},
          {title: 'Automatická', value: 'automaticka'},
          {title: 'CVT', value: 'cvt'},
          {title: 'Sekvenční', value: 'sekvencni'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gearCount',
      title: 'Počet rychlostí',
      type: 'string',
      description: 'Např. 5, 6, 7, atd.',
    }),
    defineField({
      name: 'driveType',
      title: 'Pohon',
      type: 'string',
      options: {
        list: [
          {title: 'Přední', value: 'predni'},
          {title: 'Zadní', value: 'zadni'},
          {title: '4x4', value: '4x4'},
          {title: 'AWD', value: 'awd'},
        ],
      },
    }),
    defineField({
      name: 'description',
      title: 'Krátký popis',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(300),
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
      title: 'Obrázky převodovky',
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
      name: 'mileage',
      title: 'Nájezd',
      type: 'string',
      description: 'Nájezd převodovky v km',
    }),
    defineField({
      name: 'condition',
      title: 'Stav',
      type: 'string',
      options: {
        list: [
          {title: 'Nová', value: 'nova'},
          {title: 'Repasovaná', value: 'repasovana'},
          {title: 'Použitá - funkční', value: 'pouzita-funkcni'},
          {title: 'Na díly', value: 'na-dily'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fluidType',
      title: 'Typ oleje',
      type: 'string',
      description: 'Doporučený typ převodového oleje',
    }),
    defineField({
      name: 'warrantyPeriod',
      title: 'Záruční doba',
      type: 'string',
      description: 'Např. 12 měsíců, 24 měsíců',
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
      subtitle: 'transmissionType',
      media: 'images.0',
      brand: 'brand.name',
      inStock: 'inStock',
    },
    prepare(selection) {
      const {title, subtitle, media, brand, inStock} = selection
      const typeLabels: Record<string, string> = {
        manualni: 'Manuální',
        automaticka: 'Automatická',
        cvt: 'CVT',
        sekvencni: 'Sekvenční',
      }
      return {
        title: title || 'Nepojmenovaná převodovka',
        subtitle: `${brand || 'Bez značky'} ${subtitle ? `• ${typeLabels[subtitle] || subtitle}` : ''} ${!inStock ? '• Není skladem' : ''}`,
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

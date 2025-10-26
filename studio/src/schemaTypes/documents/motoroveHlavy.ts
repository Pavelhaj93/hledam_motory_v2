import {defineField, defineType} from 'sanity'
import {ComponentIcon} from '@sanity/icons'

/**
 * Motorové hlavy (Engine heads) document schema.
 * Each document represents one engine head with full details.
 */

export const motoroveHlavy = defineType({
  name: 'motorovaHlava',
  title: 'Motorové hlavy',
  type: 'document',
  icon: ComponentIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Název hlavy',
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
      name: 'valveCount',
      title: 'Počet ventilů',
      type: 'string',
      description: 'Např. 8V, 16V, 20V',
    }),
    defineField({
      name: 'material',
      title: 'Materiál',
      type: 'string',
      options: {
        list: [
          {title: 'Litina', value: 'litina'},
          {title: 'Hliník', value: 'hlinik'},
          {title: 'Slitina hliníku', value: 'slitina-hliniku'},
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
      title: 'Obrázky hlavy',
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
      name: 'includedComponents',
      title: 'Součásti v balení',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      description: 'Co je součástí dodávky (ventily, pružiny, apod.)',
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
      subtitle: 'valveCount',
      media: 'images.0',
      brand: 'brand.name',
      inStock: 'inStock',
    },
    prepare(selection) {
      const {title, subtitle, media, brand, inStock} = selection
      return {
        title: title || 'Nepojmenovaná hlava',
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

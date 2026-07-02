import {defineField, defineType} from 'sanity'
import {languageField, isUniquePerLanguage} from '../shared/i18n'
import {RocketIcon} from '@sanity/icons'

/**
 * Turbodmychadla (Turbochargers) document schema.
 * Each document represents one turbocharger with full details.
 */

export const turbodmychadla = defineType({
  name: 'turbodmychadlo',
  title: 'Turbodmychadla',
  type: 'document',
  icon: RocketIcon,
  fields: [
    languageField,
    defineField({
      name: 'name',
      title: 'Název turbodmychadla',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Celý název produktu, jak se zobrazí zákazníkům, např. „Turbodmychadlo Ford 2.2 TDCI GT1749V"',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description:
        'Formát: [značka]-[objem]-[palivo]-[kód-turba] → např. ford-2-2-tdci-gt1749v. Pokud jsou dvě turba se stejným kódem, přidej rok: ford-2-2-tdci-gt1749v-2018. Použij hlavní kód turba (ne celé číslo dílu).',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'name',
        maxLength: 96,
        isUnique: isUniquePerLanguage,
      },
    }),
    defineField({
      name: 'brand',
      title: 'Značka',
      type: 'reference',
      to: [{type: 'brand'}],
      validation: (Rule) => Rule.required(),
      description: 'Vyberte značku vozidla ze seznamu. Pokud značka chybí, nejprve ji vytvořte v sekci Značky.',
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
      name: 'turboCode',
      title: 'Kód turbodmychadla',
      type: 'string',
      description: 'Např. KKK, Garrett, IHI kód',
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
      name: 'manufacturer',
      title: 'Výrobce turbodmychadla',
      type: 'string',
      options: {
        list: [
          {title: 'Garrett', value: 'garrett'},
          {title: 'KKK (BorgWarner)', value: 'kkk'},
          {title: 'IHI', value: 'ihi'},
          {title: 'Mitsubishi', value: 'mitsubishi'},
          {title: 'Holset', value: 'holset'},
          {title: 'Jiný', value: 'jiny'},
        ],
      },
    }),
    defineField({
      name: 'description',
      title: 'Popis',
      type: 'blockContent',
      validation: (Rule) => Rule.required(),
      description: 'Popis produktu s formátováním, použitý na kartách produktů i na detailu produktu',
    }),
    defineField({
      name: 'images',
      title: 'Obrázky turbodmychadla',
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
              description: 'Popis obrázku pro vyhledávače a čtečky obrazovky – popište, co je na obrázku vidět, např. „Turbodmychadlo Garrett GT1749V pohled zprava"',
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
      hidden: true,
      options: {
        list: [
          {title: 'CZK (Kč)', value: 'CZK'},
          {title: 'EUR (€)', value: 'EUR'},
        ],
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
              description: 'Název parametru, např. „Výkon", „Objem motoru", „Emisní norma"',
            }),
            defineField({
              name: 'value',
              title: 'Hodnota',
              type: 'string',
              validation: (Rule) => Rule.required(),
              description: 'Hodnota parametru, např. „105 kW", „2,0 l", „Euro 5"',
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
          {title: 'Nové', value: 'nove'},
          {title: 'Repasované', value: 'repasovane'},
          {title: 'Použité - funkční', value: 'pouzite-funkcni'},
          {title: 'Na díly', value: 'na-dily'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mileage',
      title: 'Nájezd',
      type: 'string',
      description: 'Nájezd turbodmychadla v km (pokud použité)',
    }),
    defineField({
      name: 'boostPressure',
      title: 'Tlak doběhu',
      type: 'string',
      description: 'Maximální tlak doběhu v bar',
    }),
    defineField({
      name: 'oilType',
      title: 'Typ oleje',
      type: 'string',
      description: 'Doporučený typ oleje pro turbodmychadlo',
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
      subtitle: 'turboCode',
      media: 'images.0',
      brand: 'brand.name',
      inStock: 'inStock',
    },
    prepare(selection) {
      const {title, subtitle, media, brand, inStock} = selection
      return {
        title: title || 'Nepojmenované turbodmychadlo',
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

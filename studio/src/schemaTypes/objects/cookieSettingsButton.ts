import {defineField, defineType} from 'sanity'

export const cookieSettingsButton = defineType({
  name: 'cookieSettingsButton',
  title: 'Tlačítko nastavení cookies',
  type: 'object',
  fields: [
    defineField({
      name: 'buttonText',
      title: 'Text tlačítka',
      type: 'string',
      initialValue: 'Změnit nastavení cookies',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {buttonText: 'buttonText'},
    prepare({buttonText}) {
      return {title: buttonText || 'Tlačítko nastavení cookies'}
    },
  },
})

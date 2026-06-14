import {defineQuery} from 'next-sanity'

// Category-specific field definitions
const repasovanyMotorFields = /* groq */ `
  _id,
  name,
  "slug": slug.current,
  "brand": brand->{
    name,
    "slug": slug.current,
    logo
  },
  engineCodes,
  displacement,
  power,
  fuelType,
  description,
  "mainImage": images[0],
  price,
  "currency": select(language == "de-AT" => "EUR", "CZK"),
  inStock,
  featured,
  specifications[] {
    label,
    value
  },
  compatibility,
  warrantyPeriod,
  mileage,
  condition,
  "relatedTurbochargers": relatedTurbochargers[]->{
    _id,
    name,
    "slug": slug.current,
    "brand": brand->name,
    "mainImage": images[0],
    price,
    "currency": select(language == "de-AT" => "EUR", "CZK"),
    inStock,
    turboCode,
    condition
  }
`

const staryMotorFields = /* groq */ `
  _id,
  name,
  "slug": slug.current,
  "brand": brand->{
    name,
    "slug": slug.current,
    logo
  },
  engineCodes,
  displacement,
  power,
  fuelType,
  description,
  "mainImage": images[0],
  price,
  "currency": select(language == "de-AT" => "EUR", "CZK"),
  inStock,
  featured,
  specifications[] {
    label,
    value
  },
  compatibility,
  mileage,
  year,
  condition,
  damageDescription,
  "relatedTurbochargers": relatedTurbochargers[]->{
    _id,
    name,
    "slug": slug.current,
    "brand": brand->name,
    "mainImage": images[0],
    price,
    "currency": select(language == "de-AT" => "EUR", "CZK"),
    inStock,
    turboCode,
    condition
  }
`

const motorovaHlavaFields = /* groq */ `
  _id,
  name,
  "slug": slug.current,
  "brand": brand->{
    name,
    "slug": slug.current,
    logo
  },
  engineCodes,
  valveCount,
  material,
  description,
  "mainImage": images[0],
  price,
  "currency": select(language == "de-AT" => "EUR", "CZK"),
  inStock,
  featured,
  specifications[] {
    label,
    value
  },
  compatibility,
  condition,
  includedComponents,
  warrantyPeriod
`

const prevodovkaFields = /* groq */ `
  _id,
  name,
  "slug": slug.current,
  "brand": brand->{
    name,
    "slug": slug.current,
    logo
  },
  engineCodes,
  transmissionCode,
  transmissionType,
  gearCount,
  driveType,
  description,
  "mainImage": images[0],
  price,
  "currency": select(language == "de-AT" => "EUR", "CZK"),
  inStock,
  featured,
  specifications[] {
    label,
    value
  },
  compatibility,
  mileage,
  condition,
  fluidType,
  warrantyPeriod
`

const turbodmychadloFields = /* groq */ `
  _id,
  name,
  "slug": slug.current,
  "brand": brand->{
    name,
    "slug": slug.current,
    logo
  },
  engineCodes,
  turboCode,
  displacement,
  power,
  manufacturer,
  description,
  "mainImage": images[0],
  price,
  "currency": select(language == "de-AT" => "EUR", "CZK"),
  inStock,
  featured,
  specifications[] {
    label,
    value
  },
  compatibility,
  condition,
  mileage,
  boostPressure,
  oilType,
  warrantyPeriod
`

export const settingsQuery = defineQuery(`*[_type == "settings" && language == $locale][0]{title, phone, description, ogImage}`)

export const homepageQuery = defineQuery(`
  *[_type == "homepage" && language == $locale][0]{
    _id,
    _type,
    title,
    seo,
    "pageBuilder": pageBuilder[]{
      ...,
      _type == "callToAction" => {
        ...,
        link {
          ...,
          _type == "link" => {
            "page": page->slug.current,
            "post": post->slug.current
          }
        }
      },
      _type == "infoSection" => {
        ...,
        content[]{
          ...,
          markDefs[]{
            ...,
            _type == "link" => {
              "page": page->slug.current,
              "post": post->slug.current
            }
          }
        }
      },
      _type == "heroSection" => {
        ...,
        primaryButton {
          ...,
          link {
            ...,
            _type == "link" => {
              "page": page->slug.current,
              "post": post->slug.current
            }
          }
        },
        secondaryButton {
          ...,
          link {
            ...,
            _type == "link" => {
              "page": page->slug.current,
              "post": post->slug.current
            }
          }
        }
      },
      _type == "heroSectionCarousel" => {
        ...,
        primaryButton {
          ...,
          link {
            ...,
            _type == "link" => {
              "page": page->slug.current,
              "post": post->slug.current
            }
          }
        },
        secondaryButton {
          ...,
          link {
            ...,
            _type == "link" => {
              "page": page->slug.current,
              "post": post->slug.current
            }
          }
        }
      },
      _type == "productShowcase" => {
        ...
      },
      _type == "contactSection" => {
        ...,
        contactInfo {
          email,
          "phone": coalesce(*[_type == "settings" && language == $locale][0].phone, phone),
          address,
          companyName,
          vatNumber
        },
        formConfiguration {
          submitButtonText,
          successMessage
        }
      },
      _type == "homepageTeaserSection" => {
        ...,
        primaryButton {
          ...,
          link {
            ...,
            _type == "link" => {
              "page": page->slug.current,
              "post": post->slug.current
            }
          }
        },
        secondaryButton {
          ...,
          link {
            ...,
            _type == "link" => {
              "page": page->slug.current,
              "post": post->slug.current
            }
          }
        },
        "products": *[_type == "repasovanyMotor" && language == $locale] | order(_createdAt desc)[0...15]{
          _id,
          _type,
          name,
          "slug": slug.current,
          images[],
          price,
          description,
          brand->{
            name,
            logo
          },
          category
        }
      },
      _type == "howItWorksSection" => {
        ...,
        ctaLink {
          ...,
          _type == "link" => {
            "page": page->slug.current,
            "post": post->slug.current
          }
        }
      },
      _type == "benefitsSection" => {
        ...,
        primaryButton {
          ...,
          link {
            ...,
            _type == "link" => {
              "page": page->slug.current,
              "post": post->slug.current
            }
          }
        }
      },
      _type == "richTextSection" => {
        ...,
        content[]{
          ...,
          markDefs[]{
            ...,
            _type == "link" => {
              "page": page->slug.current,
              "post": post->slug.current
            }
          }
        }
      },
      _type == "categoryGrid" => {
        ...,
        categories[]{
          ...,
          "itemCount": select(
            slug == "repasovane-motory" => count(*[_type == "repasovanyMotor" && language == $locale]),
            slug == "stare-motory" => count(*[_type == "staryMotor" && language == $locale]),
            slug == "motorove-hlavy" => count(*[_type == "motorovaHlava" && language == $locale]),
            slug == "prevodovky" => count(*[_type == "prevodovka" && language == $locale]),
            slug == "turbodmychadla" => count(*[_type == "turbodmychadlo" && language == $locale]),
            0
          )
        }
      },
    },
  }
`)

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "author": author->{firstName, lastName, picture},
`

const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->slug.current,
    "post": post->slug.current
  }
`

const linkFields = /* groq */ `
  link {
      ...,
      ${linkReference}
      }
`

export const getPageQuery = defineQuery(`
  *[_type == "page" && language == $locale && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    heading,
    subheading,
    "pageBuilder": pageBuilder[]{
      ...,
      _type == "callToAction" => {
        ${linkFields},
      },
      _type == "infoSection" => {
        content[]{
          ...,
          markDefs[]{
            ...,
            ${linkReference}
          }
        }
      },
      _type == "heroSection" => {
        ...,
        primaryButton {
          ...,
          ${linkFields}
        },
        secondaryButton {
          ...,
          ${linkFields}
        }
      },
      _type == "heroSectionCarousel" => {
        ...,
        primaryButton {
          ...,
          ${linkFields}
        },
        secondaryButton {
          ...,
          ${linkFields}
        }
      },
      _type == "productShowcase" => {
        ...
      },
      _type == "contactSection" => {
        ...,
        contactInfo {
          email,
          "phone": coalesce(*[_type == "settings" && language == $locale][0].phone, phone),
          address,
          companyName,
          vatNumber
        },
        formConfiguration {
          submitButtonText,
          successMessage
        }
      },
      _type == "homepageTeaserSection" => {
        ...,
        primaryButton {
          ...,
          link {
            ${linkFields}
          }
        },
        secondaryButton {
          ...,
          link {
            ${linkFields}
          }
        },
        "products": *[_type in ["repasovanyMotor", "staryMotor", "motorovaHlava", "prevodovka", "turbodmychadlo"] && language == $locale] | order(_createdAt desc)[0...10]{
          _id,
          _type,
          name,
          "slug": slug.current,
          images[],
          price,
          description,
          brand->{
            name,
            logo
          },
          category
        }
      },
      _type == "howItWorksSection" => {
        ...,
        ctaLink {
          ...,
          _type == "link" => {
            "page": page->slug.current,
            "post": post->slug.current
          }
        }
      },
      _type == "benefitsSection" => {
        ...,
        primaryButton {
          ...,
          link {
            ...,
            _type == "link" => {
              "page": page->slug.current,
              "post": post->slug.current
            }
          }
        }
      },
      _type == "richTextSection" => {
        ...,
        content[]{
          ...,
          markDefs[]{
            ...,
            _type == "link" => {
              "page": page->slug.current,
              "post": post->slug.current
            }
          }
        }
      },
      _type == "categoryGrid" => {
        ...,
        categories[]{
          ...,
          "itemCount": select(
            slug == "repasovane-motory" => count(*[_type == "repasovanyMotor" && language == $locale]),
            slug == "stare-motory" => count(*[_type == "staryMotor" && language == $locale]),
            slug == "motorove-hlavy" => count(*[_type == "motorovaHlava" && language == $locale]),
            slug == "prevodovky" => count(*[_type == "prevodovka" && language == $locale]),
            slug == "turbodmychadla" => count(*[_type == "turbodmychadlo" && language == $locale]),
            0
          )
        }
      },
    },
  }
`)

export const sitemapData = defineQuery(`
  *[(_type == "page" || _type == "post") && language == "cs" && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
    "language": language,
    "alt": *[_type == "translation.metadata" && references(^._id)][0].translations[_key != "cs"][0].value->{"slug": slug.current, "language": language}
  }
`)

export const sitemapProductsData = defineQuery(`
  *[_type in ["repasovanyMotor", "staryMotor", "motorovaHlava", "prevodovka", "turbodmychadlo"] && language == "cs" && defined(slug.current)] {
    "slug": slug.current,
    _type,
    _updatedAt,
    "language": language,
    "alt": *[_type == "translation.metadata" && references(^._id)][0].translations[_key != "cs"][0].value->{"slug": slug.current, "language": language}
  }
`)

export const allPostsQuery = defineQuery(`
  *[_type == "post" && language == $locale && defined(slug.current)] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`)

export const morePostsQuery = defineQuery(`
  *[_type == "post" && language == $locale && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`)

export const postQuery = defineQuery(`
  *[_type == "post" && language == $locale && slug.current == $slug] [0] {
    content[]{
    ...,
    markDefs[]{
      ...,
      ${linkReference}
    }
  },
    ${postFields}
  }
`)

export const postPagesSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  {"slug": slug.current, "language": language}
`)

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current, "language": language}
`)

// Brand-specific queries
export const allBrandsWithLogosQuery = defineQuery(`
  *[_type == "brand"] | order(isPopular desc, name asc) {
    _id,
    name,
    "slug": slug.current,
    logo,
    isPopular
  }
`)

export const popularBrandsWithLogosQuery = defineQuery(`
  *[_type == "brand" && isPopular == true] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    logo,
    isPopular
  }
`)

export const brandBySlugQuery = defineQuery(`
  *[_type == "brand" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    logo,
    isPopular
  }
`)

// Category-specific queries

// Repasované motory queries
export const allRepasovaneMotoryQuery = defineQuery(`
  *[_type == "repasovanyMotor" && language == $locale && defined(slug.current)] | order(name asc) {
    ${repasovanyMotorFields}
  }
`)

export const repasovanyMotorQuery = defineQuery(`
  *[_type == "repasovanyMotor" && language == $locale && slug.current == $slug] [0] {
    ${repasovanyMotorFields},
    detailedDescription,
    images[],
    seo,
    "altSlug": *[_type == "translation.metadata" && references(^._id)][0].translations[_key != $locale][0].value->{"slug": slug.current, "language": language}
  }
`)

export const repasovaneMotoryPagesSlugs = defineQuery(`
  *[_type == "repasovanyMotor" && defined(slug.current)]
  {"slug": slug.current, "language": language}
`)

// Staré motory queries
export const allStareMotoryQuery = defineQuery(`
  *[_type == "staryMotor" && language == $locale && defined(slug.current)] | order(name asc) {
    ${staryMotorFields}
  }
`)

export const staryMotorQuery = defineQuery(`
  *[_type == "staryMotor" && language == $locale && slug.current == $slug] [0] {
    ${staryMotorFields},
    detailedDescription,
    images[],
    seo,
    "altSlug": *[_type == "translation.metadata" && references(^._id)][0].translations[_key != $locale][0].value->{"slug": slug.current, "language": language}
  }
`)

export const stareMotoryPagesSlugs = defineQuery(`
  *[_type == "staryMotor" && defined(slug.current)]
  {"slug": slug.current, "language": language}
`)

// Motorové hlavy queries
export const allMotoroveHlavyQuery = defineQuery(`
  *[_type == "motorovaHlava" && language == $locale && defined(slug.current)] | order(name asc) {
    ${motorovaHlavaFields}
  }
`)

export const motorovaHlavaQuery = defineQuery(`
  *[_type == "motorovaHlava" && language == $locale && slug.current == $slug] [0] {
    ${motorovaHlavaFields},
    detailedDescription,
    images[],
    seo,
    "altSlug": *[_type == "translation.metadata" && references(^._id)][0].translations[_key != $locale][0].value->{"slug": slug.current, "language": language}
  }
`)

export const motoroveHlavyPagesSlugs = defineQuery(`
  *[_type == "motorovaHlava" && defined(slug.current)]
  {"slug": slug.current, "language": language}
`)

// Převodovky queries
export const allPrevodovkyQuery = defineQuery(`
  *[_type == "prevodovka" && language == $locale && defined(slug.current)] | order(name asc) {
    ${prevodovkaFields}
  }
`)

export const prevodovkaQuery = defineQuery(`
  *[_type == "prevodovka" && language == $locale && slug.current == $slug] [0] {
    ${prevodovkaFields},
    detailedDescription,
    images[],
    seo,
    "altSlug": *[_type == "translation.metadata" && references(^._id)][0].translations[_key != $locale][0].value->{"slug": slug.current, "language": language}
  }
`)

export const prevodovkyPagesSlugs = defineQuery(`
  *[_type == "prevodovka" && defined(slug.current)]
  {"slug": slug.current, "language": language}
`)

// Turbodmychadla queries
export const allTurbodmychadlaQuery = defineQuery(`
  *[_type == "turbodmychadlo" && language == $locale && defined(slug.current)] | order(name asc) {
    ${turbodmychadloFields}
  }
`)

export const turbodmychadloQuery = defineQuery(`
  *[_type == "turbodmychadlo" && language == $locale && slug.current == $slug] [0] {
    ${turbodmychadloFields},
    detailedDescription,
    images[],
    seo,
    "altSlug": *[_type == "translation.metadata" && references(^._id)][0].translations[_key != $locale][0].value->{"slug": slug.current, "language": language}
  }
`)

export const turbodmychadlaPagesSlugs = defineQuery(`
  *[_type == "turbodmychadlo" && defined(slug.current)]
  {"slug": slug.current, "language": language}
`)

// Latest products query for homepage teaser
export const latestProductsQuery = defineQuery(`
  *[_type in ["repasovanyMotor", "staryMotor", "motorovaHlava", "prevodovka", "turbodmychadlo"] && language == $locale] | order(_createdAt desc)[0...15]{
    _id,
    _type,
    name,
    "slug": slug.current,
    images[],
    price,
    description,
    brand->{
      name,
      logo
    },
    category
  }
`)

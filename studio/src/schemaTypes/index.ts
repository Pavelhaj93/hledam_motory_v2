import {person} from './documents/person'
import {page} from './documents/page'
import {post} from './documents/post'
import brand from './documents/brand'
import {repasovaneMotory} from './documents/repasovaneMotory'
import {stareMotory} from './documents/stareMotory'
import {motoroveHlavy} from './documents/motoroveHlavy'
import {prevodovky} from './documents/prevodovky'
import {turbodmychadla} from './documents/turbodmychadla'
import {callToAction} from './objects/callToAction'
import {infoSection} from './objects/infoSection'
import {heroSection} from './objects/heroSection'
import {productShowcase} from './objects/productShowcase'
import {contactSection} from './objects/contactSection'
import {richTextSection} from './objects/richTextSection'
import {howItWorksSection} from './objects/howItWorksSection'
import {homepageTeaserSection} from './objects/homepageTeaserSection'
import benefitsSection from './objects/benefitsSection'
import {settings} from './singletons/settings'
import {homepage} from './singletons/homepage'
import {link} from './objects/link'
import {blockContent} from './objects/blockContent'

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/schema-types

export const schemaTypes = [
  // Singletons
  settings,
  homepage,
  // Documents
  page,
  post,
  person,
  brand,
  // Category-specific documents
  repasovaneMotory,
  stareMotory,
  motoroveHlavy,
  prevodovky,
  turbodmychadla,
  // Objects
  blockContent,
  infoSection,
  callToAction,
  heroSection,
  productShowcase,
  contactSection,
  richTextSection,
  howItWorksSection,
  homepageTeaserSection,
  benefitsSection,
  link,
]

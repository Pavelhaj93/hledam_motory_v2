# Brand Management System

This document explains how to use the new Brand document system in Sanity for your engine parts catalog.

## What Changed

- **Brand Document**: Added a new `brand` document type with logos, descriptions, and metadata
- **Product Schema**: Changed the `brand` field from a string to a reference to the brand document
- **Enhanced SEO**: Brand pages now support logos and better structured data

## Brand Document Features

### Fields
- **Name**: Brand display name (e.g., "BMW", "Audi")
- **Slug**: URL-friendly identifier (e.g., "bmw", "audi")
- **Logo**: Brand logo image (with alt text)
- **Description**: Brand description for SEO and display
- **Website**: Official brand website URL
- **Country of Origin**: Where the brand originated
- **Founded**: Year the brand was established
- **Is Active**: Whether to show this brand in selectors
- **Sort Order**: Custom ordering for brand lists

## Setup Instructions

### 1. Import Sample Brands

First, you need to add brands to your Sanity dataset:

```bash
# In the studio directory
cd studio
npm run migrate-brands
```

This will:
- Import 10 common car brands (BMW, Audi, VW, Mercedes, etc.)
- Migrate existing products to use brand references

### 2. Add Brand Logos

1. Open Sanity Studio
2. Go to "Brands" section
3. Select each brand
4. Upload brand logos using the "Brand Logo" field
5. Add alt text for accessibility

### 3. Update Existing Products

The migration script will automatically convert string brands to references, but you can also:

1. Go to any Product in Sanity Studio
2. The "Brand" field is now a dropdown
3. Select from existing brands instead of typing

## Using Brand Components

### BrandSelector Component

Display brands with logos in your frontend:

```tsx
import BrandSelector from '@/app/components/BrandSelector'

// Grid layout with logos
<BrandSelector 
  category="repasovane-motory" 
  layout="grid" 
  showLogos={true}
/>

// Compact list for navigation
<BrandSelector 
  layout="compact" 
  maxBrands={6}
  showLogos={true}
/>

// List with descriptions
<BrandSelector 
  layout="list" 
  showDescriptions={true}
  showLogos={true}
/>
```

### Props
- `category`: Filter to category-specific brands
- `layout`: 'grid', 'list', or 'compact'
- `showLogos`: Display brand logos
- `showDescriptions`: Show brand descriptions
- `maxBrands`: Limit number of brands shown
- `className`: Additional CSS classes

## URL Structure

Brands now work with the SEO URL structure:

- `/repasovane-motory/bmw/` - BMW engines
- `/turbodmychadla/audi/` - Audi turbochargers  
- `/prevodovky/volkswagen/` - VW transmissions

## Queries

### Get All Brands with Logos
```groq
*[_type == "brand" && isActive == true] | order(sortOrder asc, name asc) {
  _id,
  name,
  "slug": slug.current,
  logo,
  description,
  countryOfOrigin
}
```

### Get Products by Brand
```groq
*[_type == "product" && brand->name == "BMW"] {
  name,
  "brand": brand->{name, logo},
  category,
  price
}
```

## Migration Notes

- The system is backward compatible during migration
- Products can have either string brands or brand references
- The ProductCatalog component handles both formats
- Run `npm run typegen` in frontend after schema changes

## Adding New Brands

1. In Sanity Studio, create new Brand document
2. Fill in required fields (name, slug)
3. Upload logo and add description
4. Set `isActive` to true
5. Products will now be able to select this brand

## Troubleshooting

### Products showing no brand
- Check if brand references are properly set
- Verify brand documents exist and are active
- Run the migration script if needed

### TypeScript errors
- Run `npm run typegen` in frontend directory
- Restart your development server
- Check that queries include brand references

### Missing logos
- Upload logos to brand documents in Sanity Studio
- Ensure alt text is provided for accessibility
- Logos should be square format for best display
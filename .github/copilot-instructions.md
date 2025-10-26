# Copilot Instructions for Next.js + Sanity Project

## Architecture Overview

This is a **monorepo** with two workspaces:
- `frontend/` - Next.js 15 app with Sanity integration
- `studio/` - Sanity Studio for content management

Key architectural patterns:
- **Live Content API**: Real-time content updates via `sanityFetch()` and `<SanityLive>` 
- **Visual Editing**: Draft mode + Presentation Tool for live preview editing
- **Page Builder**: Dynamic component rendering via `pageBuilder` field and `<BlockRenderer>`
- **Type Safety**: Auto-generated types from Sanity schemas via `sanity typegen generate`

## Development Workflows

### Starting Development
```bash
npm run dev  # Starts both frontend (3000) and studio (3333) concurrently
```

### Type Generation
Always run after schema changes:
```bash
cd frontend && npm run typegen  # Generates sanity.types.ts
```

### Sample Data
```bash
npm run import-sample-data  # Imports studio/sample-data.tar.gz
```

## Sanity Integration Patterns

### Data Fetching
Use `sanityFetch()` from `/sanity/lib/live.ts`, never direct client:
```tsx
const {data} = await sanityFetch({
  query: someQuery,
  params: {slug},
  perspective: 'published', // or 'previewDrafts' for drafts
  stega: false, // disable for metadata/static generation
})
```

### Schema Structure
- **Documents**: `page`, `post`, `person`, `product` in `/studio/src/schemaTypes/documents/`
- **Objects**: `callToAction`, `infoSection`, `heroSection`, `productShowcase` in `/studio/src/schemaTypes/objects/`  
- **Singletons**: `settings` in `/studio/src/schemaTypes/singletons/`

### Query Patterns
Define queries in `/frontend/sanity/lib/queries.ts` using:
- `defineQuery()` wrapper for type safety
- GROQ fragments for reusable field sets (e.g., `postFields`, `linkFields`)
- Link resolution pattern: `${linkReference}` for internal linking

## Page Builder System

Dynamic pages use `pageBuilder` array field with these components:
- `callToAction` - CTA blocks with internal/external links
- `infoSection` - Rich text content blocks
- `heroSection` - Large header sections with image, headline, and CTAs
- `productShowcase` - Product catalog grids referencing product documents

## Product Catalog Architecture

- **Product Documents**: Separate documents in `/studio/src/schemaTypes/documents/product.ts`
- **Product Pages**: Auto-generated at `/products/[slug]` route
- **Product Showcase**: Automatically displays all products (no manual selection needed)
- **Categories**: Pre-configured engine part categories (Engine Blocks, Pistons, etc.)
- **Specifications**: Structured key-value technical specs
- **Pricing**: Multi-currency support with stock status

Key files:
- `/frontend/app/products/[slug]/page.tsx` - Product detail pages
- `/frontend/app/components/ProductShowcase.tsx` - Product grid component
- `/frontend/sanity/lib/queries.ts` - Product queries that auto-fetch all products

## Visual Editing Setup

Critical components for live editing:
- `<SanityLive>` in layout.tsx - Enables live updates
- `<VisualEditing>` in draft mode - Studio integration
- `dataAttr()` utility - Adds Sanity editing attributes
- Draft mode API: `/frontend/app/api/draft-mode/enable/route.ts`

## Environment Configuration

Required environment variables:
- `SANITY_STUDIO_PROJECT_ID` - Sanity project ID
- `SANITY_STUDIO_DATASET` - Usually 'production'
- `SANITY_API_READ_TOKEN` - For private datasets
- `SANITY_STUDIO_PREVIEW_URL` - Frontend URL for previews (default: localhost:3000)

## Styling & Components

- **Tailwind CSS 4.x** with PostCSS configuration
- **Styled Components** enabled (SC_DISABLE_SPEEDY=false)
- Component structure follows atomic design with reusable blocks
- Typography handled via `@tailwindcss/typography` for rich text

## Key Files to Understand

- `/frontend/sanity/lib/live.ts` - Live content configuration
- `/frontend/app/layout.tsx` - Root layout with Sanity providers
- `/studio/sanity.config.ts` - Studio configuration with Presentation Tool
- `/frontend/sanity/lib/queries.ts` - All data queries
- `/studio/src/schemaTypes/index.ts` - Schema registry

When modifying schemas, always regenerate types and test in both Studio and frontend.
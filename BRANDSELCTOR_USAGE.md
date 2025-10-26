# BrandSelector Usage Guide

Here are the recommended places to use the BrandSelector component for maximum SEO and UX impact:

## 🏗️ **Architecture Overview**

The BrandSelector system uses a **server-client pattern**:
- **`BrandSelectorServer`** - Server component that fetches brands from Sanity
- **`BrandSelector`** - Client component that renders the UI with passed brands
- **Layout Integration** - Brands fetched in layout.tsx and passed to Header/Footer

## 📋 **Component Usage**

### **Server Components (Recommended)**
Use `BrandSelectorServer` for most pages:
```tsx
import BrandSelectorServer from '@/app/components/BrandSelectorServer'

<BrandSelectorServer 
  layout="grid"
  showLogos={true}
  maxBrands={12}
  className="mb-6"
/>
```

### **Client Components**
Use `BrandSelector` when brands are already available:
```tsx
import BrandSelector from '@/app/components/BrandSelector'

<BrandSelector 
  brands={brands}
  layout="grid"
  showLogos={true}
  maxBrands={12}
/>
```

## 1. 🏠 **Homepage/Landing Page**
```tsx
// Hero section with top brands
<BrandSelectorServer 
  layout="compact"
  showLogos={true}
  maxBrands={8}
  className="mt-8"
/>
```

## 2. 📋 **katalog Overview Page** ✅ IMPLEMENTED
```tsx
// Popular brands section
<BrandSelectorServer 
  layout="grid"
  showLogos={true}
  maxBrands={12}
  className="mb-6"
/>
```

## 3. ⚙️ **Category Pages** ✅ IMPLEMENTED
```tsx
// Category-specific brands (engines, turbos, etc.)
<BrandSelectorServer 
  category="repasovane-motory"
  layout="grid"
  showLogos={true}
  maxBrands={12}
/>
```

## 4. 🚗 **Brand-Specific Pages**
```tsx
// Related brands in same category
<BrandSelectorServer 
  category="repasovane-motory"
  layout="compact"
  showLogos={true}
  maxBrands={6}
  className="mt-8"
/>
```

## 5. 📱 **Header Navigation** ✅ IMPLEMENTED
```tsx
// Mobile mega menu (brands passed from layout)
<BrandSelector 
  brands={brands}
  layout="compact"
  showLogos={false}
  maxBrands={6}
  className="text-sm"
/>
```

## 6. 🦶 **Footer** ✅ IMPLEMENTED
```tsx
// Footer brand showcase (brands passed from layout)
<BrandSelector 
  brands={brands}
  layout="compact"
  showLogos={false}
  maxBrands={10}
  className="grid-cols-5 md:grid-cols-10"
/>
```

## 7. 🔍 **Search Results Page**
```tsx
// Filter by brand
<BrandSelector 
  layout="compact"
  showLogos={true}
  maxBrands={8}
  className="mb-4"
/>
```

## 8. 📄 **Product Detail Pages**
```tsx
// "Other [Brand] products" section
<BrandSelector 
  category="repasovane-motory"
  layout="list"
  showLogos={true}
  showDescriptions={true}
  maxBrands={5}
/>
```

## 9. 🎯 **Landing Pages**
```tsx
// SEO landing pages for specific searches
<BrandSelector 
  layout="grid"
  showLogos={true}
  showDescriptions={true}
/>
```

## Layout Recommendations

### **Grid Layout** - Best for:
- Main showcase areas
- Category pages
- Homepage sections
- When you have space

### **Compact Layout** - Best for:
- Navigation areas
- Sidebars
- Mobile menus
- Quick filters

### **List Layout** - Best for:
- Product detail pages
- Search results
- When descriptions are important
- Detailed brand information

## SEO Benefits

1. **Internal Linking**: Automatic links to brand pages
2. **Visual Appeal**: Logos improve click-through rates
3. **Brand Authority**: Shows you work with major brands
4. **User Experience**: Quick brand navigation
5. **Mobile Friendly**: Responsive layouts

## Performance Tips

- Use `maxBrands` to limit API calls
- Set `showLogos={false}` for text-only sections
- Use `layout="compact"` for mobile performance
- Consider lazy loading for below-fold placements

## Next Steps

1. Add to homepage hero section
2. Include in header mega menu
3. Add to product detail pages
4. Create brand landing pages
5. Add to search/filter areas
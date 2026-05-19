# ✅ Brand Schema Updated: `isPopular` Feature

## 🎯 **What Changed**

### **Schema Update:**

- ❌ **Removed**: `isActive` field
- ✅ **Added**: `isPopular` field (boolean, default: false)

### **Purpose:**

- **Popular Brands**: Featured in special sections (footer, katalog highlights)
- **Regular Brands**: Available in all brand listings but not prominently featured

## 🏷️ **Popular Brands (Auto-Marked)**

The migration script automatically marks these **20 popular brands**:

- **German**: BMW, Audi, Mercedes, Volkswagen, Opel
- **Japanese**: Toyota, Honda, Nissan, Mazda, Mitsubishi, Suzuki, Subaru
- **European**: Peugeot, Renault, Fiat, Skoda, Volvo
- **Korean**: Hyundai, Kia

These brands get:

- ✅ `isPopular: true`
- ✅ Lower `sortOrder` (1-20) for priority placement
- ✅ Featured in footer and katalog sections

## 📍 **Where Popular Brands Appear**

### **1. Footer - "Populární značky"**

```tsx
// Only shows popular brands (max 20)
<BrandSelector brands={popularBrands} layout="compact" maxBrands={20} />
```

### **2. katalog Page - "Populární značky"**

```tsx
// Shows popular brands with logos in grid
<BrandSelectorServer popularOnly={true} layout="grid" showLogos={true} />
```

### **3. Header Mobile Menu - "Populární značky"**

```tsx
// Quick access to popular brands in mobile menu
<BrandSelector brands={popularBrands} layout="compact" maxBrands={6} />
```

## 🔄 **New Queries**

### **All Brands Query:**

```groq
*[_type == "brand"] | order(sortOrder asc, name asc)
```

### **Popular Brands Only Query:**

```groq
*[_type == "brand" && isPopular == true] | order(sortOrder asc, name asc)
```

## ⚙️ **BrandSelectorServer Props**

### **New `popularOnly` Prop:**

```tsx
type BrandSelectorServerProps = {
  popularOnly?: boolean // NEW: Show only popular brands
  category?: string
  layout?: 'grid' | 'list' | 'compact'
  showLogos?: boolean
  maxBrands?: number
  className?: string
}
```

### **Usage Examples:**

**Show All Brands:**

```tsx
<BrandSelectorServer layout="grid" showLogos={true} />
```

**Show Popular Brands Only:**

```tsx
<BrandSelectorServer popularOnly={true} layout="grid" showLogos={true} />
```

## 📊 **Brand Priority System**

### **Popular Brands (sortOrder 1-20):**

- BMW, Audi, Mercedes, Volkswagen...
- Appear first in all listings
- Featured in special sections

### **Regular Brands (sortOrder 100+):**

- Morris, ARO, Vanden Plas...
- Available in complete brand listings
- Not featured in highlights

## 🚀 **Migration Results**

After running `npm run migrate-brands-json`:

```
✅ Created: BMW (isPopular: true, sortOrder: 1)
✅ Created: Audi (isPopular: true, sortOrder: 2)
✅ Created: Mercedes (isPopular: true, sortOrder: 3)
...
✅ Created: Morris (isPopular: false, sortOrder: 121)
✅ Created: ARO (isPopular: false, sortOrder: 122)
```

## 🎨 **Visual Impact**

### **Before:**

- All brands treated equally
- No featured brand sections
- Generic brand navigation

### **After:**

- **Popular brands** prominently featured
- **Footer showcase** of top brands
- **katalog highlights** for popular brands
- **Mobile menu** quick access to popular brands

## ✅ **Benefits**

### **User Experience:**

- ✅ Quick access to popular automotive brands
- ✅ Featured brands in key navigation areas
- ✅ Better brand discoverability

### **Business Value:**

- ✅ Highlight partnerships with major brands
- ✅ Drive traffic to popular brand pages
- ✅ Professional brand presentation

### **Technical:**

- ✅ Flexible brand categorization system
- ✅ Easy to manage in Sanity Studio
- ✅ Scalable for future brand additions

## 🔧 **How to Change Popular Brands**

### **In Sanity Studio:**

1. Go to "Brands" section
2. Select any brand
3. Toggle "Is Popular Brand" field
4. Save changes

### **In Migration Script:**

Edit the `popularBrands` array in `migrate-brands-from-json.js`

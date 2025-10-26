import {sanityFetch} from '@/sanity/lib/live'
import {allBrandsWithLogosQuery, popularBrandsWithLogosQuery} from '@/sanity/lib/queries'
import BrandSelector from './BrandSelector'

type BrandSelectorServerProps = {
  category?: string
  layout?: 'grid' | 'list' | 'compact'
  showLogos?: boolean
  showDescriptions?: boolean
  maxBrands?: number
  className?: string
  popularOnly?: boolean
}

export default async function BrandSelectorServer(props: BrandSelectorServerProps) {
  try {
    const query = props.popularOnly ? popularBrandsWithLogosQuery : allBrandsWithLogosQuery

    const {data: brands} = await sanityFetch({
      query: query,
      stega: false,
    })

    return <BrandSelector brands={brands || []} {...props} />
  } catch (error) {
    console.error('Error fetching brands:', error)
    return (
      <div className={`text-center py-8 text-gray-500 ${props.className || ''}`}>
        <p>Error loading brands</p>
      </div>
    )
  }
}

export interface OriginalProduct {
  id: string
  ean: string
  slug: string
  brand: string
  limit: number
  badges: Badges
  origin: string | null
  photos: Photo[]
  status: string | null
  details: ProductDetails
  is_bulk: boolean
  packaging: string
  published: boolean
  share_url: string
  thumbnail: string
  categories: Category[]
  extra_info: Array<any | null>
  display_name: string
  unavailable_from: string | null
  is_variable_weight: boolean
  price_instructions: PriceInstructions
  unavailable_weekdays: number[]
  nutrition_information: NutritionInformation
}

interface Badges {
  is_water: boolean
  requires_age_check: boolean
}

interface Photo {
  zoom: string
  regular: string
  thumbnail: string
  perspective: number
}

interface ProductDetails {
  brand: string
  origin: string | null
  suppliers: Supplier[]
  legal_name: string | null
  description: string
  counter_info: string | null
  danger_mentions: string | null
  alcohol_by_volume: string | null
  mandatory_mentions: string | null
  production_variant: string | null
  usage_instructions: string | null
  storage_instructions: string | null
}

interface Supplier {
  name: string
}

interface Category {
  id: number
  name: string
  level: number
  order: number
  categories?: Category[]
}

interface PriceInstructions {
  iva: number
  is_new: boolean
  is_pack: boolean
  pack_size: number | null
  unit_name: string | null
  unit_size: number
  bulk_price: string
  unit_price: string
  approx_size: boolean
  size_format: string
  total_units: number | null
  unit_selector: boolean
  bunch_selector: boolean
  drained_weight: number | null
  selling_method: number
  price_decreased: boolean
  reference_price: string
  min_bunch_amount: number
  reference_format: string
  previous_unit_price: string | null
  increment_bunch_amount: number
}

interface NutritionInformation {
  allergens: string | null
  ingredients: string | null
}

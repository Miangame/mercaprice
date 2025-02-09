export interface Product {
  badges: Badges
  brand: string
  categories: Category[]
  details: ProductDetails
  display_name: string
  ean: string
  extra_info: Array<any | null>
  id: string
  is_bulk: boolean
  is_variable_weight: boolean
  limit: number
  nutrition_information: NutritionInformation
  origin: string
  packaging: string
  photos: Photo[]
  price_instructions: PriceInstructions
  published: boolean
  share_url: string
  slug: string
  status?: string
  thumbnail: string
  unavailable_from?: string
  unavailable_weekdays: number[]
}

interface Badges {
  is_water: boolean
  requires_age_check: boolean
}

interface Category {
  categories?: Category[]
  id: number
  level: number
  name: string
  order: number
}

interface NutritionInformation {
  allergens: string
  ingredients: string
}

interface Photo {
  perspective: number
  regular: string
  thumbnail: string
  zoom: string
}

interface PriceInstructions {
  approx_size: boolean
  bulk_price: string
  bunch_selector: boolean
  drained_weight?: number
  increment_bunch_amount: number
  is_new: boolean
  is_pack: boolean
  iva: number
  min_bunch_amount: number
  pack_size?: number
  price_decreased: boolean
  previous_unit_price?: string
  reference_format: string
  reference_price: string
  selling_method: number
  size_format: string
  total_units?: number
  unit_name?: string
  unit_price: string
  unit_selector: boolean
  unit_size: number
}

interface ProductDetails {
  alcohol_by_volume?: string
  brand: string
  counter_info?: string
  danger_mentions: string
  description: string
  legal_name: string
  mandatory_mentions: string
  origin: string
  production_variant: string
  storage_instructions: string
  suppliers: Supplier[]
  usage_instructions: string
}

interface Supplier {
  name: string
}

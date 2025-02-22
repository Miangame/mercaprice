export interface OpenFoodFactsResponse {
  code: string
  product: Product
  status: number
  status_verbose: string
}

interface Product {
  _id: string
  _keywords: string[]
  brands: string
  brands_tags: string[]
  categories: string
  categories_hierarchy: string[]
  categories_lc: string
  categories_old: string
  categories_properties: CategoriesProperties
  categories_properties_tags: string[]
  categories_tags: string[]
  code: string
  countries: string
  countries_hierarchy: string[]
  countries_lc: string
  countries_tags: string[]
  created_t: number
  creator: string
  ecosystem_data?: EcosystemData
  ecosystem_grade?: string
  ecosystem_score?: number
  ecosystem_tags?: string[]
  images: Record<string, ProductImage>
  ingredients: Ingredient[]
  nutriments: Nutriments
  nutriscore: Nutriscore
  product_name: string
  quantity: string
  stores: string
  stores_tags: string[]
  packaging: string
}

interface CategoriesProperties {
  'agribalyse_food_code:en'?: string
  'ciqual_food_code:en'?: string
}

interface EcosystemData {
  grade: string
  score: number
}

interface ProductImage {
  sizes: {
    [size: string]: {
      h: number
      w: number
    }
  }
  uploaded_t: string
  uploader: string
}

interface Ingredient {
  id: string
  text: string
  percent: number
  vegan?: string
  vegetarian?: string
  ingredients?: SubIngredient[]
}

interface SubIngredient {
  id: string
  text: string
  percent?: number
}

export interface Nutriments {
  carbohydrates: number
  carbohydrates_100g: number
  carbohydrates_unit: string
  carbohydrates_value: number

  energy: number
  'energy-kcal': number
  'energy-kcal_100g': number
  'energy-kcal_unit': string
  'energy-kcal_value': number
  'energy-kcal_value_computed': number
  energy_100g: number
  energy_unit: string
  energy_value: number

  fat: number
  fat_100g: number
  fat_unit: string
  fat_value: number

  fiber: number
  fiber_100g: number
  fiber_unit: string
  fiber_value: number

  'fruits-vegetables-legumes-estimate-from-ingredients_100g': number
  'fruits-vegetables-legumes-estimate-from-ingredients_serving': number
  'fruits-vegetables-nuts-estimate-from-ingredients_100g': number
  'fruits-vegetables-nuts-estimate-from-ingredients_serving': number

  'nova-group': number
  'nova-group_100g': number
  'nova-group_serving': number

  'nutrition-score-fr': number
  'nutrition-score-fr_100g': number

  proteins: number
  proteins_100g: number
  proteins_unit: string
  proteins_value: number

  salt: number
  salt_100g: number
  salt_unit: string
  salt_value: number

  'saturated-fat': number
  'saturated-fat_100g': number
  'saturated-fat_unit': string
  'saturated-fat_value': number

  sodium: number
  sodium_100g: number
  sodium_unit: string
  sodium_value: number

  sugars: number
  sugars_100g: number
  sugars_unit: string
  sugars_value: number
}

interface Nutriscore {
  grade: string
  score: number
  components: {
    negative: NutriscoreComponent[]
    positive: NutriscoreComponent[]
  }
}

interface NutriscoreComponent {
  id: string
  points: number
  unit: string
  value: number
}

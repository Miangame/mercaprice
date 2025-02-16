import { PriceHistory, Product } from '@prisma/client'

export type ProductWithPrice = Product &
  Pick<PriceHistory, 'unitPrice'> &
  Pick<PriceHistory, 'bulkPrice'>

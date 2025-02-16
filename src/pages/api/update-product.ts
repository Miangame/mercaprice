import { NextApiRequest, NextApiResponse } from 'next'

import { OriginalProduct } from '@/types/OriginalProduct'
import { ProductWithPrice } from '@/types/ProductWithPrice'
import { prisma } from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const {
    data,
    originalData: currentData
  }: { data: ProductWithPrice; originalData: OriginalProduct } = req.body

  if (!data || !currentData) {
    return res.status(400).json({ error: 'Invalid data' })
  }

  try {
    const currentUnitPrice = parseFloat(
      currentData.price_instructions.unit_price || '0'
    )
    const currentBulkPrice = parseFloat(
      currentData.price_instructions.bulk_price || '0'
    )

    if (
      data.unitPrice !== currentUnitPrice ||
      data.bulkPrice !== currentBulkPrice
    ) {
      await prisma.priceHistory.create({
        data: {
          productId: data.id,
          unitPrice: currentUnitPrice,
          bulkPrice: currentBulkPrice
        }
      })

      console.log('Price history updated')
    }

    if (data.displayName !== currentData.display_name) {
      await prisma.product.update({
        where: { id: data.id },
        data: { displayName: currentData.display_name }
      })

      console.log('Product name updated')
    }

    if (
      currentData.photos[0] &&
      currentData.photos[0].regular &&
      data.image !== currentData.photos[0].regular
    ) {
      await prisma.product.update({
        where: { id: data.id },
        data: { image: currentData.thumbnail }
      })

      console.log('Product image updated')
    }

    return res.status(200).json({ message: 'Product updated' })
  } catch (error) {
    console.error('Error updating product:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

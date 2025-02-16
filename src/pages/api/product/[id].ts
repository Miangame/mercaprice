import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid ID' })
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id, deletedAt: null },
      include: {
        priceHistory: {
          orderBy: { recordedAt: 'desc' },
          take: 1
        }
      }
    })

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    const lastPrice =
      product.priceHistory.length > 0 ? product.priceHistory[0] : null

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { priceHistory, ...productWithoutHistory } = product

    return res.status(200).json({
      ...productWithoutHistory,
      unitPrice: lastPrice?.unitPrice || null,
      bulkPrice: lastPrice?.bulkPrice || null
    })
  } catch (error) {
    console.error('Error getting product:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

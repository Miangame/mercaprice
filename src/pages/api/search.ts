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

  const { query } = req.query

  if (!query || typeof query !== 'string') {
    return res
      .status(400)
      .json({ error: 'Query parameter is required and must be a string' })
  }

  try {
    const searchQuery = query
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .split(' ')
      .join(' & ')

    const products = await prisma.$queryRaw`
      SELECT "Product"."id", "Product"."displayName", "Product"."image", "Product"."externalId", "Product"."deletedAt"
      FROM "Product"
      WHERE "Product"."searchvector" @@ to_tsquery('spanish', ${searchQuery})
      ORDER BY ts_rank("Product"."searchvector", to_tsquery('spanish', ${searchQuery})) DESC
    `

    return res.status(200).json(products)
  } catch (error) {
    console.error('Error searching products:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

import { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '@/lib/prisma'

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
      SELECT 
        "p"."id", 
        "p"."displayName", 
        "p"."image", 
        "p"."externalId", 
        "p"."deletedAt",
        "p"."referenceFormat",
        "ph"."unitPrice",
        "ph"."bulkPrice"
      FROM "Product" AS "p"
      LEFT JOIN (
        SELECT DISTINCT ON ("productId") "productId", "unitPrice", "bulkPrice"
        FROM "PriceHistory"
        ORDER BY "productId", "recordedAt" DESC
      ) AS "ph" ON "p"."id" = "ph"."productId"
      WHERE "p"."searchvector" @@ to_tsquery('spanish', ${searchQuery})
      AND "p"."deletedAt" IS NULL
      ORDER BY ts_rank("p"."searchvector", to_tsquery('spanish', ${searchQuery})) DESC;
    `

    return res.status(200).json(products)
  } catch (error) {
    console.error('Error searching products:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

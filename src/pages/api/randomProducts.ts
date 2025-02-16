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

  const limit = Number(req.query.limit) || 10
  const maxLimit = 50
  const finalLimit = Math.min(limit, maxLimit)

  try {
    const products = await prisma.$queryRaw`
      SELECT
        "p"."id", 
        "p"."displayName", 
        "p"."image", 
        "p"."externalId", 
        "p"."deletedAt",
        "ph"."unitPrice",
        "ph"."bulkPrice"
      FROM "Product" AS "p"
      LEFT JOIN (
        SELECT DISTINCT ON ("productId") "productId", "unitPrice", "bulkPrice"
        FROM "PriceHistory"
        ORDER BY "productId", "recordedAt" DESC
      ) AS "ph" ON "p"."id" = "ph"."productId"
      WHERE "deletedAt" IS NULL
      ORDER BY RANDOM()
      LIMIT ${finalLimit};
    `

    return res.status(200).json(products)
  } catch (error) {
    console.error('Error getting random products:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

import { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '@/lib/prisma'

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
    const priceHistory = await prisma.priceHistory.findMany({
      where: { productId: id },
      orderBy: { recordedAt: 'asc' }
    })

    if (!priceHistory.length) {
      return res.status(404).json({ error: 'Price history not found' })
    }

    return res.status(200).json(priceHistory)
  } catch (error) {
    console.error('Error getting prices history:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

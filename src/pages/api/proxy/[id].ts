import { NextApiRequest, NextApiResponse } from 'next'

import { MERCADONA_PRODUCTS_API_URL } from '@/constants/urls'

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
    const response = await fetch(`${MERCADONA_PRODUCTS_API_URL}/${id}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Can`t get product' })
    }

    const data = await response.json()
    return res.status(200).json(data)
  } catch (error) {
    console.error('Error getting data:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

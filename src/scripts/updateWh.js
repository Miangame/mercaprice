const fs = require('fs')

const axios = require('axios')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const readPostalCodes = () => {
  const postalCodesList = []

  fs.readdirSync('./src/data/postalCodes').forEach((file) => {
    if (file.endsWith('.txt')) {
      const postalCodes = fs.readFileSync(
        `./src/data/postalCodes/${file}`,
        'utf8'
      )

      const lines = postalCodes.split('\n')
      for (const line of lines) {
        const [postalCode, city] = line.split(':')

        if (postalCode && city) {
          postalCodesList.push(postalCode)
        }
      }
    }
  })

  const postalCodesWithoutDuplicates = [...new Set(postalCodesList)]

  console.log('Postal codes processed:', postalCodesWithoutDuplicates.length)

  return postalCodesWithoutDuplicates
}

const getWhByPostalCode = async (postalCode) => {
  const url = 'https://tienda.mercadona.es/api/postal-codes/actions/change-pc/'
  const payload = {
    new_postal_code: postalCode
  }
  const headers = {
    'Content-Type': 'application/json'
  }

  const response = await axios.put(url, payload, { headers })

  return response.status === 200
    ? response.headers.get('X-Customer-Wh')
    : undefined
}

const getAllWh = async () => {
  const postalCodes = readPostalCodes()
  const whs = []

  let remaining = postalCodes.length

  for (const postalCode of postalCodes) {
    try {
      const wh = await getWhByPostalCode(postalCode)

      whs.push({ postalCode, wh })

      console.log(
        `Postal code: ${postalCode}, WH: ${wh}, Remaining: ${remaining}`
      )
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {}

    remaining--
  }

  return [...new Set(whs)]
}

const updateWh = async () => {
  const whs = await getAllWh()

  for (const { postalCode, wh } of whs) {
    try {
      const existWhInDB = await prisma.warehouse.findUnique({
        where: {
          externalId: wh
        }
      })

      if (!existWhInDB) {
        await prisma.warehouse.create({
          data: {
            externalId: wh,
            postalCode
          }
        })

        console.log(
          `City warehouse ${wh} with postal code ${postalCode} created`
        )
      }
    } catch (error) {
      console.error(
        `Error updating city warehouse with postal code ${postalCode}: ${error.message}`
      )
    }
  }
}

updateWh()

const fs = require('fs')

const axios = require('axios')
const xml2js = require('xml2js')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function readSitemap(urlOrPath) {
  try {
    let xmlData

    if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) {
      const response = await axios.get(urlOrPath)
      xmlData = response.data
    } else {
      xmlData = fs.readFileSync(urlOrPath, 'utf8')
    }

    const parser = new xml2js.Parser()
    const result = await parser.parseStringPromise(xmlData)

    const urls = result.urlset.url
      .map((entry) => entry.loc[0])
      .filter((url) =>
        /^https:\/\/tienda.mercadona.es\/product\/[0-9]+/.test(url)
      )

    console.log('URLs encontradas en el sitemap:')

    let skipRateLimit = 50

    for (const url of urls) {
      const productIdMatch = url.match(/[0-9]+(?:\.[0-9]+)?/)

      if (productIdMatch) {
        try {
          const productId = productIdMatch[0]
          const fetchUrl = `https://tienda.mercadona.es/api/products/${productId}`

          const response = await axios.get(fetchUrl)
          const product = response.data

          let existProductInDB = await prisma.product.findUnique({
            where: { externalId: product.id }
          })

          if (!existProductInDB) {
            existProductInDB = await prisma.product.create({
              data: {
                externalId: product.id,
                displayName: product.display_name
              }
            })
          }

          const currentUnitPrice = parseFloat(
            product.price_instructions.unit_price || 0
          )

          const currentBulkPrice = parseFloat(
            product.price_instructions.bulk_price || 0
          )

          const lastPriceEntry = await prisma.priceHistory.findFirst({
            where: { productId: existProductInDB?.id || product.id },
            orderBy: { recordedAt: 'desc' }
          })

          if (
            !lastPriceEntry ||
            lastPriceEntry.unitPrice !== currentUnitPrice ||
            lastPriceEntry.bulkPrice !== currentBulkPrice
          ) {
            await prisma.priceHistory.create({
              data: {
                productId: existProductInDB?.id || product.id,
                unitPrice: currentUnitPrice,
                bulkPrice: currentBulkPrice
              }
            })
            console.log(
              `Nuevo precio guardado para ${product.display_name}: ${currentUnitPrice}`
            )
          }

          if (skipRateLimit === 0) {
            console.log(
              '\n--- Esperando 5 segundos para evitar rate limit ---\n'
            )
            await new Promise((resolve) => setTimeout(resolve, 5000))
            skipRateLimit = 50
          }

          console.log('Producto guardado:', product.display_name)
          console.log('Productos restantes', urls.length - urls.indexOf(url))
          skipRateLimit--
        } catch (error) {
          const message = `Error al guardar el producto ${url}: ${error.message}`
          fs.appendFileSync('errors.log', message + '\n')
        }
      }
    }

    console.log('Número de URLs encontradas:', urls.length)

    return urls
  } catch (error) {
    console.error('Error al leer el sitemap:', error.message)
  }
}

readSitemap('https://tienda.mercadona.es/sitemap.xml')

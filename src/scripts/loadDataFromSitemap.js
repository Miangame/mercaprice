const fs = require('fs')

const axios = require('axios')
const xml2js = require('xml2js')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const saveToErrorLog = async (message) => {
  const date = new Date().toISOString()
  try {
    await fs.appendFileSync('error.log', `${date}: ${message}\n`, 'utf8')
  } catch (error) {
    console.error('Error al guardar en el log de errores:', error.message)
  }
}

const sendTelegramMessage = async (message) => {
  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`

  try {
    await axios.post(url, {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: message
    })
  } catch (error) {
    await saveToErrorLog(
      `Error al enviar mensaje de Telegram: ${error.message}`
    )
  }
}

const readSitemap = async (urlOrPath) => {
  const invalidUrlErrors = []
  const saveErrors = []

  const startTime = Date.now()

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
          } else if (existProductInDB.displayName !== product.display_name) {
            existProductInDB = await prisma.product.update({
              where: { id: existProductInDB.id },
              data: { displayName: product.display_name }
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
          await saveToErrorLog(
            `Error al guardar el producto ${url}: ${error.message}`
          )
          saveErrors.push(`${url}: ${error.message}`)
        }
      } else {
        await saveToErrorLog(`URL inválida: ${url}`)
        invalidUrlErrors.push(url)
      }
    }

    console.log('Número de URLs encontradas:', urls.length)

    const endTime = Date.now()
    const executionTimeMs = endTime - startTime
    const executionTimeSec = (executionTimeMs / 1000).toFixed(2)
    const executionTimeMin = (executionTimeMs / 60000).toFixed(2)

    const telegramMessage = `
      🚀 *Ejecución del Script Finalizada* 🚀

      📊 *Resultados*:
      🔹 URLs procesadas: *${urls.length}*
      ✅ Productos guardados: *${urls.length - saveErrors.length - invalidUrlErrors.length}*
      ⚠️ Productos con error: *${saveErrors.length}*
      ❌ URLs inválidas: *${invalidUrlErrors.length}*

      ${saveErrors.length > 0 ? `🛑 *Errores en productos*: \n${saveErrors.slice(0, 5).join('\n')}\n\n` : ''}
      ${invalidUrlErrors.length > 0 ? `⚠️ *URLs inválidas*: \n${invalidUrlErrors.slice(0, 5).join('\n')}\n\n` : ''}

      ⏳ *Tiempo de ejecución:* ${executionTimeMin} min (${executionTimeSec} seg)
      📅 *Fecha de ejecución:* ${new Date().toLocaleString()}
    `

    await sendTelegramMessage(telegramMessage)

    return urls
  } catch (error) {
    await saveToErrorLog(`Error al leer el sitemap: ${error.message}`)
    await sendTelegramMessage(`Error al leer el sitemap: ${error.message}`)
  }
}

readSitemap('https://tienda.mercadona.es/sitemap.xml')

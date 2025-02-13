const fs = require('fs')

const axios = require('axios')
const xml2js = require('xml2js')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const SKIP_RATE_LIMIT = 10

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
      text: message,
      parse_mode: 'MarkdownV2'
    })
  } catch (error) {
    await saveToErrorLog(
      `Error al enviar mensaje de Telegram: ${error.message}`
    )
  }
}

const markProductsAsDeleted = async (urlOrPath) => {
  const startTime = Date.now()
  const updateErrors = []
  let deletedProductsNotInSitemapCount = 0
  let deletedProductsCount = 0

  await sendTelegramMessage('🚀 Starting script for delete products...')

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

    const sitemapProductIds = result.urlset.url
      .map((entry) => entry.loc[0])
      .filter((url) =>
        /^https:\/\/tienda.mercadona.es\/product\/[0-9]+/.test(url)
      )
      .map((url) => url.match(/[0-9]+(?:\.[0-9]+)?/)[0])

    console.log('Número de productos en el sitemap:', sitemapProductIds.length)

    const storedProducts = await prisma.product.findMany({
      where: {
        deletedAt: null
      },
      select: { id: true, externalId: true }
    })

    const productsToDelete = storedProducts.filter(
      (p) => !sitemapProductIds.includes(p.externalId)
    )

    console.log(
      'Número de productos a marcar como eliminados:',
      productsToDelete.length
    )

    for (const product of productsToDelete) {
      try {
        await prisma.product.update({
          where: { id: product.id },
          data: {
            deletedAt: new Date()
          }
        })
        deletedProductsNotInSitemapCount++
      } catch (error) {
        await saveToErrorLog(
          `Error al marcar como eliminado el producto ID ${product.externalId}: ${error.message}`
        )
        updateErrors.push(`Producto ${product.externalId}: ${error.message}`)
      }
    }

    let skipRateLimit = SKIP_RATE_LIMIT

    let remainingProducts = storedProducts.length

    for (const product of storedProducts) {
      try {
        const productId = product.externalId
        const fetchUrl = `https://tienda.mercadona.es/api/products/${productId}`

        await axios.get(fetchUrl)

        if (skipRateLimit === 0) {
          console.log(
            '\n--- Esperando 10 segundos para evitar rate limit ---\n'
          )
          await new Promise((resolve) => setTimeout(resolve, 10000))
          skipRateLimit = SKIP_RATE_LIMIT
        }

        console.log(`Productos restantes: ${remainingProducts}`)
        skipRateLimit--
        remainingProducts--
      } catch (error) {
        let isDeleted = false
        let foundProduct = false

        const skipRateLimitWh = SKIP_RATE_LIMIT

        if (error.response?.status === 404) {
          isDeleted = true
        } else {
          const whs = prisma.warehouse.findMany()

          for (const wh of whs) {
            try {
              await axios.get(`${fetchUrl}/?lang=es&wh=${wh.externalId}`)

              console.log('🏬 Producto encontrado con almacén:', wh.externalId)
              await saveToErrorLog(
                `Producto encontrado con almacén: ${wh.externalId}`
              )

              if (skipRateLimitWh === 0) {
                console.log(
                  '\n⚠️ --- Esperando 5 segundos para evitar rate limit --- ⚠️\n'
                )
                await new Promise((resolve) => setTimeout(resolve, 5000))
                skipRateLimitWh = SKIP_RATE_LIMIT
              }

              skipRateLimitWh--

              foundProduct = true

              break
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {}
          }
        }

        if (!foundProduct) {
          isDeleted = true
        }

        if (isDeleted) {
          await prisma.product.update({
            where: { id: product.id },
            data: {
              deletedAt: new Date()
            }
          })
          deletedProductsCount++
        }
      }
    }

    const endTime = Date.now()
    const executionTimeMs = endTime - startTime
    const executionTimeSec = (executionTimeMs / 1000).toFixed(2)
    const executionTimeMin = (executionTimeMs / 60000).toFixed(2)

    const telegramMessage = `
      🚀 *Actualización de Productos Finalizada* 🚀

      📊 *Resultados*:
      🔹 Productos en el sitemap: *${sitemapProductIds.length}*
      ✅ Productos eliminados no en sitemap: *${deletedProductsNotInSitemapCount}*
      ❌ Productos eliminados: *${deletedProductsCount}*
      ⚠️ Errores al eliminar: *${updateErrors.length}*

      ${updateErrors.length > 0 ? `🛑 *Errores al eliminar productos*: \n${updateErrors.slice(0, 5).join('\n')}\n\n` : ''}

      ⏳ *Tiempo de ejecución:* ${executionTimeMin} min (${executionTimeSec} seg)
      📅 *Fecha de ejecución:* ${new Date().toLocaleString()}
    `

    await sendTelegramMessage(telegramMessage)
  } catch (error) {
    await saveToErrorLog(`Error general en el script: ${error.message}`)
    await sendTelegramMessage(`❌ Error en el script: ${error.message}`)
  }
}

markProductsAsDeleted('https://tienda.mercadona.es/sitemap.xml')

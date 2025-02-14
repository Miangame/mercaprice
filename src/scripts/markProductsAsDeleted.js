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
    console.error('Error saving in error.log:', error.message)
  }
}

const sendTelegramMessage = async (message) => {
  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`

  try {
    await axios.post(url, {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
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

    console.log('🌐 URls found in sitemap', sitemapProductIds.length)

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
      'Number of products to mark as deleted:',
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
        console.log('❌ Deleted product not in sitemap:', product.id)
      } catch (error) {
        await saveToErrorLog(
          `Error marking as deleted product with ID ${product.externalId}: ${error.message}`
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
            '\n⚠️ --- Waiting 10 seconds to avoid rate limit --- ⚠️\n'
          )
          await new Promise((resolve) => setTimeout(resolve, 10000))
          skipRateLimit = SKIP_RATE_LIMIT
        }

        console.log(`Remaining products: ${remainingProducts}`)
        skipRateLimit--
        remainingProducts--
      } catch (error) {
        let isDeleted = false
        let foundProduct = false

        const skipRateLimitWh = SKIP_RATE_LIMIT

        if (error.response?.status === 404) {
          isDeleted = true
        } else {
          const whs = await prisma.warehouse.findMany()

          for (const wh of whs) {
            try {
              await axios.get(`${fetchUrl}/?lang=es&wh=${wh.externalId}`)

              console.log('🏬 Product found in warehouse:', wh.externalId)
              await saveToErrorLog(
                `Product found in warehouse: ${wh.externalId}`
              )

              if (skipRateLimitWh === 0) {
                console.log(
                  '\n⚠️ --- Waiting 10 seconds to avoid rate limit --- ⚠️\n'
                )
                await new Promise((resolve) => setTimeout(resolve, 10000))
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
          console.log('❌ Deleted product:', product.id)
        }
      }
    }

    const endTime = Date.now()
    const executionTimeMs = endTime - startTime
    const executionTimeSec = (executionTimeMs / 1000).toFixed(2)
    const executionTimeMin = (executionTimeMs / 60000).toFixed(2)

    const telegramMessage = `
      🚀 *Delete products finished* 🚀

      📊 *Results*:
      🔹 Products in sitemap: *${sitemapProductIds.length}*
      ✅ Deleted products not in sitemap: *${deletedProductsNotInSitemapCount}*
      ❌ Deleted products: *${deletedProductsCount}*
      ⚠️ Delete errors: *${updateErrors.length}*

      ${updateErrors.length > 0 ? `🛑 *Errors deleting products*: \n${updateErrors.slice(0, 5).join('\n')}\n\n` : ''}

      ⏳ *Time execution:* ${executionTimeMin} min (${executionTimeSec} seg)
      📅 *Execution date:* ${new Date().toLocaleString()}
    `

    await sendTelegramMessage(telegramMessage)
  } catch (error) {
    console.log('❌ General error in script:', error.message)
    await saveToErrorLog(`General error in script: ${error.message}`)
    await sendTelegramMessage(`❌ General error in script: ${error.message}`)
  }
}

markProductsAsDeleted('https://tienda.mercadona.es/sitemap.xml')

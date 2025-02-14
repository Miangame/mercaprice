const fs = require('fs')
const http = require('http')

const axios = require('axios')
const xml2js = require('xml2js')
const { PrismaClient } = require('@prisma/client')
const express = require('express')
const { Server } = require('socket.io')

const prisma = new PrismaClient()

const SKIP_RATE_LIMIT = 10

const app = express()
const server = http.createServer(app)
const io = new Server(server)

const logs = []

const originalConsoleLog = console.log
console.log = (...args) => {
  const message = `[${new Date().toISOString()}] ` + args.join(' ')
  logs.push(message)
  if (logs.length > 500) logs.shift()

  originalConsoleLog(...args)
  io.emit('new_log', message)
}

app.get('/logs', (req, res) => {
  res.sendFile(__dirname + '/logs.html')
})

app.get('/logs-data', (req, res) => {
  res.json(logs)
})

io.on('connection', (socket) => {
  console.log('🟢 Client connected to WebSockets')
  socket.emit('logs', logs)
})

server.listen(3000, () =>
  console.log('📡 Logs server in http://localhost:3000/logs')
)

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
    await saveToErrorLog(`Error sending telegram message: ${error.message}`)
  }
}

const fetchUrls = async (url) => {
  let xmlData

  if (url.startsWith('http://') || url.startsWith('https://')) {
    const response = await axios.get(url)
    xmlData = response.data
  } else {
    xmlData = fs.readFileSync(url, 'utf8')
  }

  const parser = new xml2js.Parser()
  const result = await parser.parseStringPromise(xmlData)

  const urls = result.urlset.url
    .map((entry) => entry.loc[0])
    .filter((url) =>
      /^https:\/\/tienda.mercadona.es\/product\/[0-9]+/.test(url)
    )

  return urls
}

const fetchProduct = async (productIdMatch) => {
  const productId = productIdMatch[0]
  const fetchUrl = `https://tienda.mercadona.es/api/products/${productId}`
  let response
  let skipRateLimit = SKIP_RATE_LIMIT

  try {
    response = await axios.get(fetchUrl)
  } catch (error) {
    if (error.response?.status === 404) {
      throw error
    } else {
      const whs = await prisma.warehouse.findMany()

      for (const wh of whs) {
        try {
          response = await axios.get(`${fetchUrl}/?lang=es&wh=${wh.externalId}`)

          console.log('🏬 Product fetched with warehouse:', wh.externalId)
          await saveToErrorLog(
            `Product fetched with warehouse: ${wh.externalId}`
          )

          if (skipRateLimit === 0) {
            console.log(
              '\n⚠️ --- Waiting 10 seconds to avoid rate limit --- ⚠️\n'
            )
            await new Promise((resolve) => setTimeout(resolve, 10000))
            skipRateLimit = SKIP_RATE_LIMIT
          }

          skipRateLimit--

          break
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {}
      }
    }
  }

  const product = response.data

  return product
}

const readSitemap = async (urlOrPath) => {
  const invalidUrlErrors = []
  const saveErrors = []
  let newProducts = 0
  let updatedProducts = 0
  let updatedPrices = 0

  const startTime = Date.now()

  await sendTelegramMessage('🚀 Starting products update...')

  try {
    const urls = await fetchUrls(urlOrPath)

    console.log(`🌐 URls found in sitemap: ${urls.length}`)

    let skipRateLimit = SKIP_RATE_LIMIT

    for (const url of urls) {
      const productIdMatch = url.match(/[0-9]+(?:\.[0-9]+)?/)

      if (productIdMatch) {
        try {
          const product = await fetchProduct(productIdMatch)

          let existProductInDB = await prisma.product.findUnique({
            where: { externalId: product.id }
          })

          // If product does not exist in DB, create it
          if (!existProductInDB) {
            existProductInDB = await prisma.product.create({
              data: {
                externalId: product.id,
                displayName: product.display_name
              }
            })

            console.log('💾 Product saved:', product.display_name)

            newProducts++
            // If product exists in DB but display name is different, update it
          } else if (existProductInDB.displayName !== product.display_name) {
            existProductInDB = await prisma.product.update({
              where: { id: existProductInDB.id },
              data: { displayName: product.display_name }
            })

            console.log('🔄 Product updated:', product.display_name)

            updatedProducts++
          }

          const currentUnitPrice = parseFloat(
            product.price_instructions.unit_price || 0
          )

          const currentBulkPrice = parseFloat(
            product.price_instructions.bulk_price || 0
          )

          // Get last price entry for the product
          const lastPriceEntry = await prisma.priceHistory.findFirst({
            where: { productId: existProductInDB?.id || product.id },
            orderBy: { recordedAt: 'desc' }
          })

          // If there is no last price entry or the price has changed, save the new price
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
              `💰 New price saved for: ${product.display_name}: ${currentUnitPrice}`
            )
            updatedPrices++
          }

          if (skipRateLimit === 0) {
            console.log(
              '\n⚠️ --- Waiting 10 seconds to avoid rate limit --- ⚠️\n'
            )
            await new Promise((resolve) => setTimeout(resolve, 10000))
            skipRateLimit = SKIP_RATE_LIMIT
          }

          console.log('🔢 Remaining products', urls.length - urls.indexOf(url))
          skipRateLimit--
        } catch (error) {
          if (error.response?.status === 404) {
            const productId = productIdMatch[0]

            await prisma.product.update({
              where: { externalId: productId },
              data: { deletedAt: new Date() }
            })

            console.log(`❌ Product not found. Deleted: ${productId}`)
            await saveToErrorLog(`Product not found. Deleted: ${productId}`)
            saveErrors.push(`Product not found. Deleted: ${productId}`)
          }
        }
      } else {
        console.log('‼️ Invalid URL:', url)
        await saveToErrorLog(`Invalid URL: ${url}`)
        invalidUrlErrors.push(url)
      }
    }

    console.log('🔍 URLs found:', urls.length)

    const endTime = Date.now()
    const executionTimeMs = endTime - startTime
    const executionTimeSec = (executionTimeMs / 1000).toFixed(2)
    const executionTimeMin = (executionTimeMs / 60000).toFixed(2)

    const telegramMessage = `
      🚀 *Script execution finished* 🚀

      📊 *Results*:
      🔹 URLs processed: *${urls.length}*
      ✅ Checked products: *${urls.length - saveErrors.length - invalidUrlErrors.length}*
      🥑 New products: *${newProducts}*
      🔄 Updated products: *${updatedProducts}*
      🤑 Updated prices: *${updatedPrices}*
      ⚠️ Product with errors: *${saveErrors.length}*
      ❌ Invalid URLs: *${invalidUrlErrors.length}*

      ${saveErrors.length > 0 ? `🛑 *Products with errors*: \n${saveErrors.slice(0, 5).join('\n')}\n\n` : ''}
      ${invalidUrlErrors.length > 0 ? `⚠️ *Invalid URLs*: \n${invalidUrlErrors.slice(0, 5).join('\n')}\n\n` : ''}

      ⏳ *Execution time:* ${executionTimeMin} min (${executionTimeSec} secs)
      📅 *Execution date:* ${new Date().toLocaleString()}
    `

    await sendTelegramMessage(telegramMessage)

    return urls
  } catch (error) {
    await saveToErrorLog(`Error reading sitemap: ${error.message}`)
    await sendTelegramMessage(`Error reading sitemap: ${error.message}`)
  }
}

readSitemap('https://tienda.mercadona.es/sitemap.xml')

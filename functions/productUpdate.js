const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

module.exports.handler = async (event, context, callback) => {
  if (!context.clientContext.user) {
    return { statusCode: 401, body: "" }
  }

  const body = JSON.parse(event.body)
  const productId = body.productId

  const product = await stripe.products.update(productId, body.product)

  let prices = await stripe.prices.list({
    product: productId,
    limit: 100,
  })

  const updatedPrices = body.prices.map(async priceData => {
    const existingPrice = prices.data.find(p => p.id === priceData.id)
    const { active, metadata, nickname, unit_amount } = priceData
    if (existingPrice) {
      return stripe.prices.update(priceData.id, { active, metadata, nickname })
    } else {
      return stripe.prices.create({
        active,
        metadata,
        nickname,
        unit_amount,
        currency: "usd",
        product: productId,
      })
    }
  })

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      product,
      prices: await Promise.all(updatedPrices),
    }),
  }
  callback(null, response)
}

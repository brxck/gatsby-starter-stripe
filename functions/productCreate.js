const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

module.exports.handler = async (event, context, callback) => {
  if (!context.clientContext.user) {
    return { statusCode: 401, body: "" }
  }

  const requestBody = JSON.parse(event.body)

  const product = await stripe.products.create({
    ...requestBody.product,
    type: "good",
  })

  const prices = requestBody.prices.map(async priceData => {
    const { active, metadata, nickname, unit_amount } = priceData
    stripe.prices.create({
      active,
      metadata,
      nickname,
      unit_amount,
      product: product.id,
      currency: "usd",
    })
  })

  const response = {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ product, prices: Promise.all(prices) }),
  }
  callback(null, response)
}

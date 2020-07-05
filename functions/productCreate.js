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

  const skus = requestBody.skus.map(async skuData => {
    return stripe.skus.create({
      ...skuData,
      product: product.id,
      currency: "usd",
    })
  })

  const response = {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ product, skus: Promise.all(skus) }),
  }
  callback(null, response)
}

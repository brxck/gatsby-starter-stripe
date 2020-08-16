const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

module.exports.handler = async (event, context, callback) => {
  if (!context.clientContext.user) {
    return { statusCode: 401, body: "" }
  }

  const requestBody = JSON.parse(event.body)
  // All prices must be deleted before product
  const prices = await stripe.prices.list({ product: requestBody.productId })
  await Promise.all(prices.data.map(({ id }) => stripe.prices.del(id)))
  await stripe.products.del(requestBody.productId)

  const response = {
    statusCode: 204,
    headers: {
      "Access-Control-Allow-Origin": "b*",
    },
    body: "",
  }
  callback(null, response)
}

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

module.exports.handler = async (event, context, callback) => {
  if (!context.clientContext.user) {
    return { statusCode: 401, body: "" }
  }

  const requestBody = JSON.parse(event.body)
  // All skus must be deleted before product
  const skus = await stripe.skus.list({ product: requestBody.productId })
  await Promise.all(skus.data.map(({ id }) => stripe.skus.del(id)))
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

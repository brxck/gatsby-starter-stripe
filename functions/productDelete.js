const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

module.exports.handler = async (event, context, callback) => {
  if (!context.clientContext.user) {
    return { statusCode: 401, body: "" }
  }

  const requestBody = JSON.parse(event.body)
  await stripe.products.del(requestBody.productId)

  const response = {
    statusCode: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: "",
  }
  callback(null, response)
}

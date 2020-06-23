const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

/**
 * Returns list of skus with product fields expanded.
 */
module.exports.handler = async (event, context, callback) => {
  const skus = await stripe.skus.list({
    limit: 100, // max allowed
    expand: ["data.product"],
  })
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(skus),
  }
  callback(null, response)
}

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

/**
 * Returns list of skus with product fields expanded.
 */
module.exports.handler = (event, context, callback) => {
  stripe.skus.list(
    {
      limit: 100, // max allowed
      expand: ['data.product']
    },
    (err, result) => {
      let statusCode, body

      if (err) {
        statusCode = 500
        body = JSON.stringify({
          error: err.message
        })
      } else {
        statusCode = 200
        body = JSON.stringify({
          data: result.data
        })
      }

      const response = {
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        statusCode,
        body
      }
      callback(null, response)
    }
  )
}

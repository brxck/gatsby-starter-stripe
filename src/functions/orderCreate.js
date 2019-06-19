const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

/**
 * Captures payment token and creates order.
 */
module.exports.handler = async (event, context, callback) => {
  const requestBody = JSON.parse(event.body)
  const { id, email } = requestBody.token
  const { currency, items, shipping } = requestBody.order

  console.log(items)

  // Create order
  const order = await stripe.orders
    .create({
      currency,
      items,
      shipping,
      email
    })
    // Charge order
    .then(order => {
      stripe.orders.pay(order.id, {
        source: id
      })
    })
    .catch(err => errorResponse(err))

  const response = {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    statusCode: 200,
    body: {
      data: order,
      message: 'Order placed successfully!'
    }
  }
  callback(null, response)

  /** Respond with status code 500 and error message */
  function errorResponse(err) {
    const response = {
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      statusCode: 500,
      body: JSON.stringify({
        error: err
      })
    }
    callback(null, response)
  }
}

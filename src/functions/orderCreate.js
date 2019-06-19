const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

/** Respond with status code 500 and error message */
function errorResponse(err, callback) {
  const response = {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    statusCode: 500,
    body: JSON.stringify({
      error: err
    })
  }

  if (typeof callback === 'function') {
    callback(null, response)
  }
}

/**
 * Captures payment token and creates order.
 */
module.exports.handler = async (event, context, callback) => {
  const requestBody = JSON.parse(event.body)
  const { id, email } = requestBody.token
  const { currency, items, shipping } = requestBody.order

  // Create order
  try {
    const order = await stripe.orders.create({
      currency,
      items,
      shipping,
      email,
    });

    // Charge order
    stripe.orders.pay(order.id, {
      source: id,
    })

    const response = {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      statusCode: 200,
      body: JSON.stringify({
        data: order,
        message: 'Order placed successfully!',
      }),
    }

    callback(null, response)

  } catch (e) {
    errorResponse(e, callback)
  }
}

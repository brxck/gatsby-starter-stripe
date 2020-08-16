const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

/** Map prices to their ids, or their index if id not present. */
function mapPrices(prices) {
  return prices.reduce((acc, data, i) => {
    const key = data.id || String(i) // Use index of prices which do not exist yet
    acc[key] = data
    return acc
  }, {})
}

const intersection = (a0, a1) => a0.filter(x => a1.includes(x))
const difference = (a0, a1) => a0.filter(x => !a1.includes(x))

module.exports.handler = async (event, context, callback) => {
  if (!context.clientContext.user) {
    return { statusCode: 401, body: "" }
  }

  const requestBody = JSON.parse(event.body)
  const requestPrices = mapPrices(requestBody.prices)
  const productId = requestBody.productId

  const product = await stripe.products.update(productId, requestBody.product)

  let stripePrices = await stripe.prices.list({
    product: productId,
    limit: 100,
  })
  stripePrices = mapPrices(stripePrices.data)

  const requestIds = Object.keys(requestPrices)
  const stripeIds = Object.keys(stripePrices)

  const pricesToCreate = difference(requestIds, stripeIds)
  const createdPrices = pricesToCreate.map(async id => {
    const { id: _id, ...priceData } = requestPrices[id]
    return stripe.prices.create({
      ...priceData,
      currency: "usd",
      product: productId,
    })
  })

  const pricesToUpdate = intersection(stripeIds, requestIds)
  console.log(pricesToUpdate)
  const updatedPrices = pricesToUpdate.map(async id => {
    const { active, metadata, nickname } = requestPrices[id]
    return stripe.prices.update(id, { active, metadata, nickname })
  })

  const pricesToDelete = difference(stripeIds, requestIds)
  pricesToDelete.forEach(id => stripe.prices.del(id))

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      product,
      prices: await Promise.all([...createdPrices, ...updatedPrices]),
    }),
  }
  callback(null, response)
}

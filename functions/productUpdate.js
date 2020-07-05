const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

/** Map skus to their ids, or their index if id not present. */
function mapSkus(skus) {
  return skus.reduce((acc, data, i) => {
    const key = data.id || String(i) // Use index of skus which do not exist yet
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
  const requestSkus = mapSkus(requestBody.skus)
  const productId = requestBody.productId

  const product = await stripe.products.update(productId, requestBody.product)

  let stripeSkus = await stripe.skus.list({ product: productId, limit: 100 })
  stripeSkus = mapSkus(stripeSkus.data)

  const requestIds = Object.keys(requestSkus)
  const stripeIds = Object.keys(stripeSkus)

  const skusToCreate = difference(requestIds, stripeIds)
  const createdSkus = skusToCreate.map(async id => {
    return stripe.skus.create({ ...requestSkus[id], currency: "usd" })
  })

  const skusToUpdate = intersection(stripeIds, requestIds)
  const updatedSkus = skusToUpdate.map(async id => {
    delete requestSkus[id].id // Stripe does not allow including id
    return stripe.skus.update(id, requestSkus[id])
  })

  const skusToDelete = difference(stripeIds, requestIds)
  skusToDelete.forEach(id => stripe.skus.del(id))

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      product,
      skus: await Promise.all([...createdSkus, ...updatedSkus]),
    }),
  }
  callback(null, response)
}

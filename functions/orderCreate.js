const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

const redirectUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8888/"
    : "https://gatsby-starter-stripe.netlify.app/"

/**
 * Creates and returns a Stripe Checkout session.
 */
module.exports.handler = async (event, context, callback) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: JSON.parse(event.body),
    mode: "payment",
    success_url: redirectUrl + "?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: redirectUrl,
  })

  const response = {
    statusCode: 200,
    body: JSON.stringify(session),
  }

  callback(null, response)
}

import React, { useContext } from "react"
import { CartContext } from "./CartProvider"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.GATSBY_STRIPE_PUBLISHABLE_KEY)

const Checkout = () => {
  const { cart, total } = useContext(CartContext)

  const onClick = () => {
    const lineItems = cart.map(([price, quantity]) => ({
      price: price.id,
      quantity,
    }))

    fetch("/.netlify/functions/orderCreate", {
      method: "POST",
      body: JSON.stringify(lineItems),
    })
      .then(async response => {
        const { id } = await response.json()
        localStorage.setItem("cart", "{}")
        const stripe = await stripePromise
        const { error } = await stripe.redirectToCheckout({ sessionId: id })
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `error.message`.
        alert(error.message)
      })
      .catch(err => alert(err.message))
  }

  return <button onClick={onClick}>Checkout for ${total / 100}</button>
}

export default Checkout

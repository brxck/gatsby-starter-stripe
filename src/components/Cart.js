import React, { useContext } from "react"
import { CartContext } from "./CartProvider"
import Checkout from "./Checkout"
import CartItem from "./CartItem"

const Cart = () => {
  const { cart, count, mode, toggle } = useContext(CartContext)
  return (
    <>
      <button onClick={() => toggle()}>Cart</button>
      <div
        style={{
          borderLeft: "1px solid #ddd",
          display: mode ? "initial" : "none",
          position: "fixed",
          right: 0,
          top: 0,
          height: "100vh",
          padding: "2rem",
          backgroundColor: "white",
          maxWidth: 400,
          width: "100%",
          zIndex: 1,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1>Cart</h1>
          <button onClick={() => toggle()}>→</button>
        </div>

        {count > 0 &&
          cart.map(([price, quantity]) => (
            <CartItem key={price.id} price={price} quantity={quantity} />
          ))}
        {count === 0 && <span>No items in cart.</span>}
        {count > 0 && <Checkout />}
      </div>
    </>
  )
}

export default Cart

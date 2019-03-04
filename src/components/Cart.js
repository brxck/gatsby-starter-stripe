import React, { useContext } from 'react'
import { CartContext } from './CartProvider'
import Checkout from './Checkout'

const Cart = () => {
  const { cart, count, mode, toggle, remove } = useContext(CartContext)
  return (
    <>
      <button onClick={() => toggle()}>Cart</button>
      <div
        style={{
          display: mode ? 'initial' : 'none',
          position: 'fixed',
          right: 0,
          top: 0,
          height: '100vh',
          padding: '2rem',
          backgroundColor: 'white',
          maxWidth: 400,
          width: '100%'
        }}
      >
        <h1>Cart</h1>
        <div>{count === 0 ? 'No' : count} items in cart.</div>
        {cart.map(([sku, quantity]) => (
          <div key={sku.id}>
            <span>{sku.product.name}</span>
            <span
              onClick={() => {
                remove(sku.id)
              }}
            >
              &times;
            </span>
            <div>
              {sku.price / 100} &times; {quantity}
            </div>
            <div>
              <strong>{(sku.price / 100) * quantity}</strong>
            </div>
          </div>
        ))}
        <Checkout />
      </div>
    </>
  )
}

export default Cart

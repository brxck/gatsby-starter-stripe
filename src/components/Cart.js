import React, { useContext } from 'react'
import { CartContext } from './CartProvider'
import Checkout from './Checkout'
import CartItem from './CartItem'

const Cart = () => {
  const { cart, count, mode, toggle } = useContext(CartContext)
  return (
    <>
      <button
        onClick={() => toggle()}
        style={{
          position: 'fixed',
          right: '2rem',
          top: '2rem',
          zIndex: '2'
        }}
      >
        {mode ? '→' : 'cart'}
      </button>
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
          width: '100%',
          zIndex: 1
        }}
      >
        <h1>cart</h1>
        {count === 0 && <span>No items in cart.</span>}
        {cart.map(([sku, quantity]) => (
          <CartItem key={sku.id} sku={sku} quantity={quantity} />
        ))}
        <Checkout />
      </div>
    </>
  )
}

export default Cart

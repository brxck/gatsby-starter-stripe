import React, { useContext } from 'react'
import { CartContext } from './CartProvider'

const Cart = () => {
  const context = useContext(CartContext)
  console.log(context.cart)
  return (
    <>
      <button onClick={context.toggle}>Cart</button>
      <div style={{ display: context.mode ? 'initial' : 'none' }}>
        {context.cart.map(([sku, quantity]) => (
          <div key={sku.id}>
            <div>{sku.product.name}</div>
          </div>
        ))}
      </div>
    </>
  )
}

export default Cart

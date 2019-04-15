import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { CartContext } from './CartProvider'

const CartItem = ({ sku, quantity }) => {
  const { remove } = useContext(CartContext)
  return (
    <div key={sku.id} style={{ display: 'flex', margin: '1rem 0' }}>
      <img
        style={{
          width: 100,
          maxHeight: 100,
          objectFit: 'contain',
          marginRight: '0.5rem'
        }}
        src={sku.image || sku.product.images[0]}
        alt={sku.product.name}
      />
      <div style={{ flexBasis: '100%' }}>
        <div style={{ fontWeight: 'bold' }}>{sku.product.name}</div>
        <div>
          ${sku.price / 100} &times; {quantity}
        </div>
        <div>
          <strong>${(sku.price / 100) * quantity}</strong>
        </div>
      </div>
      <span
        style={{}}
        onClick={() => {
          remove(sku.id)
        }}
      >
        &times;
      </span>
    </div>
  )
}

CartItem.propTypes = {
  sku: PropTypes.object.isRequired,
  quantity: PropTypes.number.isRequired
}

export default CartItem

import React, { useContext } from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

import { CartContext } from "./CartProvider"
import css from "./CartItem.module.css"

const CartItem = ({ sku, quantity }) => {
  const { remove } = useContext(CartContext)
  return (
    <div key={sku.id} className={css.container}>
      <Link to={`/buy/${sku.product.slug}`} className={css.image}>
        <img src={sku.image || sku.product.images[0]} alt={sku.product.name} />
      </Link>
      <div className={css.description}>
        <button
          className={css.remove}
          onClick={() => {
            remove(sku.id)
          }}
        >
          &times;
        </button>
        <Link to={`/buy/${sku.product.slug}`}>
          <div>
            <strong>{sku.product.name}</strong>
            {sku.name && <span> &mdash; {sku.name}</span>}
          </div>
        </Link>
        <div className={css.quantity}>
          <span>
            ${sku.price / 100} &times; {quantity}
          </span>
          <strong>${(sku.price / 100) * quantity}</strong>
        </div>
      </div>
    </div>
  )
}

CartItem.propTypes = {
  sku: PropTypes.object.isRequired,
  quantity: PropTypes.number.isRequired,
}

export default CartItem

import React, { useContext } from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

import { CartContext } from "./CartProvider"
import * as css from "./CartItem.module.css"

const CartItem = ({ price, quantity }) => {
  const { remove } = useContext(CartContext)
  return (
    <div key={price.id} className={css.container}>
      <Link to={`/buy/${price.product.slug}`} className={css.image}>
        <img
          src={price.image || price.product.images[0]}
          alt={price.product.name}
        />
      </Link>
      <div className={css.description}>
        <button
          className={css.remove}
          onClick={() => {
            remove(price.id)
          }}
        >
          &times;
        </button>
        <Link to={`/buy/${price.product.slug}`}>
          <div>
            <strong>{price.product.name}</strong>
          </div>
          <div>{price.nickname}</div>
        </Link>
        <div className={css.quantity}>
          <span>
            ${price.unit_amount / 100} &times; {quantity}
          </span>
          <strong>${(price.unit_amount / 100) * quantity}</strong>
        </div>
      </div>
    </div>
  )
}

CartItem.propTypes = {
  price: PropTypes.object.isRequired,
  quantity: PropTypes.number.isRequired,
}

export default CartItem

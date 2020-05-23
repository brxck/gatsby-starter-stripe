import React, { useContext } from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

import { CartContext } from "./CartProvider"

const CartItem = ({ sku, quantity }) => {
  const { remove } = useContext(CartContext)
  return (
    <div key={sku.id} style={{ display: "flex", margin: "1rem 0" }}>
      <Link
        to={`/buy/${sku.product.slug}`}
        style={{ textDecoration: "none", marginRight: "0.5rem" }}
      >
        <img
          style={{
            width: 100,
            maxHeight: 100,
            objectFit: "contain",
          }}
          src={sku.image || sku.product.images[0]}
          alt={sku.product.name}
        />
      </Link>
      <div style={{ flexBasis: "100%" }}>
        <Link
          to={`/buy/${sku.product.slug}`}
          style={{ textDecoration: "none" }}
        >
          <div>
            <strong>{sku.product.name}</strong>
            {sku.name && <span> &mdash; {sku.name}</span>}
          </div>
        </Link>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>
            ${sku.price / 100} &times; {quantity}
          </span>
          <strong>${(sku.price / 100) * quantity}</strong>
        </div>
        <div></div>
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
  quantity: PropTypes.number.isRequired,
}

export default CartItem

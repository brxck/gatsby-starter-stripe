import React, { useContext, useState } from "react"
import PropTypes from "prop-types"
import Img from "gatsby-image"

import { ProductsContext } from "./ProductsProvider"
import { CartContext } from "./CartProvider"
import css from "./ProductPage.module.css"

const ProductPage = ({ productId }) => {
  const { products } = useContext(ProductsContext)
  const { add, toggle, available } = useContext(CartContext)

  const product = products[productId]
  const [activePrice, setActivePrice] = useState(product.prices[0])
  const [imageIndex, setImageIndex] = useState(0)

  const images = [...product?.localFiles]
  if (activePrice?.localFiles?.[0]) {
    images.unshift(activePrice.localFiles[0])
  }
  const activeImage = images[imageIndex].childImageSharp.fluid

  const onPriceChange = e => {
    setImageIndex(0)
    setActivePrice(product.prices[e.target.value])
  }

  const onImageClick = () => {
    setImageIndex((imageIndex + 1) % images.length)
  }

  return (
    <div className={css.container}>
      <div className={css.image} onClick={onImageClick}>
        {activeImage && (
          <Img
            fluid={activeImage}
            style={{ height: "100%" }}
            imgStyle={{ objectFit: "contain" }}
          />
        )}
      </div>

      <h2>{product.name}</h2>

      <p>
        <em>{product.caption}</em>
      </p>

      <p className={css.description}>{product.description}</p>

      <div className={css.controls}>
        {product.prices.length > 1 && (
          <label>
            Item Style
            <select name="price" id="price" onChange={onPriceChange}>
              {product.prices.map((price, i) => {
                return (
                  <option value={i} key={price.id}>
                    {price.attributes.name}
                  </option>
                )
              })}
            </select>
          </label>
        )}

        <button
          onClick={() => {
            add(activePrice.id)
            toggle(true)
          }}
          disabled={!available(activePrice.id)}
        >
          {available(activePrice.id) ? "Add To Cart" : "Sold Out"}
        </button>
      </div>
    </div>
  )
}

ProductPage.propTypes = {
  productId: PropTypes.string.isRequired,
}

export default ProductPage

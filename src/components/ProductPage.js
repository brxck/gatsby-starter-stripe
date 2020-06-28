import React, { useContext, useState } from "react"
import PropTypes from "prop-types"
import Img from "gatsby-image"
import { ProductsContext } from "./ProductsProvider"
import { CartContext } from "./CartProvider"

const ProductPage = ({ productId }) => {
  const { products } = useContext(ProductsContext)
  const { add, toggle } = useContext(CartContext)

  const product = products[productId]
  const [activeSku, setActiveSku] = useState(product.skus[0])
  const [imageIndex, setImageIndex] = useState(0)

  const images = [...product?.localFiles]
  if (activeSku?.localFiles?.[0]) {
    images.unshift(activeSku.localFiles[0])
  }
  const activeImage = images[imageIndex].childImageSharp.fluid

  const onSkuChange = e => {
    setImageIndex(0)
    setActiveSku(product.skus[e.target.value])
  }

  const onImageClick = () => {
    setImageIndex((imageIndex + 1) % images.length)
  }

  return (
    <div style={{ margin: "0 auto", maxWidth: 500 }}>
      <div
        style={{
          margin: "3rem auto",
          maxWidth: 300,
          cursor: "pointer",
        }}
        onClick={onImageClick}
      >
        {activeImage && <Img fluid={activeImage} />}
      </div>

      <h2>{product.name}</h2>
      <div>
        <em>{product.caption}</em>
      </div>

      <br />
      <div style={{ textAlign: "justify" }}>{product.description}</div>
      <br />

      {product.skus.length > 1 && (
        <select name="sku" id="sku" onChange={onSkuChange}>
          {product.skus.map((sku, i) => {
            return (
              <option value={i} key={sku.id}>
                {sku.attributes.name}
              </option>
            )
          })}
        </select>
      )}

      <br />

      <button
        onClick={() => {
          add(activeSku.id)
          toggle(true)
        }}
      >
        {product.skus[0].inventory.quantity === 0 ? "Sold Out" : "Add To Cart"}
      </button>
    </div>
  )
}

ProductPage.propTypes = {
  productId: PropTypes.string.isRequired,
}

export default ProductPage

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
  const activeImage =
    activeSku?.localFiles[0]?.childImageSharp.fluid ||
    product?.localFiles[0]?.childImageSharp.fluid

  const onSkuChange = e => setActiveSku(product.skus[e.target.value])

  return (
    <div style={{ margin: "0 auto", maxWidth: 500 }}>
      <div style={{ margin: "3rem auto", maxWidth: 300 }}>
        {activeImage && <Img fluid={activeImage} />}
      </div>

      <h2>{product.name}</h2>
      <div>
        <em>{product.caption}</em>
      </div>
      <br />

      <div style={{ textAlign: "justify" }}>{product.description}</div>

      {product.skus.length > 0 && (
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

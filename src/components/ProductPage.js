import React, { useContext, useState } from "react"
import PropTypes from "prop-types"
import Img from "gatsby-image"
import { ProductsContext } from "./ProductsProvider"
import { CartContext } from "./CartProvider"

const ProductPage = ({ productId }) => {
  const { products } = useContext(ProductsContext)
  const { add, toggle } = useContext(CartContext)

  const product = products[productId]
  const namedSkus = product.skus.filter(({ name }) => name)
  const images = namedSkus.map(({ image }) => image)

  const defaultSku = namedSkus.length ? namedSkus[0] : product.skus[0]
  const [activeSku, setActiveSku] = useState(defaultSku)

  const defaultImage = product?.localFiles[0].childImageSharp.fluid
  const activeImage = activeSku?.image

  const onSkuChange = e => setActiveSku(namedSkus[e.target.value])

  return (
    <div style={{ margin: "0 auto", maxWidth: 500 }}>
      <div style={{ margin: "3rem auto", maxWidth: 300 }}>
        {images.map(image => (
          <img
            key={image}
            src={image}
            alt={activeSku.name}
            loading="lazy"
            style={{ display: activeImage === image ? "initial" : "none" }}
          />
        ))}
        {defaultImage && !activeImage && <Img fluid={defaultImage} />}
      </div>

      <h2>{product.name}</h2>
      <div>
        <em>{product.caption}</em>
      </div>
      <br />

      <div style={{ textAlign: "justify" }}>{product.description}</div>

      <button
        style={{ margin: "2rem 0" }}
        onClick={() => {
          add(activeSku.id)
          toggle(true)
        }}
      >
        {product.skus[0].inventory.quantity === 0 ? "Sold Out" : "Add To Cart"}
      </button>

      {namedSkus.length > 0 && (
        <select
          name="sku"
          id="sku"
          onChange={onSkuChange}
          style={{ marginLeft: "1rem" }}
        >
          {namedSkus.map((sku, i) => {
            return (
              <option value={i} key={sku.id}>
                {sku.name}
              </option>
            )
          })}
        </select>
      )}
    </div>
  )
}

ProductPage.propTypes = {
  productId: PropTypes.string.isRequired,
}

export default ProductPage

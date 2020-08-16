import React, { useContext } from "react"
import PropTypes from "prop-types"
import { StripeProductsContext } from "./StripeProductsProvider"

import ProductForm from "./ProductForm"

function ProductPage({ productId, create }) {
  const { products } = useContext(StripeProductsContext)
  if (create) {
    const product = { prices: [], images: [] }
    return <ProductForm product={product} create></ProductForm>
  } else if (productId && products[productId]) {
    const product = products[productId]
    return <ProductForm product={product} create={false}></ProductForm>
  } else {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <div>Loading...</div>
      </div>
    )
  }
}

ProductPage.propTypes = {
  productId: PropTypes.string,
  create: PropTypes.bool,
}

export default ProductPage

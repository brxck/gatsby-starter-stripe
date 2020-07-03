import React, { useContext } from "react"
import PropTypes from "prop-types"
import { AdminProductsContext } from "./AdminProductsProvider"

import AdminProductForm from "./AdminProductForm"

function AdminProductPage({ productId, create }) {
  const { products } = useContext(AdminProductsContext)
  if (create) {
    const product = { skus: [{ inventory: { type: "infinite" }, price: "" }] }
    return <AdminProductForm product={product} create></AdminProductForm>
  } else if (productId && products[productId]) {
    const product = products[productId]
    return (
      <AdminProductForm product={product} create={false}></AdminProductForm>
    )
  } else {
    return <div>Loading...</div>
  }
}

AdminProductPage.propTypes = {
  productId: PropTypes.string,
  create: PropTypes.bool,
}

export default AdminProductPage

import React, { useContext } from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

import { ProductsContext } from "./ProductsProvider"

export const AdminProductForm = ({ productId }) => {
  const { listProducts } = useContext(ProductsContext)
  const products = listProducts()

  return (
    <ul>
      {products.map(({ id, name }) => (
        <Link to={`/admin/product/${id}`} key={id}>
          <li>{name}</li>
        </Link>
      ))}
    </ul>
  )
}
AdminProductForm.propTypes = {
  productId: PropTypes.string.isRequired,
}

export default AdminProductForm

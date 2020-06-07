import React, { useContext } from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

import { AdminProductsContext } from "./AdminProductsProvider"

export const AdminProductForm = ({ productId }) => {
  const { listProducts } = useContext(AdminProductsContext)
  const products = listProducts()

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Inventory</th>
          </tr>
        </thead>
        <tbody>
          {products.map(({ id, name, skus, active }) => (
            <>
              <tr key={id}>
                <td>
                  <input type="checkbox" checked={active} readOnly />{" "}
                  <Link to={`/admin/product/${id}`}>{name}</Link>
                </td>
                {skus.length === 1 && (
                  <>
                    <td>${(skus[0].price / 100).toFixed(2)}</td>
                    <td>
                      {skus[0].inventory.value ??
                        skus[0].inventory.quantity ??
                        "∞"}
                    </td>
                  </>
                )}
              </tr>
              {skus.length > 1 &&
                skus.map(({ id, price, inventory, attributes }) => (
                  <tr key={id}>
                    <td>
                      <span style={{ marginLeft: "2rem" }}>
                        {attributes.name}
                      </span>
                    </td>
                    <td>${(price / 100).toFixed(2)}</td>
                    <td>
                      {skus[0].inventory.value ??
                        skus[0].inventory.quantity ??
                        "∞"}
                    </td>
                  </tr>
                ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  )
}
AdminProductForm.propTypes = {
  productId: PropTypes.string.isRequired,
}

export default AdminProductForm

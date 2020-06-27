import React, { useContext } from "react"
import { Link } from "gatsby"

import { AdminProductsContext } from "./AdminProductsProvider"

export const AdminProductList = () => {
  const { listProducts } = useContext(AdminProductsContext)
  const products = listProducts()

  return (
    <div>
      <div>
        <Link to="/admin/products/create">
          <button>Add Product</button>
        </Link>
      </div>
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
            <React.Fragment key={id}>
              <tr>
                <td>
                  <input type="checkbox" checked={active} readOnly />{" "}
                  <Link to={`/admin/products/${id}`}>{name}</Link>
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
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminProductList
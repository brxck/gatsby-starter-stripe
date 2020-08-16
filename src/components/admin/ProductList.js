import React, { useContext } from "react"
import { Link } from "gatsby"

import { StripeProductsContext } from "./StripeProductsProvider"

export const ProductList = () => {
  const { listProducts } = useContext(StripeProductsContext)
  const products = listProducts()

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <div style={{ textAlign: "right", padding: "0.5rem 1rem" }}>
        <Link to="/admin/products/create" className="button">
          + Add Product
        </Link>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map(({ id, name, prices, active }) => (
            <React.Fragment key={id}>
              <tr>
                <td>
                  <input type="checkbox" checked={active} readOnly />{" "}
                  <Link to={`/admin/products/${id}`}>{name}</Link>
                </td>
                <td>
                  {prices.length === 1
                    ? (prices[0].unit_amount / 100).toFixed(2)
                    : "-"}
                </td>
              </tr>
              {prices.length > 1 &&
                prices.map(
                  ({ id, unit_amount: unitAmount, nickname, active }) => (
                    <tr key={id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={active}
                          readOnly
                          style={{ marginLeft: "2rem" }}
                        />{" "}
                        <span>{nickname}</span>
                      </td>
                      <td>{(unitAmount / 100).toFixed(2)}</td>
                    </tr>
                  )
                )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProductList

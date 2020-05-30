import React, { useContext } from "react"
import PropTypes from "prop-types"
import { ProductsContext } from "./ProductsProvider"

export const AdminProductForm = ({ productId }) => {
  const { products } = useContext(ProductsContext)
  const product = products[productId]
  const handleChange = () => {}
  const handleCurrencyChange = () => {}
  const openWidget = () => {}
  const submit = () => {}
  return (
    <div>
      <form method="POST">
        <fieldset>
          <label htmlFor="name">
            Name
            <input
              id="name"
              name="product.name"
              type="text"
              required
              onChange={handleChange}
              defaultValue={product.name}
            />
          </label>

          <label htmlFor="caption">
            Caption
            <input
              id="caption"
              name="product.caption"
              type="text"
              required
              onChange={handleChange}
              defaultValue={product.caption}
            />
          </label>

          <label htmlFor="description">
            Description
            <textarea
              id="description"
              name="product.description"
              cols="30"
              rows="5"
              onChange={handleChange}
              defaultValue={product.description}
            />
          </label>

          {product.skus.map(sku => (
            <>
              <label htmlFor="quantity">
                Quantity
                <input
                  id="quantity"
                  name="sku.inventory.quantity"
                  type="number"
                  required
                  onChange={handleChange}
                  defaultValue={sku.inventory.quantity}
                />
              </label>

              <label htmlFor="price">
                Price
                <input
                  id="price"
                  name="sku.price"
                  type="number"
                  min="1.00"
                  step="0.01"
                  required
                  onChange={handleCurrencyChange}
                  defaultValue={sku.price / 100}
                />
              </label>
            </>
          ))}

          <div>
            <button onClick={openWidget}>Upload Images</button>
            <button onClick={submit} type="submit">
              Save
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  )
}
AdminProductForm.propTypes = {
  productId: PropTypes.string.isRequired,
}

export default AdminProductForm

import React, { useContext } from "react"
import PropTypes from "prop-types"
import { navigate } from "gatsby"
import { useForm, useFieldArray } from "react-hook-form"
import { AdminProductsContext } from "./AdminProductsProvider"

export const AdminProductForm = ({ product, create }) => {
  const { fetchProducts } = useContext(AdminProductsContext)

  const pricesToDecimal = skus => {
    return skus.map(sku => {
      sku.price = (sku.price / 100).toFixed(2)
      return sku
    })
  }

  const pricesToInteger = skus => {
    return skus.map(sku => {
      sku.price = parseFloat(sku.price) * 100
      return sku
    })
  }

  const onSubmit = async data => {
    const body = JSON.stringify({
      product: data.product,
      skus: pricesToInteger(data.skus),
      productId: product.id,
    })
    const path = create ? "productCreate" : "productUpdate"
    await fetch(`/.netlify/functions/${path}`, {
      method: "POST",
      body,
    })
    fetchProducts()
    alert("saved")
    navigate("/admin")
  }

  const { register, handleSubmit, control, watch, getValues } = useForm({
    defaultValues: {
      product,
      skus: pricesToDecimal(product.skus),
    },
  })

  const { fields: skuFields, append, remove } = useFieldArray({
    control,
    name: "skus",
    keyName: "fieldId",
  })

  // Watch to ensure rerender on sku field change
  const skus = watch("skus")

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>
        {product.id ? "Update" : "Create"} Product
      </h2>{" "}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Name
          <input
            ref={register({ required: true, max: 5000 })}
            name="product.name"
            type="text"
          />
        </label>
        <label>
          Caption
          <input
            ref={register({ max: 5000 })}
            name="product.caption"
            type="text"
          />
        </label>
        <label>
          Description
          <textarea
            ref={register({ max: 5000 })}
            name="product.description"
            cols="30"
            rows="5"
          />
        </label>
        <label>
          Active{" "}
          <input type="checkbox" ref={register()} name="product.active" />
        </label>
        <br />
        <h3 style={{ textAlign: "center" }}>SKUs</h3>
        {skuFields.map(({ fieldId }, i) => (
          <div
            key={fieldId}
            style={{ marginBottom: "1rem", position: "relative" }}
          >
            <input type="hidden" name={`skus[${i}].id`} ref={register()} />
            {skus.length > 1 && (
              <>
                <hr />
                <span
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    padding: "0.75rem",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    remove(i)
                  }}
                >
                  &times;
                </span>
                <label>
                  Name
                  <input
                    ref={register({ required: true, max: 5000 })}
                    name={`skus[${i}].attributes.name`}
                    type="text"
                  />
                </label>
              </>
            )}
            <label>
              Inventory
              <select
                ref={register({ required: true })}
                name={`skus[${i}].inventory.type`}
                type="number"
              >
                <option value="finite">Finite</option>
                <option value="bucket">Bucket</option>
                <option value="infinite">Infinite</option>
              </select>
            </label>
            {getValues(`skus[${i}].inventory.type`) === "bucket" && (
              <label>
                Type
                <select
                  ref={register({ required: true })}
                  name={`skus[${i}].inventory.value`}
                  type="number"
                >
                  <option value="in_stock">In Stock</option>
                  <option value="limited">Limited</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </label>
            )}
            {getValues(`skus[${i}].inventory.type`) === "finite" && (
              <label>
                Quantity
                <input
                  ref={register({ required: true })}
                  name={`skus[${i}].inventory.quantity`}
                  type="number"
                />
              </label>
            )}
            <label>
              Price
              <input
                ref={register({ required: true, min: 0.01 })}
                name={`skus[${i}].price`}
                type="number"
                step="0.01"
              />
            </label>
          </div>
        ))}
        <hr />
        <div>
          <button onClick={append}>Add SKU</button>{" "}
          <button type="submit">Save Product</button>
        </div>
      </form>
    </div>
  )
}

AdminProductForm.propTypes = {
  product: PropTypes.object.isRequired,
  create: PropTypes.bool.isRequired,
}

export default AdminProductForm

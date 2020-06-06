import React, { useContext } from "react"
import PropTypes from "prop-types"
import { AdminProductsContext } from "./AdminProductsProvider"
import { useForm, useFieldArray } from "react-hook-form"

export const AdminProductForm = ({ productId }) => {
  const { products } = useContext(AdminProductsContext)
  const product = productId ? products[productId] : {}
  const { register, handleSubmit, control, errors, getValues } = useForm({
    defaultValues: { product, skus: product.skus },
  })
  const { fields: skus, append, remove } = useFieldArray({
    control,
    name: "skus",
  })
  const openWidget = () => {}
  const onSubmit = data => console.log(data)

  const submit = () => {}
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
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
            Active
            <input
              type="checkbox"
              ref={register({ max: 5000 })}
              name="product.description"
            />
          </label>

          <button onClick={append}>Add Variant</button>

          {skus.map((sku, i) => (
            <div key={sku.id}>
              <button onClick={() => remove(i)}>Delete Variant</button>
              <label>
                Inventory Type
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
                  Quantity
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
  productId: PropTypes.string,
}

export default AdminProductForm

import React, { useContext } from "react"
import PropTypes from "prop-types"
import { AdminProductsContext } from "./AdminProductsProvider"
import { useForm, useFieldArray } from "react-hook-form"

export const AdminProductForm = ({ productId }) => {
  const { products } = useContext(AdminProductsContext)
  const product = productId ? products[productId] : {}
  const { register, handleSubmit, control, watch, getValues } = useForm({
    defaultValues: { product, skus: product.skus },
  })
  const { fields: skus, append, remove } = useFieldArray({
    control,
    name: "skus",
  })
  const openWidget = () => {}
  const onSubmit = data => console.log(data)

  // Watch to ensure rerender on sku field change
  // eslint-disable-next-line no-unused-vars
  const _skus = watch("skus")

  const submit = () => {}
  return (
    <div>
      <h2>{product.id ? "Update" : "Create"} Product</h2>{" "}
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
          <input
            type="checkbox"
            ref={register({ max: 5000 })}
            name="product.description"
          />
        </label>

        {skus.map(({ id }, i) => (
          <div key={id}>
            {skus.length > 1 && (
              <label>
                Name
                <input
                  ref={register({ required: true, max: 5000 })}
                  name={`skus[${i}].name`}
                  type="text"
                />
              </label>
            )}
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
            {skus.length > 1 && (
              <button onClick={() => remove(i)}>Delete Variant</button>
            )}
          </div>
        ))}

        <div>
          <button onClick={append}>Add Variant</button>{" "}
          <button onClick={openWidget}>Upload Images</button>{" "}
          <button onClick={submit} type="submit">
            Save Product
          </button>
        </div>
      </form>
    </div>
  )
}
AdminProductForm.propTypes = {
  productId: PropTypes.string,
}

export default AdminProductForm

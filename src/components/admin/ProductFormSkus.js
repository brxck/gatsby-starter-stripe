import React from "react"
import PropTypes from "prop-types"

import css from "./ProductFormSkus.module.css"

function ProductFormSkus({ skusFieldArray, register, getValues, watch }) {
  const { fields, remove } = skusFieldArray
  watch("skus") // Watch sku values to ensure rerender on sku field change
  return (
    <div>
      {fields.map(({ fieldId }, i) => (
        <div key={fieldId} className={css.sku}>
          <input type="hidden" name={`skus[${i}].id`} ref={register()} />

          <div className={css.image}>
            {getValues(`skus[${i}].image`) ? (
              <img
                src={getValues(`skus[${i}].image`)}
                alt={`Could not load image`}
              />
            ) : (
              <span>No image.</span>
            )}
          </div>

          <div>
            {fields.length > 1 && (
              <label>
                Name
                <input
                  ref={register({ required: true, max: 5000 })}
                  name={`skus[${i}].attributes.name`}
                  type="text"
                />
              </label>
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
            <label>
              Image
              <input
                ref={register({ max: 5000 })}
                name={`skus[${i}].image`}
                type="text"
              />
            </label>
            <button onClick={() => remove(i)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}

ProductFormSkus.propTypes = {
  skusFieldArray: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  getValues: PropTypes.func.isRequired,
  watch: PropTypes.func.isRequired,
}

export default ProductFormSkus

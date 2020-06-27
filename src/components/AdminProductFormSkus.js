import React from "react"
import PropTypes from "prop-types"

function AdminProductFormSkus({ skusFieldArray, register, getValues, watch }) {
  const { fields, append, remove } = skusFieldArray
  // Watch to ensure rerender on sku field change
  const skus = watch("skus")
  return (
    <div>
      {fields.map(({ fieldId }, i) => (
        <div
          key={fieldId}
          style={{ marginBottom: "1rem", position: "relative" }}
        >
          <input type="hidden" name={`skus[${i}].id`} ref={register()} />
          {/* Single skus can be unnamed/inherit the product name.  */}
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
          <label>
            Image
            <input
              ref={register({ max: 5000 })}
              name={`skus[${i}].image`}
              type="text"
            />
          </label>
        </div>
      ))}
      <button onClick={append}>Add SKU</button>{" "}
    </div>
  )
}

AdminProductFormSkus.propTypes = {
  skusFieldArray: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  getValues: PropTypes.func.isRequired,
  watch: PropTypes.func.isRequired,
}

export default AdminProductFormSkus

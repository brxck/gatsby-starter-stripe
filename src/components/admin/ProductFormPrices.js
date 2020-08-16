import React from "react"
import PropTypes from "prop-types"

import css from "./ProductFormPrices.module.css"

function ProductFormPrices({ pricesFieldArray, register, getValues, watch }) {
  const { fields, remove } = pricesFieldArray
  watch("prices") // Watch price values to ensure rerender on price field change
  return (
    <div>
      {fields.map(({ fieldId }, i) => (
        <div key={fieldId} className={css.price}>
          {/* We want to include id in the submitted data, but it shouldn't be editable.  */}
          <input type="hidden" name={`prices[${i}].id`} ref={register()} />
          <label className={css.name}>
            Name
            <input
              ref={register({ required: fields.length > 1 })}
              name={`prices[${i}].nickname`}
              type="text"
            />
          </label>
          <label className={css.amount}>
            Price
            <input
              ref={register({ required: true, min: 0.01 })}
              name={`prices[${i}].unit_amount`}
              type="number"
              step="0.01"
              readOnly={
                getValues(`prices[${i}].id`) /* Amounts cannot be updated */
              }
            />
          </label>
          <button onClick={() => remove(i)}>Delete</button>
        </div>
      ))}
    </div>
  )
}

ProductFormPrices.propTypes = {
  pricesFieldArray: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  getValues: PropTypes.func.isRequired,
  watch: PropTypes.func.isRequired,
}

export default ProductFormPrices

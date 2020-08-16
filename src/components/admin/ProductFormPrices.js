import React from "react"
import PropTypes from "prop-types"

function ProductFormPrices({ pricesFieldArray, register, getValues, watch }) {
  const { fields } = pricesFieldArray
  watch("prices") // Watch price values to ensure rerender on price field change
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Active</th>
        </tr>
      </thead>
      <tbody>
        {fields.map(({ fieldId }, i) => (
          <tr key={fieldId}>
            {/* We want to include id in the submitted data, but it shouldn't be editable.  */}
            <td>
              <input type="hidden" name={`prices[${i}].id`} ref={register()} />
              <input
                ref={register({ required: fields.length > 1 })}
                name={`prices[${i}].nickname`}
                type="text"
              />
            </td>
            <td style={{ width: "30%" }}>
              <input
                ref={register({ required: true, min: 0.01 })}
                name={`prices[${i}].unit_amount`}
                type="number"
                step="0.01"
                readOnly={
                  getValues(`prices[${i}].id`) /* Amounts cannot be updated */
                }
              />
            </td>
            <td style={{ textAlign: "center" }}>
              <input
                style={{ marginTop: 10 }}
                ref={register()}
                type="checkbox"
                name={`prices[${i}].active`}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

ProductFormPrices.propTypes = {
  pricesFieldArray: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  getValues: PropTypes.func.isRequired,
  watch: PropTypes.func.isRequired,
}

export default ProductFormPrices

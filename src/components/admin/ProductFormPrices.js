import React from "react"
import PropTypes from "prop-types"

function ProductFormPrices({ prices, setPrices }) {
  const onChange = i => e => {
    const updatedPrices = [...prices]
    const { name, checked, value, type } = e.target
    updatedPrices[i][name] = type === "checkbox" ? checked : value
    setPrices(updatedPrices)
  }

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
        {prices.map((price, i) => (
          <tr key={price.id || i}>
            <td>
              <input
                className="mb-2 form-input"
                name="nickname"
                type="text"
                value={price.nickname}
                onChange={onChange(i)}
              />
            </td>
            <td style={{ width: "30%" }}>
              <input
                className="mb-2 form-input"
                name="unit_amount"
                type="number"
                step="0.01"
                disabled={Boolean(price.id) /* Amounts cannot be updated */}
                value={price.unit_amount}
                onChange={onChange(i)}
              />
            </td>
            <td style={{ textAlign: "center" }}>
              <input
                className="form-checkbox"
                type="checkbox"
                name="active"
                checked={price.active}
                onChange={onChange(i)}
                style={{ marginTop: 10 }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

ProductFormPrices.propTypes = {
  prices: PropTypes.array.isRequired,
  setPrices: PropTypes.func.isRequired,
}

export default ProductFormPrices

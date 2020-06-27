import React from "react"
import PropTypes from "prop-types"

function AdminProductFormImages({ imagesFieldArray, register }) {
  const { fields, append, remove } = imagesFieldArray
  return (
    <div>
      {fields.map(({ fieldId }, i) => (
        <input
          key={fieldId}
          style={{ marginBottom: "1rem", position: "relative" }}
          ref={register({ required: true, max: 5000 })}
          name={`product.images[${i}]`}
          type="text"
        />
      ))}
    </div>
  )
}

AdminProductFormImages.propTypes = {
  imageFieldArray: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  getValues: PropTypes.func.isRequired,
  watch: PropTypes.func.isRequired,
}

export default AdminProductFormImages

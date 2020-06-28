import React from "react"
import PropTypes from "prop-types"

import css from "./AdminProductFormImages.module.css"

function AdminProductFormImages(props) {
  const { imagesFieldArray, register, getValues, watch } = props
  const { fields, remove } = imagesFieldArray
  // Watch to ensure rerender
  watch("product.images")
  return (
    <div className={css.container}>
      {fields.map(({ fieldId }, i) => (
        <div key={fieldId} className={css.image}>
          <img
            src={getValues(`product.images[${i}]`)}
            alt={"Could not load image"}
          />
          <div className={css.input}>
            <input
              ref={register({ required: true, max: 5000 })}
              name={`product.images[${i}]`}
              type="text"
            />
            <button onClick={() => console.log(i) || remove(i)}>&times;</button>
          </div>
        </div>
      ))}
    </div>
  )
}

AdminProductFormImages.propTypes = {
  imagesFieldArray: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  getValues: PropTypes.func.isRequired,
  watch: PropTypes.func.isRequired,
}

export default AdminProductFormImages

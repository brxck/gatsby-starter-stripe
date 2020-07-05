import React, { useRef } from "react"
import PropTypes from "prop-types"

import css from "./ProductFormImages.module.css"

function ProductFormImages({ productImages, setProductImages }) {
  const add = src => setProductImages([...productImages, src])
  const remove = src => setProductImages(productImages.filter(x => x !== src))

  const input = useRef()

  return (
    <>
      <div>
        <label className={css.addImage}>
          URL{" "}
          <input
            type="text"
            className={css.imageInput}
            placeholder="https://..."
            ref={input}
          />
          <button
            onClick={() => {
              add(input.current.value)
              input.current.value = ""
            }}
          >
            Add Image
          </button>
        </label>
      </div>
      <div className={css.container}>
        {productImages.map(src => (
          <div className={css.image} key={src}>
            <button onClick={() => remove(src)} className={css.remove}>
              &times;
            </button>
            <img src={src} alt={"Could not load image"} />
          </div>
        ))}
      </div>
    </>
  )
}

ProductFormImages.propTypes = {
  productImages: PropTypes.object.isRequired,
  setProductImages: PropTypes.func.isRequired,
}

export default ProductFormImages

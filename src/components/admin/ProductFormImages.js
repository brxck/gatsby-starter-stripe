import React, { useRef } from "react"
import PropTypes from "prop-types"

import * as css from "./ProductFormImages.module.css"

function ProductFormImages({ images, setImages }) {
  const add = src => setImages([...images, src])
  const remove = src => setImages(images.filter(x => x !== src))

  const input = useRef()

  return (
    <>
      <div>
        <label className={css.addImage}>
          URL <input type="text" placeholder="https://..." ref={input} />
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
        {images.map(src => (
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
  images: PropTypes.array.isRequired,
  setImages: PropTypes.func.isRequired,
}

export default ProductFormImages

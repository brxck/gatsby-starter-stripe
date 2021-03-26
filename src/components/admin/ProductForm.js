import React, { useContext, useState, useEffect } from "react"
import PropTypes from "prop-types"
import { navigate } from "gatsby"
import { useForm } from "react-hook-form"

import { StripeProductsContext } from "./StripeProductsProvider"
import ProductFormPrices from "./ProductFormPrices"
import ProductFormImages from "./ProductFormImages"
import * as css from "./ProductForm.module.css"

export const ProductForm = ({ product, create }) => {
  const pricesToDecimal = prices => {
    return prices.map(price => {
      price.unit_amount = (price.unit_amount / 100).toFixed(2)
      return price
    })
  }

  const addPrice = () => {
    setPrices([...prices, { active: true, unit_amount: 0, name: "" }])
  }

  const pricesToInteger = prices => {
    return prices.map(price => {
      price.unit_amount = parseFloat(price.unit_amount) * 100
      return price
    })
  }

  const authFetch = (url, options) => {
    const user = JSON.parse(localStorage.getItem("gotrue.user"))
    const headers = { Authorization: `Bearer ${user.token.access_token}` }
    return fetch(url, {
      ...options,
      headers,
    })
  }

  const onDelete = async e => {
    e.preventDefault()
    await authFetch(`/.netlify/functions/productDelete`, {
      method: "DELETE",
      body: JSON.stringify({ productId: product.id }),
    })
    fetchProducts()
    alert("Product deleted.")
    navigate("/admin")
  }

  const onSubmit = async data => {
    const body = JSON.stringify({
      product: { ...data.product, images: images },
      prices: pricesToInteger(data.prices),
      productId: product.id,
    })
    const path = create ? "productCreate" : "productUpdate"
    await authFetch(`/.netlify/functions/${path}`, {
      method: "POST",
      body,
    })
    fetchProducts()
    alert("Product saved.")
    navigate("/admin")
  }

  const { fetchProducts } = useContext(StripeProductsContext)
  const [images, setImages] = useState(product.images)
  const [prices, setPrices] = useState(pricesToDecimal(product.prices))
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { product },
  })

  useEffect(() => {
    reset({ product })
    setImages(product.images)
    setPrices(pricesToDecimal(product.prices))
  }, [product, reset])

  return (
    <>
      <div className={css.controls}>
        <div className="">
          {product.id && (
            <button onClick={onDelete} disabled={prices.length}>
              Delete Product
            </button>
          )}
          <button onClick={handleSubmit(onSubmit)}>Save Product</button>
        </div>
      </div>

      <div className={css.container}>
        <div className={css.product}>
          <div className={css.header}>
            <h3>{product.id ? "Update" : "Create"} Product</h3>
            <label>
              <input type="checkbox" ref={register()} name="product.active" />{" "}
              Active
            </label>
          </div>
          <label>
            Name
            <input
              ref={register({ required: true, max: 5000 })}
              name="product.name"
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

          <div className={css.header}>
            <h3>Prices</h3>
            <button onClick={addPrice}>Add Price</button>
          </div>
          <ProductFormPrices
            prices={prices}
            setPrices={setPrices}
          ></ProductFormPrices>
        </div>

        <div className={css.images}>
          <div className={css.header}>
            <h3>Images</h3>
          </div>
          <ProductFormImages
            images={images}
            setImages={setImages}
          ></ProductFormImages>
        </div>
      </div>
    </>
  )
}

ProductForm.propTypes = {
  product: PropTypes.object.isRequired,
  create: PropTypes.bool.isRequired,
}

export default ProductForm

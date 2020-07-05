import React, { useContext, useState } from "react"
import PropTypes from "prop-types"
import { navigate } from "gatsby"
import { useForm, useFieldArray } from "react-hook-form"

import { StripeProductsContext } from "./StripeProductsProvider"
import ProductFormSkus from "./ProductFormSkus"
import ProductFormImages from "./ProductFormImages"
import css from "./ProductForm.module.css"

export const ProductForm = ({ product, create }) => {
  const { fetchProducts } = useContext(StripeProductsContext)
  const [productImages, setProductImages] = useState(product.images)

  const pricesToDecimal = skus => {
    return skus.map(sku => {
      sku.price = (sku.price / 100).toFixed(2)
      return sku
    })
  }

  const pricesToInteger = skus => {
    return skus.map(sku => {
      sku.price = parseFloat(sku.price) * 100
      return sku
    })
  }

  const onDelete = async e => {
    e.preventDefault()
    await fetch(`/.netlify/functions/productDelete`, {
      method: "DELETE",
      body: JSON.stringify({ productId: product.id }),
    })
    fetchProducts()
    alert("Product deleted.")
    navigate("/admin")
  }

  const onSubmit = async data => {
    const body = JSON.stringify({
      product: { ...data.product, images: productImages },
      skus: pricesToInteger(data.skus),
      productId: product.id,
    })
    const path = create ? "productCreate" : "productUpdate"
    await fetch(`/.netlify/functions/${path}`, {
      method: "POST",
      body,
    })
    fetchProducts()
    alert("Product saved.")
    navigate("/admin")
  }

  const { register, handleSubmit, control, watch, getValues } = useForm({
    defaultValues: {
      product,
      skus: pricesToDecimal(product.skus),
    },
  })

  const skusFieldArray = useFieldArray({
    control,
    name: "skus",
    keyName: "fieldId",
  })

  return (
    <>
      <div className={css.controls}>
        <div className="">
          {product.id && <button onClick={onDelete}>Delete Product</button>}
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
            Caption
            <input
              ref={register({ max: 5000 })}
              name="product.caption"
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
            <h3>Images</h3>
          </div>
          <ProductFormImages
            productImages={productImages}
            setProductImages={setProductImages}
          ></ProductFormImages>
        </div>

        <div className={css.skus}>
          <div className={css.header}>
            <h3>SKUs</h3>
            <button onClick={skusFieldArray.append}>Add SKU</button>
          </div>
          <ProductFormSkus
            skusFieldArray={skusFieldArray}
            register={register}
            getValues={getValues}
            watch={watch}
          ></ProductFormSkus>
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

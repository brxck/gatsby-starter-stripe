import React, { useContext } from "react"
import PropTypes from "prop-types"
import { navigate } from "gatsby"
import { useForm, useFieldArray } from "react-hook-form"

import { AdminProductsContext } from "./AdminProductsProvider"
import AdminProductFormSkus from "./AdminProductFormSkus"
import AdminProductFormImages from "./AdminProductFormImages"

import styles from "./AdminProductForm.module.css"

export const AdminProductForm = ({ product, create }) => {
  const { fetchProducts } = useContext(AdminProductsContext)

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
      product: data.product,
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

  const imagesFieldArray = useFieldArray({
    control,
    name: "product.images",
    keyName: "fieldId",
  })

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>
        {product.id ? "Update" : "Create"} Product
      </h2>{" "}
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <label>
          Active{" "}
          <input type="checkbox" ref={register()} name="product.active" />
        </label>
        <h3 style={{ textAlign: "center" }}>Images</h3>
        <AdminProductFormImages
          imagesFieldArray={imagesFieldArray}
          register={register}
        ></AdminProductFormImages>

        <br />
        <h3 style={{ textAlign: "center" }}>SKUs</h3>
        <AdminProductFormSkus
          skusFieldArray={skusFieldArray}
          register={register}
          getValues={getValues}
          watch={watch}
        ></AdminProductFormSkus>
        <hr />
        <div>
          <button type="submit">Save Product</button>{" "}
          <button onClick={onDelete}>Delete Product</button>
        </div>
      </form>
    </div>
  )
}

AdminProductForm.propTypes = {
  product: PropTypes.object.isRequired,
  create: PropTypes.bool.isRequired,
}

export default AdminProductForm

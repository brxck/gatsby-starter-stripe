import React, { useContext } from "react"
import { ProductsContext } from "./ProductsProvider"
import ProductThumbnail from "./ProductThumbnail"

const Items = () => {
  const { listProducts } = useContext(ProductsContext)
  const products = listProducts()
  return (
    <div style={{ columns: "250px auto" }}>
      {products.map(product => (
        <ProductThumbnail key={product.id} product={product} />
      ))}
    </div>
  )
}

export default Items

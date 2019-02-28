import React, { useContext } from 'react'
import { Link } from 'gatsby'

import { ProductsContext } from './ProductsProvider'
import Cart from './Cart'

const Items = () => {
  const { getProducts } = useContext(ProductsContext)
  const products = getProducts()
  return (
    <div
      style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
    >
      <Cart />
      {products.map(product => {
        const image = product.images[0] || product.skus[0].image
        return (
          <Link to={`/buy/${product.slug}`} key={product.id}>
            <div style={{ width: 250, flex: '1 1 auto', margin: 10 }}>
              <p>{product.name}</p>
              <img src={image} alt={product.name} />
              <p>{(product.skus[0].price / 100).toFixed(2)}</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default Items

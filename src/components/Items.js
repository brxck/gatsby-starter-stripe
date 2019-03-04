import React, { useContext } from 'react'
import { Link } from 'gatsby'
import { ProductsContext } from './ProductsProvider'
import { CartContext } from './CartProvider'

const Items = () => {
  const { listProducts } = useContext(ProductsContext)
  const { add } = useContext(CartContext)
  const products = listProducts()
  return (
    <div
      style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
    >
      {products.map(product => {
        const image = product.images[0] || product.skus[0].image
        return (
          <div key={product.id}>
            <Link to={`/buy/${product.slug}`}>
              <div style={{ width: 250, flex: '1 1 auto', margin: 10 }}>
                <p>{product.name}</p>
                <img src={image} alt={product.name} />
                <p>{product.skus[0].price / 100}</p>
              </div>
            </Link>
            <button onClick={() => add(product.skus[0].id)}>+</button>
          </div>
        )
      })}
    </div>
  )
}

export default Items

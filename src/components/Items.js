import React, { Component } from 'react'

import { ProductsContext } from './ProductsProvider'

class Items extends Component {
  static contextType = ProductsContext

  render() {
    const { products } = this.context
    return (
      <>
        {Object.keys(products).map(id => {
          const sku = products[id][0]
          const product = sku.product
          return (
            <div key={id}>
              <p>{product.name}</p>
              <img src={product.images[0]} alt={product.name} />
              <p>{(sku.price / 100).toFixed(2)}</p>
            </div>
          )
        })}
      </>
    )
  }
}

export default Items

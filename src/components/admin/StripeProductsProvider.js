import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"

export const StripeProductsContext = React.createContext()

/**
 * Shares live product & skus data from Stripe through Context.
 */
const StripeProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [skus, setSkus] = useState([])

  useEffect(() => {
    fetchProducts()
  }, [])

  /** Query live data from Stripe and update products */
  const fetchProducts = async () => {
    const { data, error } = await fetch("/.netlify/functions/skuList")
      .then(response => response.json())
      .catch(error => console.error(error))

    if (error) {
      console.error(error)
      return
    }

    const types = extractTypes(data)
    setProducts(types.products)
    setSkus(types.skus)
  }

  return (
    <StripeProductsContext.Provider
      value={{
        fetchProducts,
        products,
        skus,
        listProducts: sortFn => {
          const fn = sortFn || ((a, b) => b.created - a.created)
          return Object.values(products).sort(fn)
        },
      }}
    >
      {children}
    </StripeProductsContext.Provider>
  )
}

StripeProductsProvider.propTypes = {
  children: PropTypes.any.isRequired,
}

const extractTypes = data => {
  const products = {}
  const skus = {}
  data.forEach(sku => {
    const { id } = sku.product
    if (!products[id]) {
      products[id] = { ...sku.product, skus: [] }
    }
    products[id].skus.push(sku)
    skus[sku.id] = sku
  })
  return { products, skus }
}

export default StripeProductsProvider

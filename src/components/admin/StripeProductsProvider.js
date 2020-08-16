import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"

export const StripeProductsContext = React.createContext()

/**
 * Shares live product & prices data from Stripe through Context.
 */
const StripeProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [prices, setPrices] = useState([])

  useEffect(() => {
    fetchProducts()
  }, [])

  /** Query live data from Stripe and update products */
  const fetchProducts = async () => {
    const { data, error } = await fetch("/.netlify/functions/priceList")
      .then(response => response.json())
      .catch(error => console.error(error))

    if (error) {
      console.error(error)
      return
    }

    const types = extractTypes(data)
    setProducts(types.products)
    setPrices(types.prices)
  }

  return (
    <StripeProductsContext.Provider
      value={{
        fetchProducts,
        products,
        prices,
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
  const prices = {}
  data.forEach(price => {
    const { id } = price.product
    if (!products[id]) {
      products[id] = { ...price.product, prices: [] }
    }
    products[id].prices.push(price)
    prices[price.id] = price
  })
  return { products, prices }
}

export default StripeProductsProvider

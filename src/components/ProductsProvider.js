import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

export const ProductsContext = React.createContext()

/**
 * Wrapper to give Provider access to Price nodes from Gatsby's GraphQL store.
 */
const ProductsProvider = ({ children }) => {
  const data = useStaticQuery(pricesQuery)
  return <Provider data={data}>{children}</Provider>
}

ProductsProvider.propTypes = {
  children: PropTypes.any.isRequired,
}

/**
 * Shares Product & Price data through Context.
 * Products are first loaded from Gatsby's GraphQL store and then updated with
 * current information from Stripe.
 */
const Provider = ({ data, children }) => {
  // Load product data from Gatsby store
  const [initialProducts, initialPrices] = processGatsbyData(data)
  const [products, setProducts] = useState(initialProducts)
  const [prices, setPrices] = useState(initialPrices)

  // On render and update, update products with live data
  useEffect(() => {
    updateProducts()
  }, [])

  /** Query live data from Stripe and update products */
  const updateProducts = async () => {
    const { data, error } = await fetch("/.netlify/functions/priceList")
      .then(response => response.json())
      .catch(error => console.error(error))

    if (error) {
      console.error(error)
      return
    }

    const [liveProducts, livePrices] = mergeStripeData(data, products)
    setProducts(liveProducts)
    setPrices(livePrices)
  }

  return (
    <ProductsContext.Provider
      value={{
        products,
        prices,
        listProducts: sortFn => {
          const fn = sortFn || ((a, b) => b.created - a.created)
          return Object.values(products).sort(fn)
        },
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

Provider.propTypes = {
  data: PropTypes.object.isRequired,
  children: PropTypes.any.isRequired,
}

/** Normalize structure of data sourced from Gatsby's GraphQL store */
const processGatsbyData = data => {
  const products = {}
  const prices = {}
  // Price nodes are grouped by product
  data.allStripePrice.group.forEach(group => {
    if (!group.edges[0].node.product.active) return
    const price = group.edges[0].node
    const product = { slug: price.fields.slug, ...price.product }
    product.prices = group.edges.map(({ node }) => {
      prices[node.id] = node
      return node
    })
    products[product.id] = product
  })
  return [products, prices]
}

/** Normalize & merge in structure of live data sourced from Stripe */
const mergeStripeData = (stripeData, products) => {
  const mergedProducts = {}
  const mergedPrices = {}
  stripeData.forEach(stripePrice => {
    if (!stripePrice.product.active) return
    const { id } = stripePrice.product
    const gatsbyPrice = products[id].prices.find(x => x.id === stripePrice.id)
    const updatedPrice = Object.assign(stripePrice, gatsbyPrice)
    if (!mergedProducts[id]) {
      stripePrice.product.slug = products[id].slug
      mergedProducts[id] = {
        ...products[id],
        ...stripePrice.product,
        prices: [],
      }
    }
    mergedProducts[id].prices.push(updatedPrice)
    mergedPrices[updatedPrice.id] = updatedPrice
  })
  return [mergedProducts, mergedPrices]
}

export const priceFragment = graphql`
  fragment Price on StripePrice {
    id
    unit_amount
    nickname
    fields {
      slug
    }
    product {
      id
      name
      description
      active
      created
      updated
      images
      localFiles {
        childImageSharp {
          gatsbyImageData(layout: CONSTRAINED, width: $maxWidth)
        }
      }
    }
  }
`

const pricesQuery = graphql`
  query pricesQuery($maxWidth: Int = 500) {
    allStripePrice {
      group(field: product___id) {
        fieldValue
        edges {
          node {
            ...Price
          }
        }
      }
    }
  }
`

export default ProductsProvider

import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

export const ProductsContext = React.createContext()

/**
 * Wrapper to give Provider access to Sku nodes from Gatsby's GraphQL store.
 */
const ProductsProvider = ({ children }) => {
  const data = useStaticQuery(skusQuery)
  return <Provider data={data}>{children}</Provider>
}

ProductsProvider.propTypes = {
  children: PropTypes.any.isRequired,
}

/**
 * Shares product & sku data through Context.
 * Products are first loaded from Gatsby's GraphQL store and then updated with
 * current information from Stripe.
 */
const Provider = ({ data, children }) => {
  // Load product data from Gatsby store
  const [initialProducts, initialSkus] = processGatsbyData(data)
  const [products, setProducts] = useState(initialProducts)
  const [skus, setSkus] = useState(initialSkus)

  // On render and update, update products with live data
  useEffect(() => {
    updateProducts()
  }, [])

  /** Query live data from Stripe and update products */
  const updateProducts = async () => {
    const { data, error } = await fetch("/.netlify/functions/skuList")
      .then(response => response.json())
      .catch(error => console.error(error))

    if (error) {
      console.error(error)
      return
    }

    const [liveProducts, liveSkus] = mergeStripeData(data, products)
    setProducts(liveProducts)
    setSkus(liveSkus)
  }

  return (
    <ProductsContext.Provider
      value={{
        products,
        skus,
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
  const skus = {}
  // Sku nodes are grouped by product
  data.allStripeSku.group.forEach(group => {
    const sku = group.edges[0].node
    const product = { slug: sku.fields.slug, ...sku.product }
    product.skus = group.edges.map(({ node }) => {
      skus[node.id] = node
      return node
    })
    products[product.id] = product
  })
  return [products, skus]
}

/** Normalize & merge in structure of live data sourced from Stripe */
const mergeStripeData = (stripeData, products) => {
  const stripeProducts = {}
  const stripeSkus = {}
  stripeData.forEach(stripeSku => {
    const { id } = stripeSku.product
    const gatsbySku = products[id].skus.find(x => x.id === stripeSku.id)
    const updatedSku = Object.assign(stripeSku, gatsbySku)
    if (!stripeProducts[id]) {
      stripeSku.product.slug = products[id].slug
      stripeProducts[id] = { ...stripeSku.product, skus: [] }
    }
    stripeProducts[id].skus.push(updatedSku)
    stripeSkus[updatedSku.id] = updatedSku
  })
  return [stripeProducts, stripeSkus]
}

export const skuFragment = graphql`
  fragment Sku on StripeSku {
    id
    price
    fields {
      slug
    }
    inventory {
      type
      quantity
    }
    attributes {
      name
    }
    product {
      id
      name
      description
      active
      caption
      created
      updated
      images
      localFiles {
        childImageSharp {
          fluid(maxWidth: $maxWidth, quality: $quality) {
            ...GatsbyImageSharpFluid_withWebp_tracedSVG
          }
        }
      }
    }
    localFiles {
      childImageSharp {
        fluid(maxWidth: $maxWidth, quality: $quality) {
          ...GatsbyImageSharpFluid_withWebp_tracedSVG
        }
      }
    }
  }
`

const skusQuery = graphql`
  query skusQuery($maxWidth: Int = 500, $quality: Int = 92) {
    allStripeSku {
      group(field: product___id) {
        fieldValue
        edges {
          node {
            ...Sku
          }
        }
      }
    }
  }
`

export default ProductsProvider

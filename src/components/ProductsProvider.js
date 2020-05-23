import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { StaticQuery, graphql } from "gatsby"

export const ProductsContext = React.createContext()

/**
 * Wrapper to give Provider access to Sku nodes from Gatsby's GraphQL store.
 */
const ProductsProvider = ({ children }) => (
  <StaticQuery
    query={skusQuery}
    render={data => <Provider data={data}>{children}</Provider>}
  />
)

ProductsProvider.propTypes = {
  children: PropTypes.any.isRequired,
}

/**
  Shares product information and availability through context.
  Products are first loaded from Gatsby's GraphQL store and then updated with
  current information from Stripe.
*/
const Provider = ({ data, children }) => {
  /** Load product data from Gatsby store */
  const [initialProducts, initialSkus] = processGatsbyData(data)
  const [products, setProducts] = useState(initialProducts)
  const [skus, setSkus] = useState(initialSkus)

  /** On render and update, update products with live data */
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
    }

    const [liveProducts, liveSkus] = processStripeData(data, products)
    setProducts(liveProducts)
    setSkus(liveSkus)
  }

  return (
    <ProductsContext.Provider
      value={{
        products,
        skus,
        listProducts: sort => {
          const fn = sort || ((a, b) => b.created - a.created)
          return Object.values(products).sort(fn)
        },
        listSkus: sort => {
          const fn = sort || ((a, b) => b.created - a.created)
          return Object.values(skus).sort(fn)
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
  const initialProducts = {}
  const initialSkus = {}
  data.allStripeSku.group.forEach(group => {
    const sku = group.edges[0].node
    const product = { slug: sku.fields.slug, ...sku.product }
    product.skus = group.edges.map(({ node }) => {
      initialSkus[node.id] = node
      return node
    })
    initialProducts[product.id] = product
  })
  return [initialProducts, initialSkus]
}

/** Normalize structure of live data sourced from Stripe */
const processStripeData = (stripeData, products) => {
  const liveProducts = {}
  const liveSkus = {}
  stripeData.forEach(stripeSku => {
    const { id } = stripeSku.product
    const gatsbySku = products[id].skus.find(x => x.id === stripeSku.id)
    const updatedSku = Object.assign(stripeSku, gatsbySku)
    updatedSku.name = generateSkuName(updatedSku)
    if (!liveProducts[id]) {
      stripeSku.product.slug = products[id].slug
      liveProducts[id] = { ...stripeSku.product, skus: [] }
    }
    liveProducts[id].skus.push(updatedSku)
    liveSkus[updatedSku.id] = updatedSku
  })
  return [liveProducts, liveSkus]
}

/** Generate a display name for a Sku from its first attribute */
const generateSkuName = sku => {
  if (!sku.attributes || !Object.keys(sku.attributes).length) return null
  return Object.values(sku.attributes)[0]
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
  }
`

const skusQuery = graphql`
  query skusQuery($maxWidth: Int = 300, $quality: Int = 92) {
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

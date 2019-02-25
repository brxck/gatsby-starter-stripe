/*  
  Shares product information and availability through context.
  Products are first loaded from Gatsby's GraphQL store and then updated with current information from Stripe.
*/

import React, { useState, useEffect } from 'react'
import { StaticQuery, graphql } from 'gatsby'

export const ProductsContext = React.createContext()

const ProductsProvider = ({ children }) => (
  <StaticQuery
    query={productSkuQuery}
    render={data => <Provider data={data}>{children}</Provider>}
  />
)

const Provider = ({ data, children }) => {
  // Load product data from Gatsby store
  const initialProducts = {}
  const initialSkus = {}
  data.allStripeSku.group.forEach(group => {
    const product = { ...group.edges[0].node.product }
    product.skus = group.edges.map(({ node }) => {
      initialSkus[node.id] = node
      return node
    })
    initialProducts[product.id] = product
  })
  const [products, setProducts] = useState(initialProducts)
  const [skus, setSkus] = useState(initialSkus)

  // Update products with live Stripe data
  const updateProducts = async () => {
    const { data, error } = await fetch('/.netlify/functions/skuList')
      .then(response => response.json())
      .catch(error => console.error(error))

    if (error) {
      console.error(error)
    }

    const liveProducts = {}
    data.forEach(source => {
      const { id } = source.product
      const target = products[id].skus.find(x => x.id === source.id)
      const updatedSku = Object.assign(target, source)
      if (!liveProducts[id]) {
        liveProducts[id] = { ...source.product, skus: [] }
      }
      liveProducts[id].skus.push(updatedSku)
    })
    setProducts(liveProducts)
  }

  useEffect(() => {
    updateProducts()
  }, [])

  return (
    <ProductsContext.Provider
      value={{
        products: sort => {
          const fn = sort || ((a, b) => b.created - a.created)
          return Object.values(products).sort(fn)
        },
        skus: sort => {
          const fn = sort || ((a, b) => b.created - a.created)
          return Object.values(skus).sort(fn)
        },
        product: id => products[id]
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export const skuFragment = graphql`
  fragment Sku on StripeSku {
    id
    price
    inventory {
      type
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
      metadata {
        category
      }
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

const productSkuQuery = graphql`
  query productSkuQuery($maxWidth: Int = 300, $quality: Int = 92) {
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

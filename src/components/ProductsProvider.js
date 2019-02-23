import React, { Component } from 'react'
import { StaticQuery, graphql } from 'gatsby'

export const ProductsContext = React.createContext()

const ProductsProvider = ({ children }) => (
  <StaticQuery
    query={productSkuQuery}
    render={data => <Provider data={data}>{children}</Provider>}
  />
)

class Provider extends Component {
  constructor(props) {
    super(props)
    const products = props.data.allStripeSku.group
    this.state = {
      products
    }
  }

  render() {
    return (
      <ProductsContext.Provider value={{ ...this.state }}>
        {this.props.children}
      </ProductsContext.Provider>
    )
  }
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

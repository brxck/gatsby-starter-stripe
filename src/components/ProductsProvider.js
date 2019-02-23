import React, { Component } from 'react'
import { StaticQuery, graphql } from 'gatsby'

/*  Shares product information and availability through context.
    Products are first loaded from Gatsby's GraphQL store and then updated with current information from Stripe.    
*/

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
    const products = {}
    const data = props.data.allStripeSku.group.sort(
      (a, b) =>
        b.edges[0].node.product.created - a.edges[0].node.product.created
    )

    data.forEach(
      group =>
        (products[group.fieldValue] = group.edges.map(({ node }) => node))
    )

    this.state = {
      products
    }
  }

  // Update product information from Stripe
  componentDidMount = async () => {
    console.log(this.state.products)
    const { data, error } = await fetch('/.netlify/functions/skuList')
      .then(response => response.json())
      .catch(error => console.error(error))

    if (error) {
      console.error(error)
    }

    const updated = {}
    data.forEach(sku => {
      const target = this.state.products[sku.product.id].find(
        item => item.id === sku.id
      )
      const updatedSku = Object.assign(target, sku)
      if (!updated[sku.product.id]) {
        updated[sku.product.id] = []
      }
      updated[sku.product.id].push(updatedSku)
    })

    console.log(updated)
    this.setState({ products: updated })
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

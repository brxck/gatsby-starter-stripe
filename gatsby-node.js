const path = require('path')
const slug = require('slug')

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  // Add slug for page generation.
  if (node.internal.type === 'StripeSku') {
    const value = slug(node.product.name, slug.defaults.modes['rfc3986'])
    createNodeField({
      node,
      name: 'slug',
      value
    })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  return graphql(`
    {
      allStripeSku {
        edges {
          node {
            fields {
              slug
            }
            product {
              id
              name
              metadata {
                category
              }
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      Promise.reject(result.errors)
    }

    // Create product pages
    const products = {}
    const categories = new Set()

    result.data.allStripeSku.edges.forEach(({ node }) => {
      products[node.product.id] = node.fields.slug
      const { category } = node.product.metadata
      category && categories.add(category)
    })

    const productTemplate = path.resolve('src/templates/ProductTemplate.js')
    Object.entries(products).forEach(([id, slug]) => {
      createPage({
        path: 'buy/' + slug,
        component: productTemplate,
        context: { id }
      })
    })
  })
}

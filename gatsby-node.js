const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  // Add slug for page generation.
  if (node.internal.type === 'StripeProduct') {
    const slug = createFilePath({ node, getNode, basePath: 'pages' })
    createNodeField({
      name: 'slug',
      node,
      value: slug
    })
  }
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return graphql(`
    {
      allStripeSku {
        group(field: product___id, limit: 1) {
          edges {
            node {
              product {
                metadata {
                  category
                }
              }
              fields {
                slug
                path
              }
            }
          }
        }
      }
      allMarkdownRemark {
        edges {
          node {
            fileAbsolutePath
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      Promise.reject(result.errors)
    }

    // Create item pages
    const categories = new Set()
    const ItemTemplate = path.resolve('src/templates/ItemTemplate.js')
    const items = result.data.allStripeSku.group
    items.forEach(({ edges }) => {
      let { node } = edges[0]
      createPage({
        path: 'buy/' + node.fields.slug,
        component: ItemTemplate,
        context: {
          slug: node.fields.slug
        }
      })

      // Add to category list
      const { category } = node.product.metadata
      category && categories.add(category)
    })

    // Create category pages
    const CategoryTemplate = path.resolve('src/templates/CategoryTemplate.js')
    categories.forEach(category => {
      createPage({
        path: `/find/${category}/`,
        component: CategoryTemplate,
        context: { category }
      })
    })
  })
}

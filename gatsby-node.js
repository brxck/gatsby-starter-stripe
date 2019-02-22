const path = require('path')
const slug = require('slug')

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  // Add slug for page generation.
  if (node.internal.type === 'StripeProduct') {
    const value = slug(node.name, slug.defaults.modes['rfc3986'])
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
      allStripeProduct {
        edges {
          node {
            name
            metadata {
              category
            }
            fields {
              slug
            }
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
    result.data.allStripeProduct.edges.forEach(({ node }) => {
      createPage({
        path: 'buy/' + node.fields.slug,
        component: ItemTemplate,
        context: {
          slug: node.fields.slug
        }
      })

      // Add to category list
      const { category } = node.metadata
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

const path = require("path")
const slug = require("slug")

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  // Add slug for page generation.
  if (node.internal.type === "StripePrice") {
    const value = slug(node.product.name, slug.defaults.modes["rfc3986"])
    createNodeField({
      node,
      name: "slug",
      value,
    })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  return graphql(`
    {
      allStripePrice {
        edges {
          node {
            fields {
              slug
            }
            product {
              id
              name
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

    result.data.allStripePrice.edges.forEach(({ node }) => {
      products[node.product.id] = node.fields.slug
    })

    const productTemplate = path.resolve("src/templates/ProductTemplate.js")
    Object.entries(products).forEach(([id, slug]) => {
      createPage({
        path: "buy/" + slug,
        component: productTemplate,
        context: { id },
      })
    })
  })
}

// Allow client-only routes on /admin/*
exports.onCreatePage = async ({ page, actions }) => {
  if (page.path.match(/^\/admin/)) {
    page.matchPath = "/admin/*"
    actions.createPage(page)
  }
}

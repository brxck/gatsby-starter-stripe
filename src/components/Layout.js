import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import Header from "./Header"
import ProductsProvider from "./ProductsProvider"
import CartProvider from "./CartProvider"
import IdentityProvider from "./IdentityProvider"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)
  return (
    <IdentityProvider>
      <ProductsProvider>
        <CartProvider>
          <Header title={data.site.siteMetadata.title} />
          <main
            style={{
              margin: `0 auto`,
              maxWidth: 960,
              padding: `1.5rem 0`,
            }}
          >
            {children}
          </main>
          <footer style={{ textAlign: "center", margin: "3rem 0" }}>
            Check out
            {` `}
            <a href="https://github.com/brxck/gatsby-starter-stripe">
              gatsby-starter-stripe
            </a>
            {` `}
            on GitHub!
          </footer>
        </CartProvider>
      </ProductsProvider>
    </IdentityProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout

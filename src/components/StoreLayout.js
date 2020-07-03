import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql, Link } from "gatsby"

import Cart from "./Cart"
import ProductsProvider from "./ProductsProvider"
import CartProvider from "./CartProvider"
import IdentityProvider from "./IdentityProvider"
import css from "./StoreLayout.module.css"

const StoreLayout = ({ children }) => {
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
          <header className={css.header}>
            <nav>
              <Link to="/admin">← Admin</Link>
              <h1 className={css.title}>
                <Link to="/">{data.site.siteMetadata.title}</Link>
              </h1>
              <div>
                <Cart />
              </div>
            </nav>
          </header>

          <main className={css.main}>{children}</main>

          <footer style={{ textAlign: "center", margin: "3rem 0" }}>
            <span>
              Fork
              {` `}
              <a href="https://github.com/brxck/gatsby-starter-stripe">
                gatsby-starter-stripe
              </a>
              {` `}
              on GitHub!{" "}
            </span>

            <div className={css.footerIcons}>
              <a href="https://github.com/brxck/gatsby-starter-stripe">
                <img
                  height="32"
                  width="32"
                  src="https://unpkg.com/simple-icons@v2/icons/github.svg"
                />
              </a>
              <a href="https://www.gatsbyjs.org/starters/brxck/gatsby-starter-stripe/">
                <img
                  height="32"
                  width="32"
                  src="https://unpkg.com/simple-icons@v2/icons/gatsby.svg"
                />
              </a>
            </div>
          </footer>
        </CartProvider>
      </ProductsProvider>
    </IdentityProvider>
  )
}

StoreLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default StoreLayout

import React from "react"
import PropTypes from "prop-types"

import Header from "./Header"
import ProductsProvider from "./ProductsProvider"
import CartProvider from "./CartProvider"
import * as css from "./StoreLayout.module.css"

const StoreLayout = ({ children }) => {
  return (
    <ProductsProvider>
      <CartProvider>
        <Header cart></Header>

        <main className={css.main}>{children}</main>

        <footer style={{ textAlign: "center", margin: "2rem 0" }}>
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
  )
}

StoreLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default StoreLayout

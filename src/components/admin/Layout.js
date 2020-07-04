import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

import "../hiq.css"
import ProductsProvider from "./ProductsProvider"
import css from "./Layout.module.css"

const Layout = ({ children }) => (
  <ProductsProvider>
    <header className={css.header}>
      <nav className={css.nav}>
        <Link to="/admin">Admin</Link>
        <Link to="/">Store →</Link>
      </nav>
    </header>
    <main>{children}</main>
  </ProductsProvider>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout

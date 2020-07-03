import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

import "./hiq.css"
import AdminProductsProvider from "./AdminProductsProvider"
import css from "./AdminLayout.module.css"

const Layout = ({ children }) => (
  <AdminProductsProvider>
    <header className={css.header}>
      <nav className={css.nav}>
        <Link to="/admin">Admin</Link>
        <Link to="/">Store →</Link>
      </nav>
    </header>
    <main>{children}</main>
  </AdminProductsProvider>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout

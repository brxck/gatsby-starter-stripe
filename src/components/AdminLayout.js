import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

import AdminProductsProvider from "./AdminProductsProvider"

const Layout = ({ children }) => (
  <AdminProductsProvider>
    <header style={{ textAlign: "center" }}>
      <h1>
        <Link
          to="/admin"
          style={{
            color: "#555",
            textDecoration: `none`,
            fontWeight: 300,
          }}
        >
          admin
        </Link>
      </h1>
    </header>
    <main className="container">{children}</main>
    <footer>
      © {new Date().getFullYear()}, Built with
      {` `}
      <a href="https://www.gatsbyjs.org">Gatsby</a>
    </footer>
  </AdminProductsProvider>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout

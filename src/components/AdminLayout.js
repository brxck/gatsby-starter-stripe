import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

import AdminProductsProvider from "./AdminProductsProvider"

const Layout = ({ children }) => (
  <AdminProductsProvider>
    <header
      style={{
        margin: "2rem",
        textAlign: "center",
      }}
    >
      <h1>
        <Link
          to="/admin"
          style={{
            color: "#555",
            textDecoration: "none",
            fontWeight: 300,
          }}
        >
          Admin
        </Link>
      </h1>
    </header>
    <main className="container">{children}</main>
    <footer
      style={{
        textAlign: "center",
        padding: "1.5rem 0",
      }}
    >
      Check out
      {` `}
      <a href="https://github.com/brxck/gatsby-starter-stripe">
        gatsby-starter-stripe
      </a>
      {` `}
      on GitHub!
    </footer>
  </AdminProductsProvider>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout

import React from "react"
import PropTypes from "prop-types"

import "../hiq.css"
import Header from "../Header"
import ProductsProvider from "./ProductsProvider"

const Layout = ({ children }) => (
  <ProductsProvider>
    <Header></Header>
    <main>{children}</main>
  </ProductsProvider>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout

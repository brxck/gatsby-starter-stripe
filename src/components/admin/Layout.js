import React from "react"
import PropTypes from "prop-types"

import "../hiq.css"
import Header from "../Header"
import StripeProductsProvider from "./StripeProductsProvider"

const Layout = ({ children }) => (
  <StripeProductsProvider>
    <Header cart={false}></Header>
    <main>{children}</main>
  </StripeProductsProvider>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout

import React from "react"
import { Router } from "@reach/router"

import SEO from "../../components/SEO"
import Layout from "../../components/admin/Layout"
import ProductPage from "../../components/admin/ProductPage"
import ProductList from "../../components/admin/ProductList"
import IdentityProvider, {
  Authenticate,
} from "../../components/IdentityProvider"

const Index = () => {
  return (
    <IdentityProvider>
      <Layout>
        <Authenticate>
          <SEO title="Admin"></SEO>
          <Router basepath="/admin">
            <ProductPage path="/products/create" create />
            <ProductPage path="/products/:productId" />
            <ProductList path="/" />
          </Router>
        </Authenticate>
      </Layout>
    </IdentityProvider>
  )
}

export default Index

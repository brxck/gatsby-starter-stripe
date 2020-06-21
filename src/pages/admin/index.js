import React from "react"
import { Router } from "@reach/router"

import SEO from "../../components/SEO"
import AdminLayout from "../../components/AdminLayout"
import AdminProductPage from "../../components/AdminProductPage"
import AdminProductList from "../../components/AdminProductList"
import IdentityProvider, {
  Authenticate,
} from "../../components/IdentityProvider"

const AdminIndex = () => {
  return (
    <IdentityProvider>
      <Authenticate>
        <AdminLayout>
          <SEO title="Admin"></SEO>
          <Router basepath="/admin">
            <AdminProductPage path="/products/create" create />
            <AdminProductPage path="/products/:productId" />
            <AdminProductList path="/" />
          </Router>
        </AdminLayout>
      </Authenticate>
    </IdentityProvider>
  )
}

export default AdminIndex

import React from "react"
import { Router } from "@reach/router"

import SEO from "../../components/SEO"
import AdminLayout from "../../components/AdminLayout"
import AdminProductPage from "../../components/AdminProductPage"
import AdminProductList from "../../components/AdminProductList"

const AdminIndex = () => {
  return (
    <AdminLayout>
      <SEO title="Admin"></SEO>
      <Router basepath="/admin">
        <AdminProductPage path="/product/create" />
        <AdminProductPage path="/product/:productId" />
        <AdminProductList path="/" />
      </Router>
    </AdminLayout>
  )
}

export default AdminIndex

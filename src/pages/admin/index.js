import React from "react"
import { Router } from "@reach/router"

import SEO from "../../components/SEO"
import AdminLayout from "../../components/AdminLayout"
import AdminProductForm from "../../components/AdminProductForm"
import AdminProductList from "../../components/AdminProductList"

const AdminProductPage = () => {
  return (
    <AdminLayout>
      <SEO title="Admin"></SEO>
      <Router basepath="/admin">
        <AdminProductForm path="/product/create" />
        <AdminProductForm path="/product/:productId" />
        <AdminProductList path="/" />
      </Router>
    </AdminLayout>
  )
}

export default AdminProductPage

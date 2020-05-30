import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import { Router } from "@reach/router"

import SEO from "../../components/SEO"
import Layout from "../../components/Layout"
import AdminProductForm from "../../components/AdminProductForm"
import AdminProductList from "../../components/AdminProductList"

const AdminProductPage = () => {
  return (
    <Layout>
      <SEO title="Admin"></SEO>
      <Router basepath="/admin">
        <AdminProductForm path="/product/create/" />
        <AdminProductForm path="/product/:productId" />
        <AdminProductList path="/" />
      </Router>
    </Layout>
  )
}

export default AdminProductPage

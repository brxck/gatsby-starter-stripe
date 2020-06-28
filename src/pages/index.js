import React from "react"

import Layout from "../components/Layout"
import SEO from "../components/SEO"
import Products from "../components/Products"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
    <Products />
  </Layout>
)

export default IndexPage

import React from "react"

import StoreLayout from "../components/StoreLayout"
import SEO from "../components/SEO"

const NotFoundPage = () => (
  <StoreLayout>
    <SEO title="404: Not found" />
    <h1>NOT FOUND</h1>
    <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
  </StoreLayout>
)

export default NotFoundPage

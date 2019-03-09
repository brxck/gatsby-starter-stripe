import React from 'react'
import Layout from '../components/Layout'
import ProductPage from '../components/ProductPage'

const ItemTemplate = ({ pageContext: { id } }) => {
  return (
    <Layout>
      <ProductPage productId={id} />
    </Layout>
  )
}

export default ItemTemplate

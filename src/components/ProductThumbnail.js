import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'

const ProductThumbnail = ({ product }) => {
  const image = product.images[0] || product.skus[0].image
  return (
    <div key={product.id}>
      <Link to={`/buy/${product.slug}`} style={{ textDecoration: 'none>' }}>
        <div
          style={{
            maxWidth: 250,
            flex: '1 1 auto',
            margin: '2rem 0.5rem'
          }}
        >
          <img src={image} alt={product.name} style={{ maxWidth: '100%' }} />
          <div style={{ fontWeight: 'bold', textAlign: 'center' }}>
            {product.name}
          </div>
          <div style={{ textAlign: 'center' }}>
            ${product.skus[0].price / 100}
          </div>
        </div>
      </Link>
    </div>
  )
}

ProductThumbnail.propTypes = {
  product: PropTypes.object.isRequired
}

export default ProductThumbnail

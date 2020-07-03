import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import Img from "gatsby-image"

import css from "./ProductThumbnail.module.css"

const ProductThumbnail = ({ product }) => {
  // TODO Use cart provider availability
  const availableSkus = product.skus.filter(
    ({ inventory }) => inventory?.quantity || inventory.type !== "finite"
  )
  const soldOut = availableSkus.length === 0

  return (
    <div key={product.id} className={css.container}>
      <Link to={`/buy/${product.slug}`}>
        <div className={css.thumbnail}>
          {product.localFiles && (
            <Img
              fluid={product.localFiles[0].childImageSharp.fluid}
              alt={product.name}
              imgStyle={{ filter: soldOut && "grayscale()" }}
            />
          )}
          <div className={css.description}>
            <strong>{product.name}</strong>
            <span>
              ${product.skus[0].price / 100}
              {soldOut && " - Sold Out"}
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}

ProductThumbnail.propTypes = {
  product: PropTypes.object.isRequired,
}

export default ProductThumbnail

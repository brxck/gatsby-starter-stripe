import React, { useContext } from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image";

import { CartContext } from "./CartProvider"
import * as css from "./ProductThumbnail.module.css"

const ProductThumbnail = ({ product }) => {
  const { available } = useContext(CartContext)

  const availablePrices = product.prices.filter(({ id }) => available(id))
  const soldOut = availablePrices.length === 0

  return (
    <div key={product.id} className={css.container}>
      <Link to={`/buy/${product.slug}`}>
        <div className={css.thumbnail}>
          {product.localFiles && (
            <GatsbyImage
              image={product.localFiles[0].childImageSharp.gatsbyImageData}
              alt={product.name}
              imgStyle={{ filter: soldOut && "grayscale()" }} />
          )}
          <div className={css.description}>
            <strong>{product.name}</strong>
            <span>
              {soldOut ? "Sold Out" : `$${product.prices[0].unit_amount / 100}`}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

ProductThumbnail.propTypes = {
  product: PropTypes.object.isRequired,
}

export default ProductThumbnail

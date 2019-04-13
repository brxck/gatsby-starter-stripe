import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import Cart from './Cart'

const Header = ({ siteTitle }) => (
  <header
    style={{
      margin: `2rem`
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <h1 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: '#555',
            textDecoration: `none`,
            fontWeight: 300
          }}
        >
          {siteTitle}
        </Link>
      </h1>
      <Cart />
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string
}

Header.defaultProps = {
  siteTitle: ``
}

export default Header

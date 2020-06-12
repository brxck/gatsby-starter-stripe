import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import Cart from "./Cart"

const Header = ({ title }) => (
  <header
    style={{
      margin: "2rem auto",
      maxWidth: "790px",
      padding: "0 1rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <Link to="/admin">
      <button>Admin</button>
    </Link>

    <div>
      <h1 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: "#666",
            textDecoration: `none`,
            fontWeight: 300,
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </Link>
      </h1>
    </div>
    <div>
      <Cart />
    </div>
  </header>
)

Header.propTypes = {
  title: PropTypes.string,
}

export default Header

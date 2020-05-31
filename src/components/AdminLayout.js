import React from "react"
import PropTypes from "prop-types"
import { StaticQuery, graphql } from "gatsby"
import AdminProductsProvider from "./AdminProductsProvider"
import "./layout.css"

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query AdminSiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <>
        <AdminProductsProvider>
          <div
            style={{
              margin: `0 auto`,
              maxWidth: 960,
              padding: `0px 1.0875rem 1.45rem`,
              paddingTop: 0,
            }}
          >
            <main>{children}</main>
            <footer>
              © {new Date().getFullYear()}, Built with
              {` `}
              <a href="https://www.gatsbyjs.org">Gatsby</a>
            </footer>
          </div>
        </AdminProductsProvider>
      </>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout

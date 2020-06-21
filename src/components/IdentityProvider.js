import React, { useState, useEffect, useContext } from "react"
import netlifyIdentity from "netlify-identity-widget"
import PropTypes from "prop-types"

export const IdentityContext = React.createContext()

export default function IdentityProvider(props) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    netlifyIdentity.init({ container: "#___gatsby" })
    netlifyIdentity.on("login", user => setUser(user))
    netlifyIdentity.on("logout", user => setUser(null))
    setUser(netlifyIdentity.currentUser())
  }, [])

  return (
    <IdentityContext.Provider
      value={{
        login: () => netlifyIdentity.open("login"),
        user,
      }}
    >
      {props.children}
    </IdentityContext.Provider>
  )
}

IdentityProvider.propTypes = {
  children: PropTypes.node,
}

export function Authenticate(props) {
  const { user, login } = useContext(IdentityContext)
  if (!user) {
    return (
      <div id="login" style={{ width: "100vw", height: "100vh" }}>
        <button onClick={login}>Login</button>
      </div>
    )
  } else {
    return props.children
  }
}

Authenticate.propTypes = {
  children: PropTypes.node,
}

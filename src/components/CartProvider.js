import React, { useState, useContext, useEffect } from "react"
import PropTypes from "prop-types"
import { ProductsContext } from "./ProductsProvider"

export const CartContext = React.createContext()

/**
 * Manages the shopping cart, which is persisted in local storage.
 * The cart and related methods are shared through context.
 */
const CartProvider = ({ children }) => {
  const { skus } = useContext(ProductsContext)
  const [mode, setMode] = useState(false)

  const [contents, setContents] = useState(() => {
    // Load cart from local storage. Initialize if not present or incorrect.
    let localCart
    try {
      localCart = JSON.parse(localStorage.getItem("cart"))
    } catch (err) {
      console.error(err.message)
    }
    if (!localCart || !Array.isArray(localCart)) return []
    return localCart
  })

  // Save cart to local storage after load and on update
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(contents))
    } catch (err) {
      console.error(err)
    }
  }, [contents])

  /** An array representing cart items in the form of [{sku}, quantity] */
  const cart = contents.map(([id, quantity]) => {
    return [skus[id], quantity]
  })

  /** The number of items in the cart */
  const count = contents.reduce((sum, [_, quantity]) => sum + quantity, 0)

  /** The total cost of the items in the cart */
  const total = contents.reduce(
    (sum, [id, quantity]) => sum + skus[id].price * quantity,
    0
  )

  /**
   * Returns the quantity of a sku in the cart.
   * @param {string} id The id of the sku
   * @returns {number}
   */
  function get(id) {
    if (!contents.length) return 0
    const cartItem = contents.find(item => item[0] === id)
    return cartItem ? cartItem[1] : 0
  }

  /**
   * Sets the quantity of a sku in the cart, if available.
   * @param {string} id The id of the sku
   * @param {number} quantity The requested quantity
   *
   * @returns {number} The cart quantity after the operation; `-1` if requested amount unavailable
   */
  function set(id, quantity) {
    if (!available(id, quantity)) return -1
    const index = contents.findIndex(item => item[0] === id)
    setContents(([...state]) => {
      if (index !== -1) {
        state[index] = [id, quantity]
      } else {
        state.push([id, quantity])
      }
      return state
    })
    return quantity
  }

  /**
   * Increments the quantity of sku in the cart.
   * @param {string} id The id of the sku
   * @param {number} [quantity=1] The quantity to add
   * @returns {number} The cart quantity after the operation; `-1` if requested amount unavailable
   */
  function add(id, quantity = 1) {
    const currentQuantity = get(id)
    return set(id, quantity + currentQuantity)
  }

  /**
   * Decrements the quantity of sku in the cart.
   * @param {string} id The id of the sku
   * @param {number} [quantity=1] The quantity to subtract
   * @returns {number} The cart quantity after the operation
   */
  function subtract(id, quantity = 1) {
    const currentQuantity = get(id)
    const newQuantity = Math.max(0, quantity - currentQuantity)
    return set(id, newQuantity)
  }

  /**
   * Remove a sku from the cart.
   * @param {string} id The id of the sku
   * @returns {void}
   */
  function remove(id) {
    setContents(state => {
      return state.filter(item => item[0] !== id)
    })
  }

  /**
   * Checks whether an item is available for purchase.
   * @param {string} id The id of the sku
   * @param {number} [quantity=1] The requested quantity
   * @returns {boolean} Whether a purchase of the quantity would be possible
   */
  function available(id, quantity = 1) {
    const cartQuantity = get(id)
    const sku = skus[id]
    if (!sku) {
      console.error(`Sku with id ${id} not found`)
      return false
    } else if (sku.active === false) {
      return false
    } else if (sku.inventory.type === "infinite") {
      return true
    } else if (sku.inventory.type === "bucket") {
      return ["in_stock", "limited"].includes(sku.inventory.type)
    } else if (sku.inventory.type === "finite") {
      return sku.inventory.quantity - cartQuantity >= quantity
    } else {
      return false
    }
  }

  /**
   * Toggles cart display, or sets to `mode` if provided.
   * @param {boolean} [mode] Force cart into mode. `true` for open; `false` for closed.
   */
  function toggle(mode) {
    setMode(prev => mode || !prev)
  }

  const ctx = {
    contents,
    cart,
    add,
    subtract,
    get,
    set,
    remove,
    available,
    toggle,
    count,
    total,
    mode,
  }

  return (
    <CartContext.Provider value={{ ...ctx }}>{children}</CartContext.Provider>
  )
}

CartProvider.propTypes = {
  children: PropTypes.any.isRequired,
}

export default CartProvider

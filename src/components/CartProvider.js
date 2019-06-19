import React, { useState, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import { ProductsContext } from './ProductsProvider'

export const CartContext = React.createContext()

/**
 * Manages the shopping cart, which is persisted in local storage.
 * The cart and related methods are shared through context.
 */
const CartProvider = ({ children }) => {
  const { skus } = useContext(ProductsContext)
  const [mode, setMode] = useState(false)

  /** Load cart from local storage. Initialize if not present or incorrect. */
  const [contents, setContents] = useState(() => {
    let localCart
    try {
      localCart = JSON.parse(localStorage.getItem('cart'))
    } catch (err) {
      console.error(err.message)
    }
    if (!localCart || !Array.isArray(localCart)) return []
    return localCart
  })

  /** Save cart to local storage after load and on update */
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(contents))
    } catch (err) {
      console.error(err)
    }
  }, [contents])

  /** An array representing the cart in the form of [{sku}, quantity] */
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

  /** Sets quantity of item with `id` */
  function set(id, quantity) {
    if (!available(id)) return

    const index = contents.findIndex(item => item[0] === id)
    setContents(state => {
      const newState = [...state]
      if (index !== -1) {
        newState[index] = [id, quantity]
      } else {
        newState.push([id, quantity])
      }
      return newState
    })
  }

  /** Increments item with `id` by `quantity`, which defaults to 0 */
  function add(id, quantity = 1) {
    const currentItem = contents.find(item => item[0] === id)
    const currentQuantity = currentItem ? currentItem[1] : 0
    set(id, quantity + currentQuantity)
  }

  /** Removes item with `id` */
  function remove(id) {
    setContents(state => {
      return state.filter(item => item[0] !== id)
    })
  }

  /** Returns true if `quantity` of item with `id` is available for purchase */
  function available(id, quantity = 1) {
    const sku = skus[id]
    if (!sku) {
      console.error(`Sku with id ${id} not found`)
      return false
    } else if (!sku.active) {
      return false
    } else if (sku.inventory.type === 'infinite') {
      return true
    } else if (sku.inventory.type === 'bucket') {
      return ['in_stock', 'limited'].includes(sku.inventory.type)
    } else if (sku.inventory.type === 'finite') {
      return sku.inventory.quantity >= quantity
    } else {
      return false
    }
  }

  /** Toggles cart display, or sets to the boolean `force` if provided */
  function toggle(force) {
    setMode(prev => force || !prev)
  }

  const ctx = {
    contents,
    cart,
    add,
    set,
    remove,
    available,
    toggle,
    count,
    total,
    mode
  }

  return (
    <CartContext.Provider value={{ ...ctx }}>{children}</CartContext.Provider>
  )
}

CartProvider.propTypes = {
  children: PropTypes.any.isRequired
}

export default CartProvider

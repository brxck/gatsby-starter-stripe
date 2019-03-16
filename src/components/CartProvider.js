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
  })

  /** Returns an array representing the cart in the form of [{sku}, quantity] */
  const cart = contents.map(([id, quantity]) => {
    return [skus[id], quantity]
  })

  /** Returns the number of items in the cart */
  const count = contents.reduce((sum, [_, quantity]) => sum + quantity, 0)

  /** Returns the total cost of the items in the cart */
  const total = contents.reduce(
    (sum, [id, quantity]) => sum + skus[id].price * quantity,
    0
  )

  /** Sets quantity of item with `id` */
  const set = (id, quantity) => {
    if (!available(id)) return

    const index = contents.findIndex(item => item.id === id)
    setContents(state => {
      if (index) {
        state[index] = [id, quantity]
      } else {
        state.push([id, quantity])
      }
      return state
    })
  }

  /** Increments item with `id` by `quantity`, which defaults to 0 */
  const add = (id, quantity = 1) => {
    set(id, (contents[id] || 0) + quantity)
  }

  /** Removes item with `id` */
  const remove = id => {
    setContents(state => {
      return state.filter(item => item[0] !== id)
    })
  }

  /** Returns true if `quantity` of item with `id` is available for purchase */
  const available = (id, quantity = 1) => {
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
  const toggle = force => {
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

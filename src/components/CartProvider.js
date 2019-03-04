/*
  Manages the shopping cart, which is persisted in local storage.
*/

import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { ProductsContext } from './ProductsProvider'

export const CartContext = React.createContext()

const CartProvider = ({ children }) => {
  const { skus } = useContext(ProductsContext)
  const [mode, setMode] = useState(false)
  const [contents, setContents] = useState(() => {
    // Load cart from localStorage
    let localCart
    try {
      localCart = JSON.parse(localStorage.getItem('cart'))
    } catch (err) {
      console.error(err.message)
    }
    if (!localCart) {
      localStorage.setItem('cart', '{}')
    }
    return localCart || {}
  })

  const cart = Object.entries(contents).map(([skuId, quantity]) => {
    return [skus[skuId], quantity]
  })

  const count = Object.values(contents).reduce(
    (sum, quantity) => sum + quantity,
    0
  )

  const total = Object.entries(contents).reduce(
    (sum, [skuId, quantity]) => sum + skus[skuId].price * quantity,
    0
  )

  const set = (skuId, quantity) => {
    if (!available(skuId)) return
    setContents(state => {
      state[skuId] = quantity
      return state
    })
    save()
  }

  const add = (skuId, quantity) => {
    set(skuId, (contents[skuId] || 0) + (quantity || 1))
  }

  const remove = (skuId, quantity) => {
    setContents(state => {
      delete state[skuId]
      return state
    })
    save()
  }

  const available = (skuId, quantity) => {
    const sku = skus[skuId]
    if (!sku) {
      console.error(`Sku with id ${skuId} not found`)
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

  const toggle = force => {
    setMode(prev => force || !prev)
  }

  const save = () => {
    try {
      localStorage.setItem('cart', JSON.stringify(contents))
    } catch (err) {
      console.error(err)
    }
  }

  const ctx = {
    contents,
    cart,
    add,
    set,
    remove,
    available,
    toggle,
    save,
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

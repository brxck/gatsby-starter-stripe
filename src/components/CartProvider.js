/*
  Manages the shopping cart, which is persisted in local storage.
*/

import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { ProductsContext } from './ProductsProvider'

export const CartContext = React.createContext()

const CartProvider = ({ children }) => {
  const context = useContext(ProductsContext)
  const skus = context.getSkus()
  console.log(skus)
  const [mode, setMode] = useState('false')
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

  const set = (skuId, quantity) => {
    if (!available(skuId)) return
    setContents(state => {
      state[skuId] = quantity
      return state
    })
  }

  const add = (skuId, quantity) => {
    set(skuId, contents[skuId] + quantity)
  }

  const remove = (skuId, quantity) => {
    setContents(state => {
      delete state[skuId]
      return state
    })
  }

  const available = (skuId, quantity) => {
    const sku = skus[skuId]
    if (!sku.active) {
      return false
    } else if (sku.inventory.type === 'infinite') {
      return true
    } else if (sku.inventory.type === 'bucket') {
      return ['in_stock', 'limited'].includes(sku.inventory.type)
    } else if (sku.inventory.type === 'finite') {
      const cartQuantity = contents[skuId] || 0
      return sku.inventory.quantity - cartQuantity > 0
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

  const count = () => {
    Object.values(contents).reduce((a, b) => a + b)
  }

  const ctx = {
    cart,
    add,
    set,
    remove,
    available,
    toggle,
    save,
    count
  }

  return (
    <CartContext.Provider value={{ ...ctx }}>{children}</CartContext.Provider>
  )
}

CartProvider.propTypes = {
  children: PropTypes.any.isRequired
}

export default CartProvider

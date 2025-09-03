import { useState, useEffect } from 'react'

interface CartItem {
  id: string
  name: string
  price: number
  originalPrice: number
  quantity: number
  image: string
  maxStock: number
}

const CART_STORAGE_KEY = 'cookite_cart'

export const usePersistedCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Carregar carrinho do localStorage na inicialização
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        setCartItems(parsedCart)
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho do localStorage:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Salvar carrinho no localStorage sempre que mudar
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
      } catch (error) {
        console.error('Erro ao salvar carrinho no localStorage:', error)
      }
    }
  }, [cartItems, isLoading])

  const addToCart = (product: any) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id)
      
      if (existingItem) {
        // Incrementar quantidade se item já existe (respeitando estoque)
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, item.maxStock) }
            : item
        )
      } else {
        // Adicionar novo item
        return [...prevItems, {
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice || product.price,
          quantity: 1,
          image: product.image,
          maxStock: product.stock || 10
        }]
      }
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id)
      return
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, quantity: Math.min(Math.max(1, quantity), item.maxStock) }
          : item
      )
    )
  }

  const removeFromCart = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const getCartSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.originalPrice * item.quantity), 0)
  }

  const getCartDiscount = () => {
    return getCartSubtotal() - getCartTotal()
  }

  return {
    cartItems,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount,
    getCartSubtotal,
    getCartDiscount
  }
}

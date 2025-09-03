import React, { createContext, useContext, useReducer, ReactNode } from 'react'

// Tipos para o estado global da aplicação
interface Order {
  id: string
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
    image: string
  }>
  total: number
  created_at: string
  pickup_date: string
  pickup_location: string
  payment_method: string
  payment_status: 'pending' | 'paid' | 'failed'
  customer: {
    name: string
    email: string
    phone: string
  }
  notes?: string
  transactionId?: string
}

interface CartItem {
  id: string
  name: string
  price: number
  originalPrice: number
  quantity: number
  image: string
  maxStock: number
}

interface AppState {
  // Cart
  cartItems: CartItem[]
  cartIsOpen: boolean
  
  // Navigation
  currentPage: 'products' | 'checkout' | 'orders'
  
  // Orders
  orders: Order[]
  ordersLoading: boolean
  
  // Payment
  currentPayment: {
    transactionId?: string
    amount?: number
    status?: string
    qrCode?: string
    pixCode?: string
  } | null
  
  // UI State
  authModalOpen: boolean
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'info' | 'warning'
    message: string
    timestamp: number
  }>
}

type AppAction = 
  | { type: 'SET_CART_ITEMS'; payload: CartItem[] }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'UPDATE_CART_ITEM'; payload: { id: string; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART_OPEN'; payload: boolean }
  | { type: 'SET_CURRENT_PAGE'; payload: 'products' | 'checkout' | 'orders' }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'SET_ORDERS_LOADING'; payload: boolean }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER'; payload: { id: string; updates: Partial<Order> } }
  | { type: 'SET_CURRENT_PAYMENT'; payload: AppState['currentPayment'] }
  | { type: 'SET_AUTH_MODAL_OPEN'; payload: boolean }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<AppState['notifications'][0], 'id' | 'timestamp'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }

const initialState: AppState = {
  cartItems: [],
  cartIsOpen: false,
  currentPage: 'products',
  orders: [],
  ordersLoading: false,
  currentPayment: null,
  authModalOpen: false,
  notifications: []
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CART_ITEMS':
      return { ...state, cartItems: action.payload }
    
    case 'ADD_TO_CART': {
      const existingItem = state.cartItems.find(item => item.id === action.payload.id)
      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: Math.min(item.quantity + 1, item.maxStock) }
              : item
          )
        }
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }]
        }
      }
    }
    
    case 'UPDATE_CART_ITEM': {
      if (action.payload.quantity === 0) {
        return {
          ...state,
          cartItems: state.cartItems.filter(item => item.id !== action.payload.id)
        }
      }
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      }
    }
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.id !== action.payload)
      }
    
    case 'CLEAR_CART':
      return { ...state, cartItems: [] }
    
    case 'SET_CART_OPEN':
      return { ...state, cartIsOpen: action.payload }
    
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload }
    
    case 'SET_ORDERS':
      return { ...state, orders: action.payload }
    
    case 'SET_ORDERS_LOADING':
      return { ...state, ordersLoading: action.payload }
    
    case 'ADD_ORDER':
      return { ...state, orders: [action.payload, ...state.orders] }
    
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id
            ? { ...order, ...action.payload.updates }
            : order
        )
      }
    
    case 'SET_CURRENT_PAYMENT':
      return { ...state, currentPayment: action.payload }
    
    case 'SET_AUTH_MODAL_OPEN':
      return { ...state, authModalOpen: action.payload }
    
    case 'ADD_NOTIFICATION': {
      const newNotification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now()
      }
      return {
        ...state,
        notifications: [...state.notifications, newNotification]
      }
    }
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      }
    
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] }
    
    default:
      return state
  }
}

interface AppStateContextType {
  state: AppState
  dispatch: React.Dispatch<AppAction>
  
  // Computed values
  cartItemCount: number
  cartTotal: number
  
  // Actions
  addToCart: (product: any) => void
  updateCartItem: (id: string, quantity: number) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  
  openCart: () => void
  closeCart: () => void
  
  navigateTo: (page: 'products' | 'checkout' | 'orders') => void
  
  addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  
  openAuthModal: () => void
  closeAuthModal: () => void
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined)

export const useAppState = () => {
  const context = useContext(AppStateContext)
  if (context === undefined) {
    throw new Error('useAppState deve ser usado dentro de um AppStateProvider')
  }
  return context
}

interface AppStateProviderProps {
  children: ReactNode
}

export const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)
  
  // Computed values
  const cartItemCount = state.cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = state.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  
  // Actions
  const addToCart = (product: any) => {
    dispatch({ type: 'ADD_TO_CART', payload: {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      quantity: 1,
      image: product.image,
      maxStock: product.stock
    }})
    
    dispatch({ type: 'ADD_NOTIFICATION', payload: {
      type: 'success',
      message: `${product.name} adicionado ao carrinho!`
    }})
  }
  
  const updateCartItem = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_CART_ITEM', payload: { id, quantity } })
  }
  
  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id })
  }
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }
  
  const openCart = () => {
    dispatch({ type: 'SET_CART_OPEN', payload: true })
  }
  
  const closeCart = () => {
    dispatch({ type: 'SET_CART_OPEN', payload: false })
  }
  
  const navigateTo = (page: 'products' | 'checkout' | 'orders') => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: page })
  }
  
  const addNotification = (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp'>) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification })
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.message })
    }, 5000)
  }
  
  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id })
  }
  
  const openAuthModal = () => {
    dispatch({ type: 'SET_AUTH_MODAL_OPEN', payload: true })
  }
  
  const closeAuthModal = () => {
    dispatch({ type: 'SET_AUTH_MODAL_OPEN', payload: false })
  }
  
  const value: AppStateContextType = {
    state,
    dispatch,
    cartItemCount,
    cartTotal,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    openCart,
    closeCart,
    navigateTo,
    addNotification,
    removeNotification,
    openAuthModal,
    closeAuthModal
  }
  
  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  )
}

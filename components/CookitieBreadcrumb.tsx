import { Home, ArrowRight, ShoppingCart, Package, CreditCard, User } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  icon?: React.ReactNode
  onClick?: () => void
  isActive?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export const Breadcrumb = ({ items, className = '' }: BreadcrumbProps) => {
  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <ArrowRight size={14} className="text-gray-400 mx-2" />
          )}
          
          <button
            onClick={item.onClick}
            disabled={item.isActive}
            className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
              item.isActive 
                ? 'text-gray-500 cursor-default' 
                : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        </div>
      ))}
    </nav>
  )
}

// Componente específico para navegação da Cookitie
export const CookitieBreadcrumb = ({ currentPage, onNavigate }: { 
  currentPage: string
  onNavigate: (page: string) => void 
}) => {
  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    const baseItems: BreadcrumbItem[] = [
      {
        label: 'Início',
        icon: <Home size={14} />,
        onClick: () => onNavigate('products'),
        isActive: currentPage === 'products'
      }
    ]

    switch (currentPage) {
      case 'cart':
        return [
          ...baseItems,
          {
            label: 'Carrinho',
            icon: <ShoppingCart size={14} />,
            isActive: true
          }
        ]
      
      case 'checkout':
        return [
          ...baseItems,
          {
            label: 'Carrinho',
            icon: <ShoppingCart size={14} />,
            onClick: () => onNavigate('cart')
          },
          {
            label: 'Checkout',
            icon: <CreditCard size={14} />,
            isActive: true
          }
        ]
      
      case 'orders':
        return [
          ...baseItems,
          {
            label: 'Meus Pedidos',
            icon: <Package size={14} />,
            isActive: true
          }
        ]
      
      case 'flavors':
        return [
          ...baseItems,
          {
            label: 'Mais Sabores',
            icon: <Package size={14} />,
            isActive: true
          }
        ]
      
      case 'admin':
        return [
          ...baseItems,
          {
            label: 'Admin',
            icon: <User size={14} />,
            isActive: true
          }
        ]
      
      default:
        return baseItems
    }
  }

  return (
    <div className="border-b py-3" style={{ backgroundColor: '#FDF1C3', borderBottomColor: '#FDF1C3', borderBottomWidth: '3px' }}>
      <div className="container mx-auto px-4 sm:px-6">
        <Breadcrumb items={getBreadcrumbItems()} />
      </div>
    </div>
  )
}

interface CategoryRowProps {
  title: string
  products: any[]
  onAddToCart: (product: any) => void
}

export const CategoryRow = ({ 
  title, 
  products, 
  onAddToCart
}: CategoryRowProps) => {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto md:overflow-visible justify-start md:flex-nowrap">
        {products.map((product, index) => (
          <div 
            key={product.id}
            className="flex-shrink-0 w-40 md:w-60 rounded-2xl overflow-hidden"
            style={{
              backgroundColor: '#F4F4F4',
              boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)'
            }}
          >
            <div className="relative h-40 md:h-56 overflow-hidden rounded-t-2xl">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded-t-2xl transition-transform duration-300 ease-in-out"
                loading="lazy"
                decoding="async"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              />
            </div>
            <div className="p-4 md:p-6 pb-6 md:pb-8 text-center">
              <h3 className="text-sm md:text-lg font-bold text-black mb-2 truncate" style={{ fontWeight: '700' }}>
                {product.name}
              </h3>
              <div className="text-lg md:text-2xl mb-3 md:mb-4" style={{ color: '#A27CBD', fontFamily: 'Inter, sans-serif', fontWeight: '700' }}>
                R$ {product.price.toFixed(2)}
              </div>
              <button
                onClick={() => onAddToCart(product)}
                className="w-full text-white flex items-center justify-center py-2 md:py-3 px-3 md:px-4 transition-all duration-300 ease-in-out touch-target"
                style={{ 
                  backgroundColor: '#E4B7CB',
                  borderRadius: '25px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: '700',
                  gap: '8px',
                  letterSpacing: '0.5px',
                  minHeight: '44px',
                  fontSize: '14px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#D4A5B8';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#E4B7CB';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: '700' }}>+</span>
                Adicionar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

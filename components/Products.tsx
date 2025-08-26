import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ShoppingCart, Plus, Star, Clock, TrendingUp, Heart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  stock: number;
  image: string;
  rating: number;
  preparationTime: string;
  discount: number;
}

const products: Product[] = [
  {
    id: 'palha-italiana',
    name: 'Palha Italiana',
    description: 'Pedaços macios com chocolate e doce de leite. Tamanho: porção individual.',
    price: 6.00,
    originalPrice: 7.50,
    discount: 20,
    stock: 100,
    rating: 4.8,
    preparationTime: '2-3 min',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop&crop=center'
  },
  {
    id: 'cookie',
    name: 'Cookie',
    description: 'Cookie grande, crocante por fora e macio por dentro.',
    price: 7.00,
    originalPrice: 8.75,
    discount: 20,
    stock: 100,
    rating: 4.9,
    preparationTime: '1-2 min',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300&h=300&fit=crop&crop=center'
  },
  {
    id: 'cake-pop',
    name: 'Cake Pop',
    description: 'Bolinha decorada, ideal como mimo individual.',
    price: 4.50,
    originalPrice: 5.63,
    discount: 20,
    stock: 100,
    rating: 4.7,
    preparationTime: '1 min',
    image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=300&h=300&fit=crop&crop=center'
  },
  {
    id: 'biscoito-amantegado',
    name: 'Biscoito Amantegado',
    description: 'Clássico amanteigado, perfeito com chá.',
    price: 5.00,
    originalPrice: 6.25,
    discount: 20,
    stock: 100,
    rating: 4.6,
    preparationTime: '1-2 min',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&h=300&fit=crop&crop=center'
  }
];

interface ProductsProps {
  onAddToCart: (product: Product) => void;
  onOpenCart: () => void;
  onGoToCheckout: () => void;
  cartItemCount: number;
}

export function Products({ onAddToCart, onOpenCart, onGoToCheckout, cartItemCount }: ProductsProps) {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  const handleAddToCart = async (product: Product) => {
    setAddingToCart(product.id);
    
    // Simular delay de adição
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onAddToCart(product);
    toast.success(`🛒 ${product.name} adicionado ao carrinho!`, {
      duration: 2000,
      action: {
        label: "Ver Carrinho",
        onClick: () => onOpenCart(),
      },
    });
    setAddingToCart(null);
  };



  const handleGoToCheckout = () => {
    onGoToCheckout();
  };

  return (
    <section id="products" className="py-20 md:py-24 px-4 bg-gradient-to-b from-white via-[var(--color-cookite-gray)]/30 to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[var(--color-cookite-blue)]/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[var(--color-cookite-yellow)]/5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-500/3 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[var(--color-cookite-yellow)] to-yellow-400 text-gray-800 px-6 py-3 rounded-full mb-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-yellow-300">
            <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center animate-pulse">
              <TrendingUp className="w-4 h-4 text-gray-800" />
            </div>
            <span className="text-sm font-bold">🔥 Mais Vendidos</span>
          </div>
          <h2 className="mb-6 md:mb-8 text-gray-800 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Nossos{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-[var(--color-cookite-blue)] via-purple-500 to-[var(--color-cookite-yellow)] bg-clip-text text-transparent">
                Doces Artesanais
              </span>
              <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-cookite-blue)] to-[var(--color-cookite-yellow)] rounded-lg blur opacity-10 animate-pulse"></div>
            </span>
          </h2>
          <p className="text-gray-600 max-w-4xl mx-auto text-lg sm:text-xl md:text-2xl leading-relaxed font-medium">
            Cada produto é feito com muito carinho e ingredientes selecionados especialmente para você.
            <br />
            <span className="bg-gradient-to-r from-[var(--color-cookite-blue)] to-purple-600 bg-clip-text text-transparent font-bold"> 
              ✨ Reserve já o seu favorito e ganhe 20% de desconto!
            </span>
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {products.map((product, index) => (
            <Card 
              key={product.id} 
              className={`group relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white border-2 border-gray-100 hover:border-[var(--color-cookite-blue)] rounded-3xl transform hover:scale-105 ${
                hoveredProduct === product.id ? 'ring-2 ring-[var(--color-cookite-blue)] ring-opacity-50 scale-105' : ''
              }`}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Discount badge */}
              <div className="absolute top-3 left-3 z-10">
                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 shadow-lg">
                  -{product.discount}%
                </Badge>
              </div>

              {/* Stock badge */}
              <div className="absolute top-3 right-3 z-10">
                <Badge className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 shadow-lg">
                  {product.stock} un
                </Badge>
              </div>

              {/* Favorite button */}
              <div className="absolute top-12 right-3 z-10">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 p-0 rounded-full bg-gradient-to-r from-white/90 to-white/70 hover:from-white hover:to-white text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/30"
                >
                  <Heart className="w-5 h-5" />
                </Button>
              </div>

              {/* Image container */}
              <div className="relative overflow-hidden">
                <ImageWithFallback
                  src={product.image}
                  alt={`${product.name} - Cookite`}
                  className="w-full h-40 sm:h-48 md:h-56 object-cover transform group-hover:scale-110 transition-transform duration-500"
                  width={300}
                  height={300}
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 fill-current text-yellow-400" />
                      <span className="text-sm font-medium">{product.rating}</span>
                      <Clock className="w-4 h-4 ml-2" />
                      <span className="text-sm">{product.preparationTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-3 sm:p-4 md:p-6">
                <h3 className="mb-2 text-gray-800 text-base sm:text-lg md:text-xl font-bold group-hover:text-[var(--color-cookite-blue)] transition-colors duration-200">
                  {product.name}
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
                
                {/* Price section */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--color-cookite-blue)]">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </p>
                    <p className="text-sm text-gray-500 line-through">
                      R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                  <p className="text-xs text-green-600 font-medium">Economia de R$ {(product.originalPrice - product.price).toFixed(2).replace('.', ',')}</p>
                </div>

                {/* Rating and preparation time */}
                <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current text-yellow-400" />
                    <span>{product.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{product.preparationTime}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleAddToCart(product)}
                    disabled={addingToCart === product.id}
                    className="flex-1 group/btn bg-[var(--color-cookite-blue)] hover:bg-[var(--color-cookite-blue-hover)] text-white rounded-lg text-sm md:text-base py-2.5 font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    {addingToCart === product.id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center mr-2">
                        <Plus size={16} className="text-white group-hover/btn:rotate-90 transition-transform duration-200" />
                      </div>
                    )}
                    {addingToCart === product.id ? 'Adicionando...' : 'Adicionar ao Carrinho'}
                  </Button>
                  
                  <Button
                    onClick={onOpenCart}
                    variant="outline"
                    size="sm"
                    className="px-3 py-2.5 rounded-lg border-[var(--color-cookite-blue)] text-[var(--color-cookite-blue)] hover:bg-[var(--color-cookite-blue)] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <ShoppingCart size={18} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12 md:mt-16">
          <div className="bg-gradient-to-r from-[var(--color-cookite-blue)] to-[var(--color-cookite-yellow)] rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden">
            <div className="relative">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                Pronto para adoçar seu dia? 🍰
              </h3>
              <p className="text-white/90 text-base mb-5 max-w-2xl mx-auto">
                Faça sua reserva agora e garanta seus doces favoritos com desconto especial!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={onOpenCart}
                  size="lg"
                  className="bg-white text-[var(--color-cookite-blue)] hover:bg-gray-100 rounded-xl px-6 py-3 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-6 h-6 bg-[var(--color-cookite-blue)] rounded-full flex items-center justify-center mr-2">
                    <ShoppingCart size={16} className="text-white" />
                  </div>
                  Ver Carrinho ({cartItemCount})
                </Button>
                <Button 
                  onClick={handleGoToCheckout}
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-[var(--color-cookite-blue)] rounded-xl px-6 py-3 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white text-base">🚀</span>
                  </div>
                  Finalizar Pedido
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
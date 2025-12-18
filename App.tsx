
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ShoppingBag, Truck, ShieldCheck, Trash2, ShoppingCart, CalendarDays, Award, MapPin, ChevronDown, Edit2 } from 'lucide-react';
import { PRODUCTS, HERO_IMAGES } from './constants';
import { Product, CartItem, ViewState, ProductCategory, BeerType } from './types';
import { Button } from './components/Button';
import { ProductCard } from './components/ProductCard';
import { Calculator } from './components/Calculator';
import { Navigation } from './components/Navigation';
import { ProductDetail } from './components/ProductDetail';
import { HeroSlider } from './components/HeroSlider';
import { FloatingCart } from './components/FloatingCart';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutFlow } from './components/CheckoutFlow';
import { ContactModal } from './components/ContactModal';
import { InfoModal } from './components/InfoModal';
import { LocationModal } from './components/LocationModal';
import { CartConflictModal } from './components/CartConflictModal';
import { CheckoutConflictModal } from './components/CheckoutConflictModal';
import { UpsellModal } from './components/UpsellModal';
import { GrowlerUpsellModal } from './components/GrowlerUpsellModal';

// --- Loading Component ---
const LoadingScreen = () => (
  <div className="fixed inset-0 z-[200] bg-zinc-950 flex flex-col items-center justify-center animate-fade-in">
    <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
       <div className="absolute inset-0 bg-amber-500/15 rounded-full animate-ping" />
       <div className="relative z-10 w-full h-full bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 shadow-2xl">
          <img 
            src="https://i.imgur.com/hm4KO4J_d.webp?maxwidth=760&fidelity=grand" 
            alt="Loading"
            className="w-20 h-20 object-contain animate-pulse" 
          />
       </div>
    </div>
    <div className="text-amber-500 font-serif text-sm tracking-[0.2em] uppercase animate-pulse">Carregando</div>
  </div>
);

// --- Extracted Components ---

const HomeView: React.FC<{
  setView: (v: ViewState) => void;
  onOrderClick: () => void;
  onEventClick: () => void;
}> = ({ setView, onOrderClick, onEventClick }) => (
  <div className="animate-fade-in pb-32 relative bg-zinc-950">
      
      {/* Logo Overlay - Fixed Image URL */}
      <div className="absolute top-0 left-0 right-0 z-40 flex justify-center pt-8 pointer-events-none">
         <div className="h-32 w-auto max-w-[80%] flex items-center justify-center drop-shadow-2xl">
            <img 
              src="https://i.imgur.com/hm4KO4J_d.webp?maxwidth=760&fidelity=grand" 
              alt="Patanegra" 
              className="h-full w-full object-contain filter drop-shadow-lg"
            />
         </div>
      </div>

      <HeroSlider 
        onOrderClick={onOrderClick}
        onCalcClick={() => setView('calculator')}
      />

      <div className="px-6 py-10 bg-zinc-950 -mt-10 relative z-20 rounded-t-[2.5rem] border-t border-zinc-900 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] overflow-hidden">
        
        {/* Background Watermark Logo with Gradient Fade */}
        <div className="absolute top-0 left-0 right-0 h-[400px] flex items-start justify-center pointer-events-none z-0 pt-12">
            <div className="relative opacity-[0.06]">
                <img 
                  src="https://i.ibb.co/bMym2DFk/simbolo2.png" 
                  alt="" 
                  className="w-72 h-72 object-contain grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/20 to-zinc-950" />
            </div>
        </div>

        {/* Content Wrapper to keep text above watermark */}
        <div className="relative z-10">
          <div className="w-12 h-1 bg-zinc-800 mx-auto rounded-full mb-8 opacity-50"></div>
          
          <h2 className="text-3xl font-serif text-white mb-4 text-center">Por que Patanegra?</h2>
          <p className="text-zinc-400 text-center mb-10 text-lg leading-relaxed max-w-xs mx-auto">
            Transforme seu evento com o melhor chope da cidade. Rápido, gelado e sem complicações.
          </p>

          <div className="grid grid-cols-1 gap-6">
            {/* NEW ITEM: Cervejaria Premiada */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
              <div className="p-3 bg-zinc-800 rounded-lg text-amber-500">
                <Award size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white">Cervejaria Premiada</h3>
                <p className="text-sm text-zinc-400 mt-1">
                  Uma das cervejarias mais premiadas do Brasil, com excelência reconhecida em cada barril.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
              <div className="p-3 bg-zinc-800 rounded-lg text-amber-500">
                <Truck size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white">Entrega Expressa</h3>
                <p className="text-sm text-zinc-400 mt-1">Seu chope chega na temperatura ideal e pronto para servir.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
              <div className="p-3 bg-zinc-800 rounded-lg text-amber-500">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white">Qualidade Garantida</h3>
                <p className="text-sm text-zinc-400 mt-1">Barris selecionados e equipamentos profissionais.</p>
              </div>
            </div>

            <button 
              onClick={onEventClick}
              className="flex items-start text-left gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-900 transition-all active:scale-[0.98] backdrop-blur-sm"
            >
              <div className="p-3 bg-zinc-800 rounded-lg text-amber-500">
                <CalendarDays size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white flex items-center gap-2">
                  Contate para Eventos
                  <span className="text-[10px] bg-amber-500 text-black px-1.5 py-0.5 rounded font-bold uppercase">Novo</span>
                </h3>
                <p className="text-sm text-zinc-400 mt-1">Fale diretamente com nossa equipe via WhatsApp.</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
);

const MenuView: React.FC<{
  products: Product[];
  addToCart: (p: Product, options?: Partial<CartItem>) => void;
  setSelectedProduct: (p: Product | null) => void;
  recommendedVolume: number | null;
  activeCategory: ProductCategory;
  setActiveCategory: (c: ProductCategory) => void;
  userLocation: string | null;
  onOpenLocationModal: () => void;
}> = ({ products, addToCart, setSelectedProduct, recommendedVolume, activeCategory, setActiveCategory, userLocation, onOpenLocationModal }) => {
  // State lifted to App component
  const filteredProducts = products.filter(p => p.category === activeCategory);
  
  // Reference for scrolling container
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top when category changes
  useEffect(() => {
    // Force immediate scroll reset without smooth behavior to avoid glitches during content swap
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    // Also reset window scroll just in case
    window.scrollTo(0, 0);
  }, [activeCategory]);

  return (
    <div className="animate-fade-in pb-24 max-w-md mx-auto h-screen flex flex-col">
      <div className="p-4 pb-2 pt-8">
        <div className="flex flex-col items-start gap-2">
          {/* Location Selector */}
          <button 
            onClick={onOpenLocationModal}
            className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 hover:bg-amber-500/20 transition-colors active:scale-95"
          >
             <div className="bg-amber-500 text-black rounded-full p-1">
                <MapPin size={12} strokeWidth={2.5} />
             </div>
             <span className="text-xs font-bold uppercase tracking-wide">{userLocation || 'Selecione a Unidade'}</span>
             <ChevronDown size={14} />
          </button>

          <div className="flex justify-between items-start w-full">
            <h2 className="text-3xl font-serif text-white">Nosso Catálogo</h2>
          </div>
        </div>
        
        {recommendedVolume && (
            <p className="text-amber-500 text-sm mt-1">
              Baseado no seu cálculo: ~{recommendedVolume} Litros
            </p>
        )}
      </div>
      
      <div className="sticky top-0 z-20 bg-zinc-950/95 backdrop-blur-md pt-2 pb-4 border-b border-zinc-900">
        <div className="flex overflow-x-auto gap-2 px-4 snap-x">
          {Object.values(ProductCategory).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`snap-center flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 scale-105'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4"
      >
        {/* Padding bottom ensures content isn't hidden behind floating elements */}
        <div className="grid grid-cols-2 gap-4 pb-32">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAdd={(p) => {
                  // LÓGICA ALTERADA: Se for Barril (30 ou 50), abre o modal para opcionais.
                  // Se for Growler, adiciona direto para manter a agilidade.
                  if (p.category === ProductCategory.KEG30 || p.category === ProductCategory.KEG50) {
                    setSelectedProduct(p);
                  } else {
                    addToCart(p);
                  }
                }}
                onClick={setSelectedProduct}
                featured={false}
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-12 text-zinc-500">
              <p>Nenhum produto nesta categoria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CartView: React.FC<{
  cart: CartItem[];
  cartTotal: number;
  setView: (v: ViewState) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, d: number) => void;
  onEdit: (item: CartItem) => void;
  onCheckout: () => void;
}> = ({ cart, cartTotal, setView, removeFromCart, updateQuantity, onEdit, onCheckout }) => (
  <div className="animate-slide-up p-4 pt-8 pb-24 h-full flex flex-col max-w-md mx-auto min-h-screen">
      <h2 className="text-3xl font-serif text-white mb-6">Seu Pedido</h2>
      
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center opacity-50">
          <ShoppingBag size={64} className="mb-4 text-zinc-600" />
          <p className="text-xl">Seu carrinho está vazio</p>
          <Button variant="outline" className="mt-6" onClick={() => setView('menu')}>
            Ver Produtos
          </Button>
        </div>
      ) : (
        <>
          <div className="flex-1 space-y-4 overflow-y-auto">
            {cart.map(item => {
               // Price Calc per Item View
               const extras = (item.rentTonel ? 30 : 0) + (item.mugsPrice || 0);
               const totalItemPrice = item.price + extras;
               const isKeg = item.category === ProductCategory.KEG30 || item.category === ProductCategory.KEG50;
               
               return (
                <div key={item.id} className="flex flex-col gap-2 bg-zinc-900/80 p-4 rounded-xl border border-zinc-800">
                  <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                         <h4 className="font-bold text-white pr-2">{item.name}</h4>
                         {isKeg && (
                             <button 
                               onClick={() => onEdit(item)}
                               className="p-1 bg-zinc-800 text-amber-500 rounded hover:bg-amber-500 hover:text-black transition-colors"
                             >
                                <Edit2 size={12} />
                             </button>
                         )}
                      </div>
                      <div className="text-amber-500 font-semibold">R$ {totalItemPrice.toFixed(2)}</div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <button onClick={() => removeFromCart(item.id)} className="text-zinc-500 hover:text-red-500">
                        <Trash2 size={16} />
                      </button>
                      <div className="flex items-center bg-zinc-800 rounded-lg">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 flex items-center justify-center text-zinc-300 hover:text-white"
                          >-</button>
                          <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 flex items-center justify-center text-zinc-300 hover:text-white"
                          >+</button>
                      </div>
                    </div>
                  </div>
                  {/* Extra info display */}
                  {(item.rentTonel || item.mugsQuantity || item.moreCups) && (
                    <div className="mt-2 pt-2 border-t border-zinc-800 text-xs text-zinc-400">
                      <p className="font-bold text-amber-500 mb-1">Adicionais:</p>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {item.rentTonel && <li>Tonel Patanegra (+R$30,00)</li>}
                        {item.mugsQuantity && <li>Kit {item.mugsQuantity} Canecas de Vidro (+R${item.mugsPrice},00)</li>}
                        {item.moreCups && <li>Solicitou orçamento de copos extras</li>}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
            <div className="flex justify-between items-center mb-4 text-zinc-400">
              <span>Subtotal</span>
              <span>R$ {cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-6 text-white text-xl font-bold">
              <span>Total</span>
              <span className="text-amber-500">R$ {cartTotal.toFixed(2)}</span>
            </div>
            <Button fullWidth onClick={onCheckout} icon={<ShoppingBag size={20} />}>
              Finalizar no WhatsApp
            </Button>
            <p className="text-xs text-center text-zinc-500 mt-3">
               Taxa de entrega a consultar na confirmação.
            </p>
          </div>
        </>
      )}
    </div>
);

// --- Pricing Configuration for Foz ---
const FOZ_PRICES: Record<string, number> = {
  // GROWLERS
  'growler-pilsen-cristal-1l': 18,
  'growler-premium-lager-1l': 19,
  'growler-weiss-1l': 26,
  'growler-session-ipa-1l': 26,
  'growler-american-ipa-1l': 28,
  'growler-vinho-branco-1l': 21,
  'growler-vinho-tinto-1l': 21,
  'growler-sour-amarelas-1l': 32,
  'growler-sour-vermelhas-1l': 32,
  'growler-amber-lager-1l': 26,
  'growler-munich-dunkel-1l': 26,
  'growler-apa-1l': 26,
  'growler-red-ale-1l': 26,
  'growler-vienna-lager-1l': 26,
  
  // BARRIS
  'keg-pilsen-50': 700,
  'keg-pilsen-30': 450,
  'keg-lager-50': 750,
  'keg-lager-30': 480,
  'keg-session-ipa-30': 520,
  'keg-vinho-branco-30': 500,
  'keg-vinho-tinto-30': 500,
};

// --- Main App Component ---

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewState>('home');
  const [activeCategory, setActiveCategory] = useState<ProductCategory>(ProductCategory.GROWLER);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isUpsellModalOpen, setIsUpsellModalOpen] = useState(false);
  
  // NEW: Growler Upsell State (ARRAY for 3 recommendations)
  const [isGrowlerUpsellOpen, setIsGrowlerUpsellOpen] = useState(false);
  const [recommendedGrowlers, setRecommendedGrowlers] = useState<Product[]>([]);

  // Upsell Config
  const [upsellOptions, setUpsellOptions] = useState({ offerTonel: false, offerCups: false, offerMugs: false });
  
  // Location State
  const [userLocation, setUserLocation] = useState<string | null>(null);

  // Cart Context State
  const [cartLocation, setCartLocation] = useState<string | null>(null);
  const [pendingProduct, setPendingProduct] = useState<{product: Product, options?: Partial<CartItem>} | null>(null);
  const [showCheckoutConflict, setShowCheckoutConflict] = useState(false);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [recommendedVolume, setRecommendedVolume] = useState<number | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // EDIT STATE
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);

  // Dynamic Pricing Logic
  const adjustedProducts = useMemo(() => {
    if (userLocation === 'Foz do Iguaçu') {
      return PRODUCTS.map(product => {
        // Check if there is a specific override for Foz
        if (FOZ_PRICES[product.id] !== undefined) {
           return { ...product, price: FOZ_PRICES[product.id] };
        }
        
        // Fallback logic if specific ID not found (though all should be covered)
        let newPrice = product.price;
        if (product.category === ProductCategory.GROWLER) {
          newPrice += 2;
        } else if (product.category === ProductCategory.KEG30 || product.category === ProductCategory.KEG50) {
          newPrice += 100;
        }
        return { ...product, price: newPrice };
      });
    }
    // Default prices (Marechal Cândido Rondon)
    return PRODUCTS;
  }, [userLocation]);

  // CRITICAL ASSET PRELOADING
  useEffect(() => {
    const loadAssets = async () => {
      // List of critical images to wait for (Logo, Hero, Top products)
      const criticalImages = [
        'https://i.imgur.com/hm4KO4J_d.webp?maxwidth=760&fidelity=grand',
        'https://i.ibb.co/d4wj1KW2/POST-DELIVERY.png', // Preload Modal Image
        ...HERO_IMAGES,
        // Preload first 2 products to avoid pop-in on menu
        ...PRODUCTS.slice(0, 2).map(p => p.image) 
      ];

      const promises = criticalImages.map(src => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve; // Continue even if error
        });
      });

      // Wait for images to load OR 4 seconds max timeout
      const timeout = new Promise(resolve => setTimeout(resolve, 4000));
      await Promise.race([Promise.all(promises), timeout]);

      // Trigger background load for rest of products
      PRODUCTS.slice(2).forEach(p => {
        const img = new Image();
        img.src = p.image;
      });

      setLoading(false);
    };

    loadAssets();
  }, []);

  // Update addToCart to handle options AND Location Conflicts
  const addToCart = (product: Product, options?: Partial<CartItem>) => {
    
    // CONFLICT CHECK
    if (cart.length > 0 && cartLocation && userLocation && cartLocation !== userLocation) {
        setPendingProduct({ product, options });
        return;
    }

    // IF Cart is empty, set location
    if (cart.length === 0 && userLocation) {
        setCartLocation(userLocation);
    }

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id);
      
      if (existingIndex >= 0) {
        const existingItem = prev[existingIndex];
        
        const updatedItem = {
           ...existingItem,
           quantity: existingItem.quantity + 1,
           rentTonel: options?.rentTonel ?? existingItem.rentTonel,
           mugsQuantity: options?.mugsQuantity ?? existingItem.mugsQuantity,
           mugsPrice: options?.mugsPrice ?? existingItem.mugsPrice,
           moreCups: options?.moreCups ?? existingItem.moreCups,
           isUpsell: existingItem.isUpsell || options?.isUpsell // Keep true if it was ever upsell
        };
        
        const newCart = [...prev];
        newCart[existingIndex] = updatedItem;
        return newCart;
      }
      
      return [...prev, { 
        ...product, 
        quantity: 1,
        rentTonel: options?.rentTonel,
        mugsQuantity: options?.mugsQuantity,
        mugsPrice: options?.mugsPrice,
        moreCups: options?.moreCups,
        isUpsell: options?.isUpsell || false
      }];
    });
  };

  const handleProductDetailAction = (product: Product, options?: Partial<CartItem>) => {
      if (editingItem) {
          // UPDATE LOGIC
          setCart(prev => prev.map(item => {
              if (item.id === editingItem.id) {
                  return {
                      ...item,
                      rentTonel: options?.rentTonel,
                      mugsQuantity: options?.mugsQuantity,
                      mugsPrice: options?.mugsPrice,
                      moreCups: options?.moreCups
                  }
              }
              return item;
          }));
          setEditingItem(null);
      } else {
          // ADD LOGIC
          addToCart(product, options);
      }
  };

  const handleEditItem = (item: CartItem) => {
      setEditingItem(item);
      // We need to find the base product from adjustedProducts to show in the modal
      // This ensures we have the correct price/image context
      const baseProduct = adjustedProducts.find(p => p.id === item.id) || item;
      setSelectedProduct(baseProduct);
      
      // Close cart drawer if open so modal is visible
      setIsCartOpen(false);
  };

  const handleResolveConflict = () => {
      if (!pendingProduct || !userLocation) return;
      
      // Clear Cart
      setCart([]);
      
      // Update Location Context
      setCartLocation(userLocation);
      
      // Add pending product
      const { product, options } = pendingProduct;
      setCart([{ 
        ...product, 
        quantity: 1,
        rentTonel: options?.rentTonel,
        mugsQuantity: options?.mugsQuantity,
        mugsPrice: options?.mugsPrice,
        moreCups: options?.moreCups,
        isUpsell: options?.isUpsell || false
      }]);
      
      // Reset Pending
      setPendingProduct(null);
  };

  const handleCancelConflict = () => {
      setPendingProduct(null);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
        const newCart = prev.filter(item => item.id !== productId);
        // Reset location if cart becomes empty
        if (newCart.length === 0) {
            setCartLocation(null);
        }
        return newCart;
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
    setCartLocation(null);
  };

  const handleOrderClick = () => {
    // 1. Show Info Modal
    setIsInfoModalOpen(true);
  };

  const handleInfoContinue = () => {
     setIsInfoModalOpen(false);
     // 2. Check if Location is set
     if (!userLocation) {
       setIsLocationModalOpen(true);
     } else {
       setView('menu');
       window.scrollTo({ top: 0, behavior: 'smooth' });
     }
  };

  const handleLocationSelect = (location: string) => {
    setUserLocation(location);
    setIsLocationModalOpen(false);
    setView('menu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- GROWLER RECOMMENDATION LOGIC (UPDATED FOR 3 ITEMS) ---
  const getGrowlerRecommendations = (currentCart: CartItem[], allProducts: Product[]): Product[] => {
      // Get the last added growler to base recommendation on
      const growlersInCart = currentCart.filter(item => item.category === ProductCategory.GROWLER);
      if (growlersInCart.length === 0) return [];
      
      const lastGrowler = growlersInCart[growlersInCart.length - 1];
      
      // Helper: Filter products not in cart and matches category
      const availableGrowlers = allProducts.filter(p => 
          p.category === ProductCategory.GROWLER && 
          !currentCart.some(c => c.id === p.id)
      );

      if (availableGrowlers.length === 0) return [];

      // --- PRIORITY 1: ALWAYS SUGGEST THESE IF NOT IN CART ---
      // Session IPA, Vinho Branco, Vinho Tinto
      const priorityIds = ['growler-session-ipa-1l', 'growler-vinho-branco-1l', 'growler-vinho-tinto-1l'];
      const priorityMatches = availableGrowlers.filter(p => priorityIds.includes(p.id));

      // --- CONTEXTUAL PAIRING LOGIC (For remaining slots) ---
      let primaryTargetTypes: BeerType[] = [];
      let secondaryTargetTypes: BeerType[] = [];

      // Logic Rules
      switch(lastGrowler.type) {
          case BeerType.PILSEN:
              primaryTargetTypes = [BeerType.LAGER, BeerType.VIENNA];
              secondaryTargetTypes = [BeerType.AMBER, BeerType.WEISS];
              break;
          case BeerType.LAGER: 
               // Check if Wine
               if (lastGrowler.name.toLowerCase().includes('vinho')) {
                   // Logic already handled by Priority list, but kept for fallback
                   if (lastGrowler.name.toLowerCase().includes('branco')) {
                        // Priority: Red Wine
                        const red = availableGrowlers.find(p => p.name.toLowerCase().includes('tinto'));
                        if (red) primaryTargetTypes = [red.type as BeerType];
                   } else if (lastGrowler.name.toLowerCase().includes('tinto')) {
                        // Priority: White Wine
                        const white = availableGrowlers.find(p => p.name.toLowerCase().includes('branco'));
                        if (white) primaryTargetTypes = [white.type as BeerType];
                   }
               }
               primaryTargetTypes = [BeerType.PILSEN, BeerType.VIENNA];
               secondaryTargetTypes = [BeerType.AMBER, BeerType.DUNKEL];
               break;
          case BeerType.IPA:
          case BeerType.APA:
              primaryTargetTypes = [BeerType.IPA, BeerType.APA, BeerType.SOUR];
              secondaryTargetTypes = [BeerType.LAGER, BeerType.PILSEN]; // Palate cleanser
              break;
          case BeerType.AMBER:
          case BeerType.DUNKEL:
          case BeerType.RED_ALE:
          case BeerType.STOUT:
              primaryTargetTypes = [BeerType.DUNKEL, BeerType.STOUT, BeerType.RED_ALE];
              secondaryTargetTypes = [BeerType.IPA, BeerType.VIENNA];
              break;
          case BeerType.SOUR:
              primaryTargetTypes = [BeerType.SOUR, BeerType.IPA];
              secondaryTargetTypes = [BeerType.WEISS, BeerType.PILSEN];
              break;
          default:
              primaryTargetTypes = [];
      }

      // Collect Contextual Matches
      const contextualPrimary = availableGrowlers.filter(p => p.type && primaryTargetTypes.includes(p.type));
      const contextualSecondary = availableGrowlers.filter(p => p.type && secondaryTargetTypes.includes(p.type));
      
      // Collect "Popular/Champions" as fillers
      const fillers = availableGrowlers
            .filter(p => !contextualPrimary.includes(p) && !contextualSecondary.includes(p))
            .sort((a, b) => (b.isChampion ? 1 : 0) - (a.isChampion ? 1 : 0));

      // Combine all unique candidates ordered by priority:
      // 1. HARDCODED PRIORITY (Vinho/Session IPA)
      // 2. PAIRING CONTEXT
      // 3. FILLERS
      const allCandidates = Array.from(new Set([...priorityMatches, ...contextualPrimary, ...contextualSecondary, ...fillers]));

      // --- MYSTERY ITEM LOGIC (Slot 3) ---
      // Rule: Can be Wine, Can be Session IPA, but CANNOT be Standard Pilsen or Standard Lager
      const isValidMystery = (p: Product) => {
          // Exception: Wine is allowed (even if typed as LAGER in some configs)
          if (p.name.toLowerCase().includes('vinho')) return true;
          // Block Standard Pilsen/Lager
          return p.type !== BeerType.PILSEN && p.type !== BeerType.LAGER;
      };

      // Try to find a valid mystery candidate from the pool
      const mysteryCandidate = allCandidates.find(isValidMystery);

      // Construct final list of 3
      let finalRecs: Product[] = [];

      if (mysteryCandidate && allCandidates.length >= 3) {
          // Take top 2 that are NOT the mystery candidate
          const standardSlots = allCandidates.filter(p => p.id !== mysteryCandidate.id).slice(0, 2);
          finalRecs = [...standardSlots, mysteryCandidate];
      } else {
          // Fallback if no mystery candidate found (rare) or not enough products
          finalRecs = allCandidates.slice(0, 3);
      }

      return finalRecs;
  };

  const handleCheckoutClick = () => {
    // 1. CHECKOUT CONFLICT CHECK
    if (cart.length > 0 && cartLocation && userLocation && cartLocation !== userLocation) {
        setShowCheckoutConflict(true);
        return;
    }

    // 2. KEG UPSELL CHECK (Priority)
    const hasKeg = cart.some(item => 
      item.category === ProductCategory.KEG30 || 
      item.category === ProductCategory.KEG50
    );
    
    if (hasKeg) {
        // Check what is present in ANY of the kegs
        const hasTonel = cart.some(item => item.rentTonel === true);
        const hasMugs = cart.some(item => item.mugsQuantity);
        const hasQuoteCups = cart.some(item => item.moreCups);

        if (!hasTonel || !hasMugs || !hasQuoteCups) {
           setUpsellOptions({
               offerTonel: !hasTonel,
               offerMugs: !hasMugs,
               offerCups: !hasQuoteCups
           });
           setIsCartOpen(false);
           setIsUpsellModalOpen(true);
           return;
        }
    } 
    // 3. GROWLER UPSELL CHECK
    else {
        // Only run if NO Kegs are in cart (Growler exclusive or Growler mix)
        const hasGrowler = cart.some(item => item.category === ProductCategory.GROWLER);
        
        if (hasGrowler) {
            // Find recommendations (Array of 3)
            const recs = getGrowlerRecommendations(cart, adjustedProducts);
            
            if (recs.length > 0) {
                setRecommendedGrowlers(recs);
                setIsCartOpen(false);
                setIsGrowlerUpsellOpen(true);
                return;
            }
        }
    }

    // If no upsells needed or available
    setIsCartOpen(false); 
    setIsCheckoutOpen(true);
  };

  // --- Upsell Handlers ---

  const handleUpsellConfirm = (addTonel: boolean, addCups: boolean, addMugs: { quantity: 24 | 36 | 48, price: number } | null) => {
      // Keg Upsell Logic
      if (addTonel || addCups || addMugs) {
          setCart(prev => prev.map(item => {
              if (item.category === ProductCategory.KEG30 || item.category === ProductCategory.KEG50) {
                  return { 
                      ...item, 
                      rentTonel: addTonel ? true : item.rentTonel,
                      moreCups: addCups ? true : item.moreCups,
                      mugsQuantity: addMugs ? addMugs.quantity : item.mugsQuantity,
                      mugsPrice: addMugs ? addMugs.price : item.mugsPrice
                  };
              }
              return item;
          }));
      }
      setIsUpsellModalOpen(false);
      setIsCheckoutOpen(true);
  };

  const handleUpsellDecline = () => {
      setIsUpsellModalOpen(false);
      setIsCheckoutOpen(true);
  };

  const handleGrowlerUpsellConfirm = (products: Product[]) => {
      // Add all selected products
      // PASSA A FLAG ISUPSELL=TRUE para marcar no carrinho
      products.forEach(p => addToCart(p, { isUpsell: true }));
      
      setIsGrowlerUpsellOpen(false);
      setIsCheckoutOpen(true);
  };

  const handleGrowlerUpsellDecline = () => {
      setIsGrowlerUpsellOpen(false);
      setIsCheckoutOpen(true);
  };

  const handleResolveCheckoutConflict = (action: 'switch' | 'clear' | 'update') => {
      if (action === 'switch' && cartLocation) {
          // Switch user location to match cart and proceed to checkout
          setUserLocation(cartLocation);
          setShowCheckoutConflict(false);
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
      } else if (action === 'clear') {
          // Clear cart and stay in current location
          clearCart();
          setShowCheckoutConflict(false);
      } else if (action === 'update' && userLocation) {
          // Update items to current location pricing
          setCart(prev => prev.map(item => {
              // Find original base product to ensure we don't double-add or calculate from wrong base
              const original = PRODUCTS.find(p => p.id === item.id) || item;
              let newPrice = original.price;

              if (userLocation === 'Foz do Iguaçu') {
                  if (FOZ_PRICES[item.id] !== undefined) {
                      newPrice = FOZ_PRICES[item.id];
                  } else {
                      // Fallback logic
                      if (item.category === ProductCategory.GROWLER) newPrice += 2;
                      else if (item.category === ProductCategory.KEG30 || item.category === ProductCategory.KEG50) newPrice += 100;
                  }
              }
              // If location is Marechal (default), it stays base price.
              
              return { ...item, price: newPrice };
          }));
          
          setCartLocation(userLocation);
          setShowCheckoutConflict(false);
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
      }
  };

  // UPDATED CALCULATION LOGIC:
  // (Base Price + Tonel + Mugs) * Quantity
  const cartTotal = cart.reduce((acc, item) => {
    const extras = (item.rentTonel ? 30 : 0) + (item.mugsPrice || 0);
    return acc + ((item.price + extras) * item.quantity);
  }, 0);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleCalculatorResult = (liters: number) => {
    setRecommendedVolume(liters);
    if (liters <= 30) {
      setActiveCategory(ProductCategory.KEG30);
    } else {
      setActiveCategory(ProductCategory.KEG50);
    }
    
    // Check location before going to menu from calculator
    if (!userLocation) {
      setIsLocationModalOpen(true);
    } else {
      setView('menu');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Logic to handle Navigation changes
  const handleViewChange = (newView: ViewState) => {
    if (newView === 'contact') {
      setIsContactOpen(true);
    } else if (newView === 'menu') {
      // INTERCEPT: Show Info Modal before going to menu via nav bar
      setIsInfoModalOpen(true);
    } else {
      setView(newView);
    }
  };

  // RENDER LOADING SCREEN IF ASSETS ARE NOT READY
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500 selection:text-black animate-fade-in">
      <main className="max-w-md mx-auto min-h-screen bg-zinc-950 shadow-2xl overflow-hidden relative">
        
        {view === 'home' && (
          <HomeView 
            setView={setView} 
            onOrderClick={handleOrderClick}
            onEventClick={() => setIsContactOpen(true)}
          />
        )}

        {view === 'menu' && (
          <MenuView 
            products={adjustedProducts} 
            addToCart={addToCart} 
            setSelectedProduct={setSelectedProduct}
            recommendedVolume={recommendedVolume}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            userLocation={userLocation}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
          />
        )}

        {view === 'calculator' && (
          <Calculator onCalculate={handleCalculatorResult} />
        )}

        {view === 'cart' && (
          <CartView 
            cart={cart}
            cartTotal={cartTotal}
            setView={setView}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            onEdit={handleEditItem}
            onCheckout={handleCheckoutClick}
          />
        )}
        
        {selectedProduct && (
          <ProductDetail 
            product={selectedProduct} 
            isOpen={!!selectedProduct} 
            onClose={() => {
                setSelectedProduct(null);
                setEditingItem(null); // Clear editing state on close
            }}
            onAdd={handleProductDetailAction}
            editingItem={editingItem}
          />
        )}

        <CartDrawer 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          total={cartTotal}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          onEdit={handleEditItem}
          onCheckout={handleCheckoutClick}
        />

        <CheckoutFlow 
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          cart={cart}
          total={cartTotal}
          onClearCart={clearCart}
          onReturnToHome={() => setView('home')}
          userLocation={userLocation}
        />

        <ContactModal 
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
        />

        <InfoModal 
          isOpen={isInfoModalOpen}
          onClose={() => setIsInfoModalOpen(false)}
          onContinue={handleInfoContinue}
        />

        <LocationModal 
          isOpen={isLocationModalOpen}
          onClose={() => {
            // Optional: If user closes without selecting, maybe go back to home or keep closed
            setIsLocationModalOpen(false);
          }}
          onSelect={handleLocationSelect}
        />

        <UpsellModal 
          isOpen={isUpsellModalOpen}
          onClose={handleUpsellDecline} // Closing with X equals declining
          onConfirm={handleUpsellConfirm}
          onDecline={handleUpsellDecline}
          offerTonel={upsellOptions.offerTonel}
          offerCups={upsellOptions.offerCups}
          offerMugs={upsellOptions.offerMugs}
        />

        <GrowlerUpsellModal 
            isOpen={isGrowlerUpsellOpen}
            onClose={handleGrowlerUpsellDecline}
            onConfirm={handleGrowlerUpsellConfirm}
            onDecline={handleGrowlerUpsellDecline}
            recommendations={recommendedGrowlers}
        />

        {/* Modal for adding new item with conflict */}
        <CartConflictModal 
            isOpen={!!pendingProduct}
            onClose={handleCancelConflict}
            onConfirm={handleResolveConflict}
            currentLocation={cartLocation || ''}
            newLocation={userLocation || ''}
        />

        {/* Modal for checkout conflict */}
        <CheckoutConflictModal
            isOpen={showCheckoutConflict}
            onClose={() => setShowCheckoutConflict(false)}
            onSwitch={() => handleResolveCheckoutConflict('switch')}
            onClear={() => handleResolveCheckoutConflict('clear')}
            onUpdatePrices={() => handleResolveCheckoutConflict('update')}
            cartLocation={cartLocation || ''}
            userLocation={userLocation || ''}
        />

        {cart.length > 0 && view !== 'cart' && !isCartOpen && (
          <FloatingCart 
            count={cartCount} 
            total={cartTotal} 
            onClick={() => setIsCartOpen(true)} 
          />
        )}
      </main>
      
      <Navigation currentView={view} onChangeView={handleViewChange} cartCount={cartCount} />
    </div>
  );
};

export default App;

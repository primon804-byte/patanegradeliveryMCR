
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ShoppingBag, Truck, ShieldCheck, Trash2, ShoppingCart, CalendarDays, Award, MapPin, ChevronDown, Edit2, ArrowRight } from 'lucide-react';
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
    <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
       <div className="absolute inset-0 bg-amber-500/10 rounded-full animate-pulse-soft scale-125" />
       <div className="relative z-10 w-full h-full bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 shadow-2xl">
          <img 
            src="https://i.imgur.com/hm4KO4J_d.webp?maxwidth=760&fidelity=grand" 
            alt="Loading"
            className="w-16 h-16 object-contain animate-float" 
          />
       </div>
    </div>
    <div className="text-amber-500/60 font-serif text-[10px] tracking-[0.4em] uppercase">Patanegra</div>
  </div>
);

// --- Transition Wrapper ---
const ViewContainer: React.FC<{ children: React.ReactNode; viewKey: string }> = ({ children, viewKey }) => (
  <div key={viewKey} className="animate-slide-left will-animate h-full">
    {children}
  </div>
);

// --- Extracted Views ---

const HomeView: React.FC<{
  setView: (v: ViewState) => void;
  onOrderClick: () => void;
  onEventClick: () => void;
}> = ({ setView, onOrderClick, onEventClick }) => (
  <div className="pb-32 relative bg-zinc-950">
      <div className="absolute top-0 left-0 right-0 z-40 flex justify-center pt-8 pointer-events-none">
         <div className="h-32 w-auto max-w-[80%] flex items-center justify-center">
            <img 
              src="https://i.imgur.com/hm4KO4J_d.webp?maxwidth=760&fidelity=grand" 
              alt="Patanegra" 
              className="h-full w-full object-contain filter drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
            />
         </div>
      </div>

      <HeroSlider 
        onOrderClick={onOrderClick}
        onCalcClick={() => setView('calculator')}
      />

      <div className="px-6 py-10 bg-zinc-950 -mt-10 relative z-20 rounded-t-[2.5rem] border-t border-zinc-900 shadow-[0_-15px_40px_rgba(0,0,0,0.9)]">
        <div className="absolute top-0 left-0 right-0 h-[400px] flex items-start justify-center pointer-events-none z-0 pt-12">
            <div className="relative opacity-[0.04]">
                <img src="https://i.ibb.co/bMym2DFk/simbolo2.png" alt="" className="w-72 h-72 object-contain" />
            </div>
        </div>

        <div className="relative z-10">
          <div className="w-10 h-1 bg-zinc-800/50 mx-auto rounded-full mb-8"></div>
          
          <h2 className="text-2xl font-serif text-white mb-3 text-center tracking-tight">Cervejaria Patanegra</h2>
          <p className="text-zinc-500 text-center mb-10 text-sm leading-relaxed max-w-xs mx-auto">
            A excelência do chope artesanal premiado, entregue onde você estiver.
          </p>

          <div className="grid grid-cols-1 gap-5">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm transition-transform active:scale-[0.98]">
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
                <Award size={22} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Tradição Premiada</h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">Qualidade atestada nos maiores concursos cervejeiros.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm transition-transform active:scale-[0.98]">
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
                <Truck size={22} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Logística Dedicada</h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">Entrega pontual e instalação técnica profissional.</p>
              </div>
            </div>

            <button 
              onClick={onEventClick}
              className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 hover:border-amber-500/30 transition-all active:scale-[0.98] backdrop-blur-sm text-left"
            >
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
                <CalendarDays size={22} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  Atendimento para Eventos
                  <span className="text-[8px] bg-amber-500 text-black px-1.5 py-0.5 rounded-full font-black uppercase">Fale Conosco</span>
                </h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">Consultoria gratuita para o seu evento.</p>
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
  const filteredProducts = products.filter(p => p.category === activeCategory);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Smooth top scroll on category change
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeCategory]);

  return (
    <div className="pb-24 max-w-md mx-auto h-screen flex flex-col bg-zinc-950">
      <div className="p-4 pb-2 pt-8 flex-shrink-0">
        <div className="flex flex-col items-start gap-3">
          <button 
            onClick={onOpenLocationModal}
            className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 hover:bg-amber-500/20 transition-all active:scale-95"
          >
             <div className="bg-amber-500 text-black rounded-full p-1">
                <MapPin size={10} strokeWidth={3} />
             </div>
             <span className="text-[10px] font-black uppercase tracking-widest">{userLocation || 'Sua Cidade'}</span>
             <ChevronDown size={14} />
          </button>

          <h2 className="text-2xl font-serif text-white tracking-tight">Escolha seu Chope</h2>
        </div>
      </div>
      
      <div className="sticky top-0 z-20 bg-zinc-950/90 backdrop-blur-xl pt-2 pb-4 border-b border-zinc-900/50 flex-shrink-0">
        <div className="flex overflow-x-auto gap-2 px-4 scrollbar-hide snap-x">
          {Object.values(ProductCategory).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`snap-center flex-shrink-0 px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 scale-105'
                  : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300 border border-zinc-800/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 scroll-smooth">
        <div className="grid grid-cols-2 gap-4 pb-32">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAdd={(p) => (p.category === ProductCategory.GROWLER ? addToCart(p) : setSelectedProduct(p))}
              onClick={setSelectedProduct}
            />
          ))}
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
  updateQuantity: (id: string, delta: number) => void;
  onEdit: (item: CartItem) => void;
  onCheckout: () => void;
}> = ({ cart, cartTotal, setView, removeFromCart, updateQuantity, onEdit, onCheckout }) => (
  <div className="pb-32 max-w-md mx-auto h-screen flex flex-col bg-zinc-950">
    <div className="p-6 pb-2 pt-10 flex-shrink-0 flex items-center gap-4">
      <button 
        onClick={() => setView('menu')}
        className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowRight className="rotate-180" size={24} />
      </button>
      <h2 className="text-2xl font-serif text-white tracking-tight">Seu Pedido</h2>
    </div>

    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {cart.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
          <ShoppingBag size={48} className="opacity-20" />
          <p>Seu carrinho está vazio.</p>
          <Button variant="outline" onClick={() => setView('menu')}>
            Ver Cardápio
          </Button>
        </div>
      ) : (
        cart.map((item) => {
          const extras = (item.rentTonel ? 30 : 0) + (item.mugsPrice || 0);
          const totalItemPrice = (item.price + extras);
          const isKeg = item.category === ProductCategory.KEG30 || item.category === ProductCategory.KEG50;

          return (
            <div key={item.id} className="flex gap-4 bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800/50">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-20 h-20 rounded-xl object-cover bg-zinc-800"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                     <h4 className="font-bold text-white text-sm leading-tight pr-2">{item.name}</h4>
                     {isKeg && (
                         <button 
                           onClick={() => onEdit(item)}
                           className="p-1.5 bg-zinc-800 text-amber-500 rounded-lg hover:bg-amber-500 hover:text-black transition-colors"
                         >
                            <Edit2 size={14} />
                         </button>
                     )}
                  </div>
                  <div className="text-amber-500 font-bold text-sm mt-1">R$ {totalItemPrice.toFixed(2)}</div>
                  
                  {(item.rentTonel || item.mugsQuantity || item.moreCups) && (
                     <div className="mt-2 text-[10px] text-zinc-500 space-y-0.5">
                        {item.rentTonel && <div className="flex items-center gap-1"><span className="w-1 h-1 bg-amber-500 rounded-full"></span> Tonel (+R$30)</div>}
                        {item.mugsQuantity && <div className="flex items-center gap-1"><span className="w-1 h-1 bg-amber-500 rounded-full"></span> {item.mugsQuantity} Canecas (+R${item.mugsPrice})</div>}
                        {item.moreCups && <div className="flex items-center gap-1"><span className="w-1 h-1 bg-amber-500 rounded-full"></span> Cotar Copos Extras</div>}
                     </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center bg-zinc-950 rounded-xl border border-zinc-800 h-9 px-1">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-full flex items-center justify-center text-zinc-400 hover:text-white"
                    >-</button>
                    <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-full flex items-center justify-center text-zinc-400 hover:text-white"
                    >+</button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-zinc-600 hover:text-red-500 transition-colors p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>

    {cart.length > 0 && (
      <div className="p-6 border-t border-zinc-900 bg-zinc-950 pb-28">
        <div className="flex justify-between items-end mb-6">
          <div className="flex flex-col">
            <span className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Total do Pedido</span>
            <span className="text-[10px] text-zinc-600">Taxa de entrega a consultar</span>
          </div>
          <span className="text-3xl font-bold text-amber-500 font-serif">R$ {cartTotal.toFixed(2)}</span>
        </div>

        <Button 
          fullWidth 
          onClick={onCheckout} 
          icon={<ShoppingCart size={20} />}
          className="py-4"
        >
          Finalizar Pedido
        </Button>
      </div>
    )}
  </div>
);

// --- App Component ---

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
  const [isGrowlerUpsellOpen, setIsGrowlerUpsellOpen] = useState(false);
  const [recommendedGrowlers, setRecommendedGrowlers] = useState<Product[]>([]);
  const [upsellOptions, setUpsellOptions] = useState({ offerTonel: false, offerCups: false, offerMugs: false });
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [cartLocation, setCartLocation] = useState<string | null>(null);
  const [pendingProduct, setPendingProduct] = useState<{product: Product, options?: Partial<CartItem>} | null>(null);
  const [showCheckoutConflict, setShowCheckoutConflict] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [recommendedVolume, setRecommendedVolume] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);

  const adjustedProducts = useMemo(() => {
    return PRODUCTS; 
  }, [userLocation]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // --- RECOMENDAÇÃO DE GROWLERS ---
  const getGrowlerRecommendations = (currentCart: CartItem[], allProducts: Product[]): Product[] => {
      const growlersInCart = currentCart.filter(item => item.category === ProductCategory.GROWLER);
      if (growlersInCart.length === 0) return [];
      
      const lastGrowler = growlersInCart[growlersInCart.length - 1];
      const availableGrowlers = allProducts.filter(p => 
          p.category === ProductCategory.GROWLER && 
          !currentCart.some(c => c.id === p.id)
      );

      if (availableGrowlers.length === 0) return [];

      const priorityIds = ['growler-session-ipa-1l', 'growler-vinho-branco-1l', 'growler-vinho-tinto-1l'];
      const priorityMatches = availableGrowlers.filter(p => priorityIds.includes(p.id));

      const fillers = availableGrowlers
            .filter(p => !priorityMatches.includes(p))
            .sort((a, b) => (b.isChampion ? 1 : 0) - (a.isChampion ? 1 : 0));

      const allCandidates = Array.from(new Set([...priorityMatches, ...fillers]));
      return allCandidates.slice(0, 3);
  };

  const handleCheckoutClick = () => {
    if (cart.length > 0 && cartLocation && userLocation && cartLocation !== userLocation) {
        setShowCheckoutConflict(true);
        return;
    }

    const hasKeg = cart.some(item => 
      item.category === ProductCategory.KEG30 || 
      item.category === ProductCategory.KEG50
    );
    
    if (hasKeg) {
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
    } else {
        const hasGrowler = cart.some(item => item.category === ProductCategory.GROWLER);
        if (hasGrowler) {
            const recs = getGrowlerRecommendations(cart, adjustedProducts);
            if (recs.length > 0) {
                setRecommendedGrowlers(recs);
                setIsCartOpen(false);
                setIsGrowlerUpsellOpen(true);
                return;
            }
        }
    }

    setIsCartOpen(false); 
    setIsCheckoutOpen(true);
  };

  const addToCart = (product: Product, options?: Partial<CartItem>) => {
    if (cart.length > 0 && cartLocation && userLocation && cartLocation !== userLocation) {
        setPendingProduct({ product, options });
        return;
    }
    if (cart.length === 0 && userLocation) setCartLocation(userLocation);

    setCart(prev => {
      const idx = prev.findIndex(item => item.id === product.id);
      if (idx >= 0) {
        const newCart = [...prev];
        newCart[idx] = { ...newCart[idx], quantity: newCart[idx].quantity + 1, ...options };
        return newCart;
      }
      return [...prev, { ...product, quantity: 1, ...options, isUpsell: options?.isUpsell || false }];
    });
  };

  const cartTotal = cart.reduce((acc, item) => {
    const extras = (item.rentTonel ? 30 : 0) + (item.mugsPrice || 0);
    return acc + ((item.price + extras) * item.quantity);
  }, 0);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500 selection:text-black overflow-hidden">
      <main className="max-w-md mx-auto min-h-screen bg-zinc-950 shadow-2xl relative overflow-hidden">
        
        <ViewContainer viewKey={view}>
          {view === 'home' && (
            <HomeView 
              setView={setView} 
              onOrderClick={() => setIsInfoModalOpen(true)}
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
            <Calculator onCalculate={(liters) => {
               setRecommendedVolume(liters);
               setActiveCategory(liters <= 30 ? ProductCategory.KEG30 : ProductCategory.KEG50);
               if (!userLocation) setIsLocationModalOpen(true);
               else setView('menu');
            }} />
          )}

          {view === 'cart' && (
            <CartView 
              cart={cart}
              cartTotal={cartTotal}
              setView={setView}
              removeFromCart={(id) => setCart(c => c.filter(i => i.id !== id))}
              updateQuantity={(id, d) => setCart(c => c.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + d)} : i))}
              onEdit={(item) => { setEditingItem(item); setSelectedProduct(PRODUCTS.find(p => p.id === item.id) || item); }}
              onCheckout={handleCheckoutClick}
            />
          )}
        </ViewContainer>

        {selectedProduct && (
          <ProductDetail 
            product={selectedProduct} 
            isOpen={!!selectedProduct} 
            onClose={() => { setSelectedProduct(null); setEditingItem(null); }}
            onAdd={(p, opts) => {
               if (editingItem) setCart(c => c.map(i => i.id === editingItem.id ? {...i, ...opts} : i));
               else addToCart(p, opts);
               setEditingItem(null);
            }}
            editingItem={editingItem}
          />
        )}

        <CartDrawer 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          total={cartTotal}
          onUpdateQuantity={(id, d) => setCart(c => c.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + d)} : i))}
          onRemove={(id) => setCart(c => c.filter(i => i.id !== id))}
          onEdit={(item) => { setIsCartOpen(false); setEditingItem(item); setSelectedProduct(PRODUCTS.find(p => p.id === item.id) || item); }}
          onCheckout={handleCheckoutClick}
        />

        <CheckoutFlow 
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          cart={cart}
          total={cartTotal}
          onClearCart={() => setCart([])}
          userLocation={userLocation}
        />

        <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        <InfoModal 
          isOpen={isInfoModalOpen} 
          onClose={() => setIsInfoModalOpen(false)} 
          onContinue={() => { setIsInfoModalOpen(false); if (!userLocation) setIsLocationModalOpen(true); else setView('menu'); }} 
        />
        <LocationModal 
          isOpen={isLocationModalOpen} 
          onClose={() => setIsLocationModalOpen(false)} 
          onSelect={(loc) => { setUserLocation(loc); setIsLocationModalOpen(false); setView('menu'); }} 
        />

        <UpsellModal 
          isOpen={isUpsellModalOpen}
          onClose={() => setIsCheckoutOpen(true)}
          onConfirm={(t, c, m) => {
              setCart(prev => prev.map(item => (item.category === ProductCategory.KEG30 || item.category === ProductCategory.KEG50) ? {...item, rentTonel: t, moreCups: c, mugsQuantity: m?.quantity, mugsPrice: m?.price} : item));
              setIsUpsellModalOpen(false);
              setIsCheckoutOpen(true);
          }}
          onDecline={() => { setIsUpsellModalOpen(false); setIsCheckoutOpen(true); }}
          offerTonel={upsellOptions.offerTonel}
          offerCups={upsellOptions.offerCups}
          offerMugs={upsellOptions.offerMugs}
        />

        <GrowlerUpsellModal 
            isOpen={isGrowlerUpsellOpen}
            onClose={() => setIsCheckoutOpen(true)}
            onConfirm={(products) => {
                products.forEach(p => addToCart(p, { isUpsell: true }));
                setIsGrowlerUpsellOpen(false);
                setIsCheckoutOpen(true);
            }}
            onDecline={() => { setIsGrowlerUpsellOpen(false); setIsCheckoutOpen(true); }}
            recommendations={recommendedGrowlers}
        />
        
        {cart.length > 0 && view !== 'cart' && !isCartOpen && (
          <FloatingCart count={cartCount} total={cartTotal} onClick={() => setIsCartOpen(true)} />
        )}
      </main>
      
      <Navigation currentView={view} onChangeView={(v) => v === 'contact' ? setIsContactOpen(true) : setView(v)} cartCount={cartCount} />
    </div>
  );
};

export default App;

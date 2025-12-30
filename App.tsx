
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ShoppingBag, Truck, ShieldCheck, Trash2, ShoppingCart, CalendarDays, Award, MapPin, ChevronDown, Edit2, ArrowRight, Star, AlertCircle, RefreshCw, UserPlus, CheckCircle2, Zap, Beer, Heart } from 'lucide-react';
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

// --- Preços específicos para Foz do Iguaçu (Matriz) ---
const FOZ_PRICES: Record<string, number> = {
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
  'keg-pilsen-50': 750,
  'keg-pilsen-30': 450,
  'keg-lager-50': 850,
  'keg-lager-30': 500,
  'keg-session-ipa-30': 540,
  'keg-vinho-branco-30': 500,
  'keg-vinho-tinto-30': 500,
};

// --- Componente de Loading Animado ---
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

// --- Componente de Alerta de Disponibilidade ---
const AvailabilityModal: React.FC<{ isOpen: boolean; onClose: () => void; onContinue: () => void }> = ({ isOpen, onClose, onContinue }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[170] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-zinc-950 rounded-3xl border border-red-500/30 shadow-2xl p-6 animate-slide-up text-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-600 opacity-50" />
        <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-4 border border-red-600/20 shadow-lg">
           <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-serif text-white font-bold mb-2">Verificar Disponibilidade</h2>
        <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
          Será necessário verificar a disponibilidade deste item em nosso estoque. 
          <br/><br/>
          A <strong className="text-white">confirmação final</strong> será realizada pela nossa equipe via <strong className="text-white">WhatsApp</strong> após o envio do pedido.
        </p>
        <div className="space-y-3">
          <Button fullWidth onClick={onContinue} className="bg-red-600 hover:bg-red-500 text-white border-none">
            Entendi, Prosseguir
          </Button>
          <button onClick={onClose} className="text-zinc-500 text-xs font-bold uppercase hover:text-white transition-colors">Voltar</button>
        </div>
      </div>
    </div>
  );
};

const ViewContainer: React.FC<{ children: React.ReactNode; viewKey: string }> = ({ children, viewKey }) => (
  <div key={viewKey} className="animate-slide-left will-animate h-full">
    {children}
  </div>
);

// --- HomeView ---
const HomeView: React.FC<{
  setView: (v: ViewState) => void;
  onOrderClick: () => void;
  onEventClick: () => void;
}> = ({ setView, onOrderClick, onEventClick }) => (
  <div className="pb-32 relative bg-zinc-950">
      <div className="absolute top-0 left-0 right-0 z-40 flex justify-center pt-8 pointer-events-none">
         <div className="h-32 w-auto max-w-[80%] flex items-center justify-center">
            <img src="https://i.imgur.com/hm4KO4J_d.webp?maxwidth=760&fidelity=grand" alt="Patanegra" className="h-full w-full object-contain filter drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]" />
         </div>
      </div>
      <HeroSlider onOrderClick={onOrderClick} onCalcClick={() => setView('calculator')} />
      <div className="px-6 py-10 bg-zinc-950 -mt-10 relative z-20 rounded-t-[2.5rem] border-t border-zinc-900 shadow-[0_-15px_40px_rgba(0,0,0,0.9)]">
        <div className="relative z-10">
          <div className="w-10 h-1 bg-zinc-800/50 mx-auto rounded-full mb-8"></div>
          
          <div className="text-center mb-10">
            <h2 className="text-2xl font-serif text-white mb-3 tracking-tight">Cervejaria Patanegra</h2>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs mx-auto mb-4">
              A excelência do chope artesanal premiado, entregue com frescor absoluto diretamente para o seu evento ou residência.
            </p>
            <div className="flex items-center justify-center gap-4 text-amber-500/50">
               <div className="flex items-center gap-1.5"><Beer size={14} /><span className="text-[10px] font-bold uppercase tracking-widest">Puro Malte</span></div>
               <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
               <div className="flex items-center gap-1.5"><ShieldCheck size={14} /><span className="text-[10px] font-bold uppercase tracking-widest">Garantia</span></div>
               <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
               <div className="flex items-center gap-1.5"><Truck size={14} /><span className="text-[10px] font-bold uppercase tracking-widest">Delivery</span></div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Card 1: Tradição */}
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm transition-all hover:bg-zinc-900/60">
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500 shadow-inner">
                <Award size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-100 mb-1">Tradição Premiada</h3>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Eleita entre as melhores cervejarias artesanais, nossa produção segue rigorosos padrões de qualidade e pureza.
                </p>
              </div>
            </div>

            {/* Card 2: Logística */}
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm transition-all hover:bg-zinc-900/60">
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500 shadow-inner">
                <Truck size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-100 mb-1">Logística Especializada</h3>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Frota própria preparada para garantir que seu chope chegue na temperatura ideal, com instalação técnica profissional inclusa.
                </p>
              </div>
            </div>

            {/* Card 3: Tecnologia/Frescor */}
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm transition-all hover:bg-zinc-900/60">
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500 shadow-inner">
                <Zap size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-100 mb-1">Frescor de Fábrica</h3>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Sistema de envase rápido que preserva os aromas e sabores originais. Do tanque direto para o seu copo.
                </p>
              </div>
            </div>

            {/* Card 4: Eventos (Botão) */}
            <button 
              onClick={onEventClick} 
              className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-900/60 border border-amber-500/20 hover:border-amber-500/40 transition-all active:scale-[0.98] backdrop-blur-sm text-left group shadow-lg shadow-black/20"
            >
              <div className="p-3 bg-amber-500 text-black rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-transform group-hover:scale-110">
                <CalendarDays size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-white">Suporte para Eventos</h3>
                  <span className="text-[8px] bg-amber-500 text-black px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">Fale Conosco</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Consultoria completa para casamentos, festas e eventos corporativos. Calculamos a quantidade exata para você.
                </p>
              </div>
            </button>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 text-[10px] font-medium tracking-widest uppercase">
               <Heart size={12} className="text-red-500" /> Paixão por Chope Artesanal
            </div>
          </div>
        </div>
      </div>
    </div>
);

// --- MenuView ---
const MenuView: React.FC<{
  products: Product[];
  addToCart: (p: Product, options?: Partial<CartItem>) => void;
  setSelectedProduct: (p: Product | null) => void;
  activeCategory: ProductCategory;
  setActiveCategory: (c: ProductCategory) => void;
  userLocation: string | null;
  onOpenLocationModal: () => void;
}> = ({ products, addToCart, setSelectedProduct, activeCategory, setActiveCategory, userLocation, onOpenLocationModal }) => {
  const filteredProducts = products.filter(p => p.category === activeCategory);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (scrollContainerRef.current) scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' }); }, [activeCategory]);
  return (
    <div className="pb-24 max-w-md mx-auto h-screen flex flex-col bg-zinc-950">
      <div className="p-4 pb-2 pt-8 flex-shrink-0">
        <div className="flex flex-col items-start gap-3">
          <button onClick={onOpenLocationModal} className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 hover:bg-amber-500/20 transition-all active:scale-95">
             <div className="bg-amber-500 text-black rounded-full p-1"><MapPin size={10} strokeWidth={3} /></div>
             <span className="text-[10px] font-black uppercase tracking-widest">{userLocation || 'Sua Cidade'}</span>
             <ChevronDown size={14} />
          </button>
          <h2 className="text-2xl font-serif text-white tracking-tight">Escolha seu Chope</h2>
        </div>
      </div>
      <div className="sticky top-0 z-20 bg-zinc-950/90 backdrop-blur-xl pt-2 pb-4 border-b border-zinc-900/50 flex-shrink-0">
        <div className="flex overflow-x-auto gap-2 px-4 scrollbar-hide snap-x">
          {Object.values(ProductCategory).map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`snap-center flex-shrink-0 px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 ${activeCategory === cat ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 scale-105' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300 border border-zinc-800/50'}`}>{cat}</button>
          ))}
        </div>
      </div>
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 scroll-smooth">
        <div className="grid grid-cols-2 gap-4 pb-32">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} onAdd={(p) => (p.category === ProductCategory.GROWLER ? addToCart(p) : setSelectedProduct(p))} onClick={setSelectedProduct} />
          ))}
        </div>
      </div>
    </div>
  );
};

// --- CartView ---
const CartView: React.FC<{
  cart: CartItem[];
  cartTotal: number;
  setView: (v: ViewState) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  onEdit: (item: CartItem) => void;
  onCheckout: () => void;
}> = ({ cart, cartTotal, setView, removeFromCart, updateQuantity, onEdit, onCheckout }) => {
  const hasConsultItem = cart.some(item => item.checkAvailability);
  return (
    <div className="pb-32 max-w-md mx-auto h-screen flex flex-col bg-zinc-950">
      <div className="p-4 pb-2 pt-8 flex-shrink-0 flex items-center justify-between">
        <h2 className="text-2xl font-serif text-white tracking-tight">Seu Pedido</h2>
        {cart.length > 0 && (
          <span className="text-amber-500 font-bold">{cart.length} {cart.length === 1 ? 'item' : 'itens'}</span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-6 animate-fade-in">
            <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
              <ShoppingBag size={40} className="opacity-20" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-zinc-300">Seu carrinho está vazio</p>
              <p className="text-sm text-zinc-500 mt-1">Explore nosso cardápio e adicione <br/> seus itens favoritos.</p>
            </div>
            <Button variant="outline" onClick={() => setView('menu')}>Ver Cardápio</Button>
          </div>
        ) : (
          cart.map((item) => {
            const extras = (item.rentTonel ? 30 : 0) + (item.mugsPrice || 0);
            const totalItemPrice = (item.price + extras);
            const isKeg = item.category === ProductCategory.KEG30 || item.category === ProductCategory.KEG50;
            return (
              <div key={item.id} className="flex gap-4 bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800/50 backdrop-blur-sm animate-slide-up">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-white text-sm leading-tight pr-2">{item.name}</h4>
                      {isKeg && (
                        <button onClick={() => onEdit(item)} className="p-1.5 bg-zinc-800 text-amber-500 rounded-lg hover:bg-amber-500 hover:text-black transition-all"><Edit2 size={12} /></button>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-amber-500 font-bold text-sm">
                        {item.checkAvailability ? 'Consultar' : `R$ ${totalItemPrice.toFixed(2)}`}
                      </span>
                      {item.isUpsell && <span className="text-[8px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded font-black uppercase">Sugestão</span>}
                    </div>
                    {(item.rentTonel || item.mugsQuantity || item.moreCups) && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {item.rentTonel && <span className="text-[9px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-700">Tonel Inc.</span>}
                        {item.mugsQuantity && <span className="text-[9px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-700">{item.mugsQuantity} Canecas</span>}
                        {item.moreCups && <span className="text-[9px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-700">+ Copos</span>}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center bg-zinc-950 rounded-xl border border-zinc-800 h-9 p-1">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-full flex items-center justify-center text-zinc-400 hover:text-white">-</button>
                      <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-full flex items-center justify-center text-zinc-400 hover:text-white">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-800 text-zinc-500 hover:bg-red-500/10 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {cart.length > 0 && (
        <div className="p-6 border-t border-zinc-900 bg-zinc-950/80 backdrop-blur-xl sticky bottom-0 z-10 pb-28">
          <div className="flex justify-between items-end mb-6">
            <div className="flex flex-col">
              <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Total Estimado</span>
              <span className="text-3xl font-serif text-white font-bold">
                R$ {cartTotal.toFixed(2)}{hasConsultItem ? ' + a consultar' : ''}
              </span>
            </div>
            <div className="text-right text-zinc-500 text-[10px] pb-1">Taxas a calcular</div>
          </div>
          <Button fullWidth onClick={onCheckout} className="py-4 text-lg shadow-[0_10px_30px_rgba(245,158,11,0.2)]">Finalizar Pedido</Button>
        </div>
      )}
    </div>
  );
};

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
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [recommendedGrowlers, setRecommendedGrowlers] = useState<Product[]>([]);
  const [upsellOptions, setUpsellOptions] = useState({ offerTonel: false, offerCups: false, offerMugs: false });
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [cartLocation, setCartLocation] = useState<string | null>(null);
  const [pendingProduct, setPendingProduct] = useState<{product: Product, options?: Partial<CartItem>} | null>(null);
  const [showCheckoutConflict, setShowCheckoutConflict] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);

  const adjustedProducts = useMemo(() => {
    if (userLocation === 'Foz do Iguaçu') {
      return PRODUCTS.map(p => FOZ_PRICES[p.id] ? { ...p, price: FOZ_PRICES[p.id] } : p);
    }
    return PRODUCTS; 
  }, [userLocation]);

  useEffect(() => { const timer = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(timer); }, []);

  // --- Algoritmo de Recomendação Inteligente ---
  const getGrowlerRecommendations = (currentCart: CartItem[], allProducts: Product[]): Product[] => {
      // 1. Excluir Pilsen e Lager explicitamente do Upsell de Growlers (conforme solicitado)
      const excludedIds = ['growler-pilsen-cristal-1l', 'growler-premium-lager-1l'];
      
      const available = allProducts.filter(p => 
        p.category === ProductCategory.GROWLER && 
        !currentCart.some(c => c.id === p.id) &&
        !excludedIds.includes(p.id)
      );

      // 2. Prioridade Máxima: Session IPA e Vinhos (se não estiverem no carrinho)
      const priorityIds = ['growler-session-ipa-1l', 'growler-vinho-branco-1l', 'growler-vinho-tinto-1l'];
      const priorityMatches = available.filter(p => priorityIds.includes(p.id));
      
      // 3. Afinidade por Estilo: Se o cliente tem uma IPA, sugere outras lupuladas (APA, etc)
      const cartTypes = currentCart.map(i => i.type);
      const styleMatches = available.filter(p => cartTypes.includes(p.type) && !priorityIds.includes(p.id));

      // 4. Preenchimento (Campeões de Venda restantes)
      const fillers = available.filter(p => !priorityIds.includes(p.id) && !styleMatches.some(s => s.id === p.id))
        .sort((a, b) => (b.isChampion ? 1 : 0) - (a.isChampion ? 1 : 0));

      // Unificar e retornar os 3 melhores
      return Array.from(new Set([...priorityMatches, ...styleMatches, ...fillers])).slice(0, 3);
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

  const handleResolveConflict = () => {
    if (!pendingProduct || !userLocation) return;
    setCart([]);
    setCartLocation(userLocation);
    const { product, options } = pendingProduct;
    setCart([{ ...product, quantity: 1, ...options, isUpsell: options?.isUpsell || false }]);
    setPendingProduct(null);
  };

  const handleResolveCheckoutConflict = (action: 'switch' | 'clear' | 'update') => {
    if (action === 'switch' && cartLocation) setUserLocation(cartLocation);
    else if (action === 'clear') { setCart([]); setCartLocation(null); }
    else if (action === 'update' && userLocation) {
        setCart(prev => prev.map(item => {
            const original = PRODUCTS.find(p => p.id === item.id) || item;
            const newPrice = (userLocation === 'Foz do Iguaçu' && FOZ_PRICES[item.id]) ? FOZ_PRICES[item.id] : original.price;
            return { ...item, price: newPrice };
        }));
        setCartLocation(userLocation);
    }
    setShowCheckoutConflict(false);
  };

  const handleCheckoutClick = () => {
    if (cart.length > 0 && cartLocation && userLocation && cartLocation !== userLocation) {
        setShowCheckoutConflict(true);
        return;
    }

    // Intercepta se houver algum produto que precise de verificação de disponibilidade
    const needsAvailabilityCheck = cart.some(item => item.checkAvailability);
    if (needsAvailabilityCheck && !isAvailabilityModalOpen) {
       setIsAvailabilityModalOpen(true);
       return;
    }

    const hasKeg = cart.some(item => item.category === ProductCategory.KEG30 || item.category === ProductCategory.KEG50);
    if (hasKeg) {
        const hasTonel = cart.some(item => item.rentTonel === true);
        const hasMugs = cart.some(item => item.mugsQuantity);
        const hasQuoteCups = cart.some(item => item.moreCups);
        if (!hasTonel || !hasMugs || !hasQuoteCups) {
           setUpsellOptions({ offerTonel: !hasTonel, offerMugs: !hasMugs, offerCups: !hasQuoteCups });
           setIsCartOpen(false); setIsUpsellModalOpen(true);
           return;
        }
    } else if (cart.some(item => item.category === ProductCategory.GROWLER)) {
        const recs = getGrowlerRecommendations(cart, adjustedProducts);
        if (recs.length > 0) {
            setRecommendedGrowlers(recs);
            setIsCartOpen(false); setIsGrowlerUpsellOpen(true);
            return;
        }
    }
    setIsCartOpen(false); 
    setIsCheckoutOpen(true);
  };

  const proceedToCheckoutAfterAvailability = () => {
      setIsAvailabilityModalOpen(false);
      // Re-invoca o checkout, mas agora ele passará pela trava da flag isAvailabilityModalOpen (se necessário lógica extra)
      // No nosso caso, simplesmente prosseguimos para o fluxo de keg/growler upsell ou checkout final.
      
      const hasKeg = cart.some(item => item.category === ProductCategory.KEG30 || item.category === ProductCategory.KEG50);
      if (hasKeg) {
          const hasTonel = cart.some(item => item.rentTonel === true);
          const hasMugs = cart.some(item => item.mugsQuantity);
          const hasQuoteCups = cart.some(item => item.moreCups);
          if (!hasTonel || !hasMugs || !hasQuoteCups) {
             setUpsellOptions({ offerTonel: !hasTonel, offerMugs: !hasMugs, offerCups: !hasQuoteCups });
             setIsCartOpen(false); setIsUpsellModalOpen(true);
             return;
          }
      } else if (cart.some(item => item.category === ProductCategory.GROWLER)) {
          const recs = getGrowlerRecommendations(cart, adjustedProducts);
          if (recs.length > 0) {
              setRecommendedGrowlers(recs);
              setIsCartOpen(false); setIsGrowlerUpsellOpen(true);
              return;
          }
      }
      setIsCartOpen(false); setIsCheckoutOpen(true);
  };

  const cartTotal = cart.reduce((acc, item) => acc + ((item.price + (item.rentTonel ? 30 : 0) + (item.mugsPrice || 0)) * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500 selection:text-black overflow-hidden">
      <main className="max-w-md mx-auto min-h-screen bg-zinc-950 shadow-2xl relative overflow-hidden">
        <ViewContainer viewKey={view}>
          {view === 'home' && <HomeView setView={setView} onOrderClick={() => setIsInfoModalOpen(true)} onEventClick={() => setIsContactOpen(true)} />}
          {view === 'menu' && <MenuView products={adjustedProducts} addToCart={addToCart} setSelectedProduct={setSelectedProduct} activeCategory={activeCategory} setActiveCategory={setActiveCategory} userLocation={userLocation} onOpenLocationModal={() => setIsLocationModalOpen(true)} />}
          {view === 'calculator' && <Calculator onCalculate={(liters) => { setActiveCategory(liters <= 30 ? ProductCategory.KEG30 : ProductCategory.KEG50); if (!userLocation) setIsInfoModalOpen(true); else setView('menu'); }} />}
          {view === 'cart' && <CartView cart={cart} cartTotal={cartTotal} setView={setView} removeFromCart={(id) => { const newCart = cart.filter(i => i.id !== id); setCart(newCart); if (newCart.length === 0) setCartLocation(null); }} updateQuantity={(id, d) => setCart(c => c.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + d)} : i))} onEdit={(item) => { setEditingItem(item); setSelectedProduct(PRODUCTS.find(p => p.id === item.id) || item); }} onCheckout={handleCheckoutClick} />}
        </ViewContainer>

        {selectedProduct && <ProductDetail product={selectedProduct} isOpen={!!selectedProduct} onClose={() => { setSelectedProduct(null); setEditingItem(null); }} onAdd={(p, opts) => { if (editingItem) setCart(c => c.map(i => i.id === editingItem.id ? {...i, ...opts} : i)); else addToCart(p, opts); setEditingItem(null); }} editingItem={editingItem} />}
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} total={cartTotal} onUpdateQuantity={(id, d) => setCart(c => c.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + d)} : i))} onRemove={(id) => { const newCart = cart.filter(i => i.id !== id); setCart(newCart); if (newCart.length === 0) setCartLocation(null); }} onEdit={(item) => { setIsCartOpen(false); setEditingItem(item); setSelectedProduct(PRODUCTS.find(p => p.id === item.id) || item); }} onCheckout={handleCheckoutClick} />
        <CheckoutFlow isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} cart={cart} total={cartTotal} onClearCart={() => { setCart([]); setCartLocation(null); }} userLocation={userLocation} />
        <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} onContinue={() => { setIsInfoModalOpen(false); if (!userLocation) setIsLocationModalOpen(true); else setView('menu'); }} />
        <LocationModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} onSelect={(loc) => { setUserLocation(loc); setIsLocationModalOpen(false); setView('menu'); }} />
        <UpsellModal isOpen={isUpsellModalOpen} onClose={() => setIsCheckoutOpen(true)} onConfirm={(t, c, m) => { setCart(prev => prev.map(item => (item.category === ProductCategory.KEG30 || item.category === ProductCategory.KEG50) ? {...item, rentTonel: t, moreCups: c, mugsQuantity: m?.quantity, mugsPrice: m?.price} : item)); setIsUpsellModalOpen(false); setIsCheckoutOpen(true); }} onDecline={() => { setIsUpsellModalOpen(false); setIsCheckoutOpen(true); }} offerTonel={upsellOptions.offerTonel} offerCups={upsellOptions.offerCups} offerMugs={upsellOptions.offerMugs} />
        <GrowlerUpsellModal isOpen={isGrowlerUpsellOpen} onClose={() => setIsCheckoutOpen(true)} onConfirm={(prods) => { prods.forEach(p => addToCart(p, { isUpsell: true })); setIsGrowlerUpsellOpen(false); setIsCheckoutOpen(true); }} onDecline={() => { setIsGrowlerUpsellOpen(false); setIsCheckoutOpen(true); }} recommendations={recommendedGrowlers} />
        <AvailabilityModal isOpen={isAvailabilityModalOpen} onClose={() => setIsAvailabilityModalOpen(false)} onContinue={proceedToCheckoutAfterAvailability} />
        <CartConflictModal isOpen={!!pendingProduct} onClose={() => setPendingProduct(null)} onConfirm={handleResolveConflict} currentLocation={cartLocation || ''} newLocation={userLocation || ''} />
        <CheckoutConflictModal isOpen={showCheckoutConflict} onClose={() => setShowCheckoutConflict(false)} onSwitch={() => handleResolveCheckoutConflict('switch')} onClear={() => handleResolveCheckoutConflict('clear')} onUpdatePrices={() => handleResolveCheckoutConflict('update')} cartLocation={cartLocation || ''} userLocation={userLocation || ''} />
        {cart.length > 0 && view !== 'cart' && !isCartOpen && <FloatingCart count={cartCount} total={cartTotal} onClick={() => setIsCartOpen(true)} />}
      </main>

      {/* Navegação Inferior com Fluxo Premium Obrigatório para Produtos */}
      <Navigation 
        currentView={view} 
        onChangeView={(v) => { 
          if (v === 'contact') {
            setIsContactOpen(true); 
          } else if (v === 'menu') {
            // Intercepta SEMPRE para mostrar o banner premium e garantir a cidade
            setIsInfoModalOpen(true); 
          } else {
            setView(v); 
          }
        }} 
        cartCount={cartCount} 
      />
    </div>
  );
};

export default App;

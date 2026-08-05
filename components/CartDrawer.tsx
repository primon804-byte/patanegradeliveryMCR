
import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Edit2 } from 'lucide-react';
import { CartItem, ProductCategory } from '../types';
import { Button } from './Button';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  total: number;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onEdit: (item: CartItem) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  total,
  onUpdateQuantity,
  onRemove,
  onEdit,
  onCheckout
}) => {
  if (!isOpen) return null;

  const hasConsultItem = cart.some(item => item.checkAvailability);

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div className="relative w-full max-w-[85vw] sm:max-w-md h-full bg-zinc-950 border-l border-zinc-800 shadow-2xl animate-slide-left flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 text-black p-2 rounded-lg">
              <ShoppingBag size={20} />
            </div>
            <h2 className="text-xl font-serif text-white">Seu Pedido</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
              <ShoppingBag size={48} className="opacity-20" />
              <p>Seu carrinho está vazio.</p>
              <Button variant="outline" onClick={onClose} className="mt-4">
                Ver Cardápio
              </Button>
            </div>
          ) : (
            cart.map((item) => {
              // Calculate item specific total for display (Base + Extras) * Qty
              const extras = (item.rentTonel ? 30 : 0) + (item.mugsPrice || 0);
              const totalItemPrice = (item.price + extras);
              
              const isKeg = item.category === ProductCategory.KEG30 || item.category === ProductCategory.KEG50;

              return (
                <div key={item.id} className="flex gap-3 bg-zinc-900/50 p-3 rounded-xl border border-zinc-900">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-20 h-20 rounded-lg object-cover bg-zinc-800"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                         <h4 className="font-bold text-zinc-200 text-sm leading-tight mb-1 pr-2">{item.name}</h4>
                         {/* Edit Button for Kegs */}
                         {isKeg && (
                             <button 
                               onClick={() => onEdit(item)}
                               className="p-1 bg-zinc-800 text-amber-500 rounded hover:bg-amber-500 hover:text-black transition-colors"
                             >
                                <Edit2 size={12} />
                             </button>
                         )}
                      </div>
                      <span className="text-amber-500 font-semibold text-sm">
                        {item.checkAvailability ? 'Consultar' : `R$ ${totalItemPrice.toFixed(2)} un.`}
                      </span>
                      
                      {/* Extras Display */}
                      {(item.rentTonel || item.mugsQuantity || item.moreCups) && (
                         <div className="mt-2 text-[10px] text-zinc-400 space-y-0.5">
                            {item.rentTonel && <div className="flex items-center gap-1"><span className="w-1 h-1 bg-amber-500 rounded-full"></span> Tonel (+R$30)</div>}
                            {item.mugsQuantity && <div className="flex items-center gap-1"><span className="w-1 h-1 bg-amber-500 rounded-full"></span> {item.mugsQuantity} Canecas (+R${item.mugsPrice})</div>}
                            {item.moreCups && <div className="flex items-center gap-1"><span className="w-1 h-1 bg-amber-500 rounded-full"></span> Cotar Copos Extras</div>}
                         </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center bg-zinc-950 rounded-lg border border-zinc-800 h-8">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-8 h-full flex items-center justify-center text-zinc-400 hover:text-white"
                        >-</button>
                        <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-8 h-full flex items-center justify-center text-zinc-400 hover:text-white"
                        >+</button>
                      </div>
                      <button 
                        onClick={() => onRemove(item.id)}
                        className="text-zinc-600 hover:text-red-500 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-zinc-900 bg-zinc-950 pb-safe">
            <div className="flex justify-between items-end mb-4">
              <span className="text-zinc-400 text-sm">Total do Pedido</span>
              <span className="text-2xl font-bold text-amber-500 font-serif">
                R$ {total.toFixed(2)}{hasConsultItem ? ' + a consultar' : ''}
              </span>
            </div>

            <Button 
              fullWidth 
              onClick={onCheckout} 
              icon={<ArrowRight size={20} />}
            >
              Finalizar no WhatsApp
            </Button>
            <p className="text-[10px] text-center text-zinc-600 mt-3">
              Taxa de entrega a consultar na confirmação.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

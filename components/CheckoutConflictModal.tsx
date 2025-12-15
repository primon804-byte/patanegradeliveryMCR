
import React from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from './Button';

interface CheckoutConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitch: () => void;
  onClear: () => void;
  cartLocation: string;
  userLocation: string;
}

export const CheckoutConflictModal: React.FC<CheckoutConflictModalProps> = ({
  isOpen, onClose, onSwitch, onClear, cartLocation, userLocation
}) => {
   if (!isOpen) return null;

   return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
       {/* Backdrop */}
       <div 
         className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-fade-in" 
         onClick={onClose} 
       />
       
       {/* Content */}
       <div className="relative w-full max-w-sm bg-zinc-950 rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden animate-slide-up p-6">
           <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 mb-4 border border-amber-500/20">
                  <AlertTriangle size={32} />
              </div>
              
              <h2 className="text-xl font-serif text-white font-bold mb-2">Conflito de Localização</h2>
              
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                  Seu carrinho contém itens de <strong className="text-white">{cartLocation}</strong>, mas você está navegando em <strong className="text-white">{userLocation}</strong>.
              </p>

              <div className="w-full space-y-3">
                  <Button fullWidth onClick={onSwitch}>
                      <div className="flex items-center justify-center gap-2">
                          <RefreshCw size={18} />
                          <span>Mudar para {cartLocation} e Finalizar</span>
                      </div>
                  </Button>
                  
                   <button 
                      onClick={onClear}
                      className="w-full py-3 rounded-xl border border-red-900/30 bg-red-500/5 text-red-500 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                      <Trash2 size={18} />
                      <span>Limpar Carrinho</span>
                  </button>
                  
                  <button onClick={onClose} className="w-full py-2 text-sm text-zinc-500 hover:text-white transition-colors">
                      Cancelar
                  </button>
              </div>
           </div>
       </div>
    </div>
   );
};


import React from 'react';
import { AlertTriangle, Trash2, ArrowRight, X } from 'lucide-react';
import { Button } from './Button';

interface CartConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentLocation: string;
  newLocation: string;
}

export const CartConflictModal: React.FC<CartConflictModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  currentLocation,
  newLocation
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

            <h2 className="text-xl font-serif text-white font-bold mb-2">Trocar de Unidade?</h2>
            
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              Você tem itens no carrinho da unidade <strong className="text-white">{currentLocation}</strong>.
              <br/><br/>
              Para adicionar produtos de <strong className="text-white">{newLocation}</strong>, precisamos limpar seu carrinho atual, pois os preços são diferentes.
            </p>

            <div className="w-full space-y-3">
                <Button 
                    fullWidth 
                    onClick={onConfirm}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 hover:border-red-500"
                >
                    <div className="flex items-center justify-center gap-2">
                        <Trash2 size={18} />
                        <span>Limpar e Adicionar Novo</span>
                    </div>
                </Button>

                <button 
                    onClick={onClose}
                    className="w-full py-3 text-sm text-zinc-500 hover:text-white transition-colors"
                >
                    Cancelar
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

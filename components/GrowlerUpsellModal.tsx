
import React, { useState, useEffect } from 'react';
import { X, Plus, Sparkles, Check, Lock, Gift, HelpCircle } from 'lucide-react';
import { Button } from './Button';
import { Product, BeerType } from '../types';

interface GrowlerUpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (products: Product[]) => void;
  onDecline: () => void;
  recommendations: Product[];
}

// Helper to map beer style to border color
const getStyleColor = (type?: BeerType) => {
    switch (type) {
        case BeerType.PILSEN:
        case BeerType.LAGER:
        case BeerType.VIENNA:
            return 'border-l-amber-400';
        case BeerType.IPA:
        case BeerType.APA:
            return 'border-l-emerald-500';
        case BeerType.RED_ALE:
        case BeerType.AMBER:
            return 'border-l-red-500';
        case BeerType.DUNKEL:
        case BeerType.STOUT:
            return 'border-l-zinc-600';
        case BeerType.SOUR:
            return 'border-l-pink-500';
        case BeerType.WEISS:
            return 'border-l-yellow-200';
        default:
            return 'border-l-purple-500';
    }
};

const getStyleName = (type?: BeerType) => type || 'Especial';

export const GrowlerUpsellModal: React.FC<GrowlerUpsellModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  onDecline, 
  recommendations
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isMysteryRevealed, setIsMysteryRevealed] = useState(false);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
        setSelectedIds([]);
        setIsMysteryRevealed(false);
    }
  }, [isOpen]);

  if (!isOpen || recommendations.length === 0) return null;

  const toggleSelection = (product: Product) => {
      setSelectedIds(prev => {
          if (prev.includes(product.id)) {
              return prev.filter(id => id !== product.id);
          } else {
              return [...prev, product.id];
          }
      });
  };

  const handleConfirm = () => {
      const selectedProducts = recommendations.filter(r => selectedIds.includes(r.id));
      onConfirm(selectedProducts);
  };

  const totalSelected = selectedIds.length;
  const totalValue = recommendations
    .filter(r => selectedIds.includes(r.id))
    .reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative w-full max-w-sm bg-zinc-950 rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Visual Header */}
        <div className="p-6 pb-4 text-center relative z-10 bg-zinc-950 border-b border-zinc-900">
            <div className="flex items-center justify-center gap-2 mb-1">
                <Sparkles size={18} className="text-amber-500" />
                <h2 className="text-lg font-serif text-white font-bold">Complete seu Pedido</h2>
            </div>
            <p className="text-zinc-500 text-xs">
                Selecione abaixo para adicionar à sua experiência.
            </p>
        </div>

        {/* Recommended Products List */}
        <div className="p-4 space-y-3 overflow-y-auto">
            {recommendations.map((product, index) => {
                const isSelected = selectedIds.includes(product.id);
                const borderColorClass = getStyleColor(product.type);
                
                // Logic for the Mystery Card (Assume the last item is the mystery if we have 3 items)
                const isMysteryItem = index === 2 && recommendations.length >= 3;
                const showMysteryCover = isMysteryItem && !isMysteryRevealed;

                if (showMysteryCover) {
                    return (
                        <button 
                            key={`mystery-${index}`}
                            onClick={() => setIsMysteryRevealed(true)}
                            className="w-full relative group h-[100px] flex items-center justify-center bg-zinc-900 rounded-xl overflow-hidden border border-amber-500/30 hover:border-amber-500 transition-all duration-500 shadow-[0_0_15px_rgba(245,158,11,0.05)] hover:shadow-[0_0_25px_rgba(245,158,11,0.2)]"
                        >
                            {/* Animated Background - Now using SLOW pulse */}
                            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-amber-900/20 animate-slow-pulse" />
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                            
                            {/* Content - Now using FLOAT (6s) instead of bounce (1s) */}
                            <div className="relative z-10 flex flex-col items-center gap-2 animate-float">
                                <div className="bg-amber-500 text-black p-1.5 rounded-full shadow-lg shadow-amber-500/20">
                                    <Gift size={18} strokeWidth={2.5} />
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-amber-500/70 text-[9px] font-bold uppercase tracking-widest">
                                        Toque para Revelar
                                    </span>
                                    <span className="text-amber-500 text-[10px] font-bold uppercase tracking-widest mt-0.5 px-2">
                                        O ESTILO QUE COMBINA COM VOCÊ
                                    </span>
                                </div>
                            </div>

                            {/* Shimmer Effect */}
                            <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-amber-500/10 to-transparent pointer-events-none" />
                        </button>
                    );
                }

                // Standard Revealed Card
                return (
                    <button 
                        key={product.id}
                        onClick={() => toggleSelection(product)}
                        className={`w-full group relative flex items-center bg-zinc-900 border rounded-xl overflow-hidden transition-all duration-200 border-l-[6px]
                            ${isSelected 
                                ? `border-amber-500 bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.1)]` 
                                : `border-zinc-800 hover:bg-zinc-800 ${borderColorClass} border-l-zinc-700` // Use gray border-l when not selected
                            }
                            ${!isSelected ? borderColorClass : ''} 
                        `}
                    >
                        {/* Image */}
                        <div className="w-20 h-20 flex-shrink-0 relative overflow-hidden">
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                className={`w-full h-full object-cover transition-transform duration-500 ${isSelected ? 'scale-105' : 'group-hover:scale-105'} opacity-90`}
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                            
                            {/* Reveal Animation Effect (Only if it was the mystery item) */}
                            {isMysteryItem && (
                                <div className="absolute inset-0 bg-amber-500 mix-blend-overlay animate-fade-in pointer-events-none" />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 px-3 py-2 text-left flex flex-col justify-center h-full">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-0.5">
                                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                                    {getStyleName(product.type)}
                                </span>
                                {isMysteryItem && (
                                    <span className="text-[8px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-tight">
                                        O QUE COMBINA COM VOCÊ
                                    </span>
                                )}
                            </div>
                            <h3 className={`font-bold text-sm leading-tight mb-1 line-clamp-2 ${isSelected ? 'text-amber-500' : 'text-white'}`}>
                                {product.name}
                            </h3>
                            <div className="text-zinc-300 font-bold text-sm">
                                R$ {product.price.toFixed(2)}
                            </div>
                        </div>

                        {/* Checkbox / Action Icon */}
                        <div className="pr-4 pl-2">
                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300
                                ${isSelected 
                                    ? 'bg-amber-500 border-amber-500 text-black scale-110' 
                                    : 'bg-zinc-950 border-zinc-700 text-zinc-600 group-hover:border-zinc-500'
                                }
                            `}>
                                {isSelected ? <Check size={14} strokeWidth={3} /> : <Plus size={14} strokeWidth={2} />}
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 pt-2 mt-auto border-t border-zinc-900 bg-zinc-950 space-y-3">
            <Button 
                fullWidth 
                onClick={handleConfirm}
                disabled={totalSelected === 0}
                className={totalSelected === 0 ? 'opacity-50 grayscale' : 'shadow-[0_0_20px_rgba(245,158,11,0.3)]'}
            >
                {totalSelected === 0 
                    ? 'Selecione uma opção acima' 
                    : `Adicionar ${totalSelected} ite${totalSelected > 1 ? 'ns' : 'm'} (R$ ${totalValue.toFixed(2)})`
                }
            </Button>

            <button 
                onClick={onDecline}
                className="w-full py-3 rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
                Não obrigado, finalizar pedido
            </button>
        </div>
      </div>
    </div>
  );
};

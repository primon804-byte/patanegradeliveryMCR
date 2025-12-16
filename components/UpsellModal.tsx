
import React, { useState, useEffect } from 'react';
import { X, Box, Check, ArrowRight, Beer, CheckCircle2, GlassWater } from 'lucide-react';
import { Button } from './Button';

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (addTonel: boolean, addCups: boolean, addMugs: { quantity: 24 | 36 | 48, price: number } | null) => void;
  onDecline: () => void;
  offerTonel: boolean;
  offerCups: boolean;
  offerMugs: boolean;
}

export const UpsellModal: React.FC<UpsellModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  onDecline,
  offerTonel,
  offerCups,
  offerMugs
}) => {
  const [selectedTonel, setSelectedTonel] = useState(false);
  const [selectedCups, setSelectedCups] = useState(false); // Disposable Quote
  const [selectedMugs, setSelectedMugs] = useState(false); // Glass Mugs
  const [mugsConfig, setMugsConfig] = useState<{ quantity: 24 | 36 | 48, price: number }>({ quantity: 24, price: 30 });

  // Reset/Init state when modal opens
  useEffect(() => {
    if (isOpen) {
      // Recommendations: Enabled by default if offered (Aggressive Upsell)
      setSelectedTonel(offerTonel);
      setSelectedMugs(offerMugs);
      // Disposable cups quote is less "premium", maybe keep it off by default or on? Let's keep consistent: ON.
      setSelectedCups(offerCups);
      
      // Reset mugs to lowest tier
      setMugsConfig({ quantity: 24, price: 30 });
    }
  }, [isOpen, offerTonel, offerCups, offerMugs]);

  if (!isOpen) return null;

  const totalExtra = (selectedTonel ? 30 : 0) + (selectedMugs ? mugsConfig.price : 0);

  const handleMugQuantityChange = (qty: 24 | 36 | 48, price: number) => {
      setMugsConfig({ quantity: qty, price });
  };

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
        <div className="relative h-36 bg-zinc-900 overflow-hidden flex-shrink-0">
            <img 
                src="https://i.ibb.co/d4wj1KW2/POST-DELIVERY.png" 
                alt="Instalação Patanegra" 
                className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
            
            <div className="absolute bottom-4 left-6 right-6">
                <span className="inline-block px-2 py-1 bg-amber-500 text-black text-[10px] font-bold rounded mb-2 uppercase tracking-wide">
                    Recomendação
                </span>
                <h2 className="text-xl font-serif text-white font-bold leading-tight drop-shadow-md">
                    Experiência Completa
                </h2>
            </div>
        </div>

        {/* Body */}
        <div className="p-5 pt-2 bg-zinc-950 flex-1 flex flex-col overflow-y-auto">
            <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
                Personalize seu evento com nossos itens exclusivos:
            </p>

            <div className="space-y-3 mb-6">
                
                {/* OPTION 1: TONEL */}
                {offerTonel && (
                    <button 
                        onClick={() => setSelectedTonel(!selectedTonel)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 group
                            ${selectedTonel 
                                ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]' 
                                : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                            }
                        `}
                    >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors flex-shrink-0
                            ${selectedTonel ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-500'}
                        `}>
                            <Box size={20} strokeWidth={2.5} />
                        </div>
                        <div className="flex-1 text-left">
                            <div className="flex justify-between items-center">
                                <span className={`font-bold text-sm ${selectedTonel ? 'text-white' : 'text-zinc-400'}`}>Tonel Patanegra</span>
                                <span className="text-xs font-semibold text-amber-500">+ R$ 30,00</span>
                            </div>
                            <p className="text-[10px] text-zinc-500 leading-tight mt-0.5">Mesa de apoio elegante.</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all flex-shrink-0
                            ${selectedTonel ? 'bg-amber-500 border-amber-500' : 'border-zinc-600'}
                        `}>
                            {selectedTonel && <Check size={12} className="text-black" strokeWidth={3} />}
                        </div>
                    </button>
                )}

                {/* OPTION 2: MUGS (GLASS) */}
                {offerMugs && (
                    <div className={`rounded-xl border transition-all duration-300 overflow-hidden
                         ${selectedMugs 
                            ? 'bg-amber-500/5 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]' 
                            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                        }
                    `}>
                        <button 
                            onClick={() => setSelectedMugs(!selectedMugs)}
                            className="w-full flex items-center gap-3 p-3"
                        >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors flex-shrink-0
                                ${selectedMugs ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-500'}
                            `}>
                                <Beer size={20} strokeWidth={2.5} />
                            </div>
                            <div className="flex-1 text-left">
                                <div className="flex justify-between items-center">
                                    <span className={`font-bold text-sm ${selectedMugs ? 'text-white' : 'text-zinc-400'}`}>Canecas de Vidro</span>
                                    {selectedMugs && <span className="text-xs font-semibold text-amber-500">+ R$ {mugsConfig.price},00</span>}
                                </div>
                                <p className="text-[10px] text-zinc-500 leading-tight mt-0.5">Kit para brindar com estilo.</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all flex-shrink-0
                                ${selectedMugs ? 'bg-amber-500 border-amber-500' : 'border-zinc-600'}
                            `}>
                                {selectedMugs && <Check size={12} className="text-black" strokeWidth={3} />}
                            </div>
                        </button>
                        
                        {/* Quantity Selector (Visible when checked) */}
                        {selectedMugs && (
                            <div className="px-3 pb-3 pt-0 flex gap-2 animate-fade-in">
                                <button 
                                    onClick={() => handleMugQuantityChange(24, 30)}
                                    className={`flex-1 py-1.5 rounded text-[10px] font-bold border transition-colors
                                        ${mugsConfig.quantity === 24 
                                            ? 'bg-amber-500 text-black border-amber-500' 
                                            : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-500'
                                        }`}
                                >
                                    24 un<br/>R$ 30
                                </button>
                                <button 
                                    onClick={() => handleMugQuantityChange(36, 40)}
                                    className={`flex-1 py-1.5 rounded text-[10px] font-bold border transition-colors
                                        ${mugsConfig.quantity === 36 
                                            ? 'bg-amber-500 text-black border-amber-500' 
                                            : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-500'
                                        }`}
                                >
                                    36 un<br/>R$ 40
                                </button>
                                <button 
                                    onClick={() => handleMugQuantityChange(48, 50)}
                                    className={`flex-1 py-1.5 rounded text-[10px] font-bold border transition-colors
                                        ${mugsConfig.quantity === 48 
                                            ? 'bg-amber-500 text-black border-amber-500' 
                                            : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-500'
                                        }`}
                                >
                                    48 un<br/>R$ 50
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* OPTION 3: DISPOSABLE CUPS QUOTE */}
                {offerCups && (
                    <button 
                        onClick={() => setSelectedCups(!selectedCups)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 group
                            ${selectedCups 
                                ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]' 
                                : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                            }
                        `}
                    >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors flex-shrink-0
                            ${selectedCups ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-500'}
                        `}>
                            <GlassWater size={20} strokeWidth={2.5} />
                        </div>
                        <div className="flex-1 text-left">
                            <div className="flex justify-between items-center">
                                <span className={`font-bold text-sm ${selectedCups ? 'text-white' : 'text-zinc-400'}`}>Orçamento de Copos</span>
                                <span className="text-xs font-semibold text-green-500">Grátis</span>
                            </div>
                            <p className="text-[10px] text-zinc-500 leading-tight mt-0.5">
                                Demandas excedentes a 50 copos, solicite orçamento.
                            </p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all flex-shrink-0
                            ${selectedCups ? 'bg-amber-500 border-amber-500' : 'border-zinc-600'}
                        `}>
                            {selectedCups && <Check size={12} className="text-black" strokeWidth={3} />}
                        </div>
                    </button>
                )}
            </div>

            <div className="mt-auto space-y-3">
                <Button 
                    fullWidth 
                    onClick={() => onConfirm(selectedTonel, selectedCups, selectedMugs ? mugsConfig : null)}
                    className="py-4 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                    disabled={!selectedTonel && !selectedCups && !selectedMugs}
                >
                    <div className="flex items-center justify-between w-full">
                        <span className="flex items-center gap-2 font-bold">
                            <CheckCircle2 size={18} strokeWidth={2.5} />
                            Adicionar Selecionados
                        </span>
                        {totalExtra > 0 && (
                            <span className="bg-black/20 px-2 py-0.5 rounded text-sm font-bold">
                                + R$ {totalExtra.toFixed(2)}
                            </span>
                        )}
                    </div>
                </Button>

                <button 
                    onClick={onDecline}
                    className="w-full py-3.5 rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                >
                    Manter meu pedido sem mais adicionais
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

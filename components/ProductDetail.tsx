
import React, { useState, useEffect } from 'react';
import { Product, ProductCategory, CartItem } from '../types';
import { Button } from './Button';
import { X, Droplets, Hop, Utensils, ShoppingBag, Beer, Check, Box, FileSignature, PlusCircle, Star, RefreshCw, AlertCircle } from 'lucide-react';

interface ProductDetailProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: Product, options?: Partial<CartItem>) => void;
  editingItem?: CartItem | null; // New prop to handle edit mode
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, isOpen, onClose, onAdd, editingItem }) => {
  const [rentTonel, setRentTonel] = useState(false);
  const [mugsSelection, setMugsSelection] = useState<string>("");
  const [wantMoreCups, setWantMoreCups] = useState(false);

  // Initialize state based on editingItem OR reset defaults
  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        // Edit Mode: Pre-fill data
        setRentTonel(!!editingItem.rentTonel);
        setWantMoreCups(!!editingItem.moreCups);
        
        if (editingItem.mugsQuantity && editingItem.mugsPrice) {
          setMugsSelection(`${editingItem.mugsQuantity}-${editingItem.mugsPrice}`);
        } else {
          setMugsSelection("");
        }
      } else {
        // Add Mode: Reset
        setRentTonel(false);
        setMugsSelection("");
        setWantMoreCups(false);
      }
    }
  }, [product, isOpen, editingItem]);

  if (!isOpen) return null;

  // Check if product is a Keg (allows extras)
  const isKeg = product.category === ProductCategory.KEG30 || product.category === ProductCategory.KEG50;

  // Helper to parse mugs selection
  const getMugsConfig = () => {
    if (!mugsSelection) return { quantity: null, price: 0 };
    const [qty, price] = mugsSelection.split('-').map(Number);
    return { quantity: qty as 24 | 36 | 48, price };
  };

  const currentMugsConfig = getMugsConfig();
  const extrasTotal = (rentTonel ? 30 : 0) + currentMugsConfig.price;
  const finalUnitTestPrice = product.price + extrasTotal;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-zinc-950 sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl animate-slide-up max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Image Header */}
        <div className="relative h-64 sm:h-72 flex-shrink-0">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
          
          {/* Price Tag Overlay */}
          <div className="absolute bottom-6 left-6">
             <div className="inline-block px-3 py-1 bg-amber-500 text-black text-xs font-bold rounded mb-2">
               {product.category}
             </div>
             <h2 className="text-3xl font-serif font-bold text-white leading-none shadow-black drop-shadow-lg">
               {product.name}
             </h2>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Technical Specs Grid */}
          {(product.abv || product.ibu) && (
            <div className="grid grid-cols-2 gap-4">
              {product.abv && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                  <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                    <Droplets size={20} />
                  </div>
                  <div>
                    <span className="block text-xs text-zinc-500 uppercase tracking-wider">Teor (ABV)</span>
                    <span className="text-lg font-bold text-zinc-200">{product.abv}%</span>
                  </div>
                </div>
              )}
              {product.ibu && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                  <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                    <Hop size={20} />
                  </div>
                  <div>
                    <span className="block text-xs text-zinc-500 uppercase tracking-wider">Amargor (IBU)</span>
                    <span className="text-lg font-bold text-zinc-200">{product.ibu}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-white font-bold mb-2">Sobre</h3>
            <p className="text-zinc-400 leading-relaxed text-sm">
              {product.description}
            </p>
          </div>
          
          {/* EXTRAS - Only for Kegs */}
          {isKeg && (
            <div className="pt-2 border-t border-zinc-900">
              
              {/* Visual Divider for Premium Experience */}
              <div className="flex items-center gap-2 mb-4 mt-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
                  <span className="text-amber-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                    <Star size={10} fill="currentColor" /> Experiência Premium
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
              </div>
              
              {/* Tonel Patanegra Toggle - HIGH VISIBILITY VERSION */}
              <button 
                onClick={() => setRentTonel(!rentTonel)}
                className={`w-full relative overflow-hidden rounded-xl border-2 transition-all duration-300 mb-6 group
                   ${rentTonel 
                     ? 'border-amber-500 bg-zinc-900 shadow-[0_0_30px_rgba(245,158,11,0.15)] scale-[1.02]' 
                     : 'border-zinc-800 bg-zinc-900/50 hover:border-amber-500/50 hover:bg-zinc-900'
                   }
                `}
              >
                {/* Badge Status */}
                <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl font-bold text-[10px] tracking-wider transition-colors z-10
                    ${rentTonel ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-500 border-l border-b border-zinc-700'}
                `}>
                    {rentTonel ? 'ADICIONADO' : 'RECOMENDADO'}
                </div>

                <div className="p-4 flex items-start gap-4 text-left relative z-0">
                    {/* Icon Box */}
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-lg
                        ${rentTonel 
                            ? 'bg-amber-500 text-black rotate-3 scale-110' 
                            : 'bg-zinc-800 text-zinc-500 group-hover:text-amber-500'
                        }
                    `}>
                        <Box size={28} strokeWidth={2.5} />
                    </div>

                    <div className="flex-1">
                        <h4 className={`font-bold text-lg mb-1 ${rentTonel ? 'text-amber-500' : 'text-white'}`}>
                            Tonel Patanegra
                        </h4>
                        <p className="text-xs text-zinc-400 leading-relaxed mb-3 pr-8">
                           Mesa de apoio sofisticada que oculta o barril e cilindro. Visual limpo e elegante.
                        </p>
                        <div className="flex flex-wrap gap-2">
                             <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold transition-colors
                                ${rentTonel ? 'bg-amber-500/20 text-amber-500' : 'bg-zinc-800 text-zinc-400'}
                            `}>
                                {rentTonel ? <Check size={12} /> : <PlusCircle size={12} />}
                                {rentTonel ? 'Incluído no pedido' : 'Adicionar por R$ 30,00'}
                            </div>
                            {/* Availability Warning */}
                            <div className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-zinc-800 text-amber-500/80">
                                <AlertCircle size={10} />
                                Verificar disponibilidade
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Glow Effect when selected */}
                {rentTonel && <div className="absolute inset-0 bg-amber-500/5 pointer-events-none animate-pulse" />}
              </button>
              
              <div className="space-y-4">
                <h3 className="text-zinc-500 font-bold uppercase text-[10px] tracking-wider pl-1">Outros Adicionais</h3>
                
                {/* Mugs Selector */}
                <div className={`bg-zinc-900 p-4 rounded-xl border ${mugsSelection ? 'border-amber-500/50' : 'border-zinc-800'}`}>
                    <div className="flex items-center gap-3 mb-3">
                    <Beer size={20} className="text-amber-500" />
                    <div>
                        <span className="font-bold text-sm text-white block">Canecas de Vidro Patanegra (390ml)</span>
                        <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                             Para combinar com sua comemoração
                             <span className="text-amber-500/70 flex items-center gap-0.5 ml-1">
                                <AlertCircle size={8} /> (Verificar Disp.)
                             </span>
                        </span>
                    </div>
                    </div>
                    
                    <select 
                    className="w-full bg-zinc-950 text-white border border-zinc-700 rounded-lg p-3 text-sm focus:border-amber-500 focus:outline-none mb-3"
                    value={mugsSelection}
                    onChange={(e) => setMugsSelection(e.target.value)}
                    >
                    <option value="">Não desejo canecas de vidro</option>
                    <option value="24-30">24 Canecas (+ R$ 30,00)</option>
                    <option value="36-40">36 Canecas (+ R$ 40,00)</option>
                    <option value="48-50">48 Canecas (+ R$ 50,00)</option>
                    </select>

                    {mugsSelection && (
                    <div className="flex gap-2 items-start bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                        <FileSignature size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                        <p className="text-[10px] text-zinc-400 leading-tight">
                        <strong className="text-amber-500">Importante:</strong> Necessário assinatura de termo de comodato na entrega. Sujeito a disponibilidade de estoque.
                        </p>
                    </div>
                    )}
                </div>

                {/* Disposable Cups Info & Extra Request */}
                <div className="bg-zinc-900/30 rounded-lg border border-zinc-800 overflow-hidden">
                    <div className="p-3 bg-zinc-900/80 flex items-center gap-3 border-b border-zinc-800">
                    <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                        <Check size={16} />
                    </div>
                    <div>
                        <p className="text-xs text-white font-bold">50 Copos Descartáveis Gratuitos</p>
                        <p className="text-[10px] text-zinc-500">Incluído em cada barril.</p>
                    </div>
                    </div>
                    
                    {/* Checkbox for more cups */}
                    <label className="flex items-center gap-3 p-3 cursor-pointer hover:bg-zinc-800/50 transition-colors">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${wantMoreCups ? 'bg-amber-500 border-amber-500' : 'bg-transparent border-zinc-600'}`}>
                            {wantMoreCups && <Check size={14} className="text-black" strokeWidth={3} />}
                            <input 
                            type="checkbox" 
                            className="hidden" 
                            checked={wantMoreCups} 
                            onChange={(e) => setWantMoreCups(e.target.checked)} 
                            />
                        </div>
                        <span className={`text-sm ${wantMoreCups ? 'text-amber-500 font-semibold' : 'text-zinc-400'}`}>
                            Preciso de mais de 50 copos (Orçamento)
                        </span>
                    </label>
                </div>
              </div>

            </div>
          )}

          {/* Pairing */}
          {product.pairing && (
            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
              <div className="flex items-center gap-2 mb-2 text-amber-500">
                <Utensils size={18} />
                <h3 className="font-bold text-sm uppercase tracking-wide">Harmonização</h3>
              </div>
              <p className="text-zinc-300 text-sm italic">
                "{product.pairing}"
              </p>
            </div>
          )}
          
          {/* Spacer for bottom bar */}
          <div className="h-12"></div>
        </div>

        {/* Sticky Bottom Action */}
        <div className="p-4 border-t border-zinc-900 bg-zinc-950 pb-8 sm:pb-4">
          <div className="flex items-center justify-between gap-4 mb-4">
             <div className="text-zinc-400 text-sm">
               Preço Unitário <span className="text-[10px] block text-zinc-600">(Produto + Adicionais)</span>
             </div>
             <div className="text-2xl font-serif text-white">R$ {finalUnitTestPrice.toFixed(2)}</div>
          </div>
          <Button 
            fullWidth 
            icon={editingItem ? <RefreshCw size={20} /> : <ShoppingBag size={20} />} 
            onClick={() => {
              onAdd(product, {
                rentTonel,
                mugsQuantity: currentMugsConfig.quantity,
                mugsPrice: currentMugsConfig.price,
                moreCups: wantMoreCups
              });
              onClose();
            }}
          >
            {editingItem ? 'Atualizar Pedido' : 'Adicionar ao Pedido'}
          </Button>
        </div>

      </div>
    </div>
  );
};

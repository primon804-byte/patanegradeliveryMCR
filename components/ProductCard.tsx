
import React, { useState } from 'react';
import { Product } from '../types';
import { Plus, Flame, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  onClick: (product: Product) => void;
  featured?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd, onClick, featured = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div 
      onClick={() => onClick(product)}
      className={`relative group overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800/60 ${featured ? 'col-span-2' : 'col-span-1'} cursor-pointer transition-all duration-300 hover:border-zinc-700 active:scale-[0.98] will-animate`}
    >
      {/* BADGES */}
      {product.checkAvailability ? (
        <div className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[9px] font-black px-2 py-1 rounded shadow-lg flex items-center gap-1 animate-fade-in uppercase tracking-tighter">
          <AlertCircle size={10} strokeWidth={3} />
          VERIFICAR DISPONIBILIDADE
        </div>
      ) : product.isChampion ? (
        <div className="absolute top-3 left-3 z-10 bg-amber-500 text-black text-[10px] font-bold px-2 py-1 rounded-md shadow-lg flex items-center gap-1 animate-fade-in">
          <div className="flex -space-x-1">
            <Flame size={10} strokeWidth={3} />
            <Flame size={10} strokeWidth={3} />
          </div>
          CAMPEÃO DE VENDAS
        </div>
      ) : product.isPopular ? (
        <div className="absolute top-3 left-3 z-10 bg-amber-500 text-black text-[10px] font-bold px-2 py-1 rounded-md shadow-lg flex items-center gap-1 animate-fade-in">
          <Flame size={10} strokeWidth={3} />
          MAIS PEDIDO
        </div>
      ) : null}
      
      <div className={`relative ${featured ? 'h-48' : 'h-40'} w-full overflow-hidden bg-zinc-800`}>
        <img 
          src={product.image} 
          alt={product.name} 
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 ${imageLoaded ? 'opacity-80 blur-0 scale-100' : 'opacity-0 blur-lg scale-110'} group-hover:opacity-100 group-hover:scale-105`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-lg text-white leading-tight tracking-tight">{product.name}</h3>
        </div>
        
        <p className="text-zinc-500 text-[11px] mb-3 line-clamp-2 min-h-[2.5em] leading-relaxed">{product.description}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-amber-500 font-bold text-lg">
            {product.checkAvailability ? 'Consultar' : `R$ ${product.price.toFixed(2)}`}
          </span>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAdd(product);
            }}
            className="w-10 h-10 rounded-full bg-zinc-800 text-white flex items-center justify-center hover:bg-amber-500 hover:text-black transition-all duration-300 shadow-lg active:scale-90"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

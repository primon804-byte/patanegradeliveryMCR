
import React from 'react';
import { X, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from './Button';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, onContinue }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-sm bg-zinc-950 rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden animate-slide-up flex flex-col">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Image Area */}
        <div className="relative w-full aspect-[4/5] bg-zinc-900">
           <img 
             src="https://i.ibb.co/d4wj1KW2/POST-DELIVERY.png" 
             alt="Serviço de Instalação Patanegra" 
             className="w-full h-full object-cover"
           />
           {/* Gradient Overlay for Text Readability */}
           <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
           
           <div className="absolute bottom-0 left-0 right-0 p-6 pb-4">
              <div className="flex items-center gap-2 text-amber-500 mb-2">
                 <ShieldCheck size={24} />
                 <span className="font-bold text-xs tracking-widest uppercase">Serviço Premium</span>
              </div>
              <h2 className="text-2xl font-serif text-white font-bold leading-tight drop-shadow-md">
                Instalação Completa & Garantia
              </h2>
           </div>
        </div>

        {/* Content Area */}
        <div className="p-6 pt-2 bg-zinc-950">
           <p className="text-zinc-400 text-sm leading-relaxed mb-6 border-l-2 border-amber-500/50 pl-4">
             Delivery Patanegra oferece o serviço de instalação com garantia de eficiência e qualidade do produto. Oferecemos a chopeira, cilindro, barril e copos se necessário.
           </p>

           <Button fullWidth onClick={onContinue} icon={<ArrowRight size={20} />}>
             Entendi, ver Cardápio
           </Button>
        </div>
      </div>
    </div>
  );
};

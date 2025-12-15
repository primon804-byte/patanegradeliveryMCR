
import React from 'react';
import { Calculator, ArrowRight, Award } from 'lucide-react';
import { Button } from './Button';

interface HeroSliderProps {
  onOrderClick: () => void;
  onCalcClick: () => void;
}

const STATIC_IMAGE = 'https://i.ibb.co/jZWpr3kK/IMG-9249-1.jpg';
const MEDAL_IMAGE = 'https://i.ibb.co/N2QW02V5/Asset-10-300x-1.png';

export const HeroSlider: React.FC<HeroSliderProps> = ({ onOrderClick, onCalcClick }) => {
  return (
    <div className="relative h-[70vh] w-full overflow-hidden">
        {/* Static Background Image */}
        <div className="absolute inset-0">
          <img 
            src={STATIC_IMAGE}
            alt="Patanegra Destaque"
            className="w-full h-full object-cover"
            loading="eager"
            // @ts-ignore
            fetchPriority="high"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-zinc-950" />
        </div>

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 pb-12 z-10">
          
          {/* Floating Medal Image - Interactive & Animated */}
          <button 
            type="button"
            className="absolute right-4 bottom-44 z-20 animate-slide-up cursor-pointer group outline-none"
            aria-label="Cervejaria Premiada"
          >
            <div className="relative transition-transform duration-300 ease-out transform group-hover:scale-110 group-active:scale-90 group-hover:-rotate-3">
              {/* Glow behind the medal */}
              <div className="absolute inset-4 bg-amber-500/30 blur-2xl rounded-full animate-pulse opacity-70 group-hover:opacity-100 transition-opacity" />
              
              <img 
                src={MEDAL_IMAGE} 
                alt="Prêmio" 
                className="relative w-28 h-28 object-contain drop-shadow-[0_0_25px_rgba(245,158,11,0.5)] filter brightness-110 animate-float"
              />
            </div>
          </button>

          <div className="mb-4 inline-flex items-center px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 backdrop-blur-md self-start animate-fade-in">
            <Award className="w-5 h-5 mr-2 text-amber-500" />
            <span className="text-amber-500 text-xs font-bold tracking-wide uppercase">CERVEJARIA PREMIADA</span>
          </div>
          
          <div className="flex flex-col gap-3 w-full">
            <Button 
              fullWidth 
              onClick={onOrderClick}
              className="relative overflow-hidden group shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] hover:-translate-y-1 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 font-bold tracking-wide">
                PEDIR AGORA
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </span>
              {/* Shimmer Effect Overlay - Continuous & Brighter */}
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent z-0 pointer-events-none" />
            </Button>
            
            <Button 
              fullWidth 
              variant="outline" 
              onClick={onCalcClick}
              className="bg-zinc-950/40 backdrop-blur-md border-zinc-700 hover:bg-zinc-900 hover:border-amber-500 transition-all active:scale-95"
              icon={<Calculator size={18} />}
            >
               Calculadora de Chopp
            </Button>
          </div>
        </div>
      </div>
  );
};

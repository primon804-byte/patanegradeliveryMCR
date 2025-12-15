
import React, { useState } from 'react';
import { MapPin, X, User, Calendar, Map, CheckCircle2, ArrowRight, QrCode, CreditCard, Banknote } from 'lucide-react';
import { Button } from './Button';
import { CartItem } from '../types';
import { WHATSAPP_NUMBERS } from '../constants';

interface CheckoutFlowProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  total: number;
  onClearCart: () => void;
  onReturnToHome?: () => void;
}

type PaymentMethod = 'PIX' | 'Cartão' | 'Dinheiro';

export const CheckoutFlow: React.FC<CheckoutFlowProps> = ({ isOpen, onClose, cart, total, onClearCart, onReturnToHome }) => {
  // Step 1: Form, Step 2: Success
  const [step, setStep] = useState<1 | 2>(1);
  const location = 'Marechal Cândido Rondon';
  
  // Form State
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

  if (!isOpen) return null;

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dob || !address || !paymentMethod) return;

    // Use Marechal Number
    const phoneNumber = WHATSAPP_NUMBERS.MARECHAL;

    // Construct Message
    const header = `*Novo Pedido - Patanegra App*\n------------------\n`;
    
    const items = cart.map(item => {
      let itemString = `• ${item.quantity}x ${item.name} (R$ ${item.price})\n`;
      
      // Append extras if present
      const extras = [];
      if (item.rentTables) extras.push("  - Orçamento Mesas: Sim");
      if (item.rentUmbrellas) extras.push("  - Orçamento Ombrelones: Sim");
      if (item.cupsQuantity) extras.push(`  - Copos: ${item.cupsQuantity} un.`);
      
      if (extras.length > 0) {
        itemString += extras.join('\n') + '\n';
      }
      return itemString;
    }).join('');

    const totalMsg = `\n*Total Aprox.: R$ ${total.toFixed(2)}*`;
    
    const clientInfo = `\n\n👤 *Dados do Cliente*\n------------------\nNome: ${name}\nNascimento: ${dob}\nEndereço: ${address}\n📍 Unidade: ${location}\n💰 Pagamento: ${paymentMethod}`;
    const footer = `\n\n------------------\nGostaria de confirmar o pedido.`;

    const message = encodeURIComponent(header + items + totalMsg + clientInfo + footer);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    // Open WhatsApp
    const link = document.createElement('a');
    link.href = whatsappUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Move to Success Step
    setStep(2);
  };

  const handleClose = () => {
    if (step === 2) {
      onClearCart();
      setStep(1); // Reset step
      setPaymentMethod(null);
      
      if (onReturnToHome) {
        onReturnToHome();
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* Content Container */}
      <div className="relative w-full max-w-sm bg-zinc-950 rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        
        {/* Glow Effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />

        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2 min-h-[60px]">
          <h2 className="text-xl font-serif text-white">
            {step === 1 ? 'Finalizar Pedido' : ''}
          </h2>
          <button 
            onClick={handleClose}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* STEP 1: User Data Form */}
        {step === 1 && (
          <form onSubmit={handleFinalSubmit} className="p-6 pt-0 flex flex-col gap-4 overflow-y-auto">
            
            {/* Fixed Location Display */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                    <MapPin size={16} />
                </div>
                <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-bold">Unidade de Entrega</p>
                    <p className="text-sm font-medium text-white leading-tight">{location}</p>
                </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Seu Nome</label>
              <div className="relative">
                <input 
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pl-10 text-white focus:border-amber-500 focus:outline-none transition-colors"
                  placeholder="Como podemos te chamar?"
                />
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Data de Nascimento</label>
              <div className="relative">
                <input 
                  required
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pl-10 text-white focus:border-amber-500 focus:outline-none transition-colors [color-scheme:dark]"
                />
                <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Endereço de Entrega</label>
              <div className="relative">
                <textarea 
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pl-10 text-white focus:border-amber-500 focus:outline-none transition-colors resize-none"
                  placeholder="Rua, Número, Bairro..."
                />
                <Map size={18} className="absolute left-3 top-4 text-zinc-500" />
              </div>
            </div>

            <div className="space-y-2 pt-2">
               <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Forma de Pagamento</label>
               <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('PIX')}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'PIX' ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'}`}
                  >
                    <QrCode size={20} />
                    <span className="text-[10px] font-bold">PIX</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Cartão')}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'Cartão' ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'}`}
                  >
                    <CreditCard size={20} />
                    <span className="text-[10px] font-bold">Cartão</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Dinheiro')}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'Dinheiro' ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'}`}
                  >
                    <Banknote size={20} />
                    <span className="text-[10px] font-bold">Dinheiro</span>
                  </button>
               </div>
            </div>

            <Button 
              type="submit" 
              fullWidth 
              className="mt-4"
              icon={<ArrowRight size={20} />}
              disabled={!name || !dob || !address || !paymentMethod}
            >
              Enviar Pedido
            </Button>
          </form>
        )}

        {/* STEP 2: Success Screen */}
        {step === 2 && (
          <div className="p-6 pt-0 flex flex-col items-center justify-center text-center h-full animate-fade-in pb-8">
             <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-4 ring-1 ring-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                <CheckCircle2 size={32} />
             </div>
             
             <h2 className="text-2xl font-serif text-white mb-1">Pedido Realizado!</h2>
             <p className="text-zinc-400 font-medium mb-6">Muito obrigado!</p>
             
             <p className="text-zinc-400 text-sm mb-6 leading-relaxed px-4">
                Iremos retornar confirmando seu pedido no WhatsApp.
             </p>

             <p className="text-amber-500 font-bold text-sm uppercase tracking-wide mb-2 animate-pulse">
                Seu pedido está a caminho
             </p>

             {/* Delivery GIF */}
             <div className="relative w-full max-w-[220px] rounded-2xl overflow-hidden mb-6 border border-zinc-800 bg-zinc-900">
                <img 
                   src="https://i.imgur.com/oAYG2Yl.gif" 
                   alt="Delivery em andamento"
                   className="w-full h-full object-cover"
                />
             </div>

             <Button fullWidth onClick={handleClose} variant="secondary">
                Fechar
             </Button>
          </div>
        )}
      </div>
    </div>
  );
};

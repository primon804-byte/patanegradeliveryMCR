
import React, { useState } from 'react';
import { MapPin, X, User, Calendar, Map, CheckCircle2, ArrowRight, QrCode, CreditCard, Banknote, Home, Fingerprint, FileText, Camera, Zap, Clock, Smartphone, Beer } from 'lucide-react';
import { Button } from './Button';
import { CartItem, ProductCategory } from '../types';
import { WHATSAPP_NUMBERS } from '../constants';

interface CheckoutFlowProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  total: number;
  onClearCart: () => void;
  onReturnToHome?: () => void;
  userLocation: string | null;
}

type PaymentMethod = 'PIX' | 'Cartão' | 'Dinheiro';
type Voltage = '110v' | '220v' | 'Não sei';

export const CheckoutFlow: React.FC<CheckoutFlowProps> = ({ isOpen, onClose, cart, total, onClearCart, onReturnToHome, userLocation }) => {
  // Step 1: Form, Step 2: Success
  const [step, setStep] = useState<1 | 2>(1);
  
  const locationName = userLocation || 'Marechal Cândido Rondon'; 
  
  // Check if cart contains a Keg (requires full registration)
  const hasKeg = cart.some(item => 
    item.category === ProductCategory.KEG30 || 
    item.category === ProductCategory.KEG50
  );

  // --- Personal Data ---
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [address, setAddress] = useState(''); // Residential (Keg) or Delivery (Growler)
  const [neighborhood, setNeighborhood] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');

  // --- Event Data (Only for Kegs) ---
  const [eventAddress, setEventAddress] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [voltage, setVoltage] = useState<Voltage>('110v');

  // --- Payment ---
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

  if (!isOpen) return null;

  // Calculate total liters in cart
  const totalLiters = cart.reduce((acc, item) => {
    let vol = item.volumeLiters || 0;
    if (item.category === ProductCategory.KEG30) vol = 30;
    if (item.category === ProductCategory.KEG50) vol = 50;
    if (item.category === ProductCategory.GROWLER) vol = 1;
    return acc + (vol * item.quantity);
  }, 0);

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic Validation
    if (!name || !address || !mobilePhone || !neighborhood || !paymentMethod) return;

    // Extra Validation for Kegs
    if (hasKeg) {
        if (!cpf || !eventAddress || !eventDate) return;
    }

    // Determine WhatsApp Number based on Location
    const phoneNumber = locationName === 'Foz do Iguaçu' 
      ? WHATSAPP_NUMBERS.FOZ 
      : WHATSAPP_NUMBERS.MARECHAL;

    let fullMessage = "";

    // --- Message Construction for KEGS (Ficha Completa) ---
    if (hasKeg) {
        const header = `*FICHA DE CADASTRO - PATANEGRA*\n------------------\n`;
        
        const personalBlock = 
          `*NOME:* ${name}\n` +
          `*CPF:* ${cpf}\n` +
          `*RG:* ${rg || 'Não informado'}\n` +
          `*END. RESIDENCIAL:* ${address}\n` +
          `*BAIRRO:* ${neighborhood}\n` +
          `*CELULAR:* ${mobilePhone}\n`;

        const docsBlock = `\n📸 *FOTOS (Enviarei a seguir):*\n- Comprovante de Residência\n- CNH (Documento com foto)\n`;

        const eventBlock = 
          `\n--- DADOS DO EVENTO ---\n` +
          `*ENDEREÇO DO EVENTO:* ${eventAddress}\n` +
          `*DATA:* ${eventDate.split('-').reverse().join('/')}\n` +
          `*HORA:* ${eventTime || 'Não definida'}\n` +
          `*VOLTAGEM:* ${voltage}\n` +
          `*TOTAL LITROS:* ${totalLiters}L\n`;

        const itemsBlock = `\n--- PEDIDO ---\n` + cart.map(item => {
          let itemString = `• ${item.quantity}x ${item.name}`;
          if (item.rentTonel) itemString += " (+ Tonel)";
          if (item.mugsQuantity) itemString += ` (+ ${item.mugsQuantity} Canecas)`;
          if (item.moreCups) itemString += ` (+ Cotar Copos)`;
          return itemString;
        }).join('\n');

        const paymentBlock = `\n\n💰 *PAGAMENTO:* ${paymentMethod}`;
        const totalMsg = `\n💵 *VALOR APROX:* R$ ${total.toFixed(2)}`;

        fullMessage = header + personalBlock + docsBlock + eventBlock + itemsBlock + paymentBlock + totalMsg;
    } 
    // --- Message Construction for GROWLERS (Pedido Simples) ---
    else {
        const header = `*NOVO PEDIDO DELIVERY*\n------------------\n`;
        
        const itemsBlock = cart.map(item => `• ${item.quantity}x ${item.name} (R$ ${item.price})`).join('\n');
        
        const deliveryBlock = 
            `\n\n👤 *CLIENTE:* ${name}\n` +
            `📱 *CELULAR:* ${mobilePhone}\n` +
            `📍 *ENTREGAR EM:* ${address}\n` +
            `🏘️ *BAIRRO:* ${neighborhood}`;
            
        const paymentBlock = `\n\n💰 *PAGAMENTO:* ${paymentMethod}`;
        const totalMsg = `\n💵 *TOTAL:* R$ ${total.toFixed(2)}`;
        const footer = `\n\n_(Aguardando taxa de entrega)_`;

        fullMessage = header + itemsBlock + totalMsg + deliveryBlock + paymentBlock + footer;
    }

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(fullMessage)}`;
    
    // Open WhatsApp
    const link = document.createElement('a');
    link.href = whatsappUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setStep(2);
  };

  const handleClose = () => {
    if (step === 2) {
      onClearCart();
      setStep(1);
      // Reset Form
      setPaymentMethod(null);
      setName(''); setCpf(''); setRg(''); setAddress(''); setNeighborhood('');
      setMobilePhone('');
      setEventAddress(''); setEventDate(''); setEventTime(''); setVoltage('110v');
      
      if (onReturnToHome) onReturnToHome();
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
      <div className="relative w-full max-w-md bg-zinc-950 rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        
        {/* Glow Effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />

        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2 min-h-[60px] flex-shrink-0 bg-zinc-950 z-20">
          <div className="flex flex-col">
              <h2 className="text-xl font-serif text-white">
                {step === 1 ? (hasKeg ? 'Ficha Cadastral' : 'Finalizar Pedido') : ''}
              </h2>
              {step === 1 && !hasKeg && <span className="text-[10px] text-zinc-500">Delivery Rápido</span>}
          </div>
          <button 
            onClick={handleClose}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* STEP 1: Registration Form */}
        {step === 1 && (
          <form onSubmit={handleFinalSubmit} className="p-6 pt-0 flex flex-col gap-6 overflow-y-auto scrollbar-hide">
            
            {/* Location Badge */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center gap-3 flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                    <MapPin size={16} />
                </div>
                <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-bold">Unidade de Atendimento</p>
                    <p className="text-sm font-medium text-white leading-tight">{locationName}</p>
                </div>
            </div>

            {/* --- DADOS BÁSICOS (Comuns) --- */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-zinc-800">
                <User size={16} className="text-amber-500" />
                <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    {hasKeg ? 'Dados do Contratante' : 'Seus Dados'}
                </h3>
              </div>

              {/* Nome */}
              <div className="relative">
                <input 
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pl-10 text-white focus:border-amber-500 focus:outline-none transition-colors placeholder:text-zinc-600"
                  placeholder="Nome Completo"
                />
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              </div>

              {/* Celular */}
              <div className="relative">
                  <input 
                      required
                      type="tel"
                      value={mobilePhone}
                      onChange={(e) => setMobilePhone(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pl-10 text-white focus:border-amber-500 focus:outline-none placeholder:text-zinc-600"
                      placeholder="Celular (WhatsApp)"
                  />
                  <Smartphone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              </div>

              {/* Campos EXTRAS apenas para Barril (CPF/RG) */}
              {hasKeg && (
                  <div className="grid grid-cols-2 gap-3 animate-fade-in">
                      <div className="relative">
                          <input 
                              required
                              type="text"
                              value={cpf}
                              onChange={(e) => setCpf(e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pl-10 text-white focus:border-amber-500 focus:outline-none placeholder:text-zinc-600"
                              placeholder="CPF"
                          />
                          <Fingerprint size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                      </div>
                      <div className="relative">
                          <input 
                              type="text"
                              value={rg}
                              onChange={(e) => setRg(e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pl-10 text-white focus:border-amber-500 focus:outline-none placeholder:text-zinc-600"
                              placeholder="RG"
                          />
                          <FileText size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                      </div>
                  </div>
              )}

              {/* Endereço */}
              <div className="space-y-3">
                  <div className="relative">
                    <input 
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pl-10 text-white focus:border-amber-500 focus:outline-none placeholder:text-zinc-600"
                      placeholder={hasKeg ? "Endereço Residencial (Cadastro)" : "Endereço de Entrega"}
                    />
                    <Home size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  </div>
                  <div className="relative">
                    <input 
                      required
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pl-10 text-white focus:border-amber-500 focus:outline-none placeholder:text-zinc-600"
                      placeholder="Bairro"
                    />
                    <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  </div>
              </div>
            </div>

            {/* --- SEÇÕES EXCLUSIVAS BARRIL --- */}
            {hasKeg && (
                <>
                    {/* DOCUMENTOS */}
                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 border-dashed animate-fade-in">
                        <div className="flex items-center gap-2 mb-2 text-zinc-400">
                            <Camera size={18} />
                            <span className="text-xs font-bold uppercase">Documentação Necessária</span>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex-1 h-20 bg-zinc-900 rounded-lg flex flex-col items-center justify-center text-zinc-600 border border-zinc-800">
                                <FileText size={20} className="mb-1" />
                                <span className="text-[10px] text-center px-2">Foto Comp. Residência</span>
                            </div>
                            <div className="flex-1 h-20 bg-zinc-900 rounded-lg flex flex-col items-center justify-center text-zinc-600 border border-zinc-800">
                                <Fingerprint size={20} className="mb-1" />
                                <span className="text-[10px] text-center px-2">Foto CNH / RG</span>
                            </div>
                        </div>
                        <p className="text-[10px] text-amber-500 mt-2 text-center leading-tight">
                            * Enviar fotos pelo WhatsApp após confirmar.
                        </p>
                    </div>

                    {/* DADOS DO EVENTO */}
                    <div className="space-y-3 animate-fade-in">
                      <div className="flex items-center gap-2 pb-1 border-b border-zinc-800">
                        <Calendar size={16} className="text-amber-500" />
                        <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Dados do Evento</h3>
                      </div>

                      <div className="relative">
                        <input
                          required
                          value={eventAddress}
                          onChange={(e) => setEventAddress(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pl-10 text-white focus:border-amber-500 focus:outline-none placeholder:text-zinc-600"
                          placeholder="Endereço do Evento (Entrega)"
                        />
                        <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                          <div className="relative">
                              <input 
                                  required
                                  type="date"
                                  value={eventDate}
                                  onChange={(e) => setEventDate(e.target.value)}
                                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pl-10 text-white focus:border-amber-500 focus:outline-none [color-scheme:dark]"
                              />
                              <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                          </div>
                          <div className="relative">
                              <input 
                                  type="time"
                                  value={eventTime}
                                  onChange={(e) => setEventTime(e.target.value)}
                                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pl-10 text-white focus:border-amber-500 focus:outline-none [color-scheme:dark]"
                              />
                              <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                          </div>
                      </div>

                      {/* Voltagem e Litragem */}
                      <div className="grid grid-cols-2 gap-3">
                         <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-2 text-zinc-400">
                                <Zap size={16} className="text-amber-500"/>
                                <span className="text-[10px] font-bold uppercase">Voltagem</span>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    type="button"
                                    onClick={() => setVoltage('110v')}
                                    className={`flex-1 py-1 text-xs rounded transition-colors ${voltage === '110v' ? 'bg-amber-500 text-black font-bold' : 'bg-zinc-800 text-zinc-400'}`}
                                >110v</button>
                                <button 
                                    type="button"
                                    onClick={() => setVoltage('220v')}
                                    className={`flex-1 py-1 text-xs rounded transition-colors ${voltage === '220v' ? 'bg-amber-500 text-black font-bold' : 'bg-zinc-800 text-zinc-400'}`}
                                >220v</button>
                            </div>
                         </div>

                         <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex flex-col justify-center items-center">
                            <span className="text-[10px] text-zinc-500 uppercase font-bold">Volume Total</span>
                            <span className="text-xl font-bold text-white">{totalLiters} <span className="text-sm font-normal text-zinc-400">Litros</span></span>
                         </div>
                      </div>
                    </div>
                </>
            )}

            {/* --- SEÇÃO 4: PAGAMENTO --- */}
            <div className="space-y-2 pt-1">
               <div className="flex items-center gap-2 pb-1 border-b border-zinc-800 mb-2">
                 <CreditCard size={16} className="text-amber-500" />
                 <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Forma de Pagamento</h3>
               </div>
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
              className="mt-2 py-4"
              icon={<ArrowRight size={20} />}
              disabled={!name || !address || !mobilePhone || !paymentMethod || (hasKeg && (!cpf || !eventAddress || !eventDate))}
            >
              {hasKeg ? 'Enviar Ficha Cadastral' : 'Enviar Pedido WhatsApp'}
            </Button>
            <div className="h-6"></div> {/* Bottom Spacer */}
          </form>
        )}

        {/* STEP 2: Success Screen */}
        {step === 2 && (
          <div className="p-6 pt-0 flex flex-col items-center justify-center text-center h-full animate-fade-in pb-8">
             <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-4 ring-1 ring-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                <CheckCircle2 size={32} />
             </div>
             
             <h2 className="text-2xl font-serif text-white mb-1">Pedido Enviado!</h2>
             <p className="text-zinc-400 font-medium mb-6">Obrigado pela preferência!</p>
             
             {hasKeg && (
                 <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 mb-6 text-left w-full">
                    <h4 className="text-amber-500 font-bold text-xs uppercase mb-2">Próximos Passos:</h4>
                    <ul className="text-sm text-zinc-300 space-y-2 list-disc pl-4">
                        <li>Envie as <strong>FOTOS</strong> do Comprovante de Residência e CNH/RG na conversa do WhatsApp que abriu.</li>
                        <li>Aguarde nossa confirmação de disponibilidade e cálculo da taxa de entrega.</li>
                    </ul>
                 </div>
             )}
             
             {!hasKeg && (
                 <p className="text-zinc-400 text-sm mb-6 leading-relaxed px-4">
                    Aguarde, iremos responder no WhatsApp confirmando seu pedido e a taxa de entrega.
                 </p>
             )}

             <Button fullWidth onClick={handleClose} variant="secondary">
                Fechar
             </Button>
          </div>
        )}
      </div>
    </div>
  );
};

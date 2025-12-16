
import React, { useState, useEffect } from 'react';
import { MapPin, X, User, Calendar, CheckCircle2, ArrowRight, QrCode, CreditCard, Banknote, Home, Fingerprint, FileText, Camera, Zap, Clock, Smartphone, UserCheck, RefreshCw, UserPlus, Truck, Info, Building2 } from 'lucide-react';
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
  const [isReturningCustomer, setIsReturningCustomer] = useState(false);
  
  const locationName = userLocation || 'Marechal Cândido Rondon'; 
  
  // Check if cart contains a Keg (requires Event Data)
  const hasKeg = cart.some(item => 
    item.category === ProductCategory.KEG30 || 
    item.category === ProductCategory.KEG50
  );

  // --- Personal Data ---
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [birthDate, setBirthDate] = useState(''); 
  const [address, setAddress] = useState(''); // Acts as Residential Address (New) OR Delivery Address (Returning)
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState(''); // New: Residential/Delivery City
  const [mobilePhone, setMobilePhone] = useState('');

  // --- Event Data (Only for Kegs) ---
  const [receiverName, setReceiverName] = useState(''); 
  const [eventAddress, setEventAddress] = useState('');
  const [eventCity, setEventCity] = useState(''); // New: Event City
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [voltage, setVoltage] = useState<Voltage>('110v');

  // --- Payment ---
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

  // Auto-fill city based on location selection
  useEffect(() => {
    if (isOpen && userLocation) {
        setCity(userLocation);
        setEventCity(userLocation);
    }
  }, [isOpen, userLocation]);

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
    
    // 1. Validação Básica (Sempre necessária)
    if (!name || !mobilePhone || !paymentMethod) return;

    // 2. Validação por Tipo de Cliente
    if (isReturningCustomer) {
        // Cliente Recorrente
        if (hasKeg) {
            // Barril precisa de dados do evento
            if (!eventAddress || !eventDate || !receiverName || !eventCity) return;
        } else {
            // Growler precisa de endereço de entrega
            if (!address || !neighborhood || !city) return;
        }
    } else {
        // Novo Cliente (SEMPRE precisa de cadastro completo agora)
        if (!cpf || !birthDate || !address || !neighborhood || !city) return;
        
        // Se for Barril, precisa TAMBÉM dos dados do evento
        if (hasKeg) {
             if (!eventAddress || !eventDate || !receiverName || !eventCity) return;
        }
    }

    // Determine WhatsApp Number based on Location
    const phoneNumber = locationName === 'Foz do Iguaçu' 
      ? WHATSAPP_NUMBERS.FOZ 
      : WHATSAPP_NUMBERS.MARECHAL;

    let fullMessage = "";

    // --- Message Logic ---
    
    // Split items into Regular and Upsell (Suggested)
    const regularItems = cart.filter(item => !item.isUpsell);
    const upsellItems = cart.filter(item => item.isUpsell);

    // Function to format item list
    const formatItemList = (items: CartItem[]) => {
        return items.map(item => {
            let itemString = `• ${item.quantity}x ${item.name}`;
            if (item.rentTonel) itemString += " (+ Tonel)";
            if (item.mugsQuantity) itemString += ` (+ ${item.mugsQuantity} Canecas)`;
            if (item.moreCups) itemString += ` (+ Cotar Copos)`;
            return itemString;
        }).join('\n');
    };

    // Build the items block
    let itemsBlock = `\n--- PEDIDO ---\n` + formatItemList(regularItems);

    // Append Upsell Items block if exists
    if (upsellItems.length > 0) {
        itemsBlock += `\n\n--- ITENS SUGERIDOS ---\n` + formatItemList(upsellItems);
    }

    const paymentBlock = `\n\n💰 *PAGAMENTO:* ${paymentMethod}`;
    const totalMsg = `\n💵 *VALOR:* R$ ${total.toFixed(2)}`;
    const freightNote = `\n\n⚠️ *FRETE:* A calcular na confirmação.`;

    // --- SCENARIO A: RETURNING CUSTOMER ---
    if (isReturningCustomer) {
        const header = `*PEDIDO - JÁ SOU CLIENTE*\n------------------\n`;
        const userBlock = `👤 *CLIENTE:* ${name}\n📱 *TEL:* ${mobilePhone}\n`;

        if (hasKeg) {
             // Returning Keg: Include Event Data
             const eventBlock = 
              `\n--- DADOS DO EVENTO ---\n` +
              `*RECEBEDOR:* ${receiverName}\n` +
              `*ENDEREÇO DO EVENTO:* ${eventAddress}\n` +
              `*CIDADE:* ${eventCity}\n` +
              `*DATA:* ${eventDate}\n` +
              `*HORA:* ${eventTime || 'Não definida'}\n` +
              `*VOLTAGEM:* ${voltage}\n` +
              `*TOTAL LITROS:* ${totalLiters}L\n`;
             
             fullMessage = header + userBlock + eventBlock + itemsBlock + paymentBlock + totalMsg + freightNote;
        } else {
             // Returning Growler: Include Delivery Address
             const deliveryBlock = 
                `\n📍 *ENTREGAR EM:* ${address}\n` +
                `🏘️ *BAIRRO:* ${neighborhood}\n` +
                `🏙️ *CIDADE:* ${city}`;
             
             fullMessage = header + userBlock + deliveryBlock + itemsBlock + paymentBlock + totalMsg + freightNote;
        }
    } 
    // --- SCENARIO B: NEW CUSTOMER (FULL DATA ALWAYS) ---
    else {
        // Header padrão para cadastro
        const header = `*FICHA DE CADASTRO - PATANEGRA*\n------------------\n`;
        
        const personalBlock = 
            `*NOME:* ${name}\n` +
            `*DATA NASC.:* ${birthDate}\n` +
            `*CPF:* ${cpf}\n` +
            `*RG:* ${rg || 'Não informado'}\n` +
            `*END. RESIDENCIAL:* ${address}\n` +
            `*BAIRRO:* ${neighborhood}\n` +
            `*CIDADE:* ${city}\n` +
            `*CELULAR:* ${mobilePhone}\n`;

        const docsBlock = `\n📸 *FOTOS (Enviarei a seguir):*\n- Comprovante de Residência\n- CNH (Documento com foto)\n`;

        let extraBlock = "";

        if (hasKeg) {
             // Se for Barril, adiciona dados do evento
             extraBlock = 
              `\n--- DADOS DO EVENTO ---\n` +
              `*RECEBEDOR:* ${receiverName}\n` +
              `*ENDEREÇO DO EVENTO:* ${eventAddress}\n` +
              `*CIDADE:* ${eventCity}\n` +
              `*DATA:* ${eventDate}\n` +
              `*HORA:* ${eventTime || 'Não definida'}\n` +
              `*VOLTAGEM:* ${voltage}\n` +
              `*TOTAL LITROS:* ${totalLiters}L\n`;
        } else {
             // Se for Growler, reforça que a entrega é no endereço residencial/cadastro
             extraBlock = `\n📍 *ENTREGA:* No endereço residencial informado acima.\n`;
        }

        fullMessage = header + personalBlock + docsBlock + extraBlock + itemsBlock + paymentBlock + totalMsg + freightNote;
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
      setIsReturningCustomer(false);
      setName(''); setCpf(''); setRg(''); setAddress(''); setNeighborhood(''); setCity('');
      setBirthDate(''); setReceiverName('');
      setMobilePhone('');
      setEventAddress(''); setEventCity(''); setEventDate(''); setEventTime(''); setVoltage('110v');
      
      if (onReturnToHome) onReturnToHome();
    }
    onClose();
  };

  // Helper to determine if submit button is disabled
  const isSubmitDisabled = () => {
      // Common requirements
      if (!name || !mobilePhone || !paymentMethod) return true;

      // Logic for NEW Customers (Rigorous)
      if (!isReturningCustomer) {
          if (!cpf || !birthDate || !address || !neighborhood || !city) return true;
          // If Keg, needs event info too
          if (hasKeg && (!eventAddress || !eventDate || !receiverName || !eventCity)) return true;
      } 
      // Logic for RETURNING Customers (Simple)
      else {
          if (hasKeg) {
              // Keg needs event info
              if (!eventAddress || !eventDate || !receiverName || !eventCity) return true;
          } else {
              // Growler needs address
              if (!address || !neighborhood || !city) return true;
          }
      }
      
      return false;
  }

  // Logic to determine if "Address" field (Residential/Delivery) should be shown
  // Show if: 
  // 1. New Customer (Always needs Residential Address for registration)
  // 2. Returning Customer Buying Growler (Needs Delivery Address)
  // Hide if: Returning Customer Buying Keg (Event address is separate)
  const showMainAddressFields = !isReturningCustomer || (!hasKeg && isReturningCustomer);

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
                {step === 1 ? 'Finalizar Pedido' : ''}
              </h2>
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
          <form onSubmit={handleFinalSubmit} className="p-6 pt-0 flex flex-col gap-5 overflow-y-auto scrollbar-hide">
            
            {/* Customer Type Toggle - IMPROVED DESIGN WITH SHINE & SPACING */}
            <div className="grid grid-cols-2 gap-3 mb-6 mt-4 flex-shrink-0">
               
               {/* SOU NOVO BUTTON (HIGHLIGHTED) */}
               <div className="relative group">
                   {!isReturningCustomer && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-amber-500 text-[9px] font-bold px-3 py-0.5 rounded-full border border-amber-500 uppercase tracking-widest shadow-md z-20 whitespace-nowrap">
                          Primeira Compra?
                      </span>
                   )}
                   <button
                     type="button"
                     onClick={() => setIsReturningCustomer(false)}
                     className={`w-full relative overflow-hidden flex flex-col items-center justify-center gap-1.5 py-4 rounded-xl border-2 transition-all duration-300 ${
                         !isReturningCustomer 
                         ? 'bg-amber-500 border-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-[1.02] z-10' 
                         : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-amber-500/50 hover:text-zinc-300'
                     }`}
                   >
                      {/* SHINE EFFECT (Only when active) */}
                      {!isReturningCustomer && (
                        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/25 to-transparent z-10 pointer-events-none" />
                      )}

                      <UserPlus size={22} strokeWidth={!isReturningCustomer ? 2.5 : 2} className="relative z-10" />
                      <span className="relative z-10 text-xs font-extrabold uppercase tracking-wide">Sou Novo</span>
                   </button>
               </div>

               {/* JÁ SOU CLIENTE BUTTON */}
               <button
                 type="button"
                 onClick={() => setIsReturningCustomer(true)}
                 className={`flex flex-col items-center justify-center gap-1.5 py-4 rounded-xl border-2 transition-all duration-300 ${
                     isReturningCustomer 
                     ? 'bg-zinc-100 border-white text-zinc-950 shadow-[0_0_15px_rgba(255,255,255,0.1)] scale-[1.02] z-10' 
                     : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                 }`}
               >
                  <RefreshCw size={22} strokeWidth={isReturningCustomer ? 2.5 : 2} />
                  <span className="text-xs font-bold uppercase tracking-wide">Já sou Cliente</span>
               </button>
            </div>

            {/* Location Badge */}
            {!isReturningCustomer && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center gap-3 flex-shrink-0 animate-fade-in">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                        <MapPin size={16} />
                    </div>
                    <div>
                        <p className="text-[10px] text-zinc-500 uppercase font-bold">Unidade de Atendimento</p>
                        <p className="text-sm font-medium text-white leading-tight">{locationName}</p>
                    </div>
                </div>
            )}

            {/* --- DADOS BÁSICOS (Sempre visíveis) --- */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-zinc-800">
                <User size={16} className="text-amber-500" />
                <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    Identificação
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
            </div>

            {/* --- ENDEREÇO DE ENTREGA (GROWLER) OU RESIDENCIAL (NOVO CLIENTE GERAL) --- */}
            {showMainAddressFields && (
                <div className="space-y-3 animate-slide-up">
                    <div className="flex items-center gap-2 pb-1 border-b border-zinc-800">
                      <Home size={16} className="text-amber-500" />
                      <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                          {!isReturningCustomer ? 'Endereço Residencial (Cadastro)' : 'Endereço de Entrega'}
                      </h3>
                    </div>
                    <div className="relative">
                      <input 
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pl-10 text-white focus:border-amber-500 focus:outline-none placeholder:text-zinc-600"
                        placeholder="Rua, Número e Complemento"
                      />
                      <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
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
                        <div className="relative">
                          <input 
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pl-10 text-white focus:border-amber-500 focus:outline-none placeholder:text-zinc-600"
                            placeholder="Cidade"
                          />
                          <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        </div>
                    </div>
                </div>
            )}

            {/* --- DADOS EXTRAS (Apenas se for NOVO CLIENTE - AGORA PARA TODOS) --- */}
            {!isReturningCustomer && (
              <div className="space-y-5 animate-slide-up">
                
                {/* Data Nascimento e CPF (Para todos os novos) */}
                <div className="space-y-3">
                     <div className="relative">
                        <input 
                            required
                            type="text"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pl-10 text-white focus:border-amber-500 focus:outline-none placeholder:text-zinc-600"
                            placeholder="Data de Nascimento (ex: 10/05/1990)"
                        />
                        <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
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
                                placeholder="RG (Opcional)"
                            />
                            <FileText size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        </div>
                    </div>
                </div>

                {/* DOCUMENTOS (Para todos os novos) */}
                <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 border-dashed">
                    <div className="flex items-center gap-2 mb-2 text-zinc-400">
                        <Camera size={18} />
                        <span className="text-xs font-bold uppercase">Documentação Necessária</span>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1 h-16 bg-zinc-900 rounded-lg flex flex-col items-center justify-center text-zinc-600 border border-zinc-800">
                            <FileText size={16} className="mb-1" />
                            <span className="text-[9px] text-center px-2">Foto Comp. Residência</span>
                        </div>
                        <div className="flex-1 h-16 bg-zinc-900 rounded-lg flex flex-col items-center justify-center text-zinc-600 border border-zinc-800">
                            <Fingerprint size={16} className="mb-1" />
                            <span className="text-[9px] text-center px-2">Foto CNH / RG</span>
                        </div>
                    </div>
                    <p className="text-[9px] text-amber-500 mt-2 text-center leading-tight">
                        * Enviar fotos pelo WhatsApp após confirmar.
                    </p>
                </div>

              </div>
            )}

            {/* --- DADOS DO EVENTO (BARRIL - SEMPRE APARECE) --- */}
            {hasKeg && (
                  <div className="space-y-3 animate-slide-up">
                    <div className="flex items-center gap-2 pb-1 border-b border-zinc-800">
                      <Calendar size={16} className="text-amber-500" />
                      <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Dados do Evento</h3>
                    </div>

                    {/* Nome do Recebedor */}
                    <div className="relative">
                      <input
                        required
                        type="text"
                        value={receiverName}
                        onChange={(e) => setReceiverName(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pl-10 text-white focus:border-amber-500 focus:outline-none placeholder:text-zinc-600"
                        placeholder="Quem vai receber o pedido?"
                      />
                      <UserCheck size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="relative col-span-2">
                          <input
                            required
                            value={eventAddress}
                            onChange={(e) => setEventAddress(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pl-10 text-white focus:border-amber-500 focus:outline-none placeholder:text-zinc-600"
                            placeholder="Endereço do Evento"
                          />
                          <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        </div>
                        <div className="relative">
                          <input
                            required
                            value={eventCity}
                            onChange={(e) => setEventCity(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pl-2 text-white focus:border-amber-500 focus:outline-none placeholder:text-zinc-600 text-center"
                            placeholder="Cidade"
                          />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                            <input 
                                required
                                type="text"
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pl-10 text-white focus:border-amber-500 focus:outline-none placeholder:text-zinc-600"
                                placeholder="Data (ex: 20/10)"
                            />
                            <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        </div>
                        <div className="relative">
                            <input 
                                type="text"
                                value={eventTime}
                                onChange={(e) => setEventTime(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pl-10 text-white focus:border-amber-500 focus:outline-none placeholder:text-zinc-600"
                                placeholder="Hora (ex: 19h)"
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

            {/* FREIGHT NOTICE BLOCK - ALWAYS VISIBLE */}
            <div className="mt-4 mb-2 p-3 bg-zinc-900/80 rounded-xl border border-amber-500/20 flex items-start gap-3">
                 <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-500 mt-0.5">
                     <Truck size={16} />
                 </div>
                 <div>
                     <p className="text-xs text-zinc-300 leading-relaxed">
                         <strong className="text-amber-500 block text-[10px] uppercase tracking-wider mb-0.5">Política de Entrega</strong>
                         O valor do frete será calculado e informado na confirmação do pedido via WhatsApp.
                     </p>
                 </div>
            </div>

            <Button 
              type="submit" 
              fullWidth 
              className="mt-2 py-4"
              icon={<ArrowRight size={20} />}
              disabled={isSubmitDisabled()}
            >
              {isReturningCustomer ? 'Enviar Pedido Rápido' : 'Enviar Ficha Cadastral'}
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
             
             {!isReturningCustomer && (
                 <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 mb-6 text-left w-full">
                    <h4 className="text-amber-500 font-bold text-xs uppercase mb-2">Próximos Passos:</h4>
                    <ul className="text-sm text-zinc-300 space-y-2 list-disc pl-4">
                        <li>Envie as <strong>FOTOS</strong> do Comprovante de Residência e CNH/RG na conversa do WhatsApp que abriu.</li>
                        <li>Aguarde nossa confirmação e cálculo da <strong>taxa de entrega</strong>.</li>
                    </ul>
                 </div>
             )}
             
             {(isReturningCustomer) && (
                 <p className="text-zinc-400 text-sm mb-6 leading-relaxed px-4">
                    Aguarde, iremos responder no WhatsApp confirmando seu pedido e informando o valor da <strong>taxa de entrega</strong>.
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

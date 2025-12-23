
import React, { useState, useEffect } from 'react';
import { MapPin, X, User, Calendar, CheckCircle2, ArrowRight, QrCode, CreditCard, Banknote, Home, Fingerprint, FileText, Camera, Zap, Clock, Smartphone, UserCheck, RefreshCw, UserPlus, Truck, Info, Building2, Store, Check, Gift } from 'lucide-react';
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
type DeliveryMethod = 'delivery' | 'pickup';

export const CheckoutFlow: React.FC<CheckoutFlowProps> = ({ isOpen, onClose, cart, total, onClearCart, onReturnToHome, userLocation }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [isReturningCustomer, setIsReturningCustomer] = useState(false);
  
  const locationName = userLocation || 'Marechal Cândido Rondon'; 
  const isFoz = locationName === 'Foz do Iguaçu';
  
  const hasKeg = cart.some(item => 
    item.category === ProductCategory.KEG30 || 
    item.category === ProductCategory.KEG50
  );
  
  const isGrowlerOnly = !hasKeg && cart.every(item => item.category === ProductCategory.GROWLER);

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery');
  const [sendEventInfoLater, setSendEventInfoLater] = useState(false);
  const [sendToDifferentAddress, setSendToDifferentAddress] = useState(false);

  // Freight logic
  const FREIGHT_VALUE = 15;
  const isDelivery = deliveryMethod === 'delivery';
  const totalWithFreight = total + (isDelivery ? FREIGHT_VALUE : 0);

  // --- Personal Data ---
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [birthDate, setBirthDate] = useState(''); 
  const [address, setAddress] = useState(''); 
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState(''); 
  const [mobilePhone, setMobilePhone] = useState('');

  // --- Delivery Address Data ---
  const [diffAddress, setDiffAddress] = useState('');
  const [diffNeighborhood, setDiffNeighborhood] = useState('');
  const [diffCity, setDiffCity] = useState('');

  // --- Event Data ---
  const [receiverName, setReceiverName] = useState(''); 
  const [eventAddress, setEventAddress] = useState('');
  const [eventCity, setEventCity] = useState(''); 
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [voltage, setVoltage] = useState<Voltage>('110v');

  // --- Payment ---
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

  useEffect(() => {
    if (isOpen && userLocation) {
        setCity(userLocation);
        setEventCity(userLocation);
        setDiffCity(userLocation);
    }
  }, [isOpen, userLocation]);

  useEffect(() => {
    if (hasKeg) {
        setDeliveryMethod('delivery');
        setSendToDifferentAddress(false);
    }
  }, [hasKeg]);

  if (!isOpen) return null;

  const totalLiters = cart.reduce((acc, item) => {
    let vol = item.volumeLiters || 0;
    if (item.category === ProductCategory.KEG30) vol = 30;
    if (item.category === ProductCategory.KEG50) vol = 50;
    if (item.category === ProductCategory.GROWLER) vol = 1;
    return acc + (vol * item.quantity);
  }, 0);

  const getUnitAddress = () => {
    if (locationName === 'Marechal Cândido Rondon') {
      return "Rua Elói Lohmann, 162 - Parque Industrial, Mal. Cândido Rondon - PR, 85963-104";
    }
    return "Endereço a confirmar com o atendente";
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobilePhone || !paymentMethod) return;

    if (isReturningCustomer) {
        if (hasKeg && !sendEventInfoLater && (!eventAddress || !eventDate || !receiverName || !eventCity)) return;
        if (!hasKeg && deliveryMethod === 'delivery' && (!address || !neighborhood || !city)) return;
    } else {
        if (!cpf || !birthDate || !address || !neighborhood || !city) return;
        if (hasKeg && !sendEventInfoLater && (!eventAddress || !eventDate || !receiverName || !eventCity)) return;
        if (!hasKeg && deliveryMethod === 'delivery' && sendToDifferentAddress && (!diffAddress || !diffNeighborhood || !diffCity)) return;
    }

    const phoneNumber = isFoz ? WHATSAPP_NUMBERS.FOZ : WHATSAPP_NUMBERS.MARECHAL;
    let fullMessage = "";

    const formatItemList = (items: CartItem[]) => {
        return items.map(item => {
            const upsellMark = item.isUpsell ? " ***" : "";
            const unitPrice = item.price + (item.rentTonel ? 30 : 0) + (item.mugsPrice || 0);
            const subtotal = unitPrice * item.quantity;
            
            let itemString = `• ${item.quantity}x ${item.name}${upsellMark}\n  (R$ ${unitPrice.toFixed(2)} cada) - Subtotal: R$ ${subtotal.toFixed(2)}`;
            if (item.rentTonel) itemString += "\n  [+ Inclui Tonel]";
            if (item.mugsQuantity) itemString += `\n  [+ Inclui ${item.mugsQuantity} Canecas]`;
            if (item.moreCups) itemString += `\n  [+ Solicita Orçamento Copos Extras]`;
            return itemString;
        }).join('\n');
    };

    let itemsBlock = `\n--- PRODUTOS ---\n` + formatItemList(cart);
    const paymentBlock = `\n\n💰 *PAGAMENTO:* ${paymentMethod}`;
    const produtosSubtotalMsg = `\n💵 *SUBTOTAL PRODUTOS:* R$ ${total.toFixed(2)}`;
    
    let freightNote = "";
    if (isDelivery) {
        freightNote = `\n🚚 *FRETE:* R$ ${FREIGHT_VALUE.toFixed(2)} (${isFoz ? 'A partir de' : 'Taxa fixa'} na cidade)`;
        if (!isFoz) freightNote += `\n⚠️ *OUTRAS REGIÕES:* Consultar valor adicional.`;
        freightNote += `\n🕒 *HORÁRIO DE ENTREGA:* 14h às 18h.`;
    } else {
        freightNote = `\n📍 *MODO:* Retirada na loja (14h às 18h).\n🏠 *LOCAL:* ${getUnitAddress()}`;
    }

    const totalFinalMsg = `\n\n✅ *TOTAL DO PEDIDO:* R$ ${totalWithFreight.toFixed(2)}${isDelivery ? ' (Produtos + Frete)' : ''}`;

    const buildEventBlock = () => {
        if (sendEventInfoLater) return `\n--- DADOS DO EVENTO ---\n⚠️ *DADOS DO EVENTO:* A combinar / Enviar a seguir\n*TOTAL LITROS:* ${totalLiters}L\n`;
        return `\n--- DADOS DO EVENTO ---\n*RECEBEDOR:* ${receiverName}\n*ENDEREÇO DO EVENTO:* ${eventAddress}\n*CIDADE:* ${eventCity}\n*DATA:* ${eventDate}\n*HORA:* ${eventTime || 'Não definida'}\n*VOLTAGEM:* ${voltage}\n*TOTAL LITROS:* ${totalLiters}L\n`;
    };

    if (isReturningCustomer) {
        const header = `*PEDIDO PATANEGRA - CLIENTE CADASTRADO*\n------------------\n`;
        const userBlock = `👤 *CLIENTE:* ${name}\n📱 *TEL:* ${mobilePhone}\n`;
        if (hasKeg) {
             fullMessage = header + userBlock + buildEventBlock() + itemsBlock + produtosSubtotalMsg + freightNote + paymentBlock + totalFinalMsg;
        } else {
             if (isDelivery) {
                const deliveryBlock = `\n📍 *ENTREGAR EM:* ${address}\n🏘️ *BAIRRO:* ${neighborhood}\n🏙️ *CIDADE:* ${city}`;
                fullMessage = header + userBlock + deliveryBlock + itemsBlock + produtosSubtotalMsg + freightNote + paymentBlock + totalFinalMsg;
             } else {
                fullMessage = header + userBlock + `\n📍 *RETIRADA NA LOJA*` + itemsBlock + produtosSubtotalMsg + freightNote + paymentBlock + totalFinalMsg;
             }
        }
    } else {
        const header = `*FICHA DE CADASTRO - PATANEGRA*\n------------------\n`;
        const personalBlock = `*NOME:* ${name}\n*DATA NASC.:* ${birthDate}\n*CPF:* ${cpf}\n*RG:* ${rg || 'Não informado'}\n*END. RESIDENCIAL:* ${address}\n*BAIRRO:* ${neighborhood}\n*CIDADE:* ${city}\n*CELULAR:* ${mobilePhone}\n`;
        const docsBlock = isGrowlerOnly ? "" : `\n📸 *FOTOS (Enviarei a seguir):*\n- Comprovante de Residência\n- CNH (Documento com foto)\n`;
        let extraBlock = "";
        if (hasKeg) {
             extraBlock = buildEventBlock();
        } else {
             if (isDelivery) {
                extraBlock = sendToDifferentAddress ? `\n📍 *ENTREGA EM OUTRO ENDEREÇO:*\n*ENDEREÇO:* ${diffAddress}\n*BAIRRO:* ${diffNeighborhood}\n*CIDADE:* ${diffCity}\n` : `\n📍 *ENTREGA:* No endereço residencial informado acima.\n`;
             } else {
                extraBlock = `\n📍 *PEDIDO PARA RETIRADA NA LOJA*\n`;
             }
        }
        fullMessage = header + personalBlock + docsBlock + extraBlock + itemsBlock + produtosSubtotalMsg + freightNote + paymentBlock + totalFinalMsg;
    }

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(fullMessage)}`, '_blank');
    setStep(2);
  };

  const handleClose = () => {
    if (step === 2) {
      onClearCart();
      setStep(1);
      setPaymentMethod(null);
      setIsReturningCustomer(false);
      setName(''); setCpf(''); setRg(''); setAddress(''); setNeighborhood(''); setCity('');
      setBirthDate(''); setReceiverName('');
      setMobilePhone('');
      setDeliveryMethod('delivery');
      setEventAddress(''); setEventCity(''); setEventDate(''); setEventTime(''); setVoltage('110v');
      setSendEventInfoLater(false);
      setSendToDifferentAddress(false);
      setDiffAddress(''); setDiffNeighborhood(''); setDiffCity('');
      if (onReturnToHome) onReturnToHome();
    }
    onClose();
  };

  const isSubmitDisabled = () => {
      if (!name || !mobilePhone || !paymentMethod) return true;
      if (!isReturningCustomer) {
          if (!cpf || !birthDate || !address || !neighborhood || !city) return true;
          if (hasKeg && !sendEventInfoLater && (!eventAddress || !eventDate || !receiverName || !eventCity)) return true;
          if (!hasKeg && isDelivery && sendToDifferentAddress && (!diffAddress || !diffNeighborhood || !diffCity)) return true;
      } else {
          if (hasKeg && !sendEventInfoLater && (!eventAddress || !eventDate || !receiverName || !eventCity)) return true;
          if (!hasKeg && isDelivery && (!address || !neighborhood || !city)) return true;
      }
      return false;
  }

  const showMainAddressFields = !isReturningCustomer || (!hasKeg && isReturningCustomer && isDelivery);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-fade-in" onClick={handleClose} />
      <div className="relative w-full max-w-md bg-zinc-950 rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />
        <div className="flex items-center justify-between p-6 pb-2 min-h-[60px] flex-shrink-0 bg-zinc-950 z-20">
          <h2 className="text-xl font-serif text-white">{step === 1 ? 'Finalizar Pedido' : ''}</h2>
          <button onClick={handleClose} className="text-zinc-500 hover:text-white transition-colors"><X size={20} /></button>
        </div>

        {step === 1 && (
          <form onSubmit={handleFinalSubmit} className="p-6 pt-0 flex flex-col gap-5 overflow-y-auto scrollbar-hide">
            <div className="grid grid-cols-2 gap-3 mb-6 mt-4 flex-shrink-0">
               <button type="button" onClick={() => setIsReturningCustomer(false)} className={`w-full relative overflow-hidden flex flex-col items-center justify-center gap-1.5 py-4 rounded-xl border-2 transition-all duration-300 ${!isReturningCustomer ? 'bg-amber-500 border-amber-500 text-black shadow-lg scale-[1.02] z-10' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                  <UserPlus size={22} strokeWidth={!isReturningCustomer ? 2.5 : 2} />
                  <span className="text-xs font-extrabold uppercase tracking-wide">Sou Novo</span>
               </button>
               <button type="button" onClick={() => setIsReturningCustomer(true)} className={`flex flex-col items-center justify-center gap-1.5 py-4 rounded-xl border-2 transition-all duration-300 ${isReturningCustomer ? 'bg-zinc-100 border-white text-zinc-950 shadow-lg scale-[1.02] z-10' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                  <RefreshCw size={22} strokeWidth={isReturningCustomer ? 2.5 : 2} />
                  <span className="text-xs font-bold uppercase tracking-wide">Já sou Cliente</span>
               </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-zinc-800">
                <User size={16} className="text-amber-500" />
                <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Identificação</h3>
              </div>
              <div className="relative">
                <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pl-10 text-white focus:border-amber-500 focus:outline-none transition-colors placeholder:text-zinc-600" placeholder="Nome Completo" />
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              </div>
              <div className="relative">
                  <input required type="tel" value={mobilePhone} onChange={(e) => setMobilePhone(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pl-10 text-white focus:border-amber-500 focus:outline-none placeholder:text-zinc-600" placeholder="Celular (WhatsApp)" />
                  <Smartphone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              </div>
            </div>

            {!hasKeg && (
                <div className="bg-zinc-900/50 p-1 rounded-xl border border-zinc-800 flex relative mt-2">
                    <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-amber-500 rounded-lg transition-all duration-300 z-0 shadow-lg shadow-amber-500/20 ${deliveryMethod === 'pickup' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'}`} />
                    <button type="button" onClick={() => setDeliveryMethod('delivery')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide relative z-10 transition-colors ${deliveryMethod === 'delivery' ? 'text-black' : 'text-zinc-500 hover:text-zinc-300'}`}>
                        <Truck size={14} /> Entrega
                    </button>
                    <button type="button" onClick={() => setDeliveryMethod('pickup')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide relative z-10 transition-colors ${deliveryMethod === 'pickup' ? 'text-black' : 'text-zinc-500 hover:text-zinc-300'}`}>
                        <Store size={14} /> Retirada
                    </button>
                </div>
            )}

            {!hasKeg && deliveryMethod === 'pickup' && (
                <div className="bg-zinc-900/50 border border-amber-500/20 rounded-xl p-4 flex flex-col gap-3 animate-fade-in">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                          <Clock size={20} />
                      </div>
                      <div>
                          <h4 className="text-white text-sm font-bold">Retirada em {locationName}</h4>
                          <p className="text-xs text-zinc-400 mt-1">Disponível das <strong className="text-amber-500">14:00 às 18:00</strong>.</p>
                      </div>
                    </div>
                    <div className="p-3 bg-zinc-950/50 rounded-lg border border-zinc-800">
                        <div className="flex items-center gap-2 mb-1 text-zinc-500">
                           <MapPin size={12} />
                           <span className="text-[10px] uppercase font-bold tracking-widest">Endereço da Unidade</span>
                        </div>
                        <p className="text-xs text-zinc-300 leading-tight">{getUnitAddress()}</p>
                    </div>
                </div>
            )}

            {showMainAddressFields && (
                <div className="space-y-3 animate-slide-up">
                    <div className="flex items-center gap-2 pb-1 border-b border-zinc-800">
                      <Home size={16} className="text-amber-500" />
                      <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">{!isReturningCustomer ? 'Endereço Residencial (Cadastro)' : 'Endereço de Entrega'}</h3>
                    </div>
                    <div className="relative"><input required value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pl-10 text-white placeholder:text-zinc-600" placeholder="Rua, Número e Complemento" /><MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" /></div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative"><input required value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pl-10 text-white placeholder:text-zinc-600" placeholder="Bairro" /><MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" /></div>
                        <div className="relative"><input required value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pl-10 text-white placeholder:text-zinc-600" placeholder="Cidade" /><Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" /></div>
                    </div>
                    {!isReturningCustomer && !hasKeg && isDelivery && (
                        <div className="mt-2 space-y-3">
                            <label className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-xl border border-zinc-800 cursor-pointer">
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${sendToDifferentAddress ? 'bg-amber-500 border-amber-500' : 'bg-transparent border-zinc-600'}`}>
                                    {sendToDifferentAddress && <Check size={14} className="text-black" strokeWidth={3} />}
                                </div>
                                <input type="checkbox" className="hidden" checked={sendToDifferentAddress} onChange={(e) => setSendToDifferentAddress(e.target.checked)} />
                                <span className={`text-sm ${sendToDifferentAddress ? 'text-white font-medium' : 'text-zinc-400'}`}>Enviar para endereço diferente.</span>
                            </label>
                            {sendToDifferentAddress && (
                                <div className="p-4 bg-zinc-900/80 rounded-2xl border border-amber-500/20 space-y-3 animate-fade-in">
                                    <div className="relative"><input required value={diffAddress} onChange={(e) => setDiffAddress(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 pl-10 text-white" placeholder="Rua e Número (Entrega)" /><MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" /></div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input required value={diffNeighborhood} onChange={(e) => setDiffNeighborhood(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white" placeholder="Bairro" />
                                        <input required value={diffCity} onChange={(e) => setDiffCity(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white" placeholder="Cidade" />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {!isReturningCustomer && (
              <div className="space-y-5 animate-slide-up">
                <div className="space-y-3">
                    <div className="relative"><input required type="text" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pl-10 text-white placeholder:text-zinc-600" placeholder="Data de Nascimento (ex: 10/05/1990)" /><Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" /></div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative"><input required type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pl-10 text-white" placeholder="CPF" /><Fingerprint size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" /></div>
                        <div className="relative"><input type="text" value={rg} onChange={(e) => setRg(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pl-10 text-white" placeholder="RG (Opcional)" /><FileText size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" /></div>
                    </div>
                </div>
                {!isGrowlerOnly && (
                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 border-dashed">
                        <div className="flex items-center gap-2 mb-2 text-zinc-400"><Camera size={18} /><span className="text-xs font-bold uppercase">Documentação</span></div>
                        <div className="flex gap-2">
                            <div className="flex-1 h-16 bg-zinc-900 rounded-lg flex flex-col items-center justify-center text-zinc-600 border border-zinc-800"><span className="text-[9px] text-center">Foto Comprovante</span></div>
                            <div className="flex-1 h-16 bg-zinc-900 rounded-lg flex flex-col items-center justify-center text-zinc-600 border border-zinc-800"><span className="text-[9px] text-center">Foto CNH/RG</span></div>
                        </div>
                        <p className="text-[9px] text-amber-500 mt-2 text-center leading-tight">* Fotos enviadas via WhatsApp após confirmação.</p>
                    </div>
                )}
              </div>
            )}

            {hasKeg && (
                  <div className="space-y-3 animate-slide-up">
                    <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
                      <div className="flex items-center gap-2"><Calendar size={16} className="text-amber-500" /><h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Dados do Evento</h3></div>
                    </div>
                    <label className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-xl border border-zinc-800 cursor-pointer">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${sendEventInfoLater ? 'bg-amber-500 border-amber-500' : 'bg-transparent border-zinc-600'}`}>{sendEventInfoLater && <Check size={14} className="text-black" strokeWidth={3} />}</div>
                        <input type="checkbox" className="hidden" checked={sendEventInfoLater} onChange={(e) => setSendEventInfoLater(e.target.checked)} />
                        <span className={`text-sm ${sendEventInfoLater ? 'text-white font-medium' : 'text-zinc-400'}`}>Enviar dados do evento posteriormente</span>
                    </label>
                    {!sendEventInfoLater && (
                        <div className="space-y-3 animate-fade-in">
                            <div className="relative"><input required type="text" value={receiverName} onChange={(e) => setReceiverName(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pl-10 text-white" placeholder="Quem vai receber?" /><UserCheck size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" /></div>
                            <div className="grid grid-cols-3 gap-3">
                                <input required value={eventAddress} onChange={(e) => setEventAddress(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white col-span-2" placeholder="Endereço" />
                                <input required value={eventCity} onChange={(e) => setEventCity(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white text-center" placeholder="Cidade" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <input required value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white" placeholder="Data (ex: 20/10)" />
                                <input value={eventTime} onChange={(e) => setEventTime(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white" placeholder="Hora (ex: 19h)" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
                                  <span className="text-[10px] font-bold uppercase text-zinc-500 mb-2 block">Voltagem</span>
                                  <div className="flex gap-2">
                                    <button type="button" onClick={() => setVoltage('110v')} className={`flex-1 py-1 text-xs rounded ${voltage === '110v' ? 'bg-amber-500 text-black' : 'bg-zinc-800'}`}>110v</button>
                                    <button type="button" onClick={() => setVoltage('220v')} className={`flex-1 py-1 text-xs rounded ${voltage === '220v' ? 'bg-amber-500 text-black' : 'bg-zinc-800'}`}>220v</button>
                                  </div>
                                </div>
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
                                  <span className="text-[10px] uppercase font-bold text-zinc-500">Volume Total</span>
                                  <span className="text-xl font-bold text-white block">{totalLiters}L</span>
                                </div>
                            </div>
                        </div>
                    )}
                  </div>
            )}

            <div className="space-y-2 pt-1">
               <div className="flex items-center gap-2 pb-1 border-b border-zinc-800 mb-2">
                 <CreditCard size={16} className="text-amber-500" /><h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Pagamento</h3>
               </div>
               <div className="grid grid-cols-3 gap-2">
                  <button type="button" onClick={() => setPaymentMethod('PIX')} className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 ${paymentMethod === 'PIX' ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}><QrCode size={20} /><span className="text-[10px] font-bold">PIX</span></button>
                  <button type="button" onClick={() => setPaymentMethod('Cartão')} className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 ${paymentMethod === 'Cartão' ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}><CreditCard size={20} /><span className="text-[10px] font-bold">Cartão</span></button>
                  <button type="button" onClick={() => setPaymentMethod('Dinheiro')} className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 ${paymentMethod === 'Dinheiro' ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}><Banknote size={20} /><span className="text-[10px] font-bold">Dinheiro</span></button>
               </div>
            </div>

            <div className="mt-4 mb-2 p-3 bg-zinc-900/80 rounded-xl border border-amber-500/20 flex items-start gap-3">
                 <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-500 mt-0.5">{isDelivery ? <Truck size={16} /> : <Store size={16} />}</div>
                 <div>
                     <div className="text-xs text-zinc-300 leading-relaxed">
                         <strong className="text-amber-500 block text-[10px] uppercase tracking-wider mb-0.5">{isDelivery ? 'Entrega e Logística' : 'Retirada na Loja'}</strong>
                         {isDelivery ? (
                            <>
                                {isFoz 
                                    ? 'Taxa de entrega a partir de R$ 15,00. Consultar valor exato na confirmação.' 
                                    : 'Taxa fixa de R$ 15,00 para entregas dentro da cidade. Demais localidades a consultar.'
                                }
                                <span className="block mt-1 text-zinc-400 italic">Entregas realizadas das 14h às 18h.</span>
                            </>
                         ) : `Retirada em ${locationName} disponível das 14:00 às 18:00.`}
                     </div>
                 </div>
            </div>

            <div className="mt-2 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Produtos</span>
                    <span className="text-zinc-200 font-bold">R$ {total.toFixed(2)}</span>
                </div>
                {isDelivery && (
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Frete Estimado</span>
                        <span className="text-emerald-500 font-bold">R$ {FREIGHT_VALUE.toFixed(2)}</span>
                    </div>
                )}
                <div className="h-px bg-zinc-800 my-2"></div>
                <div className="flex justify-between items-center">
                    <span className="text-white text-sm font-bold uppercase tracking-widest">Valor Final</span>
                    <span className="text-amber-500 text-xl font-serif font-bold">R$ {totalWithFreight.toFixed(2)}</span>
                </div>
            </div>

            <Button type="submit" fullWidth className="py-4 text-lg font-bold" icon={<ArrowRight size={20} />} disabled={isSubmitDisabled()}>
              {isReturningCustomer ? 'Enviar Pedido' : 'Enviar Cadastro'}
            </Button>
            <div className="h-6"></div>
          </form>
        )}

        {step === 2 && (
          <div className="p-6 pt-0 flex flex-col items-center justify-center text-center h-full animate-fade-in pb-8">
             <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-4 ring-1 ring-green-500/50 shadow-lg"><CheckCircle2 size={32} /></div>
             <h2 className="text-2xl font-serif text-white mb-1">Pedido Enviado!</h2>
             <p className="text-zinc-400 font-medium mb-6">Obrigado pela preferência!</p>
             <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 mb-6 text-left w-full">
                <h4 className="text-amber-500 font-bold text-xs uppercase mb-2">Próximos Passos:</h4>
                <ul className="text-sm text-zinc-300 space-y-2 list-disc pl-4">
                    {!isReturningCustomer && !isGrowlerOnly && <li>Envie as fotos dos documentos no WhatsApp.</li>}
                    {isDelivery ? <li>Aguarde nossa confirmação (Taxa R$ 15,00 aplicada). Entregas das 14h às 18h.</li> : <li>Retirada disponível (14h às 18h).</li>}
                </ul>
             </div>
             <Button fullWidth onClick={handleClose} variant="secondary">Fechar</Button>
          </div>
        )}
      </div>
    </div>
  );
};


import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { Check, ShoppingBag } from 'lucide-react';

interface ToastData {
  productName: string;
  id: number;
}

interface ToastContextType {
  showToast: (productName: string) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((productName: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { productName, id }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed bottom-24 left-0 right-0 z-[180] flex flex-col items-center gap-2 pointer-events-none px-4">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem: React.FC<{ toast: ToastData; onRemove: (id: number) => void }> = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Enter animation
    requestAnimationFrame(() => setIsVisible(true));

    // Start exit after 2s
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2000);

    // Remove from DOM after exit animation
    const removeTimer = setTimeout(() => {
      onRemove(toast.id);
    }, 2400);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [toast.id, onRemove]);

  return (
    <div
      className={`
        max-w-sm w-full flex items-center gap-3 px-4 py-3 
        bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 
        rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] 
        pointer-events-auto
        transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${isVisible && !isExiting 
          ? 'opacity-100 translate-y-0 scale-100' 
          : isExiting 
            ? 'opacity-0 translate-y-2 scale-95' 
            : 'opacity-0 translate-y-4 scale-95'
        }
      `}
    >
      {/* Success Icon */}
      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
        <Check size={16} className="text-green-500" strokeWidth={3} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold truncate">{toast.productName}</p>
        <p className="text-zinc-400 text-[11px]">Adicionado ao pedido</p>
      </div>

      {/* Cart icon */}
      <div className="text-amber-500 flex-shrink-0">
        <ShoppingBag size={18} />
      </div>
    </div>
  );
};

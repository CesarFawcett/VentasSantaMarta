import React, { useEffect, useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { cartService, CartItem } from '../services/cartService';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }: CartModalProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'res' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCart(cartService.getCart());
      setTotal(cartService.getTotalPrice());
      
      const unsubscribe = cartService.subscribe((newCart) => {
        setCart(newCart);
        setTotal(cartService.getTotalPrice());
      });
      return () => unsubscribe();
    }
  }, [isOpen]);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    setMessage(null);
    try {
      await cartService.checkout();
      setMessage({ type: 'success', text: '¡Pedido realizado con éxito!' });
      setTimeout(() => {
        onClose();
        setMessage(null);
      }, 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end overflow-hidden">
      {/* Backdrop with heavy blur and dark overlay to isolate the cart */}
      <div 
        className="absolute inset-0 bg-[#064e3b]/60 backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose}
      ></div>
      
      {/* Main Modal Panel */}
      <div className="bg-white w-full max-w-[450px] h-full relative z-[10000] shadow-2xl flex flex-col animate-slide-left translate-x-0">
        
        {/* Header - Solid Background */}
        <div className="p-6 md:p-8 bg-white border-b border-[#064e3b]/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-[#10b981]/10 rounded-2xl flex items-center justify-center text-[#10b981]">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#064e3b] leading-tight">Tu Carrito</h2>
              <p className="text-[10px] font-bold text-[#10b981] uppercase tracking-widest mt-1">
                {cart.length} {cart.length === 1 ? 'producto' : 'productos'} añadidos
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-[#064e3b]/5 text-[#064e3b]/40 hover:text-[#064e3b] transition-all bg-transparent border-none cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Item List */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-white custom-scrollbar">
          {message && (
            <div className={`p-5 rounded-2xl text-sm font-bold flex items-center gap-3 animate-reveal border ${
              message.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
            }`}>
              <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                {message.type === 'success' ? '✅' : '❌'}
              </div>
              <p>{message.text}</p>
            </div>
          )}

          {cart.length === 0 && !message ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30 px-10">
              <div className="p-8 bg-gray-50 rounded-full">
                <ShoppingBag size={64} strokeWidth={1} />
              </div>
              <div>
                <p className="text-lg font-black text-[#064e3b]">Tu carrito está vacío</p>
                <p className="text-sm mt-1">Añade algunos productos para comenzar tu aventura samaria.</p>
              </div>
              <button 
                onClick={onClose}
                className="btn-primary mt-4 w-full"
              >
                Explorar Productos
              </button>
            </div>
          ) : (
            cart.map((item: CartItem) => (
              <div key={item.id} className="flex gap-5 group animate-reveal relative">
                {/* Product Image Container with fixed dimensions */}
                <div className="h-24 w-24 aspect-square rounded-2xl overflow-hidden bg-gray-50 shrink-0 shadow-sm border border-black/5">
                  <img 
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200'} 
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="text-base font-black text-[#064e3b] line-clamp-1 group-hover:text-[#10b981] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-sm font-bold text-[#10b981] mt-1">
                      ${item.price.toLocaleString('es-CO')}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {/* Compact Quantity Control */}
                    <div className="flex items-center gap-4 bg-[#f0fdf4] rounded-xl px-2 py-1 border border-[#064e3b]/10 shadow-sm">
                      <button 
                        onClick={() => cartService.updateQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 flex items-center justify-center rounded-lg text-[#064e3b]/60 hover:text-[#10b981] hover:bg-white transition-all bg-transparent border-none cursor-pointer disabled:opacity-30"
                        disabled={isProcessing || item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-sm font-black text-[#064e3b] min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => {
                          try {
                            cartService.updateQuantity(item.id, item.quantity + 1);
                          } catch (e: any) {
                            alert(e.message);
                          }
                        }}
                        className="h-8 w-8 flex items-center justify-center rounded-lg text-[#064e3b]/60 hover:text-[#10b981] hover:bg-white transition-all bg-transparent border-none cursor-pointer"
                        disabled={isProcessing}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => !isProcessing && cartService.removeFromCart(item.id)}
                      className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all bg-transparent border-none cursor-pointer"
                      title="Eliminar"
                      disabled={isProcessing}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sticky Footer - Solid and Premium */}
        {cart.length > 0 && (
          <div className="p-8 bg-[#f9fafb] border-t border-[#064e3b]/5 space-y-6 shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[#064e3b]/40 text-[10px] font-black uppercase tracking-[0.2em]">
                <span>Logística y Envío</span>
                <span className="text-[#10b981]">Calculado al checkout</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#064e3b]/60 text-sm font-bold">Subtotal</span>
                <span className="text-[#064e3b]/60 text-sm font-bold">${total.toLocaleString('es-CO')}</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-[#064e3b] text-2xl font-black">Total</span>
                <span className="text-[#064e3b] text-2xl font-black">${total.toLocaleString('es-CO')}</span>
              </div>
            </div>
            
            <button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className={`btn-primary w-full py-5 text-sm font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl shadow-[#10b981]/20 group active:scale-[0.98] transition-all
                ${isProcessing ? 'opacity-70 cursor-wait' : 'hover:scale-[1.02]'}`}
            >
              {isProcessing ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Procesando...
                </>
              ) : (
                <>
                  Finalizar Pedido 
                  <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
                </>
              )}
            </button>
            <p className="text-center text-[9px] font-bold text-[#064e3b]/30 uppercase tracking-widest">
              Compra segura protegida por Ventas Santa Marta
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;

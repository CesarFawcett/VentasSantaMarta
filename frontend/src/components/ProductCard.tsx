import React, { useState } from 'react';
import { Product, productService } from '../services/productService';
import { authService } from '../services/authService';
import { Trash2, Edit, Heart, ShoppingBag, ArrowUpRight, ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import { cartService } from '../services/cartService';
import EditProductModal from './EditProductModal';

interface ProductCardProps {
  product: Product;
  index: number;
  isExpired?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index, isExpired }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isAdmin = authService.isAdmin();
  
  const oldPrice = product.discountPercentage > 0
    ? Math.round(product.price / (1 - product.discountPercentage / 100))
    : null;

  const isDisabled = isExpired && !isAdmin;

  const handleDelete = async () => {
    if (window.confirm(`¿Estás seguro de eliminar "${product.name}"?`)) {
      try {
        await productService.deleteProduct(product.id);
        window.location.reload();
      } catch (err) {
        alert("Error al eliminar el producto.");
      }
    }
  };

  const handleAddToCart = () => {
    try {
      cartService.addToCart(product);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div
      className="product-card group animate-reveal"
      style={{ animationDelay: `${(index % 8) * 0.07}s` }}
    >
      {/* Image */}
      <div className="relative rounded-2xl overflow-hidden aspect-[4/5] mb-4">
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#064e3b]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.category && (
            <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black uppercase text-[#064e3b] shadow-sm tracking-wider">
              {product.category.icon} {product.category.name}
            </span>
          )}
          {product.discountPercentage > 0 && product.isPromotion && (
            <span className="bg-[#10b981] px-3 py-1 rounded-full text-[9px] font-black uppercase text-white shadow-sm">
              −{product.discountPercentage}%
            </span>
          )}
          {product.discountPercentage > 0 && !product.isPromotion && (
            <span className="bg-amber-500 px-3 py-1 rounded-full text-[9px] font-black uppercase text-white shadow-sm flex items-center gap-1">
              <Zap size={10} /> Próximamente
            </span>
          )}
        </div>

        {/* Wishlist */}
        <div className="absolute top-3 right-3 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
          <button className="h-9 w-9 flex items-center justify-center rounded-full bg-white shadow-lg text-[#064e3b] hover:text-red-500 transition-colors border-none cursor-pointer">
            <Heart size={17} />
          </button>
        </div>

        {/* Add to cart hover */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex gap-2">
          {isAdmin ? (
            <>
              <button 
                onClick={() => setIsEditOpen(true)}
                className="btn-primary flex-1 py-3 text-xs tracking-widest uppercase flex items-center justify-center border-none cursor-pointer"
              >
                <Edit size={14} /> Editar
              </button>
              <button 
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white w-12 rounded-full py-3 flex items-center justify-center transition-colors border-none cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
            </>
          ) : (
            <button 
              disabled={isDisabled || product.stock <= 0}
              onClick={handleAddToCart}
              className={`btn-primary w-full py-3 text-xs tracking-widest uppercase flex items-center justify-center gap-2 ${isDisabled || product.stock <= 0 ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
            >
              <ShoppingBag size={14} /> {isDisabled ? 'Oferta Expirada' : product.stock <= 0 ? 'Agotado' : 'Añadir al Carrito'}
            </button>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="px-1 space-y-2">
        <h3 className="text-base font-extrabold text-[#064e3b] leading-tight line-clamp-2 group-hover:text-[#10b981] transition-colors min-h-[2.8rem]">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-xs text-[#064e3b]/50 font-medium line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-xl font-black text-[#064e3b]">${product.price.toLocaleString('es-CO')}</span>
          {oldPrice && (
            <span className="text-xs font-bold text-[#064e3b]/30 line-through">${oldPrice.toLocaleString('es-CO')}</span>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-1.5 text-red-500 text-[10px] font-bold animate-reveal">
            <AlertCircle size={12} /> {error}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-[#064e3b]/5">
          <button 
            disabled={isDisabled}
            className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#064e3b]/40 hover:text-[#064e3b] transition-colors border-none bg-transparent ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          >
            Ver más <ArrowUpRight size={13} />
          </button>
          <div className="flex items-center gap-1 text-[9px] font-bold text-[#064e3b]/30 uppercase bg-[#064e3b]/5 px-2 py-1 rounded">
            <ShieldCheck size={12} /> {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
          </div>
        </div>
      </div>
      
      {/* Edit Modal */}
      <EditProductModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        product={product}
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
};

export default ProductCard;

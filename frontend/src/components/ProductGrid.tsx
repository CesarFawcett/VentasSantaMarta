import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ShoppingBag, ShieldCheck, Heart, Sparkles, RefreshCw, ArrowRight } from 'lucide-react';
import { productService, Product } from '../services/productService';

const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getAllProducts();
      setProducts(data.slice(0, 8)); // Show max 8 on home
    } catch {
      setError('No se pudieron cargar los productos.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-24">
        <div className="flex flex-col items-center justify-center py-20">
          <RefreshCw className="w-10 h-10 text-[#10b981] animate-spin mb-4" />
          <p className="text-[#064e3b]/60 font-bold text-sm">Cargando productos...</p>
        </div>
      </section>
    );
  }

  if (error || products.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-24">
        <div className="text-center py-16 bg-[#064e3b]/5 rounded-[2.5rem] border-2 border-dashed border-[#064e3b]/10">
          <ShoppingBag className="mx-auto w-14 h-14 text-[#064e3b]/20 mb-4" />
          <p className="text-[#064e3b]/60 font-bold mb-2 text-lg">Productos próximamente</p>
          <p className="text-[#064e3b]/40 text-sm">Estamos preparando el catálogo para ti.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
        <div className="space-y-4 animate-reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] text-[10px] font-black uppercase tracking-[0.2em]">
            <Sparkles size={14} strokeWidth={3} /> Destacados
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#064e3b] leading-tight">
            Selección<br /><span className="text-[#10b981]">Santa Marta</span>.
          </h2>
          <p className="text-[#064e3b]/60 font-medium max-w-md text-sm leading-relaxed">
            Productos artesanales seleccionados de manos locales con calidad garantizada.
          </p>
        </div>

        <Link
          to="/catalogo"
          className="btn-primary hidden md:flex items-center gap-2 px-8 py-4 text-sm font-black uppercase tracking-wider group"
        >
          Ver Catálogo Completo <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p, index) => {
          const oldPrice = p.discountPercentage > 0
            ? Math.round(p.price / (1 - p.discountPercentage / 100))
            : null;
          return (
            <div
              key={p.id}
              className="product-card group animate-reveal"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {/* Image */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] mb-3">
                <img
                  src={p.imageUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800'}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#064e3b]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {p.category && (
                    <span className="bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[9px] font-black uppercase text-[#064e3b] shadow-sm">
                      {p.category.name}
                    </span>
                  )}
                  {p.discountPercentage > 0 && (
                    <span className="bg-[#10b981] px-2.5 py-1 rounded-full text-[9px] font-black uppercase text-white shadow-sm">
                      −{p.discountPercentage}%
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                  <button className="h-8 w-8 flex items-center justify-center rounded-full bg-white shadow-lg text-[#064e3b] hover:text-red-500 transition-colors border-none cursor-pointer">
                    <Heart size={16} />
                  </button>
                </div>

                <div className="absolute bottom-3 left-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <button className="btn-primary w-full py-3 text-xs tracking-widest uppercase">
                    <ShoppingBag size={13} /> Al Carrito
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="px-1 space-y-1.5">
                <h3 className="font-extrabold text-[#064e3b] leading-tight line-clamp-2 group-hover:text-[#10b981] transition-colors text-sm min-h-[2.5rem]">
                  {p.name}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-[#064e3b]">${p.price.toLocaleString('es-CO')}</span>
                  {oldPrice && (
                    <span className="text-xs font-bold text-[#064e3b]/30 line-through">${oldPrice.toLocaleString('es-CO')}</span>
                  )}
                </div>
                <div className="flex items-center justify-between pt-1.5 border-t border-[#064e3b]/5">
                  <button className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#064e3b]/40 hover:text-[#064e3b] transition-colors border-none bg-transparent cursor-pointer">
                    Detalles <ArrowUpRight size={12} />
                  </button>
                  <div className="flex items-center gap-1 text-[9px] font-bold text-[#064e3b]/30 uppercase bg-[#064e3b]/5 px-2 py-1 rounded">
                    <ShieldCheck size={11} /> Calidad
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile CTA */}
      <div className="mt-12 flex justify-center md:hidden">
        <Link to="/catalogo" className="btn-primary px-10 py-4 text-sm font-black uppercase tracking-wider">
          Ver Catálogo Completo <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
};

export default ProductGrid;

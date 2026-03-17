import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag, Heart, ShieldCheck, ArrowUpRight, Search,
  Filter, X, Tag, Layers, SlidersHorizontal, ChevronDown, RefreshCw, Home, ArrowLeft
} from 'lucide-react';
import { productService, Product, Category } from '../services/productService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

type SortOption = 'default' | 'price_asc' | 'price_desc' | 'name';

const CatalogPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyPromos, setOnlyPromos] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
      // Extract unique categories
      const cats: Category[] = [];
      data.forEach(p => {
        if (p.category && !cats.find(c => c.id === p.category!.id)) {
          cats.push(p.category);
        }
      });
      setCategories(cats);
    } catch {
      setError('No se pudo cargar el catálogo. Por favor intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.name.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category?.id === selectedCategory);
    }

    if (onlyPromos) {
      result = result.filter(p => p.isPromotion);
    }

    switch (sortBy) {
      case 'price_asc':  result.sort((a, b) => a.price - b.price); break;
      case 'price_desc': result.sort((a, b) => b.price - a.price); break;
      case 'name':       result.sort((a, b) => a.name.localeCompare(b.name)); break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, onlyPromos, sortBy]);

  const activeFilterCount = [
    selectedCategory !== 'all',
    onlyPromos,
    sortBy !== 'default',
    searchQuery.trim() !== ''
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setOnlyPromos(false);
    setSortBy('default');
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] overflow-x-hidden">
      <Navbar />

      {/* Page Header */}
      <div className="relative overflow-hidden bg-[#064e3b] text-white py-20 px-6 md:px-12">
        <div className="absolute top-0 right-0 w-[40vw] h-full bg-[#10b981] opacity-10 blur-[120px]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-3 text-white/50 text-xs font-bold uppercase tracking-widest mb-8">
            <Link to="/" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Home size={14} /> Inicio
            </Link>
            <span>/</span>
            <span className="text-[#10b981]">Catálogo</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[#10b981] text-[10px] font-black uppercase tracking-[0.2em]">
                <Layers size={14} /> Productos de Santa Marta
              </div>
              <h1 className="text-5xl md:text-7xl font-black leading-none">
                Catálogo<br /><span className="text-[#10b981]">Completo</span>.
              </h1>
              <p className="text-white/60 font-medium max-w-lg">
                Artesanías, café, moda y más. Todo lo que la Sierra Nevada y el Caribe tiene para ofrecerte.
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-6xl font-black text-white/10">{products.length}</span>
              <span className="text-xs font-black uppercase tracking-widest text-white/40">Productos disponibles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="sticky top-[73px] z-40 bg-white/90 backdrop-blur-md border-b border-[#064e3b]/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex items-center flex-1 min-w-[200px] h-12 bg-[#f0fdf4] rounded-full px-5 border border-[#064e3b]/10 focus-within:border-[#10b981] transition-colors gap-3">
            <Search size={18} className="text-[#064e3b]/40 shrink-0" />
            <input
              type="text"
              placeholder="Buscar por nombre, categoría..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm font-medium text-[#064e3b] placeholder-[#064e3b]/30 w-full"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-[#064e3b]/30 hover:text-[#064e3b] transition-colors">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 h-12 px-6 rounded-full font-bold text-sm border transition-all cursor-pointer ${showFilters ? 'bg-[#064e3b] text-white border-[#064e3b]' : 'bg-white text-[#064e3b] border-[#064e3b]/10 hover:border-[#064e3b]'}`}
          >
            <SlidersHorizontal size={18} />
            Filtros
            {activeFilterCount > 0 && (
              <span className="bg-[#10b981] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              className="appearance-none h-12 pl-4 pr-10 rounded-full bg-white border border-[#064e3b]/10 text-[#064e3b] font-bold text-sm outline-none cursor-pointer hover:border-[#064e3b] transition-colors"
            >
              <option value="default">Ordenar por</option>
              <option value="price_asc">Precio: Menor a Mayor</option>
              <option value="price_desc">Precio: Mayor a Menor</option>
              <option value="name">Nombre A-Z</option>
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#064e3b]/50 pointer-events-none" />
          </div>

          {/* Results count */}
          <span className="text-xs font-bold text-[#064e3b]/40 uppercase tracking-widest ml-auto hidden md:block">
            {filteredProducts.length} resultados
          </span>

          {/* Clear */}
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#10b981] hover:text-[#064e3b] transition-colors border-none bg-transparent cursor-pointer">
              <X size={14} /> Limpiar
            </button>
          )}
        </div>

        {/* Expandable Filter Panel */}
        {showFilters && (
          <div className="border-t border-[#064e3b]/5 bg-white px-6 md:px-12 py-5 max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-6 items-center">
              {/* Category Pills */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#064e3b]/40 mr-2">Categoría:</span>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider border transition-all cursor-pointer ${selectedCategory === 'all' ? 'bg-[#064e3b] text-white border-[#064e3b]' : 'bg-white text-[#064e3b] border-[#064e3b]/10 hover:border-[#064e3b]'}`}
                >
                  Todos
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider border transition-all cursor-pointer ${selectedCategory === cat.id ? 'bg-[#064e3b] text-white border-[#064e3b]' : 'bg-white text-[#064e3b] border-[#064e3b]/10 hover:border-[#064e3b]'}`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>

              {/* Promo Toggle */}
              <div className="flex items-center gap-3 ml-auto">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#064e3b]/40">Solo Ofertas</span>
                <button
                  onClick={() => setOnlyPromos(!onlyPromos)}
                  className={`relative w-12 h-6 rounded-full transition-all cursor-pointer border-none ${onlyPromos ? 'bg-[#10b981]' : 'bg-[#064e3b]/10'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${onlyPromos ? 'left-7' : 'left-1'}`}></span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <RefreshCw className="w-12 h-12 text-[#10b981] animate-spin mb-4" />
            <p className="text-[#064e3b] font-bold">Cargando catálogo...</p>
          </div>
        ) : error ? (
          <div className="text-center py-32">
            <p className="text-red-500 font-bold mb-4">{error}</p>
            <button onClick={loadData} className="btn-primary">Reintentar</button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[2.5rem] border-2 border-dashed border-[#064e3b]/10">
            <ShoppingBag className="mx-auto w-16 h-16 text-[#064e3b]/20 mb-4" />
            <h3 className="text-2xl font-black text-[#064e3b] mb-2">Sin resultados</h3>
            <p className="text-[#064e3b]/50 mb-6">No encontramos productos con esos filtros.</p>
            <button onClick={clearFilters} className="btn-primary">Limpiar filtros</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((p, index) => {
                const oldPrice = p.discountPercentage > 0
                  ? Math.round(p.price / (1 - p.discountPercentage / 100))
                  : null;
                return (
                  <div
                    key={p.id}
                    className="product-card group animate-reveal"
                    style={{ animationDelay: `${(index % 8) * 0.07}s` }}
                  >
                    {/* Image */}
                    <div className="relative rounded-2xl overflow-hidden aspect-[4/5] mb-4">
                      <img
                        src={p.imageUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800'}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#064e3b]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {p.category && (
                          <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black uppercase text-[#064e3b] shadow-sm tracking-wider">
                            {p.category.icon} {p.category.name}
                          </span>
                        )}
                        {p.discountPercentage > 0 && (
                          <span className="bg-[#10b981] px-3 py-1 rounded-full text-[9px] font-black uppercase text-white shadow-sm">
                            −{p.discountPercentage}%
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
                      <div className="absolute bottom-3 left-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <button className="btn-primary w-full py-3 text-xs tracking-widest uppercase">
                          <ShoppingBag size={14} /> Añadir al Carrito
                        </button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="px-1 space-y-2">
                      <h3 className="text-base font-extrabold text-[#064e3b] leading-tight line-clamp-2 group-hover:text-[#10b981] transition-colors min-h-[2.8rem]">
                        {p.name}
                      </h3>
                      {p.description && (
                        <p className="text-xs text-[#064e3b]/50 font-medium line-clamp-2 leading-relaxed">
                          {p.description}
                        </p>
                      )}
                      <div className="flex items-baseline gap-2 pt-1">
                        <span className="text-xl font-black text-[#064e3b]">${p.price.toLocaleString('es-CO')}</span>
                        {oldPrice && (
                          <span className="text-xs font-bold text-[#064e3b]/30 line-through">${oldPrice.toLocaleString('es-CO')}</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#064e3b]/5">
                        <button className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#064e3b]/40 hover:text-[#064e3b] transition-colors border-none bg-transparent cursor-pointer">
                          Ver más <ArrowUpRight size={13} />
                        </button>
                        <div className="flex items-center gap-1 text-[9px] font-bold text-[#064e3b]/30 uppercase bg-[#064e3b]/5 px-2 py-1 rounded">
                          <ShieldCheck size={12} /> {p.stock > 0 ? `${p.stock} disponibles` : 'Agotado'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom info */}
            <div className="mt-16 text-center text-[10px] font-black uppercase tracking-[0.3em] text-[#064e3b]/30">
              Mostrando {filteredProducts.length} de {products.length} productos
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CatalogPage;

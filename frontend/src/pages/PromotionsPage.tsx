import React, { useEffect, useState, useMemo } from 'react';
import { ShoppingBag, Timer, Zap, ArrowRight, Star, Percent, Flame, RefreshCw, Plus, FileText, Image as ImageIcon, X, Calendar } from 'lucide-react';
import { productService, Product, Category } from '../services/productService';
import { authService } from '../services/authService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import FilterPanel from '../components/FilterPanel';

interface PromotionalEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl: string;
  isPdf?: boolean;
}

const PromotionsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isAdmin = authService.isAdmin();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('discount_desc');
  const [showFilters, setShowFilters] = useState(false);

  // Events state (Mocked, but with local administration)
  const [events, setEvents] = useState<PromotionalEvent[]>(() => {
    const saved = localStorage.getItem('promo_events');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        title: 'Feria del Café de la Sierra',
        date: '20-25 de Abril, 2026',
        description: 'Descuentos exclusivos en todas las variedades de café orgánico.',
        imageUrl: '/images/banner2.png'
      },
      {
        id: '2',
        title: 'Temporada de Artesanías',
        date: 'Mayo, 2026',
        description: 'Nuevas colecciones con precios de lanzamiento especiales.',
        imageUrl: '/images/banner1.png'
      }
    ];
  });

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<PromotionalEvent>>({
    title: '',
    date: '',
    description: '',
    imageUrl: ''
  });

  // Countdown timer logic
  interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 2,
    hours: 14,
    minutes: 45,
    seconds: 30
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev: TimeLeft) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getPromotions();
      setProducts(data);
      
      const cats: Category[] = [];
      data.forEach(p => {
        if (p.category && !cats.find(c => c.id === p.category!.id)) {
          cats.push(p.category);
        }
      });
      setCategories(cats);
    } catch {
      setError('Error al cargar las promociones.');
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

    switch (sortBy) {
      case 'discount_desc': result.sort((a, b) => b.discountPercentage - a.discountPercentage); break;
      case 'discount_asc': result.sort((a, b) => a.discountPercentage - b.discountPercentage); break;
      case 'price_asc': result.sort((a, b) => a.price - b.price); break;
      case 'price_desc': result.sort((a, b) => b.price - a.price); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, sortBy]);

  const activeFilterCount = [
    selectedCategory !== 'all',
    sortBy !== 'discount_desc',
    searchQuery.trim() !== ''
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('discount_desc');
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.imageUrl) return;
    const eventToAdd: PromotionalEvent = {
        id: Date.now().toString(),
        title: newEvent.title!,
        date: newEvent.date || 'Próximamente',
        description: newEvent.description || '',
        imageUrl: newEvent.imageUrl!,
        isPdf: newEvent.isPdf
    };
    const updated = [...events, eventToAdd];
    setEvents(updated);
    localStorage.setItem('promo_events', JSON.stringify(updated));
    setNewEvent({ title: '', date: '', description: '', imageUrl: '' });
    setIsEventModalOpen(false);
  };

  const handleDeleteEvent = (id: string) => {
    const updated = events.filter(e => e.id !== id);
    setEvents(updated);
    localStorage.setItem('promo_events', JSON.stringify(updated));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("El archivo es demasiado grande. Máximo 5MB.");
        return;
      }
      const isPdf = file.type === 'application/pdf';
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewEvent({ ...newEvent, imageUrl: reader.result as string, isPdf });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] font-outfit">
      <Navbar />

      {/* Hero / Header with Countdown */}
      <section className="relative overflow-hidden bg-[#064e3b] text-white py-16 md:py-24 px-6 md:px-12 pt-32">
        <div className="absolute top-0 right-0 w-[40vw] h-full bg-[#10b981] opacity-10 blur-[120px]"></div>
        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100/10 border border-amber-500/30 rounded-full text-amber-500 text-xs font-black uppercase tracking-widest">
              <Flame size={14} className="animate-pulse" /> Ofertas Exclusivas
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              Sección de<br />
              <span className="text-[#10b981]">Promociones</span>.
            </h1>
            <p className="text-white/60 font-medium max-w-lg text-lg">
              Los mejores precios de Santa Marta en una sola selección. Filtra por los mayores descuentos y aprovecha antes de que se agoten.
            </p>

            {/* Timer integrated into Hero */}
            <div className="flex items-center gap-4 py-6 px-8 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl max-w-md">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-white">{timeLeft.days.toString().padStart(2, '0')}</span>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Días</span>
              </div>
              <div className="text-xl font-bold text-white/20">:</div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-white">{timeLeft.hours.toString().padStart(2, '0')}</span>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Hrs</span>
              </div>
              <div className="text-xl font-bold text-white/20">:</div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-white">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Min</span>
              </div>
              <div className="text-xl font-bold text-white/20">:</div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-[#10b981]">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                <span className="text-[10px] font-bold text-[#10b981]/40 uppercase tracking-widest">Seg</span>
              </div>
              <div className="ml-auto flex flex-col items-end">
                <Timer className="text-[#10b981]" size={24} />
              </div>
            </div>
          </div>

          {/* Visual Mosaic for Hero */}
          <div className="hidden lg:grid grid-cols-2 gap-4 animate-reveal-right">
             <div className="space-y-4 pt-8">
                <div className="h-48 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <img src="/images/banner1.png" className="w-full h-full object-cover" alt="Banner1" />
                </div>
                <div className="h-64 rounded-[2.5rem] bg-[#10b981]/20 border border-white/10 flex flex-col items-center justify-center p-8 text-center space-y-4">
                    <Percent size={48} className="text-[#10b981]" />
                    <p className="font-black uppercase text-sm tracking-widest">Mayores Descuentos<br/><span className="text-[#10b981]">Garantizados</span></p>
                </div>
             </div>
             <div className="space-y-4">
                <div className="h-64 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <img src="/images/banner2.png" className="w-full h-full object-cover" alt="Banner2" />
                </div>
                <div className="h-48 rounded-[2.5rem] bg-white/5 border border-white/10 p-8 flex flex-col justify-end">
                    <Star size={24} className="text-amber-400 fill-amber-400 mb-2" />
                    <p className="font-bold text-xl">Top Selección</p>
                    <p className="text-xs text-white/40 uppercase font-black">Abril 2026</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Filter Component */}
      <FilterPanel
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        sortBy={sortBy}
        setSortBy={setSortBy}
        activeFilterCount={activeFilterCount}
        clearFilters={clearFilters}
        resultsCount={filteredProducts.length}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        hidePromoToggle={true} // Already in promotions page
        customSortOptions={[
          { value: 'discount_desc', label: 'Mayores Promociones' },
          { value: 'discount_asc', label: 'Menores Promociones' },
          { value: 'price_asc', label: 'Precio: Menor a Mayor' },
          { value: 'price_desc', label: 'Precio: Mayor a Menor' },
          { value: 'name', label: 'Nombre A-Z' },
        ]}
      />

      {/* Product Grid / Main Catalog Style */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <RefreshCw className="w-12 h-12 text-[#10b981] animate-spin mb-4" />
            <p className="text-[#064e3b] font-bold">Cargando ofertas...</p>
          </div>
        ) : error ? (
          <div className="text-center py-32">
            <p className="text-red-500 font-bold mb-4">{error}</p>
            <button onClick={loadPromotions} className="btn-primary">Reintentar</button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[2.5rem] border-2 border-dashed border-[#064e3b]/10">
            <ShoppingBag className="mx-auto w-16 h-16 text-[#064e3b]/20 mb-4" />
            <h3 className="text-2xl font-black text-[#064e3b] mb-2">Sin resultados</h3>
            <p className="text-[#064e3b]/50 mb-6">No encontramos promociones con esos filtros.</p>
            <button onClick={clearFilters} className="btn-primary">Limpiar filtros</button>
          </div>
        ) : (
          <>
            {/* Featured Section (First 2 Promos) */}
            {filteredProducts.length > 0 && searchQuery === '' && selectedCategory === 'all' && (
              <div className="mb-24 space-y-12">
                <div className="flex flex-col items-center text-center space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#10b981]">Top Selección</span>
                  <h2 className="text-4xl md:text-5xl font-black text-[#064e3b]">Selección <span className="text-[#10b981]">Premium</span></h2>
                  <div className="h-1.5 w-24 bg-gradient-to-r from-[#10b981] to-[#064e3b] rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {filteredProducts.slice(0, 2).map((p, idx) => (
                    <div key={p.id} className="group relative flex flex-col md:flex-row gap-8 bg-white rounded-[3rem] p-8 border border-[#10b981]/10 hover:shadow-2xl transition-all duration-500 animate-reveal">
                      <div className="w-full md:w-1/2 aspect-square rounded-[2rem] overflow-hidden shadow-lg">
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <div className="w-full md:w-1/2 flex flex-col justify-center space-y-4">
                        <div className="flex items-center gap-2">
                           <span className="bg-[#10b981]/10 px-3 py-1 rounded-full text-[9px] font-black text-[#10b981] uppercase tracking-wider">DESTACADO</span>
                        </div>
                        <h3 className="text-2xl font-black text-[#064e3b] leading-tight">{p.name}</h3>
                        <p className="text-sm text-[#064e3b]/60 font-medium line-clamp-3 leading-relaxed">{p.description}</p>
                        <div className="flex items-center gap-3">
                           <span className="text-3xl font-black text-[#10b981]">${p.price.toLocaleString()}</span>
                           <span className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-sm">−{p.discountPercentage}%</span>
                        </div>
                        <button className="btn-primary w-full py-4 text-xs font-black uppercase tracking-widest mt-4">
                           <Zap size={14} /> ¡Aprovechar ahora!
                        </button>
                      </div>
                      
                      <div className="absolute -top-4 -right-4 h-16 w-16 bg-[#064e3b] text-white rounded-full flex flex-col items-center justify-center shadow-xl rotate-12 group-hover:rotate-0 transition-transform">
                         <span className="text-[10px] font-bold uppercase leading-none">HOT</span>
                         <span className="text-lg font-black leading-none">{idx + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.slice(searchQuery === '' && selectedCategory === 'all' ? 2 : 0).map((p, index) => (
                <ProductCard key={p.id} product={p} index={index} />
              ))}
            </div>

            <div className="mt-16 text-center text-[10px] font-black uppercase tracking-[0.3em] text-[#064e3b]/30">
              Mostrando {filteredProducts.length} de {products.length} ofertas
            </div>
          </>
        )}
      </main>

      {/* Upcoming Events / PDF Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
             <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#10b981]">Agenda Local</span>
                <h2 className="text-4xl md:text-5xl font-black text-[#064e3b]">Próximos <span className="text-[#10b981]">Eventos</span> y Flyers</h2>
                <div className="h-1.5 w-24 bg-gradient-to-r from-[#10b981] to-[#064e3b] rounded-full"></div>
             </div>
             {isAdmin && (
                <button 
                  onClick={() => setIsEventModalOpen(true)}
                  className="btn-primary py-4 px-8 rounded-full flex items-center gap-3 text-xs font-black uppercase tracking-widest"
                >
                  <Plus size={20} /> Agregar Evento / PDF
                </button>
             )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {events.map(event => (
                <div key={event.id} className="group flex flex-col bg-[#f0fdf4]/50 rounded-[2.5rem] border border-[#10b981]/10 overflow-hidden hover:shadow-2xl transition-all duration-500">
                   <div className="aspect-[16/9] relative overflow-hidden">
                      {event.isPdf ? (
                        <div className="absolute inset-0 bg-[#064e3b] flex flex-col items-center justify-center p-8 text-center space-y-4">
                           <FileText size={48} className="text-[#10b981]" />
                           <div>
                              <p className="text-white font-black uppercase text-xs tracking-widest">Documento PDF</p>
                              <p className="text-white/40 text-[10px] font-bold uppercase truncate max-w-[200px]">{event.title}</p>
                           </div>
                        </div>
                      ) : (
                        <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      )}
                      
                      {isAdmin && (
                        <button 
                          onClick={() => handleDeleteEvent(event.id)}
                          className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                        >
                          <X size={16} />
                        </button>
                      )}

                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-black uppercase text-[#064e3b] shadow-lg">
                        <Calendar size={12} className="text-[#10b981]" /> {event.date}
                      </div>
                   </div>
                   <div className="p-8 space-y-4">
                      <h3 className="text-xl font-black text-[#064e3b] line-clamp-1">{event.title}</h3>
                      <p className="text-[#064e3b]/60 text-sm font-medium line-clamp-2 leading-relaxed">{event.description}</p>
                      
                      <button className="w-full py-4 px-6 rounded-2xl bg-white border border-[#10b981]/10 text-[#064e3b] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#10b981] hover:text-white transition-all group">
                        {event.isPdf ? 'Ver Documento' : 'Ver Detalles'} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                   </div>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* Add Event Modal */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-[#064e3b]/80 backdrop-blur-sm animate-reveal">
           <div className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl">
              <div className="bg-[#10b981] p-8 text-white flex justify-between items-center">
                 <div>
                    <h2 className="text-2xl font-black">Nuevo Evento</h2>
                    <p className="text-white/60 text-xs font-black uppercase tracking-widest">Publicar info promocional</p>
                 </div>
                 <button onClick={() => setIsEventModalOpen(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                    <X size={20} />
                 </button>
              </div>
              <div className="p-8 space-y-6">
                 <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#064e3b]/40 mb-2 ml-4">Título del Evento / Promo</label>
                    <input 
                      type="text" 
                      value={newEvent.title}
                      onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                      className="w-full h-14 rounded-2xl bg-[#f0fdf4] border border-[#064e3b]/5 px-6 outline-none focus:border-[#10b981] text-[#064e3b] font-bold transition-all"
                      placeholder="Ej: Gran feria de Mayo"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[#064e3b]/40 mb-2 ml-4">Fecha</label>
                        <input 
                            type="text" 
                            value={newEvent.date}
                            onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                            className="w-full h-14 rounded-2xl bg-[#f0fdf4] border border-[#064e3b]/5 px-6 outline-none focus:border-[#10b981] text-[#064e3b] font-bold transition-all"
                            placeholder="Ej: 20 de Mayo"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[#064e3b]/40 mb-2 ml-4">Tipo de Archivo</label>
                        <div className="h-14 rounded-2xl bg-[#f0fdf4] flex items-center px-6 gap-2 text-[#064e3b] font-bold text-xs uppercase">
                            {newEvent.isPdf ? <FileText size={18} className="text-[#10b981]" /> : <ImageIcon size={18} className="text-[#10b981]" />}
                            {newEvent.isPdf ? 'PDF' : 'Imagen'}
                        </div>
                    </div>
                 </div>
                 <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#064e3b]/40 mb-2 ml-4">Descripción Corta</label>
                    <textarea 
                      value={newEvent.description}
                      onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                      className="w-full h-24 rounded-2xl bg-[#f0fdf4] border border-[#064e3b]/5 p-6 outline-none focus:border-[#10b981] text-[#064e3b] font-bold transition-all resize-none"
                      placeholder="Breve detalle de la promoción..."
                    ></textarea>
                 </div>
                 
                 <div className="relative">
                    <input 
                      type="file" 
                      id="event-file" 
                      className="hidden" 
                      accept="image/*,application/pdf"
                      onChange={handleImageUpload}
                    />
                    <label 
                      htmlFor="event-file"
                      className="flex flex-col items-center justify-center w-full h-32 rounded-[2rem] border-2 border-dashed border-[#10b981]/20 bg-[#f0fdf4] hover:bg-[#10b981]/5 cursor-pointer transition-all gap-2"
                    >
                      {newEvent.imageUrl ? (
                        <div className="flex items-center gap-3 text-[#10b981] font-black text-xs uppercase">
                            <span className="p-2 bg-white rounded-xl shadow-sm"><ImageIcon size={20} /></span> Archivo Cargado
                        </div>
                      ) : (
                        <>
                          <Plus size={24} className="text-[#10b981]" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#064e3b]/40">Subir Imagen o PDF (Max 5MB)</span>
                        </>
                      )}
                    </label>
                 </div>

                 <button 
                   onClick={handleAddEvent}
                   disabled={!newEvent.title || !newEvent.imageUrl}
                   className="btn-primary w-full py-5 rounded-full text-sm font-black uppercase tracking-widest shadow-xl shadow-[#10b981]/20 disabled:opacity-50 disabled:grayscale"
                 >
                    Publicar Promo / Evento
                 </button>
              </div>
           </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PromotionsPage;

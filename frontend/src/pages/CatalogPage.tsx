import React, { useEffect, useState, useMemo } from 'react';
import { productService, Product, Category } from '../services/productService';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import CatalogHeader from '../components/CatalogHeader';
import FilterPanel from '../components/FilterPanel';
import AddProductModal from '../components/AddProductModal';
import { authService } from '../services/authService';
import { ShoppingBag, RefreshCw, Plus } from 'lucide-react';

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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const isAdmin = authService.isAdmin();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
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
      case 'price_asc': result.sort((a, b) => a.price - b.price); break;
      case 'price_desc': result.sort((a, b) => b.price - a.price); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
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

      <CatalogHeader productCount={products.length} />

      <FilterPanel
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        sortBy={sortBy}
        setSortBy={(val) => setSortBy(val as SortOption)}
        activeFilterCount={activeFilterCount}
        clearFilters={clearFilters}
        resultsCount={filteredProducts.length}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onlyPromos={onlyPromos}
        setOnlyPromos={setOnlyPromos}
      />

      {isAdmin && (
        <div className="max-w-7xl mx-auto px-6 md:px-12 mt-8 mb-8 flex justify-end">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary py-4 px-8 rounded-full flex items-center gap-3 shadow-xl shadow-[#10b981]/20 hover:scale-105 transition-all text-xs font-black uppercase tracking-widest"
          >
            <Plus size={20} strokeWidth={3} /> Agregar Nuevo Producto
          </button>
        </div>
      )}

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
              {filteredProducts.map((p, index) => (
                <ProductCard key={p.id} product={p} index={index} />
              ))}
            </div>

            <div className="mt-16 text-center text-[10px] font-black uppercase tracking-[0.3em] text-[#064e3b]/30">
              Mostrando {filteredProducts.length} de {products.length} productos
            </div>
          </>
        )}
      </main>

      <Footer />

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
};

export default CatalogPage;

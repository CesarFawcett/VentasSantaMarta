import React from 'react';
import { Search, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { Category } from '../services/productService';

interface SortOptionItem {
  value: string;
  label: string;
}

interface FilterPanelProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  showFilters: boolean;
  setShowFilters: (val: boolean) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  activeFilterCount: number;
  clearFilters: () => void;
  resultsCount: number;
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  onlyPromos?: boolean;
  setOnlyPromos?: (val: boolean) => void;
  hidePromoToggle?: boolean;
  customSortOptions?: SortOptionItem[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  searchQuery, setSearchQuery, showFilters, setShowFilters,
  sortBy, setSortBy, activeFilterCount, clearFilters,
  resultsCount, categories, selectedCategory, setSelectedCategory,
  onlyPromos, setOnlyPromos, hidePromoToggle = false,
  customSortOptions
}) => {
  const sortOptions = customSortOptions || [
    { value: 'default', label: 'Ordenar por' },
    { value: 'price_asc', label: 'Precio: Menor a Mayor' },
    { value: 'price_desc', label: 'Precio: Mayor a Menor' },
    { value: 'name', label: 'Nombre A-Z' },
  ];

  return (
    <div className="sticky top-[73px] z-40 bg-white/90 backdrop-blur-md border-b border-[#064e3b]/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="flex items-center flex-1 min-w-[200px] h-12 bg-[#f0fdf4] rounded-full px-5 border border-[#064e3b]/10 focus-within:border-[#10b981] transition-colors gap-3">
          <Search size={18} className="text-[#064e3b]/40 shrink-0" />
          <input
            type="text"
            placeholder="Buscar por nombre, categoría..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-medium text-[#064e3b] placeholder-[#064e3b]/30 w-full"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-[#064e3b]/30 hover:text-[#064e3b] transition-colors bg-transparent border-none cursor-pointer">
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
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)}
            className="appearance-none h-12 pl-4 pr-10 rounded-full bg-white border border-[#064e3b]/10 text-[#064e3b] font-bold text-sm outline-none cursor-pointer hover:border-[#064e3b] transition-colors"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#064e3b]/50 pointer-events-none" />
        </div>

        {/* Results count */}
        <span className="text-xs font-bold text-[#064e3b]/40 uppercase tracking-widest ml-auto hidden md:block">
          {resultsCount} resultados
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
            {!hidePromoToggle && setOnlyPromos && (
              <div className="flex items-center gap-3 ml-auto">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#064e3b]/40">Solo Ofertas</span>
                <button
                  onClick={() => setOnlyPromos(!onlyPromos)}
                  className={`relative w-12 h-6 rounded-full transition-all cursor-pointer border-none ${onlyPromos ? 'bg-[#10b981]' : 'bg-[#064e3b]/10'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${onlyPromos ? 'left-7' : 'left-1'}`}></span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;

import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Layers } from 'lucide-react';

interface CatalogHeaderProps {
  productCount: number;
}

const CatalogHeader: React.FC<CatalogHeaderProps> = ({ productCount }) => {
  return (
    <div className="relative overflow-hidden bg-[#064e3b] text-white py-20 px-6 md:px-12">
      <div className="absolute top-0 right-0 w-[40vw] h-full bg-[#10b981] opacity-10 blur-[120px]"></div>
      <div className="max-w-7xl mx-auto relative z-10">
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
            <span className="text-6xl font-black text-white/10">{productCount}</span>
            <span className="text-xs font-black uppercase tracking-widest text-white/40">Productos disponibles</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogHeader;

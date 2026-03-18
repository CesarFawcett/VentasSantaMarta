import React, { useState, useEffect } from 'react';
import { ArrowRight, Wind, ShoppingBag, ArrowRightCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Slideshow from './Slideshow';

interface PromoConfig {
  banner1Urls: string[];
  banner2Urls: string[];
  topProductIds: string[];
  timerEnd: string;
}

const Hero: React.FC = () => {
  const [promoConfig, setPromoConfig] = useState<PromoConfig>({
    banner1Urls: ["https://images.unsplash.com/photo-1590402444582-43d16d655f9a?auto=format&fit=crop&q=80&w=1000"],
    banner2Urls: ["https://images.unsplash.com/photo-1596464871957-6953930419f0?auto=format&fit=crop&q=80&w=1000"],
    topProductIds: [],
    timerEnd: new Date(Date.now() + 86400000).toISOString()
  });

  useEffect(() => {
    const savedConfig = localStorage.getItem('promoConfig');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        // Migration logic for old single-string banners
        const config = {
          ...parsed,
          banner1Urls: Array.isArray(parsed.banner1Urls) ? parsed.banner1Urls : (parsed.banner1 ? [parsed.banner1] : []),
          banner2Urls: Array.isArray(parsed.banner2Urls) ? parsed.banner2Urls : (parsed.banner2 ? [parsed.banner2] : [])
        };
        setPromoConfig(config);
      } catch (e) {
        console.error("Error loading promoConfig in Hero:", e);
      }
    }
  }, []);

  return (
    <section className="relative overflow-hidden py-24 px-6 md:px-12 min-h-[85vh] flex items-center bg-[#f0fdf4]">
      {/* Background Decorative Blob */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vh] bg-[#10b981] opacity-10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
        <div className="fade-in space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 border border-[#10b981]/20 text-[#10b981] rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
            <Wind size={16} /> Lo mejor de la perla de américa
          </div>
          <h2 className="text-5xl lg:text-8xl font-black leading-none text-[#064e3b]">
            Descubre la <br /><span className="text-[#10b981]">Magia</span> de Santa Marta
          </h2>
          <p className="text-xl text-[#064e3b]/70 max-w-lg leading-relaxed font-medium">
            Artesanías locales, delicias gastronómicas y productos exclusivos. Todo el encanto samario en un solo lugar.
          </p>
          <div className="flex flex-wrap gap-5">
            <Link to="/catalogo" className="btn-primary text-lg px-10 py-5 group shadow-lg shadow-[#10b981]/20 no-underline decoration-transparent flex items-center gap-3">
              Explorar Catálogo <ArrowRightCircle className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/promociones" className="flex items-center gap-3 bg-white border-2 border-[#10b981]/10 text-[#064e3b] text-lg px-10 py-5 rounded-full font-bold hover:bg-[#10b981]/5 transition-all text-center flex items-center justify-center no-underline decoration-transparent">
              Ver Promociones <ShoppingBag size={20} />
            </Link>
          </div>

          <div className="pt-8 flex gap-10">
            <div className="text-center">
              <span className="block text-4xl font-black text-[#064e3b]">+500</span>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Productos</span>
            </div>
            <div className="text-center px-10 border-x border-[#064e3b]/10">
              <span className="block text-4xl font-black text-[#064e3b]">24h</span>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Soporte</span>
            </div>
            <div className="text-center">
              <span className="block text-4xl font-black text-[#064e3b]">100%</span>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Artesanal</span>
            </div>
          </div>
        </div>

        <div className="relative fade-in hidden lg:block">
          <div className="relative rounded-[3rem] overflow-hidden shadow-2xl rotate-2 aspect-[4/5] max-w-lg mx-auto border-8 border-white group">
            <Slideshow
              imageUrls={promoConfig.banner1Urls.length > 0
                ? promoConfig.banner1Urls
                : ["https://images.unsplash.com/photo-1590402444582-43d16d655f9a?auto=format&fit=crop&q=80&w=1000"]
              }
              title="Sierra Nevada"
            />
            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-[#064e3b]/90 to-transparent text-white">
              <span className="bg-[#10b981] px-3 py-1 rounded text-[10px] font-black uppercase mb-3 inline-block">Destacado</span>
              <h3 className="text-3xl font-black mb-2 leading-tight">En Santa Marta - Productos que enamoran</h3>
              <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#10b981] hover:text-white transition-colors border-none bg-transparent cursor-pointer">
                Ver Más <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Floating Tag */}
          <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-2xl border border-[#10b981]/5 animate-bounce-slow flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#10b981] flex items-center justify-center text-white">
              <ShoppingBag size={24} />
            </div>
            <div>
              <p className="font-black text-xl text-[#064e3b]">75+</p>
              <p className="text-[10px] text-[#064e3b]/40 uppercase font-black">Ventas hoy</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

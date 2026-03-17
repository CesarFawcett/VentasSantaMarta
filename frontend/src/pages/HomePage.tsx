import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f0fdf4] overflow-x-hidden">
      {/* Decorative blobs */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#10b981]/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-[#064e3b]/5 rounded-full blur-[100px] -z-10 -translate-x-1/4 translate-y-1/4 pointer-events-none"></div>

      <Navbar />

      <main>
        <Hero />

        {/* Trust banner */}
        <div className="bg-white border-y border-[#064e3b]/5 py-10">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-wrap justify-center md:justify-between items-center gap-8 text-[#064e3b]/50 font-black uppercase text-[10px] tracking-[0.3em]">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 flex items-center justify-center rounded-full bg-[#10b981]/10 text-[#10b981] text-base">✔</div>
              Productos a tu alcance
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 flex items-center justify-center rounded-full bg-[#10b981]/10 text-[#10b981] text-base">✈</div>
              Envíos Locales Rápidos
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 flex items-center justify-center rounded-full bg-[#10b981]/10 text-[#10b981] text-base">♥</div>
              Artesanías Responsables
            </div>
          </div>
        </div>

        {/* Featured products (first 4) */}
        <ProductGrid />

        {/* Story section */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative animate-reveal">
            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1596464871957-6953930419f0?auto=format&fit=crop&q=80&w=1000"
                alt="Artesanía Santa Marta"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-[#064e3b]/90 to-transparent text-white">
                <h4 className="text-3xl font-black mb-1">Apoyemos los proyectos Samarios</h4>
                <p className="text-sm opacity-70">apoyamos tu comodidad</p>
              </div>
            </div>
            <div className="absolute -top-8 -right-8 bg-[#10b981] text-white rounded-full h-44 w-44 flex flex-col items-center justify-center text-center shadow-2xl -rotate-12 border-8 border-[#f0fdf4]">
              <span className="text-4xl font-black">100%</span>
              <span className="text-[9px] font-black uppercase tracking-widest mt-1">Real</span>
            </div>
          </div>

          <div className="space-y-8 animate-reveal" style={{ animationDelay: '0.3s' }}>
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-black text-[#064e3b] leading-tight">
                De la pantalla <br />
                <span className="text-[#10b981] underline decoration-[#10b981]/30 underline-offset-8">directo a tu hogar</span>.
              </h2>
              <p className="text-[#064e3b]/70 font-medium text-lg leading-relaxed">
                Somos un puente entre la comodidad de tu casa y los productos que tanto quieres. Cada compra apoya nuestro crecimiento y la posibilidad de poder ayudar a otros.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { t: 'Calidad Certificada', d: 'Solo productos garantizados.' },
                { t: 'Comercio Justo', d: 'el valor del domicilio va incluido' },
              ].map(item => (
                <div key={item.t} className="border-l-4 border-[#10b981] pl-5 py-2 bg-[#064e3b]/5 rounded-r-2xl hover:bg-[#064e3b]/10 transition-all">
                  <span className="text-lg font-black text-[#064e3b] block">{item.t}</span>
                  <p className="text-xs font-bold text-[#064e3b]/50 leading-relaxed">{item.d}</p>
                </div>
              ))}
            </div>

            <button className="btn-primary px-10 py-5 text-sm font-black uppercase tracking-[0.15em]">
              Conoce Nuestra Historia
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;

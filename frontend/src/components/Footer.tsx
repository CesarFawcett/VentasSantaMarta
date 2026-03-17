import React from 'react';
import { Play, ArrowRight, Instagram, Facebook, Twitter, Mail, Globe, Sparkles, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="footer bg-primary text-white overflow-hidden py-32 rounded-t-[4rem] relative">
            {/* Background Shapes */}
            <div className="absolute top-0 right-0 w-[40vw] h-[40vh] bg-accent opacity-10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>

            <div className="premium-container">
                {/* Newsletter / CTA */}
                <div className="grid lg:grid-cols-2 gap-16 mb-24 items-center">
                    <div className="space-y-8 animate-reveal">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 border border-accent/20 rounded-full text-accent text-[10px] font-black uppercase tracking-[0.2em]">
                            <Sparkles size={14} /> La perla de américa
                        </div>
                        <h2 className="text-5xl lg:text-7xl font-black leading-tight tracking-tighter">
                            Lleva<br /><span className="text-accent underline decoration-accent/30 underline-offset-8 pr-1">Santa Marta</span><br />contigo.
                        </h2>
                        <button className="btn btn-primary bg-white text-primary text-lg px-12 py-6 font-black hover:bg-accent hover:text-white transition-all group scale-105 shadow-2xl shadow-emerald-500/20">
                            Ultimas noticias <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>

                    <div className="glass-card p-10 rounded-[3rem] space-y-8 shadow-2xl relative overflow-hidden group">
                        <div className="space-y-4">
                            <h3 className="text-3xl font-black text-white">Suscríbete a ofertas <span className="text-accent underline decoration-accent/30">VIP</span>.</h3>
                            <p className="text-white/60 font-medium text-sm leading-relaxed max-w-sm">
                                Recibe lanzamientos exclusivos y promociones directamente en tu correo.
                            </p>
                        </div>

                        <div className="flex h-16 w-full items-center bg-white/10 rounded-3xl p-1 shadow-inner focus-within:bg-white/20 transition-all border border-white/10 focus-within:border-accent">
                            <div className="px-5 opacity-40 group-focus-within:opacity-100 transition-opacity"><Mail size={20} /></div>
                            <input
                                type="email"
                                placeholder="Tu correo electrónico..."
                                className="bg-transparent border-none outline-none text-sm font-bold flex-1 placeholder-white/30"
                            />
                            <button className="h-full bg-accent hover:bg-white hover:text-primary rounded-2xl px-8 text-xs font-black uppercase tracking-widest transition-all">
                                Enviar
                            </button>
                        </div>

                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest text-center">Sin spam.</p>
                    </div>
                </div>

                {/* Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 border-t border-white/10 pt-20 mb-20 animate-reveal">
                    <div className="col-span-2 space-y-8">
                        <div className="flex flex-col gap-2">
                            <span className="text-3xl font-black tracking-tight text-white group cursor-pointer hover:rotate-2 transition-transform">
                                Santa<span className="text-accent underline decoration-accent/30 underline-offset-4">Marta</span>.com
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
                                Ventas Virtuales
                            </span>
                        </div>
                        <div className="flex items-center gap-6">
                            <button className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-primary transition-all shadow-xl hover:shadow-white/10"><Instagram size={20} /></button>
                            <button className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-primary transition-all shadow-xl hover:shadow-white/10"><Facebook size={20} /></button>
                            <button className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-primary transition-all shadow-xl hover:shadow-white/10"><Twitter size={20} /></button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-accent">Navegación</h4>
                        <ul className="space-y-4 text-sm font-bold text-white/50">
                            <li><a href="#" className="hover:text-white transition-colors">Catálogo</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Artesanías</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Ruta del Café</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Novedades</a></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-accent">Soporte</h4>
                        <ul className="space-y-4 text-sm font-bold text-white/50">
                            <li><a href="#" className="hover:text-white transition-colors">Envíos</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Devoluciones</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Ayuda</a></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-accent">Compañía</h4>
                        <ul className="space-y-4 text-sm font-bold text-white/50">
                            <li><a href="#" className="hover:text-white transition-colors">Nuestra Historia</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Localización</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Prensa</a></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-accent">Ubicación</h4>
                        <div className="flex items-start gap-3 mt-4 text-sm font-bold text-white/50 leading-loose">
                            <MapPin size={22} className="text-accent mt-1 shrink-0" />
                            <p>Santa Marta,<br />Colombia<br />Edición 2026</p>
                        </div>
                    </div>
                </div>

                {/* Legal Info */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 py-10 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                    <p>© 2026 Ventas Santa Marta. Todos los derechos reservados.</p>
                    <div className="flex gap-10">
                        <a href="#" className="hover:text-white transition-colors">Términos</a>
                        <a href="#" className="hover:text-white transition-colors">Privacidad</a>
                        <a href="#" className="hover:text-white transition-colors">Cookies</a>
                    </div>
                    <div className="flex items-center gap-2 text-accent">
                        <Globe size={14} /> Hecho en Colombia
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, User, MapPin, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Inicio', path: '/' },
    { label: 'Catálogo', path: '/catalogo' },
    { label: 'Promociones', path: '/catalogo?promos=true' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="glass-nav sticky top-0 z-50 py-4">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="h-11 w-11 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#064e3b] to-[#10b981] text-white shadow-lg group-hover:rotate-6 transition-transform">
            <MapPin size={24} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-black tracking-tight text-[#064e3b]">
              Santa<span className="text-[#10b981]">Marta</span>.com
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#064e3b]/40">
              Ventas Virtuales
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-black uppercase tracking-wider transition-all pb-1 border-b-2 ${
                isActive(link.path)
                  ? 'text-[#10b981] border-[#10b981]'
                  : 'text-[#064e3b] border-transparent hover:text-[#10b981] hover:border-[#10b981]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search - desktop only */}
          <div className="hidden md:flex items-center h-10 bg-[#064e3b]/5 rounded-full px-4 border border-[#064e3b]/10 focus-within:border-[#10b981] transition-colors gap-2 group">
            <Search size={16} className="text-[#064e3b]/40" />
            <input
              type="text"
              placeholder="Buscar..."
              className="bg-transparent border-none outline-none text-sm font-medium placeholder-[#064e3b]/30 w-24 group-focus-within:w-36 transition-all text-[#064e3b]"
            />
          </div>

          <button className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-[#064e3b]/5 text-[#064e3b] relative transition-colors border-none cursor-pointer bg-transparent">
            <ShoppingBag size={21} />
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#10b981] text-[9px] font-black text-white ring-2 ring-white">
              0
            </span>
          </button>

          <button className="btn-primary text-sm px-5 py-2.5">
            <User size={16} />
            <span className="hidden sm:inline">Acceder</span>
          </button>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden h-10 w-10 flex items-center justify-center rounded-full hover:bg-[#064e3b]/5 text-[#064e3b] transition-colors border-none bg-transparent cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-[#064e3b]/10 px-6 py-4 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`block py-3 font-black uppercase text-sm tracking-wider transition-colors border-b border-[#064e3b]/5 last:border-0 ${
                isActive(link.path) ? 'text-[#10b981]' : 'text-[#064e3b] hover:text-[#10b981]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;

import React, { useState } from 'react';
import { X, Lock, Mail, RefreshCw, AlertCircle, User as UserIcon } from 'lucide-react';
import { authService } from '../services/authService';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === 'LOGIN') {
        await authService.login(email, password);
      } else {
        await authService.register(email, password, fullName);
      }
      onLoginSuccess();
      onClose();
    } catch (err: any) {
      if (err.response && err.response.data && typeof err.response.data === 'string') {
        setError(err.response.data);
      } else {
        setError(mode === 'LOGIN' 
          ? 'Credenciales incorrectas o problema de conexión.' 
          : 'Error al crear la cuenta. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'LOGIN' ? 'REGISTER' : 'LOGIN');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-[#064e3b]/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 relative z-10 shadow-2xl animate-reveal border border-[#064e3b]/5 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-8 right-8 text-[#064e3b]/30 hover:text-[#064e3b] transition-colors bg-transparent border-none cursor-pointer">
          <X size={24} />
        </button>

        <div className="text-center mb-10">
          <div className="h-16 w-16 bg-[#10b981]/10 rounded-3xl flex items-center justify-center text-[#10b981] mx-auto mb-6">
            {mode === 'LOGIN' ? <Lock size={32} strokeWidth={2.5} /> : <UserIcon size={32} strokeWidth={2.5} />}
          </div>
          <h2 className="text-3xl font-black text-[#064e3b] mb-2 tracking-tight">
            {mode === 'LOGIN' ? 'Acceso Privado' : 'Crear Cuenta'}
          </h2>
          <p className="text-[#064e3b]/50 text-sm font-medium">
            {mode === 'LOGIN' ? 'Ingresa tus credenciales para continuar.' : 'Únete a nuestra comunidad samaria.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'REGISTER' && (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#064e3b]/40 ml-4">Nombre Completo</label>
              <div className="flex items-center h-14 bg-[#f0fdf4] rounded-full px-6 border border-[#064e3b]/10 focus-within:border-[#10b981] transition-colors gap-3">
                <UserIcon size={18} className="text-[#064e3b]/40 shrink-0" />
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Tu nombre aquí"
                  className="bg-transparent border-none outline-none text-sm font-bold text-[#064e3b] placeholder-[#064e3b]/20 w-full"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#064e3b]/40 ml-4">Tu Email</label>
            <div className="flex items-center h-14 bg-[#f0fdf4] rounded-full px-6 border border-[#064e3b]/10 focus-within:border-[#10b981] transition-colors gap-3">
              <Mail size={18} className="text-[#064e3b]/40 shrink-0" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@ejemplo.com"
                className="bg-transparent border-none outline-none text-sm font-bold text-[#064e3b] placeholder-[#064e3b]/20 w-full"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#064e3b]/40 ml-4">Contraseña</label>
            <div className="flex items-center h-14 bg-[#f0fdf4] rounded-full px-6 border border-[#064e3b]/10 focus-within:border-[#10b981] transition-colors gap-3">
              <Lock size={18} className="text-[#064e3b]/40 shrink-0" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent border-none outline-none text-sm font-bold text-[#064e3b] placeholder-[#064e3b]/20 w-full"
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 bg-red-50 p-4 rounded-3xl text-xs font-bold animate-reveal">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-5 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-[#10b981]/20 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="animate-spin" size={18} /> : (mode === 'LOGIN' ? 'Iniciar Sesión' : 'Registrarse')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={toggleMode}
            className="text-xs font-black uppercase tracking-widest text-[#064e3b]/40 hover:text-[#10b981] transition-colors bg-transparent border-none cursor-pointer"
          >
            {mode === 'LOGIN' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

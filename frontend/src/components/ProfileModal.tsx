import React, { useState } from 'react';
import { X, User, Lock, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authService, AuthResponse } from '../services/authService';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateSuccess: (user: AuthResponse) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onUpdateSuccess }: ProfileModalProps) => {
  const currentUser = authService.getCurrentUser();
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword && newPassword !== confirmPassword) {
      setError('Las nuevas contraseñas no coinciden');
      return;
    }

    if (newPassword && !currentPassword) {
      setError('Debes ingresar tu contraseña actual para cambiarla');
      return;
    }

    setIsProcessing(true);
    try {
      const updatedUser = await authService.updateProfile(fullName, currentPassword, newPassword);
      setSuccess(true);
      onUpdateSuccess(updatedUser);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data || 'Error al actualizar el perfil');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#064e3b]/60 backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="bg-white w-full max-w-[450px] rounded-[2.5rem] shadow-2xl relative z-[10002] overflow-hidden animate-reveal">
        {/* Header */}
        <div className="p-8 bg-gradient-to-br from-[#064e3b] to-[#10b981] text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 h-10 w-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border-none cursor-pointer"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
              <User size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black">Editar Perfil</h2>
              <p className="text-xs font-bold text-white/70 uppercase tracking-widest mt-1">Personaliza tu cuenta</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-shake">
              <AlertCircle size={18} />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3 text-green-600 text-sm font-bold animate-reveal">
              <CheckCircle2 size={18} />
              <p>¡Perfil actualizado con éxito!</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#064e3b]/40 ml-1">Nombre Completo</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#064e3b]/30" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#f9fafb] border border-[#064e3b]/5 rounded-2xl py-4 pl-12 pr-4 text-[#064e3b] font-bold focus:bg-white focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/5 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#064e3b]/5">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#064e3b]/20 mb-4 text-center">Cambiar Contraseña (Opcional)</p>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#064e3b]/40 ml-1">Contraseña Actual</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#064e3b]/30" />
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Indispensable para cambios"
                      className="w-full bg-[#f9fafb] border border-[#064e3b]/5 rounded-2xl py-4 pl-12 pr-4 text-[#064e3b] font-bold focus:bg-white focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/5 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#064e3b]/40 ml-1">Nueva</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-[#f9fafb] border border-[#064e3b]/5 rounded-2xl py-4 px-4 text-[#064e3b] font-bold focus:bg-white focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/5 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#064e3b]/40 ml-1">Confirmar</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-[#f9fafb] border border-[#064e3b]/5 rounded-2xl py-4 px-4 text-[#064e3b] font-bold focus:bg-white focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/5 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isProcessing}
            className={`w-full py-5 rounded-2xl bg-[#064e3b] text-white font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 shadow-2xl shadow-[#064e3b]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50
              ${success ? 'bg-[#10b981] shadow-[#10b981]/20' : ''}`}
          >
            {isProcessing ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : success ? (
              <>Guardado <CheckCircle2 size={20} /></>
            ) : (
              <>Guardar Cambios <Save size={20} /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;

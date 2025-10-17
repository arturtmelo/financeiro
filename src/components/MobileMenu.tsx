import { Home, BarChart3, List, LogOut, X, User } from 'lucide-react';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const { user, logout } = useAuth();

  // Previne scroll do body quando menu está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleNavigation = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleBackdropClick = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fadeIn" />

      {/* Menu Centralizado */}
      <div
        className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-800 to-indigo-800 p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Fechar menu"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-3 border-4 border-white/30">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{user?.name}</h2>
            <p className="text-white/80 text-sm">{user?.email}</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-6 space-y-3">
          <button
            onClick={() => handleNavigation('top')}
            className="w-full flex items-center gap-4 px-5 py-4 bg-white/10 hover:bg-white/20 active:bg-white/25 text-white rounded-xl transition-all"
          >
            <Home className="w-6 h-6" />
            <span className="font-semibold text-lg">Início</span>
          </button>

          <button
            onClick={() => handleNavigation('dashboard')}
            className="w-full flex items-center gap-4 px-5 py-4 bg-white/10 hover:bg-white/20 active:bg-white/25 text-white rounded-xl transition-all"
          >
            <BarChart3 className="w-6 h-6" />
            <span className="font-semibold text-lg">Total/Método</span>
          </button>

          <button
            onClick={() => handleNavigation('transactions')}
            className="w-full flex items-center gap-4 px-5 py-4 bg-white/10 hover:bg-white/20 active:bg-white/25 text-white rounded-xl transition-all"
          >
            <List className="w-6 h-6" />
            <span className="font-semibold text-lg">Histórico</span>
          </button>

          {/* Botão Sair */}
          <div className="pt-4 border-t border-white/20">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 px-5 py-4 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg"
            >
              <LogOut className="w-6 h-6" />
              <span className="text-lg">Sair da Conta</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;

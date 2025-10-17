import { Home, BarChart3, List, LogOut, X } from 'lucide-react';
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

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0"
      style={{ zIndex: 99999 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
        onClick={handleBackdropClick}
      />

      {/* Menu Lateral */}
      <div
        className="absolute top-0 right-0 h-full w-72 sm:w-80 bg-gradient-to-b from-purple-600 to-purple-800 shadow-2xl overflow-hidden"
        onClick={handleMenuClick}
        style={{ 
          animation: 'slideInRight 0.3s ease-out',
        }}
      >
        {/* Header do Menu */}
        <div className="p-5 border-b border-white/20 bg-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors active:scale-95"
              aria-label="Fechar menu"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          
          {/* User Info */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-3 py-3 rounded-xl">
            <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xl">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{user?.name}</p>
              <p className="text-white/70 text-sm truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 flex-1 overflow-y-auto">
          <button
            onClick={() => handleNavigation('top')}
            className="w-full flex items-center gap-4 px-4 py-3.5 text-white hover:bg-white/15 active:bg-white/20 rounded-xl transition-all mb-2"
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-left">Início</span>
          </button>

          <button
            onClick={() => handleNavigation('dashboard')}
            className="w-full flex items-center gap-4 px-4 py-3.5 text-white hover:bg-white/15 active:bg-white/20 rounded-xl transition-all mb-2"
          >
            <BarChart3 className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-left">Total/Método</span>
          </button>

          <button
            onClick={() => handleNavigation('transactions')}
            className="w-full flex items-center gap-4 px-4 py-3.5 text-white hover:bg-white/15 active:bg-white/20 rounded-xl transition-all mb-2"
          >
            <List className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-left">Histórico</span>
          </button>
        </nav>

        {/* Logout Button (no final) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20 bg-purple-900/30">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold rounded-xl transition-all shadow-lg active:scale-95"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;


import { Home, BarChart3, List, LogOut, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const { user, logout } = useAuth();

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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9500] animate-fadeIn"
        onClick={onClose}
      />

      {/* Menu Lateral */}
      <div
        className="fixed top-0 right-0 h-full w-72 bg-gradient-to-b from-purple-600 to-purple-800 shadow-2xl z-[9600] animate-slideInRight"
        style={{ animation: 'slideInRight 0.3s ease-out' }}
      >
        {/* Header do Menu */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-white font-medium">{user?.name}</p>
              <p className="text-white/70 text-sm">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4">
          <button
            onClick={() => handleNavigation('top')}
            className="w-full flex items-center gap-4 px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-colors mb-2"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Início</span>
          </button>

          <button
            onClick={() => handleNavigation('dashboard')}
            className="w-full flex items-center gap-4 px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-colors mb-2"
          >
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">Total/Método</span>
          </button>

          <button
            onClick={() => handleNavigation('transactions')}
            className="w-full flex items-center gap-4 px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-colors mb-2"
          >
            <List className="w-5 h-5" />
            <span className="font-medium">Histórico</span>
          </button>
        </nav>

        {/* Logout Button (no final) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors shadow-lg"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;


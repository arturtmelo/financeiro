import { TrendingUp, LogOut, User, Menu } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import MobileMenu from './MobileMenu';

const Header = () => {
  const { user, logout } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDesktopLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };

  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo - Clicável */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            <span className="text-lg sm:text-xl font-bold text-white">Lê Gostosa</span>
          </button>

          {/* User Info & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop: Nome do usuário */}
            <div className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <User className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">{user?.name}</span>
            </div>

            {/* Mobile: Botão Menu Hambúrguer */}
            <button
              onClick={() => setShowMobileMenu(true)}
              className="sm:hidden flex items-center justify-center p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-colors"
              title="Menu"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>

            {/* Desktop: Botão Logout */}
            <button
              onClick={handleDesktopLogout}
              className="hidden sm:flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg transition-colors text-white text-sm font-medium"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />
    </header>
  );
};

export default Header;

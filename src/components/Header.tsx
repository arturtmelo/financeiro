import { TrendingUp, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-[1000] bg-white/10 backdrop-blur-md border-b border-white/20">
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

          {/* User Info & Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop: Nome do usuário */}
            <div className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <User className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">{user?.name}</span>
            </div>

            {/* Botão Logout - Mobile e Desktop */}
            <button
              onClick={logout}
              className="flex items-center justify-center gap-1.5 sm:gap-2 bg-white/10 hover:bg-white/20 active:bg-white/25 backdrop-blur-sm px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors text-white text-sm font-medium"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

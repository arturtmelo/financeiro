import { TrendingUp, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const currentDate = new Date();

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };

  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            <span className="text-lg sm:text-xl font-bold text-white hidden sm:block">
              Controle Financeiro
            </span>
          </div>

          {/* Center: Data */}
          <div className="flex-1 flex justify-center">
            {/* Desktop: Data completa */}
            <div className="hidden md:block text-white/80 text-sm">
              {currentDate.toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>

            {/* Mobile: Data curta */}
            <div className="md:hidden text-white/80 text-xs sm:text-sm">
              {currentDate.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </div>
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <User className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">{user?.name}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 sm:gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors text-white text-sm font-medium"
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

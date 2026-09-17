import { TrendingUp, LogOut, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Header = () => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`sticky top-0 z-40 bg-white/10 dark:bg-black/20 backdrop-blur-md border-b transition-all duration-300 ${
        isScrolled ? 'border-white/30 dark:border-white/10 shadow-sm' : 'border-white/20 dark:border-white/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo - Clicável */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-lg p-1 -m-1"
          >
            <TrendingUp
              className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${
                isScrolled ? 'text-purple-600 dark:text-purple-400' : 'text-white'
              }`}
            />
            <span
              className={`text-lg sm:text-xl font-bold transition-colors ${
                isScrolled ? 'text-gray-900 dark:text-gray-100' : 'text-white'
              }`}
            >
              Finanças
            </span>
          </button>

          <div className="flex items-center gap-2">
            {/* Botão Alternar Tema */}
            <button
              onClick={toggleTheme}
              className={`flex items-center justify-center bg-white/10 hover:bg-white/20 active:bg-white/25 backdrop-blur-sm p-2.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                isScrolled ? 'text-gray-900 dark:text-gray-100' : 'text-white'
              }`}
              aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
              title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Botão Logout - Mobile e Desktop */}
            <button
              onClick={logout}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 bg-white/10 hover:bg-white/20 active:bg-white/25 backdrop-blur-sm px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg transition-colors text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                isScrolled ? 'text-gray-900 dark:text-gray-100' : 'text-white'
              }`}
              aria-label="Sair da conta"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

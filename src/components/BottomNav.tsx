import { List, BarChart3, DollarSign } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'overview' | 'analytics';
  onTabChange: (tab: 'overview' | 'analytics') => void;
  onNewTransaction: () => void;
}

const BottomNav = ({ activeTab, onTabChange, onNewTransaction }: BottomNavProps) => {
  return (
    <nav
      className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid grid-cols-3 items-center h-16">
        <button
          onClick={() => onTabChange('overview')}
          className={`flex flex-col items-center justify-center gap-1 h-full transition-colors ${
            activeTab === 'overview'
              ? 'text-purple-600 dark:text-purple-400'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <List className="w-5 h-5" />
          <span className="text-xs font-medium">Visão Geral</span>
        </button>

        <div className="flex items-center justify-center">
          <button
            onClick={onNewTransaction}
            className="flex items-center justify-center w-16 h-16 rounded-full shadow-2xl ring-4 ring-white/60 dark:ring-gray-900/60 -translate-y-5 transition-all transform active:scale-95 bg-gradient-to-br from-green-500 to-emerald-600 text-white"
            aria-label="Nova transação"
          >
            <DollarSign className="w-7 h-7" />
          </button>
        </div>

        <button
          onClick={() => onTabChange('analytics')}
          className={`flex flex-col items-center justify-center gap-1 h-full transition-colors ${
            activeTab === 'analytics'
              ? 'text-purple-600 dark:text-purple-400'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-xs font-medium">Análises</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;

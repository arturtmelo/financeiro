import { useMemo } from 'react';
import { Transaction, Budget } from '../types';
import { calculateBudgetProgress, formatCurrency } from '../utils/calculations';
import { PiggyBank, Settings } from 'lucide-react';

interface BudgetProgressProps {
  transactions: Transaction[];
  budgets: Budget[];
  onManageBudgets: () => void;
}

const BudgetProgress = ({ transactions, budgets, onManageBudgets }: BudgetProgressProps) => {
  const progress = useMemo(
    () => calculateBudgetProgress(transactions, budgets),
    [transactions, budgets]
  );

  if (budgets.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <PiggyBank className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          Orçamentos do Mês
        </h3>
        <button
          onClick={onManageBudgets}
          className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium flex items-center gap-1"
        >
          <Settings className="w-4 h-4" />
          Gerenciar
        </button>
      </div>

      <div className="space-y-4">
        {progress.map(({ budget, spent, percentage, isOverBudget, isNearThreshold }) => {
          const barColor = isOverBudget
            ? 'bg-gradient-to-r from-red-500 to-rose-600'
            : isNearThreshold
              ? 'bg-gradient-to-r from-amber-500 to-orange-500'
              : 'bg-gradient-to-r from-green-500 to-emerald-500';

          const textColor = isOverBudget
            ? 'text-red-600 dark:text-red-400'
            : isNearThreshold
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-gray-600 dark:text-gray-400';

          return (
            <div key={budget.id}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                  {budget.category}
                </span>
                <span className={`text-sm font-semibold ${textColor}`}>
                  {formatCurrency(spent)} / {formatCurrency(budget.limit)}
                </span>
              </div>
              <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${barColor} transition-all`}
                  style={{ width: `${Math.min(percentage * 100, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetProgress;

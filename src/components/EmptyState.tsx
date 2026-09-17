import { type LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  compact?: boolean;
}

const EmptyState = ({ icon: Icon, title, subtitle, compact = false }: EmptyStateProps) => {
  return (
    <div className={`text-center ${compact ? 'py-8' : 'py-16'}`}>
      <div className="flex justify-center mb-4">
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
          <Icon
            className={`${compact ? 'w-10 h-10 sm:w-12 sm:h-12' : 'w-12 h-12'} text-gray-400 dark:text-gray-500`}
          />
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg font-medium mb-1">
        {title}
      </p>
      {subtitle && (
        <p className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm">{subtitle}</p>
      )}
    </div>
  );
};

export default EmptyState;

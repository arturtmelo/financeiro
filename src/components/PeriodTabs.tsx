interface PeriodOption<T extends string> {
  value: T;
  label: string;
}

interface PeriodTabsProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: PeriodOption<T>[];
}

const PeriodTabs = <T extends string>({ value, onChange, options }: PeriodTabsProps<T>) => {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 ${
            value === option.value
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 active:bg-gray-300 dark:active:bg-gray-500'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default PeriodTabs;

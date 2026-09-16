export const CATEGORY_COLOR_PALETTE = [
  'purple',
  'pink',
  'blue',
  'green',
  'amber',
  'red',
  'cyan',
  'orange',
  'indigo',
  'teal',
] as const;

export type CategoryColor = (typeof CATEGORY_COLOR_PALETTE)[number];

interface ColorClasses {
  bg: string;
  text: string;
  dot: string;
  bar: string;
}

const COLOR_CLASS_MAP: Record<CategoryColor, ColorClasses> = {
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-950',
    text: 'text-purple-700 dark:text-purple-300',
    dot: 'bg-purple-500',
    bar: 'bg-gradient-to-r from-purple-500 to-indigo-500',
  },
  pink: {
    bg: 'bg-pink-100 dark:bg-pink-950',
    text: 'text-pink-700 dark:text-pink-300',
    dot: 'bg-pink-500',
    bar: 'bg-gradient-to-r from-pink-500 to-rose-500',
  },
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-950',
    text: 'text-blue-700 dark:text-blue-300',
    dot: 'bg-blue-500',
    bar: 'bg-gradient-to-r from-blue-500 to-cyan-500',
  },
  green: {
    bg: 'bg-green-100 dark:bg-green-950',
    text: 'text-green-700 dark:text-green-300',
    dot: 'bg-green-500',
    bar: 'bg-gradient-to-r from-green-500 to-emerald-500',
  },
  amber: {
    bg: 'bg-amber-100 dark:bg-amber-950',
    text: 'text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-500',
    bar: 'bg-gradient-to-r from-amber-500 to-orange-500',
  },
  red: {
    bg: 'bg-red-100 dark:bg-red-950',
    text: 'text-red-700 dark:text-red-300',
    dot: 'bg-red-500',
    bar: 'bg-gradient-to-r from-red-500 to-rose-500',
  },
  cyan: {
    bg: 'bg-cyan-100 dark:bg-cyan-950',
    text: 'text-cyan-700 dark:text-cyan-300',
    dot: 'bg-cyan-500',
    bar: 'bg-gradient-to-r from-cyan-500 to-blue-500',
  },
  orange: {
    bg: 'bg-orange-100 dark:bg-orange-950',
    text: 'text-orange-700 dark:text-orange-300',
    dot: 'bg-orange-500',
    bar: 'bg-gradient-to-r from-orange-500 to-amber-500',
  },
  indigo: {
    bg: 'bg-indigo-100 dark:bg-indigo-950',
    text: 'text-indigo-700 dark:text-indigo-300',
    dot: 'bg-indigo-500',
    bar: 'bg-gradient-to-r from-indigo-500 to-purple-500',
  },
  teal: {
    bg: 'bg-teal-100 dark:bg-teal-950',
    text: 'text-teal-700 dark:text-teal-300',
    dot: 'bg-teal-500',
    bar: 'bg-gradient-to-r from-teal-500 to-emerald-500',
  },
};

const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const isCategoryColor = (value: string): value is CategoryColor =>
  (CATEGORY_COLOR_PALETTE as readonly string[]).includes(value);

/**
 * Retorna a cor de uma categoria: a cor escolhida pelo usuário, ou um fallback
 * determinístico (hash do nome) para categorias sem cor definida.
 */
export const getCategoryColor = (
  category: string,
  colors: Record<string, string>
): CategoryColor => {
  const assigned = colors[category];
  if (assigned && isCategoryColor(assigned)) {
    return assigned;
  }
  return CATEGORY_COLOR_PALETTE[hashString(category) % CATEGORY_COLOR_PALETTE.length];
};

export const getColorClasses = (color: CategoryColor): ColorClasses => COLOR_CLASS_MAP[color];

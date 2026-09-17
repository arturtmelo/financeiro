export type ButtonTheme = 'purple' | 'green' | 'amber' | 'red';

export const CARD_CLASS = 'bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6';

export const SECTION_HEADING_CLASS =
  'text-lg sm:text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2';

export const SUBSECTION_HEADING_CLASS =
  'text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2';

export const MODAL_TITLE_CLASS = 'text-lg sm:text-xl lg:text-2xl font-bold truncate';

export const INPUT_CLASS =
  'w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-xl focus:border-purple-500 focus:outline-none transition-colors';

const FOCUS_RING: Record<ButtonTheme, string> = {
  purple: 'focus-visible:ring-purple-500',
  green: 'focus-visible:ring-green-500',
  amber: 'focus-visible:ring-amber-500',
  red: 'focus-visible:ring-red-500',
};

const PRIMARY_GRADIENTS: Record<ButtonTheme, string> = {
  purple: 'from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700',
  green: 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700',
  amber: 'from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700',
  red: 'from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700',
};

const RING_BASE =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900';

/**
 * Botão de ação principal (CTA), com o mesmo padding/radius/hover/foco em
 * todas as telas — só a cor (tema) muda por feature (verde=transação,
 * âmbar=orçamento, roxo=marca, vermelho=perigo).
 */
export const getButtonClass = (theme: ButtonTheme = 'purple'): string =>
  `flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r ${PRIMARY_GRADIENTS[theme]} text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105 ${RING_BASE} ${FOCUS_RING[theme]}`;

export const SECONDARY_BUTTON_CLASS = `flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-colors ${RING_BASE} focus-visible:ring-gray-400`;

export const ICON_BUTTON_CLASS = `p-2 rounded-lg transition-colors ${RING_BASE}`;

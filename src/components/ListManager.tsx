import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, X, Save, Palette, type LucideIcon } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';
import { CATEGORY_COLOR_PALETTE, getCategoryColor, getColorClasses } from '../utils/colors';

type GradientTheme = 'purple' | 'green';

interface ThemeClasses {
  header: string;
  button: string;
  badge: string;
  editBorder: string;
  focusBorder: string;
  linkText: string;
}

const THEME_CLASSES: Record<GradientTheme, ThemeClasses> = {
  purple: {
    header: 'bg-gradient-to-r from-purple-500 to-indigo-600',
    button:
      'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700',
    badge: 'bg-gradient-to-br from-purple-500 to-pink-500',
    editBorder: 'border-purple-500',
    focusBorder: 'focus:border-purple-500',
    linkText: 'text-purple-600 dark:text-purple-400',
  },
  green: {
    header: 'bg-gradient-to-r from-green-500 to-emerald-600',
    button:
      'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700',
    badge: 'bg-gradient-to-br from-green-500 to-emerald-500',
    editBorder: 'border-green-500',
    focusBorder: 'focus:border-green-500',
    linkText: 'text-green-600 dark:text-green-400',
  },
};

interface ListManagerProps {
  title: string;
  icon: LucideIcon;
  itemLabelSingular: string;
  addPlaceholder: string;
  items: string[];
  onItemsChange: (items: string[]) => void;
  onClose: () => void;
  gradientTheme: GradientTheme;
  colors?: Record<string, string>;
  onColorsChange?: (colors: Record<string, string>) => void;
}

const ListManager = ({
  title,
  icon: Icon,
  itemLabelSingular,
  addPlaceholder,
  items,
  onItemsChange,
  onClose,
  gradientTheme,
  colors,
  onColorsChange,
}: ListManagerProps) => {
  const theme = THEME_CLASSES[gradientTheme];
  const supportsColors = !!colors && !!onColorsChange;

  const [newItem, setNewItem] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [colorPickerFor, setColorPickerFor] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; item: string }>({
    isOpen: false,
    item: '',
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const itemExists = (value: string) =>
    items.some((item) => item.toLowerCase() === value.toLowerCase());

  const handleAdd = () => {
    const trimmed = newItem.trim();
    if (trimmed && !itemExists(trimmed)) {
      onItemsChange([...items, trimmed]);
      setNewItem('');
    }
  };

  const handleDeleteClick = (item: string) => {
    setDeleteConfirm({ isOpen: true, item });
  };

  const handleDeleteConfirm = () => {
    onItemsChange(items.filter((i) => i !== deleteConfirm.item));
    if (supportsColors && colors) {
      const { [deleteConfirm.item]: _removed, ...rest } = colors;
      onColorsChange!(rest);
    }
    setDeleteConfirm({ isOpen: false, item: '' });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, item: '' });
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditingValue(items[index]);
  };

  const handleSaveEdit = () => {
    if (editingIndex === null) return;
    const trimmed = editingValue.trim();
    const current = items[editingIndex];
    if (trimmed && (trimmed === current || !itemExists(trimmed))) {
      const updated = [...items];
      updated[editingIndex] = trimmed;
      onItemsChange(updated);

      if (supportsColors && colors && trimmed !== current && colors[current]) {
        const { [current]: colorValue, ...rest } = colors;
        onColorsChange!({ ...rest, [trimmed]: colorValue });
      }
    }
    setEditingIndex(null);
    setEditingValue('');
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue('');
  };

  const handlePickColor = (item: string, color: string) => {
    if (!supportsColors || !colors) return;
    onColorsChange!({ ...colors, [item]: color });
    setColorPickerFor(null);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="list-manager-title"
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] sm:max-h-[80vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className={`${theme.header} p-4 sm:p-6 text-white`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              <h2 id="list-manager-title" className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
              aria-label="Fechar"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Add new item */}
          <div className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 rounded-xl">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Adicionar {itemLabelSingular}
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                placeholder={addPlaceholder}
                className={`flex-1 px-3 sm:px-4 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl ${theme.focusBorder} focus:outline-none transition-colors text-sm sm:text-base`}
              />
              <button
                onClick={handleAdd}
                disabled={!newItem.trim()}
                className={`${theme.button} disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all text-sm sm:text-base`}
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                Adicionar
              </button>
            </div>
          </div>

          {/* Items list */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">
              Cadastrados ({items.length})
            </h3>
            <div className="space-y-2">
              {items.map((item, index) => {
                const itemColor = supportsColors && colors ? getCategoryColor(item, colors) : null;
                const colorClasses = itemColor ? getColorClasses(itemColor) : null;

                return (
                  <div key={item}>
                    <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
                      {editingIndex === index ? (
                        <>
                          <input
                            type="text"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                            className={`flex-1 px-3 py-1 border-2 ${theme.editBorder} dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:outline-none text-sm sm:text-base`}
                            autoFocus
                          />
                          <div className="flex items-center gap-1 sm:gap-2 ml-2">
                            <button
                              onClick={handleSaveEdit}
                              className="p-1.5 sm:p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950 rounded-lg transition-colors"
                              title="Salvar"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                              title="Cancelar"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            {colorClasses ? (
                              <button
                                onClick={() =>
                                  setColorPickerFor(colorPickerFor === item ? null : item)
                                }
                                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${colorClasses.dot} flex items-center justify-center text-white flex-shrink-0 transition-transform hover:scale-105`}
                                title="Escolher cor"
                              >
                                <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </button>
                            ) : (
                              <div
                                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${theme.badge} flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0`}
                              >
                                {index + 1}
                              </div>
                            )}
                            <span
                              className={`font-medium text-sm sm:text-base truncate ${
                                colorClasses
                                  ? `px-2 py-0.5 rounded-full ${colorClasses.bg} ${colorClasses.text}`
                                  : 'text-gray-800 dark:text-gray-100'
                              }`}
                            >
                              {item}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleStartEdit(index)}
                              className="p-1.5 sm:p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(item)}
                              className="p-1.5 sm:p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {colorPickerFor === item && (
                      <div className="flex flex-wrap gap-2 p-2 sm:p-3 mt-1 bg-gray-50 dark:bg-gray-900 rounded-xl">
                        {CATEGORY_COLOR_PALETTE.map((color) => (
                          <button
                            key={color}
                            onClick={() => handlePickColor(item, color)}
                            className={`w-6 h-6 rounded-full ${getColorClasses(color).dot} transition-transform hover:scale-110 ${
                              itemColor === color
                                ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-900'
                                : ''
                            }`}
                            aria-label={`Cor ${color}`}
                            title={color}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {items.length === 0 && (
                <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                  <Icon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm sm:text-base">Nenhum item cadastrado</p>
                  <p className="text-xs sm:text-sm mt-1">Adicione o primeiro item acima</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4 bg-gray-50 dark:bg-gray-900">
          <button
            onClick={onClose}
            className={`w-full ${theme.button} text-white font-semibold py-2.5 sm:py-3 rounded-xl transition-all transform hover:scale-105 text-sm sm:text-base`}
          >
            Concluído
          </button>
        </div>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title={`Excluir ${itemLabelSingular}`}
        message={`Tem certeza que deseja excluir "${deleteConfirm.item}"? As transações existentes não serão afetadas.`}
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        confirmColor="red"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default ListManager;

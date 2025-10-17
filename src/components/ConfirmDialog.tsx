import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'red' | 'blue' | 'green';
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmColor = 'red',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const colorClasses = {
    red: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700',
    blue: 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700',
    green:
      'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700',
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fadeIn"
      onClick={handleBackdropClick}
      style={{ alignItems: 'center', justifyContent: 'center' }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm sm:max-w-md w-full overflow-hidden animate-scaleIn my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 sm:p-5 text-white">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold">{title}</h3>
            </div>
            <button
              onClick={onCancel}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">{message}</p>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-3 sm:gap-3 sm:justify-end">
          <button
            onClick={onConfirm}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 sm:py-2.5 ${colorClasses[confirmColor]} text-white font-semibold rounded-xl shadow-lg transition-all transform active:scale-95 sm:hover:scale-105 order-1`}
          >
            {confirmText}
          </button>
          <button
            onClick={onCancel}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 sm:py-2.5 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-700 font-semibold rounded-xl transition-colors order-2"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

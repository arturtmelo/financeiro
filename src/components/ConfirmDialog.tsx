import { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { MODAL_TITLE_CLASS, SECONDARY_BUTTON_CLASS } from '../utils/uiClasses';

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
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    confirmButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const headerColorClasses = {
    red: 'bg-gradient-to-r from-red-500 to-rose-600',
    blue: 'bg-gradient-to-r from-blue-500 to-cyan-600',
    green: 'bg-gradient-to-r from-green-500 to-emerald-600',
  };

  const confirmButtonColorClasses = {
    red: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700',
    blue: 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700',
    green:
      'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700',
  };

  const confirmRingColorClasses = {
    red: 'focus-visible:ring-red-500',
    blue: 'focus-visible:ring-blue-500',
    green: 'focus-visible:ring-green-500',
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn z-[60]"
      onClick={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm sm:max-w-md w-full overflow-hidden animate-scaleIn my-auto"
      >
        {/* Header */}
        <div className={`${headerColorClasses[confirmColor]} p-4 sm:p-5 text-white`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 id="confirm-dialog-title" className={MODAL_TITLE_CLASS}>
                {title}
              </h3>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Fechar"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          <p className="text-gray-700 dark:text-gray-200 text-base sm:text-lg leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-3 sm:gap-3 sm:justify-end">
          <button
            ref={confirmButtonRef}
            onClick={onConfirm}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 sm:py-2.5 ${confirmButtonColorClasses[confirmColor]} text-white font-semibold rounded-xl shadow-lg transition-all transform active:scale-95 sm:hover:scale-105 order-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 ${confirmRingColorClasses[confirmColor]}`}
          >
            {confirmText}
          </button>
          <button
            onClick={onCancel}
            className={`w-full sm:w-auto order-2 ${SECONDARY_BUTTON_CLASS}`}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

import { AlertTriangle } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationDialog({
  isOpen,
  title,
  message,
  confirmText = 'Delete Permanently',
  cancelText = 'Cancel',
  onConfirm,
  onCancel
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" id="confirmation-dialog-overlay">
      <div 
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 w-full max-w-md p-6 rounded-2xl shadow-2xl space-y-4"
        id="confirmation-dialog-container"
      >
        <div className="flex gap-3.5 items-start">
          <div className="p-3 bg-rose-500/10 rounded-full text-rose-600 dark:text-rose-400 flex-shrink-0">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-base text-neutral-800 dark:text-neutral-100" id="confirmation-title">
              {title}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed" id="confirmation-message">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-100 dark:border-neutral-800">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
            id="confirmation-cancel-btn"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-500/20 transition-all cursor-pointer"
            id="confirmation-confirm-btn"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export default function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          let Icon = Info;
          let bgColor = 'bg-blue-50/95 dark:bg-blue-950/90 border-blue-200 dark:border-blue-900';
          let textColor = 'text-blue-800 dark:text-blue-200';
          let iconColor = 'text-blue-500';

          if (toast.type === 'success') {
            Icon = CheckCircle;
            bgColor = 'bg-emerald-50/95 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-900';
            textColor = 'text-emerald-800 dark:text-emerald-200';
            iconColor = 'text-emerald-500';
          } else if (toast.type === 'error') {
            Icon = AlertCircle;
            bgColor = 'bg-rose-50/95 dark:bg-rose-950/90 border-rose-200 dark:border-rose-900';
            textColor = 'text-rose-800 dark:text-rose-200';
            iconColor = 'text-rose-500';
          } else if (toast.type === 'warning') {
            Icon = AlertTriangle;
            bgColor = 'bg-amber-50/95 dark:bg-amber-950/90 border-amber-200 dark:border-amber-900';
            textColor = 'text-amber-800 dark:text-amber-200';
            iconColor = 'text-amber-500';
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              layout
              className={`pointer-events-auto flex gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md ${bgColor} ${textColor}`}
              id={`toast-${toast.id}`}
            >
              <div className="flex-shrink-0 mt-0.5">
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <div className="flex-grow">
                <h4 className="text-sm font-semibold leading-tight">{toast.title}</h4>
                <p className="text-xs mt-1 opacity-90 leading-normal">{toast.description}</p>
              </div>
              <button
                onClick={() => onClose(toast.id)}
                className="flex-shrink-0 self-start text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                id={`toast-close-${toast.id}`}
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

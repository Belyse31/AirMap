import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const COLORS = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
};

export function Toast({ toast, onClose }) {
  const [isExiting, setIsExiting] = useState(false);
  const Icon = ICONS[toast.type] || Info;

  useEffect(() => {
    if (toast.duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(toast.id);
    }, 300);
  };

  return (
    <div
      className={`flex items-start gap-3 bg-white rounded-lg shadow-lg p-4 mb-3 min-w-[300px] max-w-md transition-all duration-300 ${
        isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
      }`}
      role="alert"
      aria-live="polite"
    >
      <div className={`${COLORS[toast.type]} rounded-full p-1`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="flex-1 text-sm text-gray-800">{toast.message}</p>
      <button
        onClick={handleClose}
        className="text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Close notification"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onClose }) {
  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col items-end"
      aria-label="Notifications"
    >
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
}

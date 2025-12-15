import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, X, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastProps {
    toast: ToastData;
    onRemove: (id: string) => void;
}

const TOAST_ICONS = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
};

const TOAST_COLORS = {
    success: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white',
    error: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white',
    warning: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white',
    info: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white'
};

const ICON_COLORS = {
    success: 'text-black dark:text-white',
    error: 'text-black dark:text-white',
    warning: 'text-black dark:text-white',
    info: 'text-black dark:text-white'
};

function Toast({ toast, onRemove }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);
    const Icon = TOAST_ICONS[toast.type];

    useEffect(() => {
        setIsVisible(true);
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onRemove(toast.id), 300);
        }, 3000);
        return () => clearTimeout(timer);
    }, [toast.id, onRemove]);

    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg transition-all duration-300 ${TOAST_COLORS[toast.type]} ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                }`}
        >
            <Icon className={`w-5 h-5 flex-shrink-0 ${ICON_COLORS[toast.type]}`} />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(() => onRemove(toast.id), 300);
                }}
                className="p-1 hover:bg-black/10 rounded-lg transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

interface ToastContainerProps {
    toasts: ToastData[];
    onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <Toast key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
}

// Hook pour gérer les toasts
export function useToast() {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const addToast = (type: ToastType, message: string) => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, type, message }]);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return { toasts, addToast, removeToast };
}

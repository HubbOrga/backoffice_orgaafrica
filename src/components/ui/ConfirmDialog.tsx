import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    type = 'danger'
}: ConfirmDialogProps) {
    const buttonColors = {
        danger: 'bg-red-600 hover:bg-red-700',
        warning: 'bg-yellow-600 hover:bg-yellow-700',
        info: 'bg-blue-600 hover:bg-blue-700'
    };

    const iconColors = {
        danger: 'text-red-600 bg-red-100 dark:bg-red-900/30',
        warning: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30',
        info: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30'
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <div className="text-center">
                <div className={`mx-auto w-12 h-12 flex items-center justify-center rounded-full ${iconColors[type]} mb-4`}>
                    <AlertTriangle className="w-6 h-6" />
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {message}
                </p>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-medium transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`px-4 py-2 text-white ${buttonColors[type]} rounded-xl font-medium transition-colors`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

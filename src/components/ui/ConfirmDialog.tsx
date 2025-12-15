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
        danger: 'bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200',
        warning: 'bg-gray-700 hover:bg-gray-600 dark:bg-gray-300 dark:text-black dark:hover:bg-gray-400',
        info: 'bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:text-black dark:hover:bg-gray-300'
    };

    const iconColors = {
        danger: 'text-black bg-gray-100 dark:text-white dark:bg-gray-800',
        warning: 'text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-800',
        info: 'text-gray-900 bg-gray-100 dark:text-gray-100 dark:bg-gray-800'
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

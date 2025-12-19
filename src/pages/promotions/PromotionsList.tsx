import { useState } from 'react';
import {
    Megaphone,
    Search,
    Plus,
    Calendar,
    Percent,
    Clock,
    CheckCircle,
    XCircle,
    Pause,
    Edit,
    Trash2,
    Eye,
    Copy,
    Tag,
    Play
} from 'lucide-react';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { ToastContainer, useToast } from '../../components/ui/Toast';

// ============================================
// TYPES
// ============================================

interface Promotion {
    id: string;
    name: string;
    description: string;
    discount_type: string;
    discount_value: number;
    code: string;
    restaurant: string;
    start_date: string;
    end_date: string;
    status: string;
    usage_count: number;
    max_uses: number | null;
}

// ============================================
// DONNÉES MOCKÉES INITIALES
// ============================================

const INITIAL_PROMOTIONS: Promotion[] = [
    {
        id: '1',
        name: 'Happy Hour -30%',
        description: 'Réduction sur toutes les boissons entre 17h et 19h',
        discount_type: 'percentage',
        discount_value: 30,
        code: 'HAPPY30',
        restaurant: 'Le Petit Bistro',
        start_date: '2024-12-01',
        end_date: '2024-12-31',
        status: 'active',
        usage_count: 234,
        max_uses: 500
    },
    {
        id: '2',
        name: 'Offre Nouvel An',
        description: 'Menu spécial avec champagne offert',
        discount_type: 'fixed',
        discount_value: 5000,
        code: 'NEWYEAR24',
        restaurant: 'Sushi Master',
        start_date: '2024-12-25',
        end_date: '2025-01-05',
        status: 'scheduled',
        usage_count: 0,
        max_uses: 100
    },
    {
        id: '3',
        name: 'Pizza 2+1',
        description: 'Pour 2 pizzas achetées, la 3ème offerte',
        discount_type: 'bogo',
        discount_value: 100,
        code: 'PIZZA3FOR2',
        restaurant: 'Pizza Palace',
        start_date: '2024-11-15',
        end_date: '2024-12-15',
        status: 'active',
        usage_count: 456,
        max_uses: 1000
    },
    {
        id: '4',
        name: 'Livraison Gratuite',
        description: 'Livraison offerte sans minimum d\'achat',
        discount_type: 'free_delivery',
        discount_value: 0,
        code: 'FREELIV',
        restaurant: 'Burger Express',
        start_date: '2024-12-01',
        end_date: '2024-12-20',
        status: 'active',
        usage_count: 789,
        max_uses: null
    },
    {
        id: '5',
        name: 'Promo Été 2024',
        description: 'Réduction de 15% sur tout le menu',
        discount_type: 'percentage',
        discount_value: 15,
        code: 'SUMMER24',
        restaurant: 'Chez Mama',
        start_date: '2024-06-01',
        end_date: '2024-08-31',
        status: 'expired',
        usage_count: 1234,
        max_uses: 2000
    },
    {
        id: '6',
        name: 'Pause Café',
        description: '-20% sur les desserts et cafés',
        discount_type: 'percentage',
        discount_value: 20,
        code: 'COFFEE20',
        restaurant: 'Le Petit Bistro',
        start_date: '2024-12-10',
        end_date: '2024-12-25',
        status: 'paused',
        usage_count: 67,
        max_uses: 200
    }
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    active: { label: 'Active', color: 'bg-black text-white dark:bg-white dark:text-black', icon: CheckCircle },
    scheduled: { label: 'Planifiée', color: 'bg-gray-700 text-white dark:bg-gray-300 dark:text-black', icon: Calendar },
    paused: { label: 'En pause', color: 'bg-gray-500 text-white dark:bg-gray-500 dark:text-white', icon: Pause },
    expired: { label: 'Expirée', color: 'bg-gray-300 text-black dark:bg-gray-700 dark:text-white', icon: XCircle },
};

const DISCOUNT_TYPE_LABELS: Record<string, string> = {
    percentage: 'Pourcentage',
    fixed: 'Montant fixe',
    bogo: 'Achetez X Obtenez Y',
    free_delivery: 'Livraison gratuite'
};

const DISCOUNT_TYPES = [
    { value: 'percentage', label: 'Pourcentage (%)' },
    { value: 'fixed', label: 'Montant fixe (FCFA)' },
    { value: 'bogo', label: 'Achetez X Obtenez Y' },
    { value: 'free_delivery', label: 'Livraison gratuite' },
];

const STATUSES = [
    { value: 'active', label: 'Active' },
    { value: 'scheduled', label: 'Planifiée' },
    { value: 'paused', label: 'En pause' },
    { value: 'expired', label: 'Expirée' },
];

const RESTAURANTS = [
    'Le Petit Bistro',
    'Pizza Palace',
    'Sushi Master',
    'Chez Mama',
    'Burger Express',
    'Wok & Roll'
];

// ============================================
// COMPOSANT FORMULAIRE PROMOTION
// ============================================

interface PromotionFormProps {
    promotion?: Promotion | null;
    onSubmit: (data: Omit<Promotion, 'id' | 'usage_count'>) => void;
    onCancel: () => void;
}

function PromotionForm({ promotion, onSubmit, onCancel }: PromotionFormProps) {
    const [formData, setFormData] = useState({
        name: promotion?.name || '',
        description: promotion?.description || '',
        discount_type: promotion?.discount_type || 'percentage',
        discount_value: promotion?.discount_value || 0,
        code: promotion?.code || '',
        restaurant: promotion?.restaurant || RESTAURANTS[0],
        start_date: promotion?.start_date || new Date().toISOString().split('T')[0],
        end_date: promotion?.end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: promotion?.status || 'active',
        max_uses: promotion?.max_uses || null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            max_uses: formData.max_uses ? Number(formData.max_uses) : null,
        });
    };

    const generateCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setFormData({ ...formData, code });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nom de la promotion
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Type de réduction
                    </label>
                    <select
                        value={formData.discount_type}
                        onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        {DISCOUNT_TYPES.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Valeur {formData.discount_type === 'percentage' ? '(%)' : formData.discount_type === 'fixed' ? '(FCFA)' : ''}
                    </label>
                    <input
                        type="number"
                        value={formData.discount_value}
                        onChange={(e) => setFormData({ ...formData, discount_value: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        min="0"
                        disabled={formData.discount_type === 'free_delivery'}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Code promo
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                        required
                    />
                    <button
                        type="button"
                        onClick={generateCode}
                        className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                        Générer
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Restaurant
                    </label>
                    <select
                        value={formData.restaurant}
                        onChange={(e) => setFormData({ ...formData, restaurant: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        {RESTAURANTS.map(restaurant => (
                            <option key={restaurant} value={restaurant}>{restaurant}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Statut
                    </label>
                    <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        {STATUSES.map(status => (
                            <option key={status.value} value={status.value}>{status.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Date de début
                    </label>
                    <input
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Date de fin
                    </label>
                    <input
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Utilisations max (laisser vide pour illimité)
                </label>
                <input
                    type="number"
                    value={formData.max_uses || ''}
                    onChange={(e) => setFormData({ ...formData, max_uses: e.target.value ? Number(e.target.value) : null })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    min="0"
                    placeholder="Illimité"
                />
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-medium transition-colors"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground hover:opacity-90 rounded-xl font-medium transition-all"
                >
                    {promotion ? 'Modifier' : 'Créer'}
                </button>
            </div>
        </form>
    );
}

// ============================================
// COMPOSANT DÉTAIL PROMOTION
// ============================================

interface PromotionDetailProps {
    promotion: Promotion;
    onClose: () => void;
}

function PromotionDetail({ promotion, onClose }: PromotionDetailProps) {
    const statusConfig = STATUS_CONFIG[promotion.status];
    const StatusIcon = statusConfig.icon;
    const usagePercentage = promotion.max_uses ? (promotion.usage_count / promotion.max_uses) * 100 : null;

    const copyCode = () => {
        navigator.clipboard.writeText(promotion.code);
    };

    return (
        <div className="space-y-6">
            {/* Header with gradient */}
            <div className={`h-32 rounded-xl relative flex items-center justify-center ${promotion.status === 'active' ? 'bg-gray-900' :
                promotion.status === 'scheduled' ? 'bg-gray-700' :
                    promotion.status === 'paused' ? 'bg-gray-500' :
                        'bg-gray-300'
                }`}>
                {promotion.discount_type === 'percentage' && (
                    <span className="text-5xl font-bold text-white/90">-{promotion.discount_value}%</span>
                )}
                {promotion.discount_type === 'fixed' && (
                    <span className="text-4xl font-bold text-white/90">-{promotion.discount_value} FCFA</span>
                )}
                {promotion.discount_type === 'bogo' && (
                    <span className="text-4xl font-bold text-white/90">2+1</span>
                )}
                {promotion.discount_type === 'free_delivery' && (
                    <span className="text-3xl font-bold text-white/90">🚚 GRATUIT</span>
                )}
                <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                    </span>
                </div>
            </div>

            {/* Info */}
            <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{promotion.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">{promotion.description}</p>
            </div>

            {/* Code */}
            <div className="flex items-center gap-2">
                <div className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl font-mono text-lg text-gray-900 dark:text-white text-center">
                    {promotion.code}
                </div>
                <button
                    onClick={copyCode}
                    className="p-3 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
                >
                    <Copy className="w-5 h-5" />
                </button>
            </div>

            {/* Stats */}
            <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Restaurant</span>
                    <span className="font-medium text-gray-900 dark:text-white">{promotion.restaurant}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Type</span>
                    <span className="font-medium text-gray-900 dark:text-white">{DISCOUNT_TYPE_LABELS[promotion.discount_type]}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Période</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(promotion.start_date).toLocaleDateString('fr-FR')} - {new Date(promotion.end_date).toLocaleDateString('fr-FR')}
                    </span>
                </div>
                {promotion.max_uses && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-500 dark:text-gray-400">Utilisations</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {promotion.usage_count} / {promotion.max_uses}
                            </span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all ${usagePercentage! > 80 ? 'bg-gray-900' :
                                    usagePercentage! > 50 ? 'bg-gray-700' :
                                        'bg-gray-500'
                                    }`}
                                style={{ width: `${usagePercentage}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>

            <button
                onClick={onClose}
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors"
            >
                Fermer
            </button>
        </div>
    );
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export default function PromotionsList() {
    const [promotions, setPromotions] = useState<Promotion[]>(INITIAL_PROMOTIONS);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    // Modals state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);

    // Toast
    const { toasts, addToast, removeToast } = useToast();

    const filteredPromotions = promotions.filter(promo => {
        const matchesSearch = promo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            promo.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            promo.restaurant.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || promo.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const activeCount = promotions.filter(p => p.status === 'active').length;
    const scheduledCount = promotions.filter(p => p.status === 'scheduled').length;
    const totalUsage = promotions.reduce((sum, p) => sum + p.usage_count, 0);

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        addToast('info', `Code "${code}" copié dans le presse-papier`);
    };

    // CRUD Operations
    const handleCreate = (data: Omit<Promotion, 'id' | 'usage_count'>) => {
        const newPromotion: Promotion = {
            ...data,
            id: Date.now().toString(),
            usage_count: 0,
        };
        setPromotions([...promotions, newPromotion]);
        setIsCreateModalOpen(false);
        addToast('success', `Promotion "${data.name}" créée avec succès`);
    };

    const handleEdit = (data: Omit<Promotion, 'id' | 'usage_count'>) => {
        if (!selectedPromotion) return;
        const updatedPromotions = promotions.map(p =>
            p.id === selectedPromotion.id ? { ...p, ...data } : p
        );
        setPromotions(updatedPromotions);
        setIsEditModalOpen(false);
        setSelectedPromotion(null);
        addToast('success', `Promotion "${data.name}" modifiée avec succès`);
    };

    const handleDelete = () => {
        if (!selectedPromotion) return;
        setPromotions(promotions.filter(p => p.id !== selectedPromotion.id));
        addToast('success', `Promotion "${selectedPromotion.name}" supprimée`);
        setSelectedPromotion(null);
    };

    const handleToggleStatus = (promotion: Promotion) => {
        let newStatus = promotion.status;
        if (promotion.status === 'active') {
            newStatus = 'paused';
        } else if (promotion.status === 'paused') {
            newStatus = 'active';
        }

        const updatedPromotions = promotions.map(p =>
            p.id === promotion.id ? { ...p, status: newStatus } : p
        );
        setPromotions(updatedPromotions);
        addToast('success', `Promotion "${promotion.name}" ${newStatus === 'active' ? 'activée' : 'mise en pause'}`);
    };

    const openEditModal = (promotion: Promotion) => {
        setSelectedPromotion(promotion);
        setIsEditModalOpen(true);
    };

    const openViewModal = (promotion: Promotion) => {
        setSelectedPromotion(promotion);
        setIsViewModalOpen(true);
    };

    const openDeleteDialog = (promotion: Promotion) => {
        setSelectedPromotion(promotion);
        setIsDeleteDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <Megaphone className="w-8 h-8 text-primary" />
                        Gestion des Promotions
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Créez et gérez vos campagnes promotionnelles
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground hover:opacity-90 font-medium rounded-xl transition-all duration-300 shadow-lg"
                >
                    <Plus className="w-5 h-5" />
                    Créer une promotion
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-secondary rounded-lg">
                            <Tag className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Promos</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{promotions.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-secondary rounded-lg">
                            <CheckCircle className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Actives</p>
                            <p className="text-xl font-bold text-primary">{activeCount}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-secondary rounded-lg">
                            <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Planifiées</p>
                            <p className="text-xl font-bold text-primary">{scheduledCount}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-secondary rounded-lg">
                            <Percent className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Utilisations</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{totalUsage.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher une promotion, code, restaurant..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                    </div>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                        <option value="all">Tous les statuts</option>
                        <option value="active">Active</option>
                        <option value="scheduled">Planifiée</option>
                        <option value="paused">En pause</option>
                        <option value="expired">Expirée</option>
                    </select>
                </div>
            </div>

            {/* Empty state */}
            {filteredPromotions.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
                    <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">Aucune promotion trouvée</p>
                </div>
            ) : (
                /* Promotions Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredPromotions.map((promo) => {
                        const statusConfig = STATUS_CONFIG[promo.status];
                        const StatusIcon = statusConfig.icon;
                        const usagePercentage = promo.max_uses ? (promo.usage_count / promo.max_uses) * 100 : null;

                        return (
                            <div
                                key={promo.id}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300"
                            >
                                {/* Header with gradient */}
                                <div className={`h-24 relative ${promo.status === 'active' ? 'bg-gray-900' :
                                    promo.status === 'scheduled' ? 'bg-gray-700' :
                                        promo.status === 'paused' ? 'bg-gray-500' :
                                            'bg-gray-300'
                                    }`}>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {promo.discount_type === 'percentage' && (
                                            <span className="text-4xl font-bold text-white/90">-{promo.discount_value}%</span>
                                        )}
                                        {promo.discount_type === 'fixed' && (
                                            <span className="text-3xl font-bold text-white/90">-{promo.discount_value} FCFA</span>
                                        )}
                                        {promo.discount_type === 'bogo' && (
                                            <span className="text-3xl font-bold text-white/90">2+1</span>
                                        )}
                                        {promo.discount_type === 'free_delivery' && (
                                            <span className="text-2xl font-bold text-white/90">🚚 GRATUIT</span>
                                        )}
                                    </div>
                                    <div className="absolute top-3 right-3">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                                            <StatusIcon className="w-3 h-3" />
                                            {statusConfig.label}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                        {promo.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                                        {promo.description}
                                    </p>

                                    {/* Code */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-white">
                                            {promo.code}
                                        </div>
                                        <button
                                            onClick={() => copyCode(promo.code)}
                                            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                            title="Copier le code"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Info */}
                                    <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        <p className="flex items-center gap-2">
                                            <span className="font-medium">Restaurant:</span>
                                            {promo.restaurant}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            {new Date(promo.start_date).toLocaleDateString('fr-FR')} - {new Date(promo.end_date).toLocaleDateString('fr-FR')}
                                        </p>
                                    </div>

                                    {/* Usage */}
                                    {promo.max_uses && (
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between text-sm mb-1">
                                                <span className="text-gray-500 dark:text-gray-400">Utilisations</span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {promo.usage_count} / {promo.max_uses}
                                                </span>
                                            </div>
                                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${usagePercentage! > 80 ? 'bg-gray-900' :
                                                        usagePercentage! > 50 ? 'bg-gray-700' :
                                                            'bg-gray-500'
                                                        }`}
                                                    style={{ width: `${usagePercentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openViewModal(promo)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                title="Voir"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => openEditModal(promo)}
                                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                                title="Modifier"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            {(promo.status === 'active' || promo.status === 'paused') && (
                                                <button
                                                    onClick={() => handleToggleStatus(promo)}
                                                    className={`p-2 rounded-lg transition-colors ${promo.status === 'active' ? 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30' : 'text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30'}`}
                                                    title={promo.status === 'active' ? 'Mettre en pause' : 'Activer'}
                                                >
                                                    {promo.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                                </button>
                                            )}
                                            <button
                                                onClick={() => openDeleteDialog(promo)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                title="Supprimer"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {DISCOUNT_TYPE_LABELS[promo.discount_type]}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination info */}
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <p>
                    Affichage de <span className="font-medium">{filteredPromotions.length}</span> promotions sur <span className="font-medium">{promotions.length}</span>
                </p>
            </div>

            {/* Create Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Créer une promotion"
                size="lg"
            >
                <PromotionForm
                    onSubmit={handleCreate}
                    onCancel={() => setIsCreateModalOpen(false)}
                />
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedPromotion(null);
                }}
                title="Modifier la promotion"
                size="lg"
            >
                <PromotionForm
                    promotion={selectedPromotion}
                    onSubmit={handleEdit}
                    onCancel={() => {
                        setIsEditModalOpen(false);
                        setSelectedPromotion(null);
                    }}
                />
            </Modal>

            {/* View Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedPromotion(null);
                }}
                title="Détails de la promotion"
                size="md"
            >
                {selectedPromotion && (
                    <PromotionDetail
                        promotion={selectedPromotion}
                        onClose={() => {
                            setIsViewModalOpen(false);
                            setSelectedPromotion(null);
                        }}
                    />
                )}
            </Modal>

            {/* Delete Dialog */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setSelectedPromotion(null);
                }}
                onConfirm={handleDelete}
                title="Supprimer la promotion"
                message={`Êtes-vous sûr de vouloir supprimer "${selectedPromotion?.name}" ? Cette action est irréversible.`}
                confirmText="Supprimer"
                type="danger"
            />

            {/* Toast Container */}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
    );
}

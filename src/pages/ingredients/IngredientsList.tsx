import { useState } from 'react';
import {
    ChefHat,
    Search,
    Plus,
    Package,
    AlertTriangle,
    CheckCircle,
    Edit,
    Trash2,
    Eye,
    TrendingUp,
    TrendingDown,
    BarChart3
} from 'lucide-react';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { ToastContainer, useToast } from '../../components/ui/Toast';

// ============================================
// TYPES
// ============================================

interface Ingredient {
    id: string;
    name: string;
    category: string;
    unit: string;
    stock_quantity: number;
    min_stock: number;
    price_per_unit: number;
    supplier: string;
    last_restock: string;
}

// ============================================
// DONNÉES MOCKÉES INITIALES
// ============================================

const INITIAL_INGREDIENTS: Ingredient[] = [
    {
        id: '1',
        name: 'Tomates fraîches',
        category: 'Légumes',
        unit: 'kg',
        stock_quantity: 150,
        min_stock: 50,
        price_per_unit: 500,
        supplier: 'Ferme Bio Togo',
        last_restock: '2024-12-10'
    },
    {
        id: '2',
        name: 'Poulet fermier',
        category: 'Viandes',
        unit: 'kg',
        stock_quantity: 45,
        min_stock: 30,
        price_per_unit: 3500,
        supplier: 'Élevage du Nord',
        last_restock: '2024-12-12'
    },
    {
        id: '3',
        name: 'Huile de palme',
        category: 'Huiles',
        unit: 'L',
        stock_quantity: 80,
        min_stock: 40,
        price_per_unit: 1200,
        supplier: 'Palmier d\'Or',
        last_restock: '2024-12-08'
    },
    {
        id: '4',
        name: 'Riz parfumé',
        category: 'Céréales',
        unit: 'kg',
        stock_quantity: 200,
        min_stock: 100,
        price_per_unit: 800,
        supplier: 'Import Asie',
        last_restock: '2024-12-05'
    },
    {
        id: '5',
        name: 'Piment frais',
        category: 'Épices',
        unit: 'kg',
        stock_quantity: 15,
        min_stock: 20,
        price_per_unit: 2000,
        supplier: 'Épices du Sahel',
        last_restock: '2024-12-01'
    },
    {
        id: '6',
        name: 'Poisson fumé',
        category: 'Poissons',
        unit: 'kg',
        stock_quantity: 35,
        min_stock: 25,
        price_per_unit: 4500,
        supplier: 'Pêcherie Côtière',
        last_restock: '2024-12-11'
    },
    {
        id: '7',
        name: 'Oignons',
        category: 'Légumes',
        unit: 'kg',
        stock_quantity: 120,
        min_stock: 60,
        price_per_unit: 400,
        supplier: 'Ferme Bio Togo',
        last_restock: '2024-12-09'
    },
    {
        id: '8',
        name: 'Farine de blé',
        category: 'Céréales',
        unit: 'kg',
        stock_quantity: 5,
        min_stock: 50,
        price_per_unit: 600,
        supplier: 'Moulins Réunis',
        last_restock: '2024-11-28'
    },
];

const CATEGORY_COLORS: Record<string, string> = {
    'Légumes': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'Viandes': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    'Huiles': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    'Céréales': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'Épices': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    'Poissons': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

const CATEGORIES = ['Légumes', 'Viandes', 'Huiles', 'Céréales', 'Épices', 'Poissons'];
const UNITS = ['kg', 'L', 'g', 'ml', 'unité'];

// ============================================
// COMPOSANT FORMULAIRE INGRÉDIENT
// ============================================

interface IngredientFormProps {
    ingredient?: Ingredient | null;
    onSubmit: (data: Omit<Ingredient, 'id'>) => void;
    onCancel: () => void;
}

function IngredientForm({ ingredient, onSubmit, onCancel }: IngredientFormProps) {
    const [formData, setFormData] = useState({
        name: ingredient?.name || '',
        category: ingredient?.category || 'Légumes',
        unit: ingredient?.unit || 'kg',
        stock_quantity: ingredient?.stock_quantity || 0,
        min_stock: ingredient?.min_stock || 0,
        price_per_unit: ingredient?.price_per_unit || 0,
        supplier: ingredient?.supplier || '',
        last_restock: ingredient?.last_restock || new Date().toISOString().split('T')[0],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nom de l'ingrédient
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Catégorie
                    </label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Unité
                    </label>
                    <select
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        {UNITS.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Quantité en stock
                    </label>
                    <input
                        type="number"
                        value={formData.stock_quantity}
                        onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        min="0"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Stock minimum
                    </label>
                    <input
                        type="number"
                        value={formData.min_stock}
                        onChange={(e) => setFormData({ ...formData, min_stock: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        min="0"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Prix unitaire (FCFA)
                    </label>
                    <input
                        type="number"
                        value={formData.price_per_unit}
                        onChange={(e) => setFormData({ ...formData, price_per_unit: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        min="0"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Dernier réapprovisionnement
                    </label>
                    <input
                        type="date"
                        value={formData.last_restock}
                        onChange={(e) => setFormData({ ...formData, last_restock: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Fournisseur
                </label>
                <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    required
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
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-medium transition-all"
                >
                    {ingredient ? 'Modifier' : 'Créer'}
                </button>
            </div>
        </form>
    );
}

// ============================================
// COMPOSANT DÉTAIL INGRÉDIENT
// ============================================

interface IngredientDetailProps {
    ingredient: Ingredient;
    onClose: () => void;
}

function IngredientDetail({ ingredient, onClose }: IngredientDetailProps) {
    const getStockStatus = (current: number, min: number) => {
        const percentage = (current / min) * 100;
        if (percentage < 50) return { status: 'critical', label: 'Critique', color: 'text-red-500' };
        if (percentage < 100) return { status: 'low', label: 'Bas', color: 'text-orange-500' };
        return { status: 'good', label: 'OK', color: 'text-green-500' };
    };

    const stockStatus = getStockStatus(ingredient.stock_quantity, ingredient.min_stock);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white">
                    <ChefHat className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {ingredient.name}
                    </h3>
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[ingredient.category]}`}>
                        {ingredient.category}
                    </span>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Stock actuel</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {ingredient.stock_quantity} <span className="text-sm font-normal">{ingredient.unit}</span>
                    </p>
                    <p className={`text-sm ${stockStatus.color} flex items-center gap-1 mt-1`}>
                        {stockStatus.status === 'critical' && <AlertTriangle className="w-4 h-4" />}
                        {stockStatus.status === 'low' && <TrendingDown className="w-4 h-4" />}
                        {stockStatus.status === 'good' && <CheckCircle className="w-4 h-4" />}
                        {stockStatus.label}
                    </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Prix unitaire</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {ingredient.price_per_unit.toLocaleString()} <span className="text-sm font-normal">FCFA/{ingredient.unit}</span>
                    </p>
                </div>
            </div>

            {/* Infos */}
            <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Stock minimum</span>
                    <span className="font-medium text-gray-900 dark:text-white">{ingredient.min_stock} {ingredient.unit}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Fournisseur</span>
                    <span className="font-medium text-gray-900 dark:text-white">{ingredient.supplier}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Dernier réappro</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(ingredient.last_restock).toLocaleDateString('fr-FR')}
                    </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Valeur stock</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                        {(ingredient.stock_quantity * ingredient.price_per_unit).toLocaleString()} FCFA
                    </span>
                </div>
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

export default function IngredientsList() {
    const [ingredients, setIngredients] = useState<Ingredient[]>(INITIAL_INGREDIENTS);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    // Modals state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);

    // Toast
    const { toasts, addToast, removeToast } = useToast();

    const filteredIngredients = ingredients.filter(ingredient => {
        const matchesSearch = ingredient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ingredient.supplier.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || ingredient.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getStockStatus = (current: number, min: number) => {
        const percentage = (current / min) * 100;
        if (percentage < 50) return { status: 'critical', label: 'Critique', color: 'text-red-500', bg: 'bg-red-500' };
        if (percentage < 100) return { status: 'low', label: 'Bas', color: 'text-orange-500', bg: 'bg-orange-500' };
        return { status: 'good', label: 'OK', color: 'text-green-500', bg: 'bg-green-500' };
    };

    const lowStockCount = ingredients.filter(i => i.stock_quantity < i.min_stock).length;
    const totalValue = ingredients.reduce((sum, i) => sum + (i.stock_quantity * i.price_per_unit), 0);
    const categories = ['all', ...new Set(ingredients.map(i => i.category))];

    // CRUD Operations
    const handleCreate = (data: Omit<Ingredient, 'id'>) => {
        const newIngredient: Ingredient = {
            ...data,
            id: Date.now().toString(),
        };
        setIngredients([...ingredients, newIngredient]);
        setIsCreateModalOpen(false);
        addToast('success', `Ingrédient "${data.name}" ajouté avec succès`);
    };

    const handleEdit = (data: Omit<Ingredient, 'id'>) => {
        if (!selectedIngredient) return;
        const updatedIngredients = ingredients.map(i =>
            i.id === selectedIngredient.id ? { ...i, ...data } : i
        );
        setIngredients(updatedIngredients);
        setIsEditModalOpen(false);
        setSelectedIngredient(null);
        addToast('success', `Ingrédient "${data.name}" modifié avec succès`);
    };

    const handleDelete = () => {
        if (!selectedIngredient) return;
        setIngredients(ingredients.filter(i => i.id !== selectedIngredient.id));
        addToast('success', `Ingrédient "${selectedIngredient.name}" supprimé`);
        setSelectedIngredient(null);
    };

    const openEditModal = (ingredient: Ingredient) => {
        setSelectedIngredient(ingredient);
        setIsEditModalOpen(true);
    };

    const openViewModal = (ingredient: Ingredient) => {
        setSelectedIngredient(ingredient);
        setIsViewModalOpen(true);
    };

    const openDeleteDialog = (ingredient: Ingredient) => {
        setSelectedIngredient(ingredient);
        setIsDeleteDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <ChefHat className="w-8 h-8 text-primary" />
                        Gestion des Ingrédients
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Gérez votre inventaire et les stocks
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                >
                    <Plus className="w-5 h-5" />
                    Ajouter un ingrédient
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Ingrédients</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{ingredients.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Stock Bas</p>
                            <p className="text-xl font-bold text-red-600">{lowStockCount}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <BarChart3 className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Valeur Stock</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{(totalValue / 1000).toFixed(0)}k FCFA</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Catégories</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{categories.length - 1}</p>
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
                            placeholder="Rechercher un ingrédient..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                    </div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                        <option value="all">Toutes catégories</option>
                        {categories.filter(c => c !== 'all').map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Ingredients Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Ingrédient
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Catégorie
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Statut
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Prix unitaire
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Fournisseur
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredIngredients.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        Aucun ingrédient trouvé
                                    </td>
                                </tr>
                            ) : (
                                filteredIngredients.map((ingredient) => {
                                    const stockStatus = getStockStatus(ingredient.stock_quantity, ingredient.min_stock);
                                    const stockPercentage = Math.min((ingredient.stock_quantity / ingredient.min_stock) * 100, 100);

                                    return (
                                        <tr key={ingredient.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white">
                                                        <ChefHat className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {ingredient.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            Dernier réappro: {new Date(ingredient.last_restock).toLocaleDateString('fr-FR')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[ingredient.category] || 'bg-gray-100 text-gray-700'}`}>
                                                    {ingredient.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="w-32">
                                                    <div className="flex items-center justify-between text-sm mb-1">
                                                        <span className="font-medium text-gray-900 dark:text-white">
                                                            {ingredient.stock_quantity} {ingredient.unit}
                                                        </span>
                                                        <span className="text-gray-500 text-xs">
                                                            min: {ingredient.min_stock}
                                                        </span>
                                                    </div>
                                                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all ${stockStatus.bg}`}
                                                            style={{ width: `${stockPercentage}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1 text-sm ${stockStatus.color}`}>
                                                    {stockStatus.status === 'critical' && <AlertTriangle className="w-4 h-4" />}
                                                    {stockStatus.status === 'low' && <TrendingDown className="w-4 h-4" />}
                                                    {stockStatus.status === 'good' && <CheckCircle className="w-4 h-4" />}
                                                    {stockStatus.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {ingredient.price_per_unit.toLocaleString()} FCFA/{ingredient.unit}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {ingredient.supplier}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openViewModal(ingredient)}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                        title="Voir"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => openEditModal(ingredient)}
                                                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                                        title="Modifier"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteDialog(ingredient)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Affichage de <span className="font-medium">{filteredIngredients.length}</span> ingrédients sur <span className="font-medium">{ingredients.length}</span>
                    </p>
                </div>
            </div>

            {/* Create Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Ajouter un ingrédient"
                size="lg"
            >
                <IngredientForm
                    onSubmit={handleCreate}
                    onCancel={() => setIsCreateModalOpen(false)}
                />
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedIngredient(null);
                }}
                title="Modifier l'ingrédient"
                size="lg"
            >
                <IngredientForm
                    ingredient={selectedIngredient}
                    onSubmit={handleEdit}
                    onCancel={() => {
                        setIsEditModalOpen(false);
                        setSelectedIngredient(null);
                    }}
                />
            </Modal>

            {/* View Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedIngredient(null);
                }}
                title="Détails de l'ingrédient"
                size="md"
            >
                {selectedIngredient && (
                    <IngredientDetail
                        ingredient={selectedIngredient}
                        onClose={() => {
                            setIsViewModalOpen(false);
                            setSelectedIngredient(null);
                        }}
                    />
                )}
            </Modal>

            {/* Delete Dialog */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setSelectedIngredient(null);
                }}
                onConfirm={handleDelete}
                title="Supprimer l'ingrédient"
                message={`Êtes-vous sûr de vouloir supprimer "${selectedIngredient?.name}" ? Cette action est irréversible.`}
                confirmText="Supprimer"
                type="danger"
            />

            {/* Toast Container */}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
    );
}

import { useState } from 'react';
import {
    Utensils,
    Search,
    Plus,
    MapPin,
    Star,
    Clock,
    Phone,
    CheckCircle,
    XCircle,
    Edit,
    Trash2,
    Eye,
    Filter
} from 'lucide-react';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { ToastContainer, useToast } from '../../components/ui/Toast';

// ============================================
// TYPES
// ============================================

interface Restaurant {
    id: string;
    name: string;
    address: string;
    phone: string;
    cuisine: string;
    rating: number;
    reviews: number;
    is_verified: boolean;
    is_open: boolean;
    opening_hours: string;
    image: string;
}

// ============================================
// DONNÉES MOCKÉES INITIALES
// ============================================

const INITIAL_RESTAURANTS: Restaurant[] = [
    {
        id: '1',
        name: 'Le Petit Bistro',
        address: '123 Rue du Commerce, Lomé',
        phone: '+228 90 12 34 56',
        cuisine: 'Française',
        rating: 4.8,
        reviews: 234,
        is_verified: true,
        is_open: true,
        opening_hours: '08:00 - 22:00',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop'
    },
    {
        id: '2',
        name: 'Pizza Palace',
        address: '45 Avenue de la Liberté, Lomé',
        phone: '+228 91 23 45 67',
        cuisine: 'Italienne',
        rating: 4.5,
        reviews: 189,
        is_verified: true,
        is_open: true,
        opening_hours: '10:00 - 23:00',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop'
    },
    {
        id: '3',
        name: 'Sushi Master',
        address: '78 Boulevard Maritime, Lomé',
        phone: '+228 92 34 56 78',
        cuisine: 'Japonaise',
        rating: 4.9,
        reviews: 312,
        is_verified: true,
        is_open: false,
        opening_hours: '11:00 - 21:00',
        image: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=200&h=200&fit=crop'
    },
    {
        id: '4',
        name: 'Chez Mama',
        address: '56 Rue des Palmiers, Lomé',
        phone: '+228 93 45 67 89',
        cuisine: 'Africaine',
        rating: 4.7,
        reviews: 456,
        is_verified: false,
        is_open: true,
        opening_hours: '07:00 - 20:00',
        image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200&h=200&fit=crop'
    },
    {
        id: '5',
        name: 'Burger Express',
        address: '89 Avenue du 13 Janvier, Lomé',
        phone: '+228 94 56 78 90',
        cuisine: 'Américaine',
        rating: 4.3,
        reviews: 167,
        is_verified: true,
        is_open: true,
        opening_hours: '09:00 - 00:00',
        image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=200&h=200&fit=crop'
    },
    {
        id: '6',
        name: 'Wok & Roll',
        address: '34 Rue du Marché, Lomé',
        phone: '+228 95 67 89 01',
        cuisine: 'Asiatique',
        rating: 4.6,
        reviews: 278,
        is_verified: true,
        is_open: true,
        opening_hours: '11:30 - 22:30',
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&h=200&fit=crop'
    },
];

const CUISINE_COLORS: Record<string, string> = {
    'Française': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Italienne': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'Japonaise': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    'Africaine': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    'Américaine': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    'Asiatique': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

const CUISINES = ['Française', 'Italienne', 'Japonaise', 'Africaine', 'Américaine', 'Asiatique', 'Mexicaine', 'Indienne'];

// Images par défaut pour les restaurants
const DEFAULT_IMAGES = [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=200&h=200&fit=crop',
];

// ============================================
// COMPOSANT FORMULAIRE RESTAURANT
// ============================================

interface RestaurantFormProps {
    restaurant?: Restaurant | null;
    onSubmit: (data: Omit<Restaurant, 'id' | 'rating' | 'reviews'>) => void;
    onCancel: () => void;
}

function RestaurantForm({ restaurant, onSubmit, onCancel }: RestaurantFormProps) {
    const [formData, setFormData] = useState({
        name: restaurant?.name || '',
        address: restaurant?.address || '',
        phone: restaurant?.phone || '',
        cuisine: restaurant?.cuisine || 'Française',
        is_verified: restaurant?.is_verified || false,
        is_open: restaurant?.is_open || true,
        opening_hours: restaurant?.opening_hours || '08:00 - 22:00',
        image: restaurant?.image || DEFAULT_IMAGES[Math.floor(Math.random() * DEFAULT_IMAGES.length)],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nom du restaurant
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
                    Adresse
                </label>
                <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Téléphone
                    </label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Type de cuisine
                    </label>
                    <select
                        value={formData.cuisine}
                        onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        {CUISINES.map(cuisine => (
                            <option key={cuisine} value={cuisine}>{cuisine}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Horaires d'ouverture
                </label>
                <input
                    type="text"
                    value={formData.opening_hours}
                    onChange={(e) => setFormData({ ...formData, opening_hours: e.target.value })}
                    placeholder="Ex: 08:00 - 22:00"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    URL de l'image
                </label>
                <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="is_verified"
                        checked={formData.is_verified}
                        onChange={(e) => setFormData({ ...formData, is_verified: e.target.checked })}
                        className="w-4 h-4 text-primary rounded focus:ring-primary"
                    />
                    <label htmlFor="is_verified" className="text-sm text-gray-700 dark:text-gray-300">
                        Restaurant vérifié
                    </label>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="is_open"
                        checked={formData.is_open}
                        onChange={(e) => setFormData({ ...formData, is_open: e.target.checked })}
                        className="w-4 h-4 text-primary rounded focus:ring-primary"
                    />
                    <label htmlFor="is_open" className="text-sm text-gray-700 dark:text-gray-300">
                        Actuellement ouvert
                    </label>
                </div>
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
                    {restaurant ? 'Modifier' : 'Créer'}
                </button>
            </div>
        </form>
    );
}

// ============================================
// COMPOSANT DÉTAIL RESTAURANT
// ============================================

interface RestaurantDetailProps {
    restaurant: Restaurant;
    onClose: () => void;
}

function RestaurantDetail({ restaurant, onClose }: RestaurantDetailProps) {
    return (
        <div className="space-y-6">
            {/* Image */}
            <div className="relative h-48 rounded-xl overflow-hidden">
                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                    <h3 className="text-xl font-bold text-white">{restaurant.name}</h3>
                    <span className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-medium ${CUISINE_COLORS[restaurant.cuisine] || 'bg-gray-100 text-gray-700'}`}>
                        {restaurant.cuisine}
                    </span>
                </div>
                <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-white/90 rounded-full">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold">{restaurant.rating}</span>
                    <span className="text-xs text-gray-500">({restaurant.reviews})</span>
                </div>
            </div>

            {/* Status badges */}
            <div className="flex gap-2">
                {restaurant.is_verified && (
                    <span className="flex items-center gap-1 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium rounded-full">
                        <CheckCircle className="w-4 h-4" />
                        Vérifié
                    </span>
                )}
                <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${restaurant.is_open ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                    {restaurant.is_open ? 'Ouvert' : 'Fermé'}
                </span>
            </div>

            {/* Infos */}
            <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Adresse</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{restaurant.address}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Téléphone</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{restaurant.phone}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Horaires</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{restaurant.opening_hours}</p>
                    </div>
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

export default function RestaurantsList() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedCuisine, setSelectedCuisine] = useState<string>('all');

    // Modals state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    // Toast
    const { toasts, addToast, removeToast } = useToast();

    const filteredRestaurants = restaurants.filter(restaurant => {
        const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
            restaurant.address.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCuisine = selectedCuisine === 'all' || restaurant.cuisine === selectedCuisine;
        return matchesSearch && matchesCuisine;
    });

    const cuisines = ['all', ...new Set(restaurants.map(r => r.cuisine))];

    // CRUD Operations
    const handleCreate = (data: Omit<Restaurant, 'id' | 'rating' | 'reviews'>) => {
        const newRestaurant: Restaurant = {
            ...data,
            id: Date.now().toString(),
            rating: 4.0 + Math.random() * 0.9,
            reviews: Math.floor(Math.random() * 100),
        };
        newRestaurant.rating = Math.round(newRestaurant.rating * 10) / 10;
        setRestaurants([...restaurants, newRestaurant]);
        setIsCreateModalOpen(false);
        addToast('success', `Restaurant "${data.name}" ajouté avec succès`);
    };

    const handleEdit = (data: Omit<Restaurant, 'id' | 'rating' | 'reviews'>) => {
        if (!selectedRestaurant) return;
        const updatedRestaurants = restaurants.map(r =>
            r.id === selectedRestaurant.id ? { ...r, ...data } : r
        );
        setRestaurants(updatedRestaurants);
        setIsEditModalOpen(false);
        setSelectedRestaurant(null);
        addToast('success', `Restaurant "${data.name}" modifié avec succès`);
    };

    const handleDelete = () => {
        if (!selectedRestaurant) return;
        setRestaurants(restaurants.filter(r => r.id !== selectedRestaurant.id));
        addToast('success', `Restaurant "${selectedRestaurant.name}" supprimé`);
        setSelectedRestaurant(null);
    };

    const openEditModal = (restaurant: Restaurant) => {
        setSelectedRestaurant(restaurant);
        setIsEditModalOpen(true);
    };

    const openViewModal = (restaurant: Restaurant) => {
        setSelectedRestaurant(restaurant);
        setIsViewModalOpen(true);
    };

    const openDeleteDialog = (restaurant: Restaurant) => {
        setSelectedRestaurant(restaurant);
        setIsDeleteDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <Utensils className="w-8 h-8 text-primary" />
                        Gestion des Restaurants
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        {restaurants.length} restaurants enregistrés
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                >
                    <Plus className="w-5 h-5" />
                    Ajouter un restaurant
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un restaurant, cuisine, adresse..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors ${showFilters ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                        >
                            <Filter className="w-4 h-4" />
                            Filtres
                        </button>
                        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filter options */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex flex-wrap gap-2">
                            {cuisines.map(cuisine => (
                                <button
                                    key={cuisine}
                                    onClick={() => setSelectedCuisine(cuisine)}
                                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${selectedCuisine === cuisine ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                >
                                    {cuisine === 'all' ? 'Toutes cuisines' : cuisine}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Empty state */}
            {filteredRestaurants.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
                    <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">Aucun restaurant trouvé</p>
                </div>
            ) : viewMode === 'grid' ? (
                /* Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredRestaurants.map((restaurant) => (
                        <div
                            key={restaurant.id}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                        >
                            {/* Image */}
                            <div className="relative h-48 bg-gradient-to-br from-purple-500 to-pink-500">
                                <img
                                    src={restaurant.image}
                                    alt={restaurant.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                                {/* Status badges */}
                                <div className="absolute top-3 left-3 flex gap-2">
                                    {restaurant.is_verified && (
                                        <span className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                                            <CheckCircle className="w-3 h-3" />
                                            Vérifié
                                        </span>
                                    )}
                                    <span className={`px-2 py-1 text-white text-xs font-medium rounded-full ${restaurant.is_open ? 'bg-green-500' : 'bg-red-500'}`}>
                                        {restaurant.is_open ? 'Ouvert' : 'Fermé'}
                                    </span>
                                </div>

                                {/* Rating */}
                                <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 dark:bg-gray-900/90 rounded-full">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{restaurant.rating}</span>
                                    <span className="text-xs text-gray-500">({restaurant.reviews})</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {restaurant.name}
                                        </h3>
                                        <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${CUISINE_COLORS[restaurant.cuisine] || 'bg-gray-100 text-gray-700'}`}>
                                            {restaurant.cuisine}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                                    <p className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 flex-shrink-0" />
                                        <span className="truncate">{restaurant.address}</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 flex-shrink-0" />
                                        {restaurant.opening_hours}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 flex-shrink-0" />
                                        {restaurant.phone}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openViewModal(restaurant)}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                            title="Voir"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => openEditModal(restaurant)}
                                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                            title="Modifier"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => openDeleteDialog(restaurant)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                            title="Supprimer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => openViewModal(restaurant)}
                                        className="text-sm text-primary font-medium hover:underline"
                                    >
                                        Voir détails →
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* List View */
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredRestaurants.map((restaurant) => (
                            <div key={restaurant.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center gap-4">
                                <img
                                    src={restaurant.image}
                                    alt={restaurant.name}
                                    className="w-16 h-16 rounded-xl object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{restaurant.name}</h3>
                                        {restaurant.is_verified && <CheckCircle className="w-4 h-4 text-green-500" />}
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{restaurant.address}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${CUISINE_COLORS[restaurant.cuisine]}`}>
                                    {restaurant.cuisine}
                                </span>
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span className="font-semibold">{restaurant.rating}</span>
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${restaurant.is_open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {restaurant.is_open ? 'Ouvert' : 'Fermé'}
                                </span>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => openViewModal(restaurant)}
                                        className="p-2 text-gray-400 hover:text-blue-600 rounded-lg transition-colors"
                                        title="Voir"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => openEditModal(restaurant)}
                                        className="p-2 text-gray-400 hover:text-green-600 rounded-lg transition-colors"
                                        title="Modifier"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => openDeleteDialog(restaurant)}
                                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                                        title="Supprimer"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Pagination info */}
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <p>
                    Affichage de <span className="font-medium">{filteredRestaurants.length}</span> restaurants sur <span className="font-medium">{restaurants.length}</span>
                </p>
            </div>

            {/* Create Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Ajouter un restaurant"
                size="lg"
            >
                <RestaurantForm
                    onSubmit={handleCreate}
                    onCancel={() => setIsCreateModalOpen(false)}
                />
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedRestaurant(null);
                }}
                title="Modifier le restaurant"
                size="lg"
            >
                <RestaurantForm
                    restaurant={selectedRestaurant}
                    onSubmit={handleEdit}
                    onCancel={() => {
                        setIsEditModalOpen(false);
                        setSelectedRestaurant(null);
                    }}
                />
            </Modal>

            {/* View Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedRestaurant(null);
                }}
                title="Détails du restaurant"
                size="md"
            >
                {selectedRestaurant && (
                    <RestaurantDetail
                        restaurant={selectedRestaurant}
                        onClose={() => {
                            setIsViewModalOpen(false);
                            setSelectedRestaurant(null);
                        }}
                    />
                )}
            </Modal>

            {/* Delete Dialog */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setSelectedRestaurant(null);
                }}
                onConfirm={handleDelete}
                title="Supprimer le restaurant"
                message={`Êtes-vous sûr de vouloir supprimer "${selectedRestaurant?.name}" ? Cette action est irréversible.`}
                confirmText="Supprimer"
                type="danger"
            />

            {/* Toast Container */}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
    );
}

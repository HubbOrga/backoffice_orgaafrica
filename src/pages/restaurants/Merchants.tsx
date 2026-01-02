import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Plus,
    MapPin,
    Star,
    Clock,
    Phone,
    CheckCircle,
    Edit,
    Trash2,
    Eye,
    Filter,
    LayoutDashboard,
    Mail,
    Table as TableIcon,
    X,
    Save,
    Store,
    Download
} from 'lucide-react';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { ToastContainer, useToast } from '../../components/ui/Toast';
import { cn } from '../../lib/utils';

// ============================================
// TYPES
// ============================================

import type { Restaurant, Table } from '../../types';
import { INITIAL_RESTAURANTS, MOCK_TABLES } from '../../data/mockData';

const CUISINE_COLORS: Record<string, string> = {
    'Française': 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100',
    'Italienne': 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100',
    'Japonaise': 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100',
    'Africaine': 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100',
    'Américaine': 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100',
    'Asiatique': 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100',
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

// ============================================
// SUB-COMPONENTS
// ============================================

function OpeningHoursEditor({ value, onChange }: { value: Record<string, string>, onChange: (val: Record<string, string>) => void }) {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayLabels: Record<string, string> = {
        monday: 'Lundi',
        tuesday: 'Mardi',
        wednesday: 'Mercredi',
        thursday: 'Jeudi',
        friday: 'Vendredi',
        saturday: 'Samedi',
        sunday: 'Dimanche'
    };

    const handleDayChange = (day: string, val: string) => {
        onChange({ ...value, [day]: val });
    };

    return (
        <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Horaires par jour</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                {days.map(day => (
                    <div key={day} className="flex items-center justify-between gap-4">
                        <span className="text-xs font-medium text-gray-500 w-20">{dayLabels[day]}</span>
                        <input
                            type="text"
                            value={value[day] || ''}
                            onChange={(e) => handleDayChange(day, e.target.value)}
                            placeholder="Ex: 08:00-22:00"
                            className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

function TableManager({ merchantId, tables, onUpdate }: { merchantId: string, tables: Table[], onUpdate: (tables: Table[]) => void }) {
    const [isAdding, setIsAdding] = useState(false);
    const [newTable, setNewTable] = useState({ tableNumber: '', capacity: 2 });

    const handleAdd = () => {
        if (!newTable.tableNumber) return;
        const table: Table = {
            id: `table-${Date.now()}`,
            merchantId,
            tableNumber: newTable.tableNumber,
            capacity: newTable.capacity,
            isAvailable: true,
            status: 'available'
        };
        onUpdate([...tables, table]);
        setNewTable({ tableNumber: '', capacity: 2 });
        setIsAdding(false);
    };

    const handleDelete = (id: string) => {
        onUpdate(tables.filter(t => t.id !== id));
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Gestion des Tables</h4>
                <button
                    type="button"
                    onClick={() => setIsAdding(true)}
                    className="p-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            {isAdding && (
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-end gap-3 animate-in slide-in-from-top-2">
                    <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-bold uppercase text-primary">N° Table</label>
                        <input
                            type="text"
                            value={newTable.tableNumber}
                            onChange={e => setNewTable({ ...newTable, tableNumber: e.target.value })}
                            className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Ex: 12"
                        />
                    </div>
                    <div className="w-24 space-y-2">
                        <label className="text-[10px] font-bold uppercase text-primary">Capacité</label>
                        <input
                            type="number"
                            value={newTable.capacity}
                            onChange={e => setNewTable({ ...newTable, capacity: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setIsAdding(false)} className="p-2 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                        <button onClick={handleAdd} className="p-2 text-primary hover:text-primary-dark"><CheckCircle className="w-5 h-5" /></button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {tables.map(table => (
                    <div key={table.id} className="p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center font-bold text-gray-600 dark:text-gray-300">
                                {table.tableNumber}
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase font-bold">Capacité</p>
                                <p className="text-xs font-bold text-gray-700 dark:text-gray-200">{table.capacity} pers.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleDelete(table.id)}
                            className="p-1.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

interface MerchantFormProps {
    merchant?: Restaurant | null;
    onSubmit: (data: Omit<Restaurant, 'id' | 'rating' | 'reviews'>) => void;
    onCancel: () => void;
}

function MerchantForm({ merchant, onSubmit, onCancel }: MerchantFormProps) {
    const [formData, setFormData] = useState({
        name: merchant?.name || '',
        description: merchant?.description || '',
        address: merchant?.address || '',
        phone: merchant?.phone || '',
        email: merchant?.contactEmail || '',
        cuisine: merchant?.cuisine || 'Française',
        is_verified: merchant?.is_verified || false,
        is_open: merchant?.is_open ?? true,
        openingHours: merchant?.openingHours || {
            monday: "08:00-22:00",
            tuesday: "08:00-22:00",
            wednesday: "08:00-22:00",
            thursday: "08:00-22:00",
            friday: "08:00-22:00",
            saturday: "09:00-23:00",
            sunday: "09:00-21:00"
        },
        image: merchant?.image || DEFAULT_IMAGES[Math.floor(Math.random() * DEFAULT_IMAGES.length)],
    });

    const [activeTab, setActiveTab] = useState<'general' | 'hours' | 'tables'>('general');
    const [tables, setTables] = useState<Table[]>(MOCK_TABLES.filter(t => t.merchantId === merchant?.id));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            contactEmail: formData.email,
            contactPhone: formData.phone || '',
            opening_hours: formData.openingHours.monday, // Fallback for legacy UI
        });
    };

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                <button
                    onClick={() => setActiveTab('general')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-xl transition-all",
                        activeTab === 'general' ? "bg-white dark:bg-gray-700 text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    <LayoutDashboard className="w-4 h-4" /> Général
                </button>
                <button
                    onClick={() => setActiveTab('hours')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-xl transition-all",
                        activeTab === 'hours' ? "bg-white dark:bg-gray-700 text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    <Clock className="w-4 h-4" /> Horaires
                </button>
                <button
                    onClick={() => setActiveTab('tables')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-xl transition-all",
                        activeTab === 'tables' ? "bg-white dark:bg-gray-700 text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    <TableIcon className="w-4 h-4" /> Tables
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {activeTab === 'general' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Nom de l'établissement</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Type de cuisine</label>
                                <select
                                    value={formData.cuisine}
                                    onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all"
                                >
                                    {CUISINES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all h-24 resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Adresse complète</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Email de contact</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Téléphone</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
                            <div className="flex-1">
                                <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Statut de vérification</p>
                                <p className="text-xs text-gray-500">Affiche le badge de confiance sur le profil</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={formData.is_verified}
                                onChange={(e) => setFormData({ ...formData, is_verified: e.target.checked })}
                                className="w-6 h-6 rounded-lg border-gray-300 text-primary focus:ring-primary"
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'hours' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2">
                        <OpeningHoursEditor
                            value={formData.openingHours}
                            onChange={(val) => setFormData({ ...formData, openingHours: val })}
                        />
                    </div>
                )}

                {activeTab === 'tables' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2">
                        <TableManager
                            merchantId={merchant?.id || 'new'}
                            tables={tables}
                            onUpdate={setTables}
                        />
                    </div>
                )}

                <div className="flex gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 px-6 py-4 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-2xl font-bold transition-all"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="flex-1 px-6 py-4 bg-primary text-white hover:opacity-90 rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        {merchant ? 'Enregistrer les modifications' : 'Créer l\'établissement'}
                    </button>
                </div>
            </form>
        </div>
    );
}

// ============================================
// COMPOSANT DÉTAIL RESTAURANT
// ============================================

interface MerchantDetailProps {
    merchant: Restaurant;
    onClose: () => void;
}

function MerchantDetail({ merchant, onClose }: MerchantDetailProps) {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayLabels: Record<string, string> = {
        monday: 'Lun', tuesday: 'Mar', wednesday: 'Mer', thursday: 'Jeu', friday: 'Ven', saturday: 'Sam', sunday: 'Dim'
    };

    return (
        <div className="space-y-6">
            {/* Image */}
            <div className="relative h-48 rounded-xl overflow-hidden">
                <img
                    src={merchant.image}
                    alt={merchant.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                    <h3 className="text-xl font-bold text-white">{merchant.name}</h3>
                    <span className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-medium ${merchant.cuisine ? (CUISINE_COLORS[merchant.cuisine] || 'bg-gray-100 text-gray-700') : 'bg-gray-100 text-gray-700'}`}>
                        {merchant.cuisine}
                    </span>
                </div>
                <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-white/90 rounded-full">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold">{merchant.rating}</span>
                    <span className="text-xs text-gray-500">({merchant.reviews})</span>
                </div>
            </div>

            {/* Status badges */}
            <div className="flex gap-2">
                {merchant.is_verified && (
                    <span className="flex items-center gap-1 px-3 py-1.5 bg-gray-900 text-white dark:bg-white dark:text-black text-sm font-medium rounded-full">
                        <CheckCircle className="w-4 h-4" />
                        Vérifié
                    </span>
                )}
                <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${merchant.is_open ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100' : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                    {merchant.is_open ? 'Ouvert' : 'Fermé'}
                </span>
            </div>

            {/* Infos */}
            <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold">Adresse</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{merchant.address}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold">Téléphone</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{merchant.phone}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold">Email</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{merchant.contactEmail}</p>
                    </div>
                </div>
            </div>

            {/* Opening Hours Display */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-100 dark:border-gray-700">
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Horaires d'ouverture
                </h4>
                <div className="space-y-2">
                    {days.map(day => (
                        <div key={day} className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">{dayLabels[day]}</span>
                            <span className="font-bold text-gray-700 dark:text-gray-200">{merchant.openingHours[day] || 'Fermé'}</span>
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={onClose}
                className="w-full px-4 py-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl font-bold transition-all"
            >
                Fermer
            </button>
        </div>
    );
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export default function Merchants() {
    const navigate = useNavigate();
    const [merchants, setMerchants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedCuisine, setSelectedCuisine] = useState<string>('all');

    // Modals state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedMerchant, setSelectedMerchant] = useState<Restaurant | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    // Toast
    const { toasts, addToast, removeToast } = useToast();

    const filteredMerchants = merchants.filter(merchant => {
        const matchesSearch = merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (merchant.cuisine?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            merchant.address.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCuisine = selectedCuisine === 'all' || merchant.cuisine === selectedCuisine;
        return matchesSearch && matchesCuisine;
    });

    const cuisines = ['all', ...new Set(merchants.map(r => r.cuisine))];

    // CRUD Operations
    const handleCreate = (data: Omit<Restaurant, 'id' | 'rating' | 'reviews'>) => {
        const newMerchant: Restaurant = {
            ...data,
            id: Date.now().toString(),
            rating: 4.0 + Math.random() * 0.9,
            reviews: Math.floor(Math.random() * 100),
        };
        if (newMerchant.rating) {
            newMerchant.rating = Math.round(newMerchant.rating * 10) / 10;
        }
        setMerchants([...merchants, newMerchant]);
        setIsCreateModalOpen(false);
        addToast('success', `Établissement "${data.name}" ajouté avec succès`);
    };

    const handleEdit = (data: Omit<Restaurant, 'id' | 'rating' | 'reviews'>) => {
        if (!selectedMerchant) return;
        const updatedMerchants = merchants.map(m =>
            m.id === selectedMerchant.id ? { ...m, ...data } : m
        );
        setMerchants(updatedMerchants);
        setIsEditModalOpen(false);
        setSelectedMerchant(null);
        addToast('success', `Établissement "${data.name}" modifié avec succès`);
    };

    const handleDelete = () => {
        if (!selectedMerchant) return;
        setMerchants(merchants.filter(m => m.id !== selectedMerchant.id));
        addToast('success', `Établissement "${selectedMerchant.name}" supprimé`);
        setSelectedMerchant(null);
    };

    const openEditModal = (merchant: Restaurant) => {
        setSelectedMerchant(merchant);
        setIsEditModalOpen(true);
    };

    const openViewModal = (merchant: Restaurant) => {
        setSelectedMerchant(merchant);
        setIsViewModalOpen(true);
    };

    const openDeleteDialog = (merchant: Restaurant) => {
        setSelectedMerchant(merchant);
        setIsDeleteDialogOpen(true);
    };

    const handleExport = () => {
        const headers = ['Nom', 'Cuisine', 'Adresse', 'Téléphone', 'Email', 'Note', 'Avis', 'Statut', 'Vérifié'];
        const csvContent = [
            headers.join(','),
            ...filteredMerchants.map(m => [
                `"${m.name}"`,
                `"${m.cuisine || ''}"`,
                `"${m.address}"`,
                `"${m.phone}"`,
                `"${m.contactEmail}"`,
                `"${m.rating}"`,
                `"${m.reviews}"`,
                `"${m.is_open ? 'Ouvert' : 'Fermé'}"`,
                `"${m.is_verified ? 'Oui' : 'Non'}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'etablissements_export.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <Store className="w-8 h-8 text-primary" />
                        Gestion des Établissements
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        {merchants.length} marchands enregistrés
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExport}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-xl transition-all duration-300"
                    >
                        <Download className="w-5 h-5" />
                        Exporter
                    </button>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground hover:opacity-90 font-medium rounded-xl transition-all duration-300 shadow-lg"
                    >
                        <Plus className="w-5 h-5" />
                        Ajouter un établissement
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un établissement, cuisine, adresse..."
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
                                    onClick={() => setSelectedCuisine(cuisine || 'all')}
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
            {filteredMerchants.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
                    <Store className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">Aucun établissement trouvé</p>
                </div>
            ) : viewMode === 'grid' ? (
                /* Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredMerchants.map((merchant) => (
                        <div
                            key={merchant.id}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                        >
                            {/* Image */}
                            <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                                <img
                                    src={merchant.image}
                                    alt={merchant.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                                {/* Status badges */}
                                <div className="absolute top-3 left-3 flex gap-2">
                                    {merchant.is_verified && (
                                        <span className="flex items-center gap-1 px-2 py-1 bg-black text-white dark:bg-white dark:text-black text-xs font-medium rounded-full">
                                            <CheckCircle className="w-3 h-3" />
                                            Vérifié
                                        </span>
                                    )}
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${merchant.is_open ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}>
                                        {merchant.is_open ? 'Ouvert' : 'Fermé'}
                                    </span>
                                </div>

                                {/* Rating */}
                                <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 dark:bg-gray-900/90 rounded-full">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{merchant.rating}</span>
                                    <span className="text-xs text-gray-500">({merchant.reviews})</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {merchant.name}
                                        </h3>
                                        <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${merchant.cuisine ? (CUISINE_COLORS[merchant.cuisine] || 'bg-gray-100 text-gray-700') : 'bg-gray-100 text-gray-700'}`}>
                                            {merchant.cuisine}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                                    <p className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 flex-shrink-0" />
                                        <span className="truncate">{merchant.address}</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 flex-shrink-0" />
                                        {merchant.openingHours.monday}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 flex-shrink-0" />
                                        {merchant.phone}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openViewModal(merchant)}
                                            className="p-2 text-gray-400 hover:text-primary hover:bg-secondary rounded-lg transition-colors"
                                            title="Voir"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => openEditModal(merchant)}
                                            className="p-2 text-gray-400 hover:text-primary hover:bg-secondary rounded-lg transition-colors"
                                            title="Modifier"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => navigate(`/?merchant=${merchant.id}`)}
                                            className="p-2 text-gray-400 hover:text-primary hover:bg-secondary rounded-lg transition-colors"
                                            title="Dashboard"
                                        >
                                            <LayoutDashboard className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => openViewModal(merchant)}
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
                        {filteredMerchants.map((merchant) => (
                            <div key={merchant.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center gap-4">
                                <img
                                    src={merchant.image}
                                    alt={merchant.name}
                                    className="w-16 h-16 rounded-xl object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{merchant.name}</h3>
                                        {merchant.is_verified && <CheckCircle className="w-4 h-4 text-gray-900 dark:text-white" />}
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{merchant.address}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${merchant.cuisine ? CUISINE_COLORS[merchant.cuisine] : 'bg-gray-100 text-gray-800'}`}>
                                    {merchant.cuisine || 'Général'}
                                </span>
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span className="font-semibold">{merchant.rating}</span>
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${merchant.is_open ? 'bg-gray-100 text-gray-900' : 'bg-gray-200 text-gray-500'}`}>
                                    {merchant.is_open ? 'Ouvert' : 'Fermé'}
                                </span>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => openViewModal(merchant)}
                                        className="p-2 text-gray-400 hover:text-primary rounded-lg transition-colors"
                                        title="Voir"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => openEditModal(merchant)}
                                        className="p-2 text-gray-400 hover:text-primary rounded-lg transition-colors"
                                        title="Modifier"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => navigate(`/?merchant=${merchant.id}`)}
                                        className="p-2 text-gray-400 hover:text-primary rounded-lg transition-colors"
                                        title="Dashboard"
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => openDeleteDialog(merchant)}
                                        className="p-2 text-gray-400 hover:text-destructive rounded-lg transition-colors"
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
                    Affichage de <span className="font-medium">{filteredMerchants.length}</span> établissements sur <span className="font-medium">{merchants.length}</span>
                </p>
            </div>

            {/* Create Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Ajouter un établissement"
                size="lg"
            >
                <MerchantForm
                    onSubmit={handleCreate}
                    onCancel={() => setIsCreateModalOpen(false)}
                />
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedMerchant(null);
                }}
                title="Modifier l'établissement"
                size="lg"
            >
                <MerchantForm
                    merchant={selectedMerchant}
                    onSubmit={handleEdit}
                    onCancel={() => {
                        setIsEditModalOpen(false);
                        setSelectedMerchant(null);
                    }}
                />
            </Modal>

            {/* View Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedMerchant(null);
                }}
                title="Détails de l'établissement"
                size="md"
            >
                {selectedMerchant && (
                    <MerchantDetail
                        merchant={selectedMerchant}
                        onClose={() => {
                            setIsViewModalOpen(false);
                            setSelectedMerchant(null);
                        }}
                    />
                )}
            </Modal>

            {/* Delete Dialog */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setSelectedMerchant(null);
                }}
                onConfirm={handleDelete}
                title="Supprimer l'établissement"
                message={`Êtes-vous sûr de vouloir supprimer "${selectedMerchant?.name}" ? Cette action est irréversible.`}
                confirmText="Supprimer"
                type="danger"
            />

            {/* Toast Container */}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
    );
}

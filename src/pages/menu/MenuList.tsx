import { useState, useMemo } from 'react';
import {
    Utensils,
    Search,
    Plus,
    Edit,
    Trash2,
    Image as ImageIcon,
    CheckCircle,
    Clock,
    ChevronRight,
    Tag,
    Layers,
    PlusCircle,
    Download
} from 'lucide-react';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { ToastContainer, useToast } from '../../components/ui/Toast';
import { cn } from '../../lib/utils';

// ============================================
// TYPES & DATA
// ============================================

import type { MenuItem, Subcategory } from '../../types';
import { INITIAL_MENU_ITEMS, MOCK_CATEGORIES } from '../../data/mockData';
import { MOCK_SUPPLEMENTS } from '../../data/ordersData';

// ============================================
// COMPOSANT FORMULAIRE MENU ITEM
// ============================================

interface MenuItemFormProps {
    item?: MenuItem | null;
    onSubmit: (data: Omit<MenuItem, 'id'>) => void;
    onCancel: () => void;
}

function MenuItemForm({ item, onSubmit, onCancel }: MenuItemFormProps) {
    const [formData, setFormData] = useState<Omit<MenuItem, 'id'>>({
        merchantId: item?.merchantId || '1',
        categoryId: item?.categoryId || MOCK_CATEGORIES[0].id,
        subcategoryId: item?.subcategoryId || MOCK_CATEGORIES[0].subcategories?.[0].id || '',
        name: item?.name || '',
        description: item?.description || '',
        price: item?.price || 0,
        image: item?.image || '',
        isAvailable: item?.isAvailable ?? true,
        preparationTime: item?.preparationTime || 15,
        supplements: item?.supplements || [],
    });



    const selectedCategory = MOCK_CATEGORIES.find(c => c.id === formData.categoryId);
    const availableSubcategories = selectedCategory?.subcategories || [];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const toggleSupplement = (supId: string) => {
        const currentSups = [...(formData.supplements || [])];
        const index = currentSups.indexOf(supId);
        if (index > -1) {
            currentSups.splice(index, 1);
        } else {
            currentSups.push(supId);
        }
        setFormData({ ...formData, supplements: currentSups });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                            Nom du plat
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                            placeholder="Ex: Steak Frites Maison"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all h-24 resize-none"
                            placeholder="Décrivez le plat..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                                Prix (FCFA)
                            </label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                                min="0"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                                Temps prép. (min)
                            </label>
                            <input
                                type="number"
                                value={formData.preparationTime}
                                onChange={(e) => setFormData({ ...formData, preparationTime: Number(e.target.value) })}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                                min="1"
                            />
                        </div>
                    </div>
                </div>

                {/* Categorization & Image */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                            Catégorie
                        </label>
                        <select
                            value={formData.categoryId}
                            onChange={(e) => {
                                const catId = e.target.value;
                                const firstSub = MOCK_CATEGORIES.find(c => c.id === catId)?.subcategories?.[0]?.id || '';
                                setFormData({ ...formData, categoryId: catId, subcategoryId: firstSub });
                            }}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                        >
                            {MOCK_CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                            Sous-catégorie
                        </label>
                        <select
                            value={formData.subcategoryId}
                            onChange={(e) => setFormData({ ...formData, subcategoryId: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                            disabled={availableSubcategories.length === 0}
                        >
                            {availableSubcategories.map((sub: Subcategory) => (
                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                            URL de l'image
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                                placeholder="https://..."
                            />
                            {formData.image && (
                                <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200">
                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
                        <input
                            type="checkbox"
                            id="isAvailable"
                            checked={formData.isAvailable}
                            onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor="isAvailable" className="text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                            Disponible immédiatement
                        </label>
                    </div>
                </div>
            </div>

            {/* Supplements Section */}
            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <PlusCircle className="w-4 h-4" /> Suppléments Disponibles
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {MOCK_SUPPLEMENTS.map(sup => (
                        <button
                            key={sup.id}
                            type="button"
                            onClick={() => toggleSupplement(sup.id)}
                            className={cn(
                                "flex items-center justify-between px-4 py-3 rounded-2xl border transition-all text-left",
                                formData.supplements?.includes(sup.id)
                                    ? "bg-primary/10 border-primary text-primary"
                                    : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary/50"
                            )}
                        >
                            <div>
                                <p className="text-xs font-bold">{sup.name}</p>
                                <p className="text-[10px] opacity-70">+{sup.price} FCFA</p>
                            </div>
                            {formData.supplements?.includes(sup.id) && <CheckCircle className="w-4 h-4" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Actions */}
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
                    className="flex-1 px-6 py-4 bg-primary text-white hover:opacity-90 rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all"
                >
                    {item ? 'Enregistrer les modifications' : 'Créer le plat'}
                </button>
            </div>
        </form>
    );
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export default function MenuList() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');

    // Modals state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

    // Toast
    const { toasts, addToast, removeToast } = useToast();

    // Derived Data
    const availableSubcategories = useMemo(() => {
        if (selectedCategory === 'all') return [];
        return MOCK_CATEGORIES.find(c => c.id === selectedCategory)?.subcategories || [];
    }, [selectedCategory]);

    const filteredItems = useMemo(() => {
        return menuItems.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
            const matchesSubcategory = selectedSubcategory === 'all' || item.subcategoryId === selectedSubcategory;
            return matchesSearch && matchesCategory && matchesSubcategory;
        });
    }, [menuItems, searchQuery, selectedCategory, selectedSubcategory]);

    // CRUD Operations
    const handleCreate = (data: Omit<MenuItem, 'id'>) => {
        const newItem: MenuItem = {
            ...data,
            id: `menu-${Date.now()}`,
        };
        setMenuItems([...menuItems, newItem]);
        setIsCreateModalOpen(false);
        addToast('success', `Le plat "${data.name}" a été ajouté au catalogue`);
    };

    const handleEdit = (data: Omit<MenuItem, 'id'>) => {
        if (!selectedItem) return;
        const updatedItems = menuItems.map(i =>
            i.id === selectedItem.id ? { ...i, ...data } : i
        );
        setMenuItems(updatedItems);
        setIsEditModalOpen(false);
        setSelectedItem(null);
        addToast('success', `Le plat "${data.name}" a été mis à jour`);
    };

    const handleDelete = () => {
        if (!selectedItem) return;
        setMenuItems(menuItems.filter(i => i.id !== selectedItem.id));
        addToast('success', `Le plat "${selectedItem.name}" a été supprimé du catalogue`);
        setIsDeleteDialogOpen(false);
        setSelectedItem(null);
    };

    const handleExport = () => {
        const headers = ['Nom', 'Description', 'Prix', 'Catégorie', 'Sous-catégorie', 'Disponible', 'Temps de préparation'];
        const csvContent = [
            headers.join(','),
            ...filteredItems.map(item => {
                const category = MOCK_CATEGORIES.find(c => c.id === item.categoryId);
                const subcategory = category?.subcategories?.find((s: Subcategory) => s.id === item.subcategoryId);
                return [
                    `"${item.name}"`,
                    `"${item.description || ''}"`,
                    `"${item.price}"`,
                    `"${category?.name || ''}"`,
                    `"${subcategory?.name || ''}"`,
                    `"${item.isAvailable ? 'Oui' : 'Non'}"`,
                    `"${item.preparationTime}"`
                ].join(',');
            })
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'menu_export.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl">
                            <Utensils className="w-8 h-8 text-primary" />
                        </div>
                        Catalogue Menu
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
                        Gérez vos plats, catégories et suppléments
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExport}
                        className="inline-flex items-center gap-3 px-6 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 font-bold rounded-2xl transition-all shadow-xl shadow-gray-200/20 dark:shadow-none hover:scale-105 active:scale-95"
                    >
                        <Download className="w-6 h-6" />
                        Exporter
                    </button>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex items-center gap-3 px-6 py-4 bg-primary text-white hover:opacity-90 font-bold rounded-2xl transition-all shadow-xl shadow-primary/20 hover:scale-105 active:scale-95"
                    >
                        <Plus className="w-6 h-6" />
                        Ajouter un plat
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="glass-card rounded-[2.5rem] p-6 space-y-6 border border-gray-100 dark:border-gray-800 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="md:col-span-2 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un plat ou une description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="relative">
                        <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setSelectedSubcategory('all');
                            }}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer"
                        >
                            <option value="all">Toutes les catégories</option>
                            {MOCK_CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Subcategory Filter */}
                    <div className="relative">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                            value={selectedSubcategory}
                            onChange={(e) => setSelectedSubcategory(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer disabled:opacity-50"
                            disabled={selectedCategory === 'all'}
                        >
                            <option value="all">Toutes les sous-catégories</option>
                            {availableSubcategories.map((sub: Subcategory) => (
                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.length === 0 ? (
                    <div className="col-span-full py-20 text-center space-y-4">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                            <Search className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Aucun plat trouvé</h3>
                        <p className="text-gray-500">Essayez de modifier vos filtres ou votre recherche.</p>
                    </div>
                ) : (
                    filteredItems.map((item) => {
                        const category = MOCK_CATEGORIES.find(c => c.id === item.categoryId);
                        const subcategory = category?.subcategories?.find((s: Subcategory) => s.id === item.subcategoryId);

                        return (
                            <div
                                key={item.id}
                                className="group glass-card rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                            >
                                {/* Image Container */}
                                <div className="relative h-56 overflow-hidden">
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                            <ImageIcon className="w-12 h-12 text-gray-300" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4">
                                        <span className={cn(
                                            "px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg backdrop-blur-md",
                                            item.isAvailable
                                                ? "bg-emerald-500/90 text-white"
                                                : "bg-red-500/90 text-white"
                                        )}>
                                            {item.isAvailable ? 'Disponible' : 'Épuisé'}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-4 left-4">
                                        <span className="px-3 py-1.5 bg-black/50 backdrop-blur-md text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" /> {item.preparationTime} min
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 space-y-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                                            <span>{category?.name}</span>
                                            <ChevronRight className="w-3 h-3" />
                                            <span className="text-gray-400">{subcategory?.name}</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-900 dark:text-white line-clamp-1">{item.name}</h3>
                                    </div>

                                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 min-h-[2.5rem]">
                                        {item.description || 'Aucune description fournie.'}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <span className="text-2xl font-black text-gray-900 dark:text-white">
                                            {item.price.toLocaleString()} <span className="text-sm font-normal text-gray-400">FCFA</span>
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedItem(item);
                                                    setIsEditModalOpen(true);
                                                }}
                                                className="p-3 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-2xl transition-all"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedItem(item);
                                                    setIsDeleteDialogOpen(true);
                                                }}
                                                className="p-3 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Modals */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Ajouter un nouveau plat"
                size="xl"
            >
                <MenuItemForm
                    onSubmit={handleCreate}
                    onCancel={() => setIsCreateModalOpen(false)}
                />
            </Modal>

            <Modal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedItem(null);
                }}
                title="Modifier le plat"
                size="xl"
            >
                <MenuItemForm
                    item={selectedItem}
                    onSubmit={handleEdit}
                    onCancel={() => {
                        setIsEditModalOpen(false);
                        setSelectedItem(null);
                    }}
                />
            </Modal>

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setSelectedItem(null);
                }}
                onConfirm={handleDelete}
                title="Supprimer du catalogue"
                message={`Êtes-vous sûr de vouloir retirer "${selectedItem?.name}" du catalogue ? Cette action est irréversible.`}
                confirmText="Supprimer définitivement"
                type="danger"
            />

            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
    );
}

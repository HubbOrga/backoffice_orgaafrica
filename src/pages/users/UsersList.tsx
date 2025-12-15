import { useState } from 'react';
import {
    Users,
    Search,
    Plus,
    Mail,
    Phone,
    Shield,
    CheckCircle,
    XCircle,
    Edit,
    Trash2,
    Eye
} from 'lucide-react';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { ToastContainer, useToast } from '../../components/ui/Toast';

// ============================================
// TYPES
// ============================================

interface User {
    id: string;
    username: string;
    fullname: string;
    email: string;
    phone: string;
    role: string;
    email_verified: boolean;
    created_at: string;
    avatar: string | null;
}

// ============================================
// DONNÉES MOCKÉES INITIALES
// ============================================

const INITIAL_USERS: User[] = [
    {
        id: '1',
        username: 'john_doe',
        fullname: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+228 90 12 34 56',
        role: 'admin',
        email_verified: true,
        created_at: '2024-01-15',
        avatar: null
    },
    {
        id: '2',
        username: 'marie_curie',
        fullname: 'Marie Curie',
        email: 'marie.curie@email.com',
        phone: '+228 91 23 45 67',
        role: 'manager',
        email_verified: true,
        created_at: '2024-02-20',
        avatar: null
    },
    {
        id: '3',
        username: 'albert_e',
        fullname: 'Albert Einstein',
        email: 'albert.e@email.com',
        phone: '+228 92 34 56 78',
        role: 'user',
        email_verified: false,
        created_at: '2024-03-10',
        avatar: null
    },
    {
        id: '4',
        username: 'ada_love',
        fullname: 'Ada Lovelace',
        email: 'ada.love@email.com',
        phone: '+228 93 45 67 89',
        role: 'restaurant_owner',
        email_verified: true,
        created_at: '2024-03-25',
        avatar: null
    },
    {
        id: '5',
        username: 'nikola_t',
        fullname: 'Nikola Tesla',
        email: 'nikola.t@email.com',
        phone: '+228 94 56 78 90',
        role: 'user',
        email_verified: true,
        created_at: '2024-04-05',
        avatar: null
    },
];

const ROLE_BADGES: Record<string, { label: string; color: string }> = {
    admin: { label: 'Admin', color: 'bg-black text-white dark:bg-white dark:text-black' },
    manager: { label: 'Manager', color: 'bg-gray-800 text-white dark:bg-gray-200 dark:text-black' },
    restaurant_owner: { label: 'Propriétaire', color: 'bg-gray-600 text-white dark:bg-gray-400 dark:text-black' },
    user: { label: 'Utilisateur', color: 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100' },
};

const ROLES = [
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'restaurant_owner', label: 'Propriétaire' },
    { value: 'user', label: 'Utilisateur' },
];

// ============================================
// COMPOSANT FORMULAIRE UTILISATEUR
// ============================================

interface UserFormProps {
    user?: User | null;
    onSubmit: (data: Omit<User, 'id' | 'created_at'>) => void;
    onCancel: () => void;
}

function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
    const [formData, setFormData] = useState({
        username: user?.username || '',
        fullname: user?.fullname || '',
        email: user?.email || '',
        phone: user?.phone || '',
        role: user?.role || 'user',
        email_verified: user?.email_verified || false,
        avatar: user?.avatar || null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nom d'utilisateur
                    </label>
                    <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nom complet
                    </label>
                    <input
                        type="text"
                        value={formData.fullname}
                        onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                </label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Rôle
                    </label>
                    <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        {ROLES.map(role => (
                            <option key={role.value} value={role.value}>{role.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="email_verified"
                    checked={formData.email_verified}
                    onChange={(e) => setFormData({ ...formData, email_verified: e.target.checked })}
                    className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
                <label htmlFor="email_verified" className="text-sm text-gray-700 dark:text-gray-300">
                    Email vérifié
                </label>
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
                    {user ? 'Modifier' : 'Créer'}
                </button>
            </div>
        </form>
    );
}

// ============================================
// COMPOSANT DÉTAIL UTILISATEUR
// ============================================

interface UserDetailProps {
    user: User;
    onClose: () => void;
}

function UserDetail({ user, onClose }: UserDetailProps) {
    return (
        <div className="space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                    {user.fullname.charAt(0)}
                </div>
                <h3 className="mt-3 text-xl font-semibold text-gray-900 dark:text-white">
                    {user.fullname}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>
            </div>

            {/* Infos */}
            <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user.email}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Téléphone</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user.phone}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Rôle</p>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${ROLE_BADGES[user.role]?.color}`}>
                            {ROLE_BADGES[user.role]?.label}
                        </span>
                    </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="flex items-center gap-3">
                        {user.email_verified ? (
                            <CheckCircle className="w-5 h-5 text-gray-900 dark:text-white" />
                        ) : (
                            <XCircle className="w-5 h-5 text-gray-400" />
                        )}
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Statut email</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.email_verified ? 'Vérifié' : 'Non vérifié'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                Inscrit le {new Date(user.created_at).toLocaleDateString('fr-FR')}
            </p>

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

export default function UsersList() {
    const [users, setUsers] = useState<User[]>(INITIAL_USERS);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('all');

    // Modals state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Toast
    const { toasts, addToast, removeToast } = useToast();

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.username.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = selectedRole === 'all' || user.role === selectedRole;
        return matchesSearch && matchesRole;
    });

    // CRUD Operations
    const handleCreate = (data: Omit<User, 'id' | 'created_at'>) => {
        const newUser: User = {
            ...data,
            id: Date.now().toString(),
            created_at: new Date().toISOString().split('T')[0],
        };
        setUsers([...users, newUser]);
        setIsCreateModalOpen(false);
        addToast('success', `Utilisateur "${data.fullname}" créé avec succès`);
    };

    const handleEdit = (data: Omit<User, 'id' | 'created_at'>) => {
        if (!selectedUser) return;
        const updatedUsers = users.map(u =>
            u.id === selectedUser.id ? { ...u, ...data } : u
        );
        setUsers(updatedUsers);
        setIsEditModalOpen(false);
        setSelectedUser(null);
        addToast('success', `Utilisateur "${data.fullname}" modifié avec succès`);
    };

    const handleDelete = () => {
        if (!selectedUser) return;
        setUsers(users.filter(u => u.id !== selectedUser.id));
        addToast('success', `Utilisateur "${selectedUser.fullname}" supprimé`);
        setSelectedUser(null);
    };

    const openEditModal = (user: User) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const openViewModal = (user: User) => {
        setSelectedUser(user);
        setIsViewModalOpen(true);
    };

    const openDeleteDialog = (user: User) => {
        setSelectedUser(user);
        setIsDeleteDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <Users className="w-8 h-8 text-primary" />
                        Gestion des Utilisateurs
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Gérez les comptes utilisateurs et leurs permissions
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground hover:opacity-90 font-medium rounded-xl transition-all duration-300 shadow-lg"
                >
                    <Plus className="w-5 h-5" />
                    Ajouter un utilisateur
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un utilisateur..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                    </div>
                    {/* Role Filter */}
                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                        <option value="all">Tous les rôles</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="restaurant_owner">Propriétaire</option>
                        <option value="user">Utilisateur</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Utilisateur
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Rôle
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Statut
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Inscrit le
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        Aucun utilisateur trouvé
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                                                    {user.fullname.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {user.fullname}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        @{user.username}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-900 dark:text-white flex items-center gap-1">
                                                    <Mail className="w-3 h-3 text-gray-400" />
                                                    {user.email}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                    <Phone className="w-3 h-3" />
                                                    {user.phone}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${ROLE_BADGES[user.role]?.color || ROLE_BADGES.user.color}`}>
                                                <Shield className="w-3 h-3" />
                                                {ROLE_BADGES[user.role]?.label || 'Utilisateur'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.email_verified ? (
                                                <span className="inline-flex items-center gap-1 text-gray-900 dark:text-gray-100 text-sm">
                                                    <CheckCircle className="w-4 h-4" />
                                                    Vérifié
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                                                    <XCircle className="w-4 h-4" />
                                                    Non vérifié
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(user.created_at).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openViewModal(user)}
                                                    className="p-2 text-gray-400 hover:text-primary hover:bg-secondary rounded-lg transition-colors"
                                                    title="Voir"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    className="p-2 text-gray-400 hover:text-primary hover:bg-secondary rounded-lg transition-colors"
                                                    title="Modifier"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteDialog(user)}
                                                    className="p-2 text-gray-400 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Affichage de <span className="font-medium">{filteredUsers.length}</span> utilisateurs sur <span className="font-medium">{users.length}</span>
                    </p>
                </div>
            </div>

            {/* Create Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Ajouter un utilisateur"
                size="lg"
            >
                <UserForm
                    onSubmit={handleCreate}
                    onCancel={() => setIsCreateModalOpen(false)}
                />
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedUser(null);
                }}
                title="Modifier l'utilisateur"
                size="lg"
            >
                <UserForm
                    user={selectedUser}
                    onSubmit={handleEdit}
                    onCancel={() => {
                        setIsEditModalOpen(false);
                        setSelectedUser(null);
                    }}
                />
            </Modal>

            {/* View Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedUser(null);
                }}
                title="Détails de l'utilisateur"
                size="md"
            >
                {selectedUser && (
                    <UserDetail
                        user={selectedUser}
                        onClose={() => {
                            setIsViewModalOpen(false);
                            setSelectedUser(null);
                        }}
                    />
                )}
            </Modal>

            {/* Delete Dialog */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setSelectedUser(null);
                }}
                onConfirm={handleDelete}
                title="Supprimer l'utilisateur"
                message={`Êtes-vous sûr de vouloir supprimer "${selectedUser?.fullname}" ? Cette action est irréversible.`}
                confirmText="Supprimer"
                type="danger"
            />

            {/* Toast Container */}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
    );
}

import { useState } from 'react';
import {
    Users,
    Search,
    Plus,
    Shield,
    CheckCircle,
    XCircle,
    Edit,
    Trash2,
    Eye,
    Mail,
    Phone
} from 'lucide-react';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { ToastContainer, useToast } from '../../components/ui/Toast';

import type { User, StaffMember, MerchantRole } from '../../types';
import { INITIAL_USERS, MOCK_ROLES, ROLE_COLORS, MOCK_STAFF, MOCK_MERCHANT_ROLES, INITIAL_RESTAURANTS } from '../../data/mockData';
import { cn } from '../../lib/utils';
import { Store } from 'lucide-react';

// Helper to get role details
const getRoleDetails = (roleId: string) => {
    const role = MOCK_ROLES.find(r => r.id === roleId);
    return {
        label: role?.name || 'Inconnu',
        color: ROLE_COLORS[roleId] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    };
};

// ============================================
// COMPOSANT FORMULAIRE UTILISATEUR
// ============================================

interface UserFormData {
    username: string;
    fullname: string;
    email: string;
    phone: string;
    role: string;
    isActive: boolean;
    merchantId: string;
    merchantRoleId: string;
    firstName?: string;
    lastName?: string;
}

interface UserFormProps {
    user?: User | null;
    onSubmit: (data: UserFormData) => void;
    onCancel: () => void;
}

function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
    const [formData, setFormData] = useState<UserFormData>({
        username: user?.username || '',
        fullname: user?.fullname || '',
        email: user?.email || '',
        phone: user?.phone || '',
        role: user?.role || '5',
        isActive: user?.isActive ?? true,
        merchantId: '',
        merchantRoleId: '',
    });

    const [availableRoles, setAvailableRoles] = useState<MerchantRole[]>([]);

    const handleMerchantChange = (merchantId: string) => {
        setFormData({ ...formData, merchantId, merchantRoleId: '' });
        setAvailableRoles(MOCK_MERCHANT_ROLES.filter(r => r.merchantId === merchantId));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const [firstName, ...lastNameParts] = formData.fullname.split(' ');
        onSubmit({
            ...formData,
            firstName: firstName || '',
            lastName: lastNameParts.join(' ') || '',
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Nom d'utilisateur</label>
                    <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Nom complet</label>
                    <input
                        type="text"
                        value={formData.fullname}
                        onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Email</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Téléphone</label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                </div>
            </div>

            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 space-y-4">
                <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Affectation Marchand
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Établissement</label>
                        <select
                            value={formData.merchantId}
                            onChange={(e) => handleMerchantChange(e.target.value)}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                        >
                            <option value="">Aucun (Admin Global)</option>
                            {INITIAL_RESTAURANTS.map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Rôle Marchand</label>
                        <select
                            value={formData.merchantRoleId}
                            onChange={(e) => setFormData({ ...formData, merchantRoleId: e.target.value })}
                            disabled={!formData.merchantId}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all disabled:opacity-50"
                        >
                            <option value="">Sélectionner un rôle</option>
                            {availableRoles.map(role => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Compte actif</p>
                    <p className="text-xs text-gray-500">L'utilisateur peut se connecter</p>
                </div>
                <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-6 h-6 rounded-lg border-gray-300 text-primary focus:ring-primary"
                />
            </div>

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
                    {user ? 'Enregistrer les modifications' : 'Créer l\'utilisateur'}
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
    const staffEntry = MOCK_STAFF.find(s => s.userId === user.id);
    const merchant = staffEntry ? INITIAL_RESTAURANTS.find(r => r.id === staffEntry.merchantId) : null;
    const merchantRole = staffEntry ? MOCK_MERCHANT_ROLES.find(r => r.id === staffEntry.merchantRoleId) : null;

    return (
        <div className="space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-black">
                    {user.fullname?.charAt(0) || '?'}
                </div>
                <h3 className="mt-4 text-xl font-black text-gray-900 dark:text-white">
                    {user.fullname}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium">@{user.username}</p>
            </div>

            {/* Roles & Status */}
            <div className="flex flex-wrap justify-center gap-2">
                <span className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest",
                    getRoleDetails(user.role).color
                )}>
                    {getRoleDetails(user.role).label}
                </span>
                <span className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest",
                    user.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                )}>
                    {user.isActive ? 'Compte Actif' : 'Compte Inactif'}
                </span>
            </div>

            {/* Affectation Card */}
            {merchant && (
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Affectation Marchand</p>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                            <Store className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{merchant.name}</p>
                            <p className="text-xs font-bold text-primary uppercase tracking-wider">{merchantRole?.name || 'Staff'}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Contact Infos */}
            <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{user.email}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Téléphone</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{user.phone || 'Non renseigné'}</p>
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <button
                    onClick={onClose}
                    className="w-full px-6 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl font-bold transition-all"
                >
                    Fermer
                </button>
            </div>
        </div>
    );
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export default function TeamManagement() {
    const [users, setUsers] = useState<User[]>(INITIAL_USERS);
    const [staff, setStaff] = useState<StaffMember[]>(MOCK_STAFF);
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
        const matchesSearch = (user.fullname?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (user.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (user.username?.toLowerCase() || '').includes(searchQuery.toLowerCase());
        const matchesRole = selectedRole === 'all' || user.role === selectedRole;
        return matchesSearch && matchesRole;
    });

    // Helper to get merchant info for a user
    const getUserStaffInfo = (userId: string) => {
        const staffEntry = staff.find(s => s.userId === userId);
        if (!staffEntry) return null;

        const merchant = INITIAL_RESTAURANTS.find(r => r.id === staffEntry.merchantId);
        const role = MOCK_MERCHANT_ROLES.find(r => r.id === staffEntry.merchantRoleId);

        return {
            merchantName: merchant?.name || 'Inconnu',
            roleName: role?.name || 'Inconnu'
        };
    };

    // CRUD Operations
    const handleCreate = (data: UserFormData) => {
        const newUser: User = {
            ...data,
            id: Date.now().toString(),
            createdAt: new Date().toISOString().split('T')[0],
        };
        setUsers([...users, newUser]);

        if (data.merchantId && data.merchantRoleId) {
            const newStaff: StaffMember = {
                id: `s${Date.now()}`,
                userId: newUser.id,
                merchantId: data.merchantId,
                merchantRoleId: data.merchantRoleId
            };
            setStaff([...staff, newStaff]);
        }

        setIsCreateModalOpen(false);
        addToast('success', `Utilisateur "${data.fullname}" créé avec succès`);
    };

    const handleEdit = (data: UserFormData) => {
        if (!selectedUser) return;
        const updatedUsers = users.map(u =>
            u.id === selectedUser.id ? { ...u, ...data } : u
        );
        setUsers(updatedUsers);

        // Update staff info
        if (data.merchantId && data.merchantRoleId) {
            const existingStaffIndex = staff.findIndex(s => s.userId === selectedUser.id);
            if (existingStaffIndex > -1) {
                const updatedStaff = [...staff];
                updatedStaff[existingStaffIndex] = {
                    ...updatedStaff[existingStaffIndex],
                    merchantId: data.merchantId,
                    merchantRoleId: data.merchantRoleId
                };
                setStaff(updatedStaff);
            } else {
                setStaff([...staff, {
                    id: `s${Date.now()}`,
                    userId: selectedUser.id,
                    merchantId: data.merchantId,
                    merchantRoleId: data.merchantRoleId
                }]);
            }
        }

        setIsEditModalOpen(false);
        setSelectedUser(null);
        addToast('success', `Utilisateur "${data.fullname}" modifié avec succès`);
    };

    const handleDelete = () => {
        if (!selectedUser) return;
        setUsers(users.filter(u => u.id !== selectedUser.id));
        setStaff(staff.filter(s => s.userId !== selectedUser.id));
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
                        Gestion de l'Équipe
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Gérez les membres de votre équipe et leurs accès aux établissements
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white hover:opacity-90 font-bold rounded-xl transition-all duration-300 shadow-lg shadow-primary/20"
                >
                    <Plus className="w-5 h-5" />
                    Ajouter un membre
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher par nom, email ou pseudo..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        />
                    </div>
                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    >
                        <option value="all">Tous les rôles système</option>
                        {MOCK_ROLES.map(role => (
                            <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Team Grid/Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Membre</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Affectation</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Rôle Système</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Statut</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredUsers.map((user) => {
                                const staffInfo = getUserStaffInfo(user.id);
                                return (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                                                    {user.fullname?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{user.fullname}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {staffInfo ? (
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
                                                        <Store className="w-3.5 h-3.5 text-gray-400" />
                                                        {staffInfo.merchantName}
                                                    </div>
                                                    <div className="text-[10px] font-bold text-primary uppercase tracking-wider">
                                                        {staffInfo.roleName}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">Non affecté</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold",
                                                getRoleDetails(user.role).color
                                            )}>
                                                <Shield className="w-3 h-3" />
                                                {getRoleDetails(user.role).label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 text-sm font-medium",
                                                user.isActive ? "text-green-600" : "text-gray-400"
                                            )}>
                                                {user.isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                                {user.isActive ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openViewModal(user)} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => openEditModal(user)} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => openDeleteDialog(user)} className="p-2 text-gray-400 hover:text-destructive hover:bg-destructive/5 rounded-lg transition-all">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Nouveau membre" size="lg">
                <UserForm onSubmit={handleCreate} onCancel={() => setIsCreateModalOpen(false)} />
            </Modal>

            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Modifier le membre" size="lg">
                <UserForm user={selectedUser} onSubmit={handleEdit} onCancel={() => setIsEditModalOpen(false)} />
            </Modal>

            <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Profil membre" size="md">
                {selectedUser && <UserDetail user={selectedUser} onClose={() => setIsViewModalOpen(false)} />}
            </Modal>

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Supprimer le membre"
                message={`Voulez-vous vraiment retirer "${selectedUser?.fullname}" de l'équipe ?`}
                confirmText="Supprimer"
                type="danger"
            />

            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
    );
}

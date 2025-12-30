import { useState } from 'react';
import { Plus, Shield, Edit, Trash2, Check } from 'lucide-react';

import type { Permission, Role } from '../../types';
import { AVAILABLE_PERMISSIONS, MOCK_ROLES } from '../../data/mockData';

export default function RolesList() {
    const [roles, setRoles] = useState<Role[]>(MOCK_ROLES);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        permissions: [] as string[]
    });

    const handleOpenModal = (role?: Role) => {
        if (role) {
            setEditingRole(role);
            setFormData({
                name: role.name,
                description: role.description || '',
                permissions: role.permissions
            });
        } else {
            setEditingRole(null);
            setFormData({
                name: '',
                description: '',
                permissions: []
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRole(null);
    };

    const handlePermissionToggle = (permissionId: string) => {
        setFormData(prev => {
            const newPermissions = prev.permissions.includes(permissionId)
                ? prev.permissions.filter(id => id !== permissionId)
                : [...prev.permissions, permissionId];
            return { ...prev, permissions: newPermissions };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingRole) {
            setRoles(prev => prev.map(r => r.id === editingRole.id ? { ...r, ...formData } : r));
        } else {
            const newRole: Role = {
                id: Math.random().toString(36).substr(2, 9),
                usersCount: 0,
                ...formData
            };
            setRoles(prev => [...prev, newRole]);
        }
        handleCloseModal();
    };

    const handleDeleteRole = (roleId: string) => {
        if (window.confirm('Are you sure you want to delete this role?')) {
            setRoles(prev => prev.filter(r => r.id !== roleId));
        }
    };

    // Group permissions by module
    const permissionsByModule = AVAILABLE_PERMISSIONS.reduce((acc, perm) => {
        if (!acc[perm.module]) acc[perm.module] = [];
        acc[perm.module].push(perm);
        return acc;
    }, {} as Record<string, Permission[]>);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Roles & Permissions</h1>
                    <p className="text-gray-500 mt-1">Manage system roles and access rights</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Role
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map((role) => (
                    <div key={role.id} className="bg-card text-card-foreground rounded-lg border border-border shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-secondary rounded-lg">
                                <Shield className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleOpenModal(role)}
                                    className="p-2 text-gray-500 hover:text-primary hover:bg-secondary rounded-md transition-colors"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDeleteRole(role.id)}
                                    className="p-2 text-gray-500 hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{role.name}</h3>
                        <p className="text-sm text-gray-500 mb-4 h-10 line-clamp-2">{role.description}</p>

                        <div className="flex items-center justify-between text-sm text-gray-500 border-t border-border pt-4">
                            <span>{role.permissions.length} Permissions</span>
                            <span>{role.usersCount} Users</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-background rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-border flex justify-between items-center">
                            <h2 className="text-xl font-semibold">
                                {editingRole ? 'Edit Role' : 'Create New Role'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                                <span className="sr-only">Close</span>
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Role Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                        placeholder="e.g. Content Manager"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                        rows={3}
                                        placeholder="Describe the role's responsibilities..."
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium mb-4">Permissions</h3>
                                <div className="space-y-6">
                                    {Object.entries(permissionsByModule).map(([module, permissions]) => (
                                        <div key={module} className="border border-border rounded-lg p-4">
                                            <h4 className="font-medium mb-3 text-primary">{module}</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {permissions.map(perm => (
                                                    <label key={perm.id} className="flex items-start space-x-3 cursor-pointer group">
                                                        <div className="relative flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                className="peer sr-only"
                                                                checked={formData.permissions.includes(perm.id)}
                                                                onChange={() => handlePermissionToggle(perm.id)}
                                                            />
                                                            <div className="w-5 h-5 border-2 border-input rounded peer-checked:bg-primary peer-checked:border-primary transition-colors">
                                                                <Check className="w-3.5 h-3.5 text-primary-foreground absolute top-0.5 left-0.5 opacity-0 peer-checked:opacity-100" />
                                                            </div>
                                                        </div>
                                                        <div className="text-sm">
                                                            <span className="font-medium block text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">
                                                                {perm.name}
                                                            </span>
                                                            <span className="text-gray-500 text-xs">
                                                                {perm.description}
                                                            </span>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </form>

                        <div className="p-6 border-t border-border bg-secondary/20 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-secondary rounded-md transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
                            >
                                {editingRole ? 'Save Changes' : 'Create Role'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

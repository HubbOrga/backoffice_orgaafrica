import { useState } from 'react';
import {
    User,
    Settings as SettingsIcon,
    Bell,
    Shield,
    Key,
    Building,
    Save,
    Mail,
    Smartphone,
    Moon,
    Sun,
    Monitor,
    Users
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast, ToastContainer } from '../../components/ui/Toast';
import UsersList from '../users/UsersList';
import RolesList from '../roles/RolesList';

// ============================================
// TYPES & MOCKS
// ============================================

type TabId = 'profile' | 'account' | 'notifications' | 'display' | 'security' | 'users' | 'roles';

interface Tab {
    id: TabId;
    label: string;
    icon: any;
    description: string;
}

const TABS: Tab[] = [
    { id: 'profile', label: 'Mon Profil', icon: User, description: 'Gérez vos informations personnelles' },
    { id: 'users', label: 'Utilisateurs', icon: Users, description: 'Gérez les membres de l\'équipe' },
    { id: 'roles', label: 'Rôles & Permissions', icon: Shield, description: 'Configurez les accès' },
    { id: 'account', label: 'Compte & Organisation', icon: Building, description: 'Paramètres de votre compte et organisation' },
    { id: 'security', label: 'Sécurité', icon: Key, description: 'Mot de passe et authentification' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Préférences de communication' },
    { id: 'display', label: 'Affichage', icon: Monitor, description: 'Thème et préférences d\'interface' },
];

// ============================================
// SUB-COMPONENTS
// ============================================

interface ProfileSettingsProps {
    data: any;
    onChange: (field: string, value: any) => void;
}

function ProfileSettings({ data, onChange }: ProfileSettingsProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                <div className="relative group cursor-pointer">
                    <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-3xl border-2 border-dashed border-primary/30 group-hover:border-primary transition-all">
                        {data.fullname?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-bold">Modifier</span>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Photo de profil</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Cette photo sera affichée sur votre profil et dans l'interface.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nom complet</label>
                    <input
                        type="text"
                        value={data.fullname}
                        onChange={(e) => onChange('fullname', e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nom d'utilisateur</label>
                    <input
                        type="text"
                        value={data.username}
                        onChange={(e) => onChange('username', e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => onChange('email', e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Téléphone</label>
                    <div className="relative">
                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="tel"
                            value={data.phone}
                            onChange={(e) => onChange('phone', e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                <textarea
                    rows={4}
                    value={data.bio || ''}
                    onChange={(e) => onChange('bio', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Parlez-nous un peu de vous..."
                />
            </div>
        </div>
    );
}

interface SecuritySettingsProps {
    data: any;
    onChange: (field: string, value: any) => void;
}

function SecuritySettings({ data, onChange }: SecuritySettingsProps) {
    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Key className="w-5 h-5 text-primary" />
                    Changer le mot de passe
                </h3>
                <div className="grid grid-cols-1 gap-4 max-w-xl">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mot de passe actuel</label>
                        <input
                            type="password"
                            value={data.currentPassword}
                            onChange={(e) => onChange('currentPassword', e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nouveau mot de passe</label>
                        <input
                            type="password"
                            value={data.newPassword}
                            onChange={(e) => onChange('newPassword', e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirmer le nouveau mot de passe</label>
                        <input
                            type="password"
                            value={data.confirmPassword}
                            onChange={(e) => onChange('confirmPassword', e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-primary" />
                    Authentification à deux facteurs (2FA)
                </h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">Activer l'authentification à deux facteurs</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Ajoutez une couche de sécurité supplémentaire à votre compte.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={data.twoFactorEnabled}
                            onChange={(e) => onChange('twoFactorEnabled', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                </div>
            </div>
        </div>
    );
}

interface NotificationSettingsProps {
    data: any;
    onChange: (index: number, value: boolean) => void;
}

function NotificationSettings({ data, onChange }: NotificationSettingsProps) {
    const NOTIFICATIONS = [
        'Nouvelle commande',
        'Nouveau client inscrit',
        'Rapport hebdomadaire',
        'Alertes de stock',
        'Mises à jour système'
    ];

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Notifications Email</h3>
                <div className="space-y-3">
                    {NOTIFICATIONS.map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors">
                            <span className="text-gray-700 dark:text-gray-300 font-medium">{item}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data[i] || false}
                                    onChange={(e) => onChange(i, e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

interface DisplaySettingsProps {
    data: any;
    onChange: (field: string, value: any) => void;
}

function DisplaySettings({ data, onChange }: DisplaySettingsProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Thème de l'interface</h3>
                <div className="grid grid-cols-3 gap-4">
                    <button
                        onClick={() => onChange('theme', 'light')}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${data.theme === 'light' ? 'border-primary bg-primary/5' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700 bg-gray-50 dark:bg-gray-900'}`}
                    >
                        <div className="w-full aspect-video bg-white rounded-lg shadow-sm border border-gray-200"></div>
                        <span className={`font-bold flex items-center gap-2 ${data.theme === 'light' ? 'text-primary' : 'text-gray-500'}`}>
                            <Sun className="w-4 h-4" /> Clair
                        </span>
                    </button>
                    <button
                        onClick={() => onChange('theme', 'dark')}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${data.theme === 'dark' ? 'border-primary bg-primary/5' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700 bg-gray-50 dark:bg-gray-900'}`}
                    >
                        <div className="w-full aspect-video bg-gray-900 rounded-lg shadow-sm border border-gray-700"></div>
                        <span className={`font-bold flex items-center gap-2 ${data.theme === 'dark' ? 'text-primary' : 'text-gray-500'}`}>
                            <Moon className="w-4 h-4" /> Sombre
                        </span>
                    </button>
                    <button
                        onClick={() => onChange('theme', 'system')}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${data.theme === 'system' ? 'border-primary bg-primary/5' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700 bg-gray-50 dark:bg-gray-900'}`}
                    >
                        <div className="w-full aspect-video bg-gradient-to-br from-white to-gray-900 rounded-lg shadow-sm border border-gray-200"></div>
                        <span className={`font-bold flex items-center gap-2 ${data.theme === 'system' ? 'text-primary' : 'text-gray-500'}`}>
                            <Monitor className="w-4 h-4" /> Système
                        </span>
                    </button>
                </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Langue et Région</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Langue</label>
                        <select
                            value={data.language}
                            onChange={(e) => onChange('language', e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        >
                            <option value="fr">Français</option>
                            <option value="en">English</option>
                            <option value="es">Español</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Fuseau horaire</label>
                        <select
                            value={data.timezone}
                            onChange={(e) => onChange('timezone', e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        >
                            <option value="europe/paris">Europe/Paris (GMT+1)</option>
                            <option value="utc">UTC</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function Settings() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<TabId>('profile');
    const { toasts, addToast, removeToast } = useToast();

    // State for different sections
    const [profileData, setProfileData] = useState({
        fullname: user?.fullname || '',
        username: user?.username || '',
        email: user?.email || '',
        phone: user?.phone || '',
        bio: ''
    });

    const [securityData, setSecurityData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactorEnabled: false
    });

    const [notificationData, setNotificationData] = useState<boolean[]>([true, true, true, false, false]);

    const [displayData, setDisplayData] = useState({
        theme: 'system',
        language: 'fr',
        timezone: 'europe/paris'
    });

    const handleSave = () => {
        // Validation logic could go here
        if (activeTab === 'security' && securityData.newPassword !== securityData.confirmPassword) {
            addToast('error', 'Les mots de passe ne correspondent pas');
            return;
        }

        // Mock API call
        setTimeout(() => {
            addToast('success', 'Paramètres enregistrés avec succès');
        }, 500);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <SettingsIcon className="w-8 h-8 text-primary" />
                    Paramètres
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Gérez vos préférences et la configuration de l'application
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-72 flex-shrink-0">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden sticky top-24">
                        <nav className="p-2 space-y-1">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${activeTab === tab.id
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                >
                                    <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-gray-400'}`} />
                                    <div>
                                        <p className="font-bold text-sm">{tab.label}</p>
                                    </div>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 lg:p-8">
                        {!['users', 'roles'].includes(activeTab) && (
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {TABS.find(t => t.id === activeTab)?.label}
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {TABS.find(t => t.id === activeTab)?.description}
                                </p>
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <ProfileSettings
                                data={profileData}
                                onChange={(field, value) => setProfileData({ ...profileData, [field]: value })}
                            />
                        )}
                        {activeTab === 'users' && <UsersList />}
                        {activeTab === 'roles' && <RolesList />}
                        {activeTab === 'security' && (
                            <SecuritySettings
                                data={securityData}
                                onChange={(field, value) => setSecurityData({ ...securityData, [field]: value })}
                            />
                        )}
                        {activeTab === 'notifications' && (
                            <NotificationSettings
                                data={notificationData}
                                onChange={(index, value) => {
                                    const newData = [...notificationData];
                                    newData[index] = value;
                                    setNotificationData(newData);
                                }}
                            />
                        )}
                        {activeTab === 'display' && (
                            <DisplaySettings
                                data={displayData}
                                onChange={(field, value) => setDisplayData({ ...displayData, [field]: value })}
                            />
                        )}
                        {activeTab === 'account' && (
                            <div className="text-center py-12 text-gray-500">
                                <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <p>Les paramètres d'organisation seront bientôt disponibles.</p>
                            </div>
                        )}

                        {/* Save Button - Hide for Users and Roles */}
                        {!['users', 'roles'].includes(activeTab) && (
                            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground hover:opacity-90 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
                                >
                                    <Save className="w-5 h-5" />
                                    Enregistrer les modifications
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
    );
}

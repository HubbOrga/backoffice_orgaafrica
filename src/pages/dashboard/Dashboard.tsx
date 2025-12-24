import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
    Users,
    Megaphone,
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingBag,
    ArrowUpRight,
    Filter,
    Download,
    Calendar,
    UserCheck,
    XCircle,
    Percent
} from 'lucide-react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from 'recharts';

// ============================================
// DONNÉES MOCKÉES POUR LE DASHBOARD
// ============================================

const GROWTH_DATA = [
    { month: 'Jan', orga: 400, orgaPro: 240 },
    { month: 'Fév', orga: 520, orgaPro: 310 },
    { month: 'Mar', orga: 680, orgaPro: 450 },
    { month: 'Avr', orga: 850, orgaPro: 580 },
    { month: 'Mai', orga: 1100, orgaPro: 720 },
    { month: 'Juin', orga: 1450, orgaPro: 980 },
];

const AUDIENCE_DATA = [
    { name: 'Orga (Standard)', value: 1450, color: '#6366f1' },
    { name: 'Orga Pro', value: 980, color: '#ec4899' },
];

const MOCK_MERCHANTS = [
    { id: 'all', name: 'Tous les marchands' },
    { id: '1', name: 'Le Gourmet' },
    { id: '2', name: 'Pizza Express' },
    { id: '3', name: 'Sushi Master' },
    { id: '4', name: 'Burger King' },
];

export default function Dashboard() {
    const { user } = useAuth();
    const [selectedMerchant, setSelectedMerchant] = useState('all');
    const [timeRange, setTimeRange] = useState('30d');

    // Stats calculées (normalement viendraient de l'API)
    const stats = {
        totalUsers: 2430,
        orgaUsers: 1450,
        orgaProUsers: 980,
        regularUsers: 456, // Utilisateurs avec >= 2 commandes en 30j
        totalOrders: 12840,
        cancelledOrders: 342,
        aov: 15400, // Average Order Value in FCFA
        aovTrend: 8.5, // +8.5%
        promotionsCount: 42,
        uniqueClientsPerMerchant: 156, // Pour le marchand sélectionné
    };

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Tableau de Bord OrgaAfrica
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Bienvenue, <span className="text-primary font-medium">{user?.fullname || 'Admin'}</span> ! Analyse des performances.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                        <Filter className="w-4 h-4 ml-2 text-gray-400" />
                        <select
                            value={selectedMerchant}
                            onChange={(e) => setSelectedMerchant(e.target.value)}
                            className="bg-transparent border-none text-sm focus:ring-0 cursor-pointer pr-8"
                        >
                            {MOCK_MERCHANTS.map(m => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                        <Calendar className="w-4 h-4 ml-2 text-gray-400" />
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="bg-transparent border-none text-sm focus:ring-0 cursor-pointer pr-8"
                        >
                            <option value="7d">7 derniers jours</option>
                            <option value="30d">30 derniers jours</option>
                            <option value="90d">90 derniers jours</option>
                            <option value="12m">12 derniers mois</option>
                        </select>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
                        <Download className="w-4 h-4" />
                        <span className="text-sm font-medium">Exporter</span>
                    </button>
                </div>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Users & Segmentation */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-xs font-medium text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">+12%</span>
                    </div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Utilisateurs</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalUsers.toLocaleString()}</p>
                    <div className="mt-4 flex gap-2 text-xs">
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{stats.orgaUsers} Orga</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-pink-600 dark:text-pink-400 font-semibold">{stats.orgaProUsers} Orga Pro</span>
                    </div>
                </div>

                {/* Regular Users (Retention) */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <UserCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="text-xs font-medium text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">+5.2%</span>
                    </div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Utilisateurs Réguliers</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.regularUsers.toLocaleString()}</p>
                    <p className="text-xs text-gray-400 mt-2">≥ 2 commandes / 30 jours</p>
                </div>

                {/* Orders & Cancelled */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                            <ShoppingBag className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="flex items-center gap-1 text-xs font-medium text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">
                            <XCircle className="w-3 h-3" />
                            {stats.cancelledOrders} annulées
                        </div>
                    </div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Volume Commandes</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalOrders.toLocaleString()}</p>
                    <p className="text-xs text-gray-400 mt-2">Total sur la période</p>
                </div>

                {/* AOV & Trend */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                            <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className={`flex items-center gap-1 text-xs font-medium ${stats.aovTrend >= 0 ? 'text-green-500 bg-green-50 dark:bg-green-900/20' : 'text-red-500 bg-red-50 dark:bg-red-900/20'} px-2 py-1 rounded-full`}>
                            {stats.aovTrend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {Math.abs(stats.aovTrend)}%
                        </div>
                    </div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Panier Moyen (AOV)</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.aov.toLocaleString()} FCFA</p>
                    <p className="text-xs text-gray-400 mt-2">vs mois précédent</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Growth Curve */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Courbe de Croissance Mensuelle</h3>
                        <div className="flex gap-4 text-xs">
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                                <span className="text-gray-500">Orga</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                                <span className="text-gray-500">Orga Pro</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={GROWTH_DATA}>
                                <defs>
                                    <linearGradient id="colorOrga" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorOrgaPro" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="orga"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorOrga)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="orgaPro"
                                    stroke="#ec4899"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorOrgaPro)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Audience Segmentation */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Segmentation d'Audience</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={AUDIENCE_DATA}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {AUDIENCE_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-3">
                        {AUDIENCE_DATA.map((item) => (
                            <div key={item.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{item.name}</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {((item.value / stats.totalUsers) * 100).toFixed(1)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row: Marketing & Merchant Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Marketing Stats */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Megaphone className="w-5 h-5 text-primary" />
                        Marketing & Promotions
                    </h3>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Promotions Actives</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.promotionsCount}</p>
                            </div>
                            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                <Percent className="w-6 h-6 text-primary" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Clients Uniques / Marchand</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.uniqueClientsPerMerchant}</p>
                            </div>
                            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                <UserCheck className="w-6 h-6 text-primary" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Merchants (Merchant View) */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Performance des Marchands
                        </h3>
                        <button className="text-sm text-primary hover:underline flex items-center gap-1">
                            Voir tout
                            <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-700/50">
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Marchand</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Commandes</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Annulées</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">CA Total</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">AOV</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {[
                                    { name: 'Le Gourmet', orders: 1234, cancelled: 12, revenue: '4.5M', aov: '18,500' },
                                    { name: 'Pizza Express', orders: 987, cancelled: 45, revenue: '3.2M', aov: '12,400' },
                                    { name: 'Sushi Master', orders: 856, cancelled: 8, revenue: '2.8M', aov: '22,100' },
                                    { name: 'Burger King', orders: 743, cancelled: 23, revenue: '2.4M', aov: '14,800' },
                                ].map((m, i) => (
                                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{m.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{m.orders}</td>
                                        <td className="px-6 py-4 text-sm text-red-500 font-medium">{m.cancelled}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-semibold">{m.revenue} FCFA</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{m.aov} FCFA</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

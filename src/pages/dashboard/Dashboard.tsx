import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    Users,
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingBag,
    Filter,
    Download,
    Calendar,

    XCircle,
    Utensils,

    Search,
    MoreHorizontal,
    ArrowRight,
    Activity,
    Zap
} from 'lucide-react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,

    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { INITIAL_RESTAURANTS } from '../../data/mockData';

// ============================================
// DONNÉES MOCKÉES POUR LE DASHBOARD
// ============================================

const GROWTH_DATA = [
    { month: 'Jan', orga: 400, orgaPro: 240, total: 640 },
    { month: 'Fév', orga: 520, orgaPro: 310, total: 830 },
    { month: 'Mar', orga: 680, orgaPro: 450, total: 1130 },
    { month: 'Avr', orga: 850, orgaPro: 580, total: 1430 },
    { month: 'Mai', orga: 1100, orgaPro: 720, total: 1820 },
    { month: 'Juin', orga: 1450, orgaPro: 980, total: 2430 },
];

const AUDIENCE_DATA = [
    { name: 'Orga Standard', value: 1450, color: '#6366f1' },
    { name: 'Orga Pro', value: 980, color: '#ec4899' },
];

const MOCK_USERS = [
    { id: 1, name: 'Jean Dupont', email: 'jean.dupont@email.com', type: 'Orga', status: 'Régulier', orders: 15, cancelled: 1, revenue: 250000, lastRestaurant: 'Le Petit Bistro', avatar: 'JD' },
    { id: 2, name: 'Marie Koné', email: 'marie.kone@email.com', type: 'Orga Pro', status: 'Régulier', orders: 42, cancelled: 0, revenue: 850000, lastRestaurant: 'Sushi Master', avatar: 'MK' },
    { id: 3, name: 'Abdoulaye Traoré', email: 'abdou.traore@email.com', type: 'Orga', status: 'Occasionnel', orders: 1, cancelled: 2, revenue: 15000, lastRestaurant: 'Pizza Palace', avatar: 'AT' },
    { id: 4, name: 'Saliou Diallo', email: 'saliou.diallo@email.com', type: 'Orga Pro', status: 'Régulier', orders: 28, cancelled: 3, revenue: 420000, lastRestaurant: 'Chez Mama', avatar: 'SD' },
    { id: 5, name: 'Fatou Sow', email: 'fatou.sow@email.com', type: 'Orga', status: 'Régulier', orders: 12, cancelled: 0, revenue: 180000, lastRestaurant: 'Burger Express', avatar: 'FS' },
    { id: 6, name: 'Koffi Mensah', email: 'koffi.mensah@email.com', type: 'Orga Pro', status: 'Occasionnel', orders: 5, cancelled: 1, revenue: 75000, lastRestaurant: 'Wok & Roll', avatar: 'KM' },
    { id: 7, name: 'Awa Thiam', email: 'awa.thiam@email.com', type: 'Orga', status: 'Régulier', orders: 22, cancelled: 0, revenue: 330000, lastRestaurant: 'Le Petit Bistro', avatar: 'AT' },
    { id: 8, name: 'Moussa Fofana', email: 'moussa.fofana@email.com', type: 'Orga Pro', status: 'Régulier', orders: 35, cancelled: 2, revenue: 525000, lastRestaurant: 'Sushi Master', avatar: 'MF' },
];



const MOCK_MERCHANTS = [
    { id: 'all', name: 'Tous les restaurants' },
    ...INITIAL_RESTAURANTS.map(r => ({ id: r.id, name: r.name }))
];

const RESTAURANT_PERFORMANCE = [
    { name: 'Le Petit Bistro', orders: 1234, revenue: 4500000, growth: 12.5, color: '#6366f1' },
    { name: 'Pizza Palace', orders: 987, revenue: 3200000, growth: 8.2, color: '#10b981' },
    { name: 'Sushi Master', orders: 856, revenue: 2800000, growth: -2.4, color: '#f59e0b' },
    { name: 'Chez Mama', orders: 743, revenue: 2400000, growth: 15.1, color: '#ec4899' },
];

export default function Dashboard() {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const [selectedMerchant, setSelectedMerchant] = useState('all');
    const [timeRange, setTimeRange] = useState('30d');
    const [activeFilter] = useState<'all' | 'orga' | 'orgaPro' | 'regular'>('all');
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const merchantId = searchParams.get('merchant');
        if (merchantId) {
            setSelectedMerchant(merchantId);
        }
    }, [searchParams]);

    const selectedMerchantName = MOCK_MERCHANTS.find(m => m.id === selectedMerchant)?.name;

    const stats = {
        totalUsers: selectedMerchant === 'all' ? 2430 : 156,
        orgaUsers: selectedMerchant === 'all' ? 1450 : 92,
        orgaProUsers: selectedMerchant === 'all' ? 980 : 64,
        regularUsers: selectedMerchant === 'all' ? 456 : 28,
        totalOrders: selectedMerchant === 'all' ? 12840 : 845,
        cancelledOrders: selectedMerchant === 'all' ? 342 : 12,
        aov: selectedMerchant === 'all' ? 15400 : 12500,
        aovTrend: 8.5,
        revenue: selectedMerchant === 'all' ? 197736000 : 10562500,
    };

    const filteredUsers = MOCK_USERS.filter(u => {
        const matchesType = activeFilter === 'orga' ? u.type === 'Orga' :
            activeFilter === 'orgaPro' ? u.type === 'Orga Pro' :
                activeFilter === 'regular' ? u.status === 'Régulier' : true;

        const matchesMerchant = selectedMerchant === 'all' || u.lastRestaurant === selectedMerchantName;
        const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesType && matchesMerchant && matchesSearch;
    });

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (!sortConfig) return 0;
        const { key, direction } = sortConfig;
        const aValue = a[key as keyof typeof a];
        const bValue = b[key as keyof typeof b];

        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-700">
            {/* --- HERO SECTION --- */}
            <div className="relative overflow-hidden rounded-3xl bg-primary p-8 lg:p-12 text-white shadow-2xl">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium border border-white/10">
                            <Activity className="w-3 h-3" />
                            <span>Système Opérationnel</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                            Tableau de Bord <span className="text-white/70 font-light italic">OrgaAfrica</span>
                        </h1>
                        <p className="text-white/60 text-lg max-w-2xl">
                            Ravi de vous revoir, <span className="text-white font-semibold">{user?.fullname || 'Administrateur'}</span>.
                            Voici l'état actuel de votre écosystème commercial.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 shadow-inner">
                            <Filter className="w-4 h-4 ml-3 text-white/40" />
                            <select
                                value={selectedMerchant}
                                onChange={(e) => setSelectedMerchant(e.target.value)}
                                className="bg-transparent border-none text-sm focus:ring-0 cursor-pointer pr-8 text-white font-medium"
                            >
                                {MOCK_MERCHANTS.map(m => (
                                    <option key={m.id} value={m.id} className="text-gray-900">{m.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 shadow-inner">
                            <Calendar className="w-4 h-4 ml-3 text-white/40" />
                            <select
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                                className="bg-transparent border-none text-sm focus:ring-0 cursor-pointer pr-8 text-white font-medium"
                            >
                                <option value="7d" className="text-gray-900">7 derniers jours</option>
                                <option value="30d" className="text-gray-900">30 derniers jours</option>
                                <option value="90d" className="text-gray-900">90 derniers jours</option>
                                <option value="12m" className="text-gray-900">12 derniers mois</option>
                            </select>
                        </div>

                        <button className="group flex items-center gap-2 px-6 py-3 bg-white text-primary rounded-2xl hover:bg-white/90 transition-all duration-300 shadow-xl hover:scale-105 active:scale-95">
                            <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                            <span className="font-bold text-sm">Rapport Complet</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* --- KEY METRICS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Users Card */}
                <div className="glass-card rounded-[2.5rem] p-8 group hover:border-primary/30 transition-all duration-500">
                    <div className="flex items-start justify-between">
                        <div className="p-4 bg-blue-500/10 dark:bg-blue-500/20 rounded-2xl glow-blue group-hover:scale-110 transition-transform duration-500">
                            <Users className="w-8 h-8 text-blue-500" />
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                                <TrendingUp className="w-3 h-3" /> +12%
                            </span>
                        </div>
                    </div>
                    <div className="mt-6">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Utilisateurs Actifs</p>
                        <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-1">{stats.totalUsers.toLocaleString()}</h3>
                    </div>
                    <div className="mt-6 flex items-center gap-4">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold">
                                    U{i}
                                </div>
                            ))}
                        </div>
                        <span className="text-xs text-gray-400 font-medium">+{stats.orgaProUsers} Orga Pro</span>
                    </div>
                </div>

                {/* Orders Card */}
                <div className="glass-card rounded-[2.5rem] p-8 group hover:border-orange-500/30 transition-all duration-500">
                    <div className="flex items-start justify-between">
                        <div className="p-4 bg-orange-500/10 dark:bg-orange-500/20 rounded-2xl glow-orange group-hover:scale-110 transition-transform duration-500">
                            <ShoppingBag className="w-8 h-8 text-orange-500" />
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-full">
                                <XCircle className="w-3 h-3" /> {stats.cancelledOrders}
                            </span>
                        </div>
                    </div>
                    <div className="mt-6">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Volume Commandes</p>
                        <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-1">{stats.totalOrders.toLocaleString()}</h3>
                    </div>
                    <div className="mt-6 h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                </div>

                {/* Revenue Card */}
                <div className="glass-card rounded-[2.5rem] p-8 group hover:border-emerald-500/30 transition-all duration-500">
                    <div className="flex items-start justify-between">
                        <div className="p-4 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-2xl glow-emerald group-hover:scale-110 transition-transform duration-500">
                            <DollarSign className="w-8 h-8 text-emerald-500" />
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                                <TrendingUp className="w-3 h-3" /> +24%
                            </span>
                        </div>
                    </div>
                    <div className="mt-6">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Chiffre d'Affaires</p>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{(stats.revenue / 1000000).toFixed(1)}M <span className="text-lg font-normal text-gray-400">FCFA</span></h3>
                    </div>
                    <div className="mt-6 flex items-center justify-between text-xs text-gray-400">
                        <span>Objectif: 250M</span>
                        <span>80%</span>
                    </div>
                </div>

                {/* AOV Card */}
                <div className="glass-card rounded-[2.5rem] p-8 group hover:border-purple-500/30 transition-all duration-500">
                    <div className="flex items-start justify-between">
                        <div className="p-4 bg-purple-500/10 dark:bg-purple-500/20 rounded-2xl glow-purple group-hover:scale-110 transition-transform duration-500">
                            <Zap className="w-8 h-8 text-purple-500" />
                        </div>
                        <div className="flex flex-col items-end">
                            <span className={`flex items-center gap-1 text-xs font-bold ${stats.aovTrend >= 0 ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'} px-2 py-1 rounded-full`}>
                                {stats.aovTrend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {Math.abs(stats.aovTrend)}%
                            </span>
                        </div>
                    </div>
                    <div className="mt-6">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Panier Moyen</p>
                        <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-1">{stats.aov.toLocaleString()} <span className="text-lg font-normal text-gray-400">FCFA</span></h3>
                    </div>
                    <p className="mt-6 text-xs text-gray-400 italic">Optimisation recommandée (+5%)</p>
                </div>
            </div>

            {/* --- ANALYTICS SECTION --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Growth Chart */}
                <div className="lg:col-span-2 glass-card rounded-[2.5rem] p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Analyse de Croissance</h3>
                            <p className="text-sm text-gray-500">Évolution des segments Orga vs Orga Pro</p>
                        </div>
                        <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded-2xl">
                            <button className="px-4 py-2 text-xs font-bold rounded-xl bg-white dark:bg-gray-700 shadow-sm">Mensuel</button>
                            <button className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">Hebdomadaire</button>
                        </div>
                    </div>

                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={GROWTH_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorOrga" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorOrgaPro" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" opacity={0.5} />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
                                    dy={15}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
                                    tickFormatter={(value) => `${value}`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '24px',
                                        border: 'none',
                                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                                        padding: '16px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                    itemStyle={{ fontWeight: 700 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="orga"
                                    stroke="#6366f1"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorOrga)"
                                    animationDuration={2000}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="orgaPro"
                                    stroke="#ec4899"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorOrgaPro)"
                                    animationDuration={2500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/30"></div>
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Orga Standard</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full bg-pink-500 shadow-lg shadow-pink-500/30"></div>
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Orga Pro</span>
                        </div>
                    </div>
                </div>

                {/* Audience & Insights */}
                <div className="space-y-8">
                    <div className="glass-card rounded-[2.5rem] p-8">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Répartition Audience</h3>
                        <div className="h-[240px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={AUDIENCE_DATA}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={90}
                                        paddingAngle={8}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {AUDIENCE_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-4 mt-6">
                            {AUDIENCE_DATA.map((item) => (
                                <div key={item.name} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/30">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                        <span className="text-sm font-bold text-gray-600 dark:text-gray-400">{item.name}</span>
                                    </div>
                                    <span className="text-sm font-black text-gray-900 dark:text-white">
                                        {((item.value / stats.totalUsers) * 100).toFixed(1)}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card rounded-[2.5rem] p-8 bg-gradient-to-br from-primary to-primary/80 text-white border-none">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Activity className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold">Insight IA</h4>
                        </div>
                        <p className="text-sm text-white/80 leading-relaxed">
                            Le segment <span className="text-white font-bold">Orga Pro</span> a augmenté de 15% ce mois-ci.
                            Envisagez une campagne ciblée sur le restaurant <span className="text-white font-bold">Sushi Master</span> pour maximiser la rétention.
                        </p>
                        <button className="mt-6 w-full py-3 bg-white text-primary rounded-2xl font-bold text-sm hover:bg-white/90 transition-colors flex items-center justify-center gap-2">
                            Voir l'analyse détaillée <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* --- OPERATIONAL DETAILS --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Top Restaurants Leaderboard */}
                <div className="glass-card rounded-[2.5rem] p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <Utensils className="w-6 h-6 text-primary" />
                            Top Restaurants
                        </h3>
                        <button className="text-primary text-sm font-bold hover:underline">Tout voir</button>
                    </div>

                    <div className="space-y-6">
                        {RESTAURANT_PERFORMANCE.map((r, i) => (
                            <div key={i} className="group relative p-4 rounded-3xl bg-gray-50 dark:bg-gray-800/30 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 border border-transparent hover:border-gray-100 dark:hover:border-gray-700 hover:shadow-xl">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg" style={{ backgroundColor: r.color }}>
                                            {r.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white">{r.name}</p>
                                            <p className="text-xs text-gray-500 font-medium">{r.orders.toLocaleString()} commandes</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-gray-900 dark:text-white">{(r.revenue / 1000000).toFixed(1)}M</p>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.growth >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                            {r.growth >= 0 ? '+' : ''}{r.growth}%
                                        </span>
                                    </div>
                                </div>
                                <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000"
                                        style={{
                                            backgroundColor: r.color,
                                            width: `${(r.revenue / 4500000) * 100}%`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Detailed User List Table */}
                <div className="lg:col-span-2 glass-card rounded-[2.5rem] overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Utilisateurs Récents
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">Gestion et suivi des clients actifs</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 w-full sm:w-64 transition-all"
                                />
                            </div>
                            <button className="p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <MoreHorizontal className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-gray-800/20">
                                    <th onClick={() => handleSort('name')} className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest cursor-pointer hover:text-primary transition-colors">
                                        Client {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th onClick={() => handleSort('type')} className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest cursor-pointer hover:text-primary transition-colors">
                                        Segment
                                    </th>
                                    <th onClick={() => handleSort('orders')} className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest cursor-pointer hover:text-primary transition-colors text-center">
                                        Cmds
                                    </th>
                                    <th onClick={() => handleSort('revenue')} className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest cursor-pointer hover:text-primary transition-colors text-right">
                                        Total CA
                                    </th>
                                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {sortedUsers.map((u) => (
                                    <tr key={u.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all duration-300">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold text-xs border border-primary/10">
                                                    {u.avatar}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{u.name}</p>
                                                    <p className="text-xs text-gray-500">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${u.type === 'Orga Pro' ? 'bg-pink-500/10 text-pink-600' : 'bg-indigo-500/10 text-indigo-600'}`}>
                                                {u.type}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">{u.orders}</span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <span className="text-sm font-black text-gray-900 dark:text-white">{u.revenue.toLocaleString()} <span className="text-[10px] font-normal text-gray-400">FCFA</span></span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-xl shadow-sm border border-transparent hover:border-gray-100 dark:hover:border-gray-600 transition-all">
                                                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {sortedUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3 text-gray-400">
                                                <Search className="w-12 h-12 opacity-20" />
                                                <p className="font-medium">Aucun utilisateur trouvé pour "{searchTerm}"</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-auto p-6 bg-gray-50/50 dark:bg-gray-800/20 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-medium">Affichage de {sortedUsers.length} sur {MOCK_USERS.length} clients</span>
                        <div className="flex items-center gap-2">
                            <button className="px-4 py-2 text-xs font-bold bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 disabled:opacity-50" disabled>Précédent</button>
                            <button className="px-4 py-2 text-xs font-bold bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">Suivant</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

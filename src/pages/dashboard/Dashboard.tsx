import { useAuth } from '../../contexts/AuthContext';
import {
    Users,
    Utensils,
    ChefHat,
    Megaphone,
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingBag,
    ArrowUpRight,
    Activity
} from 'lucide-react';

// ============================================
// DONNÉES MOCKÉES POUR LE DASHBOARD
// ============================================

const MOCK_STATS = [
    {
        title: 'Utilisateurs Actifs',
        value: '2,847',
        change: '+12.5%',
        trend: 'up',
        icon: Users,
        color: 'from-blue-500 to-cyan-500',
        bgColor: 'bg-blue-500/10'
    },
    {
        title: 'Restaurants',
        value: '156',
        change: '+8.2%',
        trend: 'up',
        icon: Utensils,
        color: 'from-purple-500 to-pink-500',
        bgColor: 'bg-purple-500/10'
    },
    {
        title: 'Ingrédients',
        value: '1,234',
        change: '-2.4%',
        trend: 'down',
        icon: ChefHat,
        color: 'from-orange-500 to-red-500',
        bgColor: 'bg-orange-500/10'
    },
    {
        title: 'Promotions Actives',
        value: '42',
        change: '+24.8%',
        trend: 'up',
        icon: Megaphone,
        color: 'from-green-500 to-emerald-500',
        bgColor: 'bg-green-500/10'
    }
];

const MOCK_RECENT_ACTIVITIES = [
    { id: 1, action: 'Nouveau restaurant ajouté', restaurant: 'Le Petit Bistro', time: 'Il y a 2 min', type: 'restaurant' },
    { id: 2, action: 'Promotion créée', restaurant: 'Pizza Palace', time: 'Il y a 15 min', type: 'promotion' },
    { id: 3, action: 'Nouvel utilisateur inscrit', restaurant: 'john.doe@email.com', time: 'Il y a 32 min', type: 'user' },
    { id: 4, action: 'Stock mis à jour', restaurant: 'Tomates - 500kg', time: 'Il y a 1h', type: 'ingredient' },
    { id: 5, action: 'Restaurant vérifié', restaurant: 'Chez Mama', time: 'Il y a 2h', type: 'restaurant' },
];

const MOCK_TOP_RESTAURANTS = [
    { id: 1, name: 'Le Gourmet', orders: 1234, revenue: '45,230 FCFA', rating: 4.9 },
    { id: 2, name: 'Pizza Express', orders: 987, revenue: '32,100 FCFA', rating: 4.7 },
    { id: 3, name: 'Sushi Master', orders: 856, revenue: '28,500 FCFA', rating: 4.8 },
    { id: 4, name: 'Burger King', orders: 743, revenue: '24,800 FCFA', rating: 4.5 },
];

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Tableau de Bord
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Bienvenue, <span className="text-primary font-medium">{user?.fullname || 'Admin'}</span> ! Voici un aperçu de votre activité.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                        <Activity className="w-3 h-3 mr-1" />
                        Système en ligne
                    </span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {MOCK_STATS.map((stat, index) => (
                    <div
                        key={index}
                        className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group"
                    >
                        {/* Gradient overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                        <div className="flex items-start justify-between relative z-10">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {stat.title}
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                    {stat.value}
                                </p>
                                <div className="flex items-center mt-2">
                                    {stat.trend === 'up' ? (
                                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                    ) : (
                                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                                    )}
                                    <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                                        {stat.change}
                                    </span>
                                    <span className="text-xs text-gray-400 ml-1">vs mois dernier</span>
                                </div>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                <stat.icon className={`w-6 h-6 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} style={{
                                    background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent'
                                }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Activité Récente
                        </h3>
                        <button className="text-sm text-primary hover:underline flex items-center gap-1">
                            Voir tout
                            <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {MOCK_RECENT_ACTIVITIES.map((activity) => (
                            <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === 'restaurant' ? 'bg-purple-100 dark:bg-purple-900/30' :
                                            activity.type === 'promotion' ? 'bg-green-100 dark:bg-green-900/30' :
                                                activity.type === 'user' ? 'bg-blue-100 dark:bg-blue-900/30' :
                                                    'bg-orange-100 dark:bg-orange-900/30'
                                        }`}>
                                        {activity.type === 'restaurant' && <Utensils className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
                                        {activity.type === 'promotion' && <Megaphone className="w-5 h-5 text-green-600 dark:text-green-400" />}
                                        {activity.type === 'user' && <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                                        {activity.type === 'ingredient' && <ChefHat className="w-5 h-5 text-orange-600 dark:text-orange-400" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {activity.action}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {activity.restaurant}
                                        </p>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {activity.time}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Restaurants */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Top Restaurants
                        </h3>
                    </div>
                    <div className="p-6 space-y-4">
                        {MOCK_TOP_RESTAURANTS.map((restaurant, index) => (
                            <div key={restaurant.id} className="flex items-center gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                                    {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {restaurant.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {restaurant.orders} commandes
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {restaurant.revenue}
                                    </p>
                                    <p className="text-xs text-yellow-500">
                                        ★ {restaurant.rating}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-200 text-sm">Revenu Total</p>
                            <p className="text-3xl font-bold mt-1">2.4M FCFA</p>
                            <p className="text-purple-200 text-xs mt-2">+18% ce mois</p>
                        </div>
                        <DollarSign className="w-12 h-12 text-purple-300" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-200 text-sm">Commandes Aujourd'hui</p>
                            <p className="text-3xl font-bold mt-1">847</p>
                            <p className="text-blue-200 text-xs mt-2">+32% vs hier</p>
                        </div>
                        <ShoppingBag className="w-12 h-12 text-blue-300" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-200 text-sm">Taux de Satisfaction</p>
                            <p className="text-3xl font-bold mt-1">94.6%</p>
                            <p className="text-green-200 text-xs mt-2">Basé sur 12k avis</p>
                        </div>
                        <TrendingUp className="w-12 h-12 text-green-300" />
                    </div>
                </div>
            </div>
        </div>
    );
}

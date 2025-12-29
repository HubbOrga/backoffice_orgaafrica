import { useState, useMemo, useEffect } from 'react';
import {
    ShoppingBag,
    XCircle,
    CheckCircle,
    Clock,
    TrendingUp,
    DollarSign,
    Calendar,
    Filter,
    Download,
    Utensils,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    RefreshCw
} from 'lucide-react';
import { MOCK_ORDERS, MOCK_RESERVATIONS } from '../../data/ordersData';
import { INITIAL_RESTAURANTS } from '../../data/mockData';
import type { OrderStatistics, MerchantOrderStatistics } from '../../types';

export default function OrdersStatistics() {
    const [timeRange, setTimeRange] = useState('30d');
    const [expandedRestaurant, setExpandedRestaurant] = useState<string | null>(null);
    const [lastRefresh, setLastRefresh] = useState(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            handleRefresh();
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setLastRefresh(new Date());

        // Simulate data refresh
        setTimeout(() => {
            setIsRefreshing(false);
        }, 500);
    };

    // Global Statistics Calculation
    const globalStats: OrderStatistics = useMemo(() => {
        const totalOrders = MOCK_ORDERS.length;
        const cancelledOrders = MOCK_ORDERS.filter(o => o.status === 'cancelled').length;
        const completedOrders = MOCK_ORDERS.filter(o => o.status === 'delivered').length;
        const pendingOrders = MOCK_ORDERS.filter(o => ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status)).length;
        const totalRevenue = MOCK_ORDERS
            .filter(o => o.status !== 'cancelled')
            .reduce((sum, order) => sum + order.total_amount, 0);
        const averageOrderValue = totalRevenue / (totalOrders - cancelledOrders);

        return {
            totalOrders,
            cancelledOrders,
            completedOrders,
            pendingOrders,
            totalRevenue,
            averageOrderValue: isNaN(averageOrderValue) ? 0 : averageOrderValue,
        };
    }, [lastRefresh]);

    // Merchant Statistics Calculation
    const merchantStats: MerchantOrderStatistics[] = useMemo(() => {
        const restaurantIds = [...new Set(MOCK_ORDERS.map(o => o.restaurant_id))];

        return restaurantIds.map(restaurantId => {
            const restaurant = INITIAL_RESTAURANTS.find(r => r.id === restaurantId);
            const restaurantOrders = MOCK_ORDERS.filter(o => o.restaurant_id === restaurantId);
            const restaurantReservations = MOCK_RESERVATIONS.filter(r => r.restaurant_id === restaurantId);

            const totalOrders = restaurantOrders.length;
            const cancelledOrders = restaurantOrders.filter(o => o.status === 'cancelled').length;
            const completedOrders = restaurantOrders.filter(o => o.status === 'delivered').length;
            const pendingOrders = restaurantOrders.filter(o => ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status)).length;
            const totalRevenue = restaurantOrders
                .filter(o => o.status !== 'cancelled')
                .reduce((sum, order) => sum + order.total_amount, 0);
            const averageOrderValue = totalRevenue / (totalOrders - cancelledOrders);

            const totalReservations = restaurantReservations.length;
            const cancelledReservations = restaurantReservations.filter(r => r.status === 'cancelled').length;

            return {
                restaurant_id: restaurantId,
                restaurant_name: restaurant?.name || restaurantId,
                totalOrders,
                cancelledOrders,
                completedOrders,
                pendingOrders,
                totalRevenue,
                averageOrderValue: isNaN(averageOrderValue) ? 0 : averageOrderValue,
                totalReservations,
                cancelledReservations,
            };
        }).sort((a, b) => b.totalRevenue - a.totalRevenue);
    }, [lastRefresh]);

    const toggleRestaurant = (restaurantId: string) => {
        setExpandedRestaurant(expandedRestaurant === restaurantId ? null : restaurantId);
    };

    const formatLastRefresh = () => {
        const seconds = Math.floor((new Date().getTime() - lastRefresh.getTime()) / 1000);
        if (seconds < 60) return `Il y a ${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        return `Il y a ${minutes}min`;
    };

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-700">
            {/* HERO SECTION */}
            <div className="relative overflow-hidden rounded-3xl bg-primary p-8 lg:p-12 text-white shadow-2xl">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium border border-white/10">
                            <ShoppingBag className="w-3 h-3" />
                            <span>Statistiques Commandes</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                            Rapport des <span className="text-white/70 font-light italic">Commandes</span>
                        </h1>
                        <p className="text-white/60 text-lg max-w-2xl">
                            Vue d'ensemble complète des commandes, réservations et performances par restaurant
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
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

                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="group flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl hover:bg-white/20 transition-all duration-300 shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-500`} />
                            <span className="font-bold text-sm">Actualiser</span>
                        </button>

                        <button className="group flex items-center gap-2 px-6 py-3 bg-white text-primary rounded-2xl hover:bg-white/90 transition-all duration-300 shadow-xl hover:scale-105 active:scale-95">
                            <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                            <span className="font-bold text-sm">Export CSV</span>
                        </button>
                    </div>
                </div>

                {/* Last refresh indicator */}
                <div className="relative z-10 mt-4 text-xs text-white/40">
                    Dernière actualisation: {formatLastRefresh()}
                </div>
            </div>

            {/* GLOBAL STATISTICS */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Statistiques Globales</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Orders */}
                    <div className="glass-card rounded-[2.5rem] p-8 group hover:border-orange-500/30 transition-all duration-500">
                        <div className="flex items-start justify-between">
                            <div className="p-4 bg-orange-500/10 dark:bg-orange-500/20 rounded-2xl glow-orange group-hover:scale-110 transition-transform duration-500">
                                <ShoppingBag className="w-8 h-8 text-orange-500" />
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                                    <TrendingUp className="w-3 h-3" /> +15%
                                </span>
                            </div>
                        </div>
                        <div className="mt-6">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Commandes</p>
                            <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-1">{globalStats.totalOrders}</h3>
                        </div>
                        <div className="mt-6 h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                    </div>

                    {/* Cancelled Orders */}
                    <div className="glass-card rounded-[2.5rem] p-8 group hover:border-red-500/30 transition-all duration-500">
                        <div className="flex items-start justify-between">
                            <div className="p-4 bg-red-500/10 dark:bg-red-500/20 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                                <XCircle className="w-8 h-8 text-red-500" />
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-full">
                                    {((globalStats.cancelledOrders / globalStats.totalOrders) * 100).toFixed(1)}%
                                </span>
                            </div>
                        </div>
                        <div className="mt-6">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Commandes Annulées</p>
                            <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-1">{globalStats.cancelledOrders}</h3>
                        </div>
                        <p className="mt-6 text-xs text-gray-400 italic">Sur {globalStats.totalOrders} commandes totales</p>
                    </div>

                    {/* Revenue */}
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
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Revenu Total</p>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                                {(globalStats.totalRevenue / 1000).toFixed(0)}K <span className="text-lg font-normal text-gray-400">FCFA</span>
                            </h3>
                        </div>
                        <div className="mt-6 flex items-center justify-between text-xs text-gray-400">
                            <span>Commandes validées uniquement</span>
                        </div>
                    </div>

                    {/* Average Order Value */}
                    <div className="glass-card rounded-[2.5rem] p-8 group hover:border-blue-500/30 transition-all duration-500">
                        <div className="flex items-start justify-between">
                            <div className="p-4 bg-blue-500/10 dark:bg-blue-500/20 rounded-2xl glow-blue group-hover:scale-110 transition-transform duration-500">
                                <DollarSign className="w-8 h-8 text-blue-500" />
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                                    <TrendingUp className="w-3 h-3" /> +8%
                                </span>
                            </div>
                        </div>
                        <div className="mt-6">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Panier Moyen</p>
                            <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-1">
                                {globalStats.averageOrderValue.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} <span className="text-lg font-normal text-gray-400">FCFA</span>
                            </h3>
                        </div>
                        <p className="mt-6 text-xs text-gray-400 italic">Par commande validée</p>
                    </div>
                </div>
            </div>

            {/* MERCHANT STATISTICS */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <Utensils className="w-6 h-6 text-primary" />
                        Statistiques par Restaurant
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Filter className="w-4 h-4" />
                        <span>{merchantStats.length} restaurants</span>
                    </div>
                </div>

                <div className="space-y-4">
                    {merchantStats.map((merchant, index) => (
                        <div
                            key={merchant.restaurant_id}
                            className="glass-card rounded-[2.5rem] overflow-hidden transition-all duration-300 hover:shadow-xl"
                        >
                            {/* Restaurant Header */}
                            <div
                                className="p-6 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all"
                                onClick={() => toggleRestaurant(merchant.restaurant_id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white font-black text-lg shadow-lg">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{merchant.restaurant_name}</h3>
                                            <p className="text-sm text-gray-500">
                                                {merchant.totalOrders} commandes • {merchant.totalReservations} réservations
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-gray-900 dark:text-white">
                                                {(merchant.totalRevenue / 1000).toFixed(0)}K FCFA
                                            </p>
                                            <p className="text-xs text-gray-500">Chiffre d'affaires</p>
                                        </div>

                                        {expandedRestaurant === merchant.restaurant_id ? (
                                            <ChevronUp className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Expandable Details */}
                            {expandedRestaurant === merchant.restaurant_id && (
                                <div className="px-6 pb-6 space-y-6 border-t border-gray-100 dark:border-gray-700 pt-6 animate-in fade-in slide-in-from-top-4 duration-300">
                                    {/* Detailed Statistics */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-800/30">
                                            <div className="flex items-center gap-2 mb-2">
                                                <ShoppingBag className="w-4 h-4 text-orange-600" />
                                                <p className="text-xs font-bold text-gray-500 uppercase">Commandes</p>
                                            </div>
                                            <p className="text-2xl font-black text-gray-900 dark:text-white">{merchant.totalOrders}</p>
                                        </div>

                                        <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-800/30">
                                            <div className="flex items-center gap-2 mb-2">
                                                <XCircle className="w-4 h-4 text-red-600" />
                                                <p className="text-xs font-bold text-gray-500 uppercase">Annulées</p>
                                            </div>
                                            <p className="text-2xl font-black text-gray-900 dark:text-white">{merchant.cancelledOrders}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {((merchant.cancelledOrders / merchant.totalOrders) * 100).toFixed(1)}% du total
                                            </p>
                                        </div>

                                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                                                <p className="text-xs font-bold text-gray-500 uppercase">Livrées</p>
                                            </div>
                                            <p className="text-2xl font-black text-gray-900 dark:text-white">{merchant.completedOrders}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {((merchant.completedOrders / merchant.totalOrders) * 100).toFixed(1)}% du total
                                            </p>
                                        </div>

                                        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Clock className="w-4 h-4 text-blue-600" />
                                                <p className="text-xs font-bold text-gray-500 uppercase">En cours</p>
                                            </div>
                                            <p className="text-2xl font-black text-gray-900 dark:text-white">{merchant.pendingOrders}</p>
                                        </div>
                                    </div>

                                    {/* Reservations */}
                                    <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-800/30">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Calendar className="w-4 h-4 text-purple-600" />
                                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Réservations</p>
                                                </div>
                                                <p className="text-2xl font-black text-gray-900 dark:text-white">
                                                    {merchant.totalReservations} réservations
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500">Annulées</p>
                                                <p className="text-xl font-bold text-red-600">{merchant.cancelledReservations}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Average Basket */}
                                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900/10 dark:to-pink-900/10 rounded-2xl border border-orange-100 dark:border-orange-800/30">
                                        <div className="flex items-center gap-3">
                                            <DollarSign className="w-6 h-6 text-orange-600" />
                                            <div>
                                                <p className="text-xs font-bold text-gray-500 uppercase">Panier Moyen</p>
                                                <p className="text-2xl font-black text-gray-900 dark:text-white">
                                                    {merchant.averageOrderValue.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} FCFA
                                                </p>
                                            </div>
                                        </div>
                                        <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                                            <p className="text-xs text-gray-500">Revenue total</p>
                                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                {(merchant.totalRevenue / 1000).toFixed(0)}K FCFA
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* INSIGHTS & ALERTS */}
            <div className="glass-card rounded-[2.5rem] p-8 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-amber-500/20 rounded-2xl">
                        <AlertCircle className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Insights Clés</h3>
                        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                            <li className="flex items-start gap-2">
                                <span className="text-amber-600 mt-1">•</span>
                                <span>
                                    <strong>Taux d'annulation global:</strong> {((globalStats.cancelledOrders / globalStats.totalOrders) * 100).toFixed(1)}%
                                    {((globalStats.cancelledOrders / globalStats.totalOrders) * 100) > 20 ?
                                        <span className="text-red-600 font-semibold"> (Attention: taux élevé)</span> :
                                        <span className="text-emerald-600 font-semibold"> (Bon niveau)</span>
                                    }
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-600 mt-1">•</span>
                                <span>
                                    <strong>Top restaurant:</strong> {merchantStats[0]?.restaurant_name} avec {merchantStats[0]?.totalOrders} commandes
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-600 mt-1">•</span>
                                <span>
                                    <strong>Panier moyen plateforme:</strong> {globalStats.averageOrderValue.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} FCFA
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

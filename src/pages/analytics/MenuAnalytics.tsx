import { useMemo } from 'react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import {
    TrendingUp,
    Heart,
    Award,
    ArrowUpRight,
    ArrowDownRight,
    Utensils,
    ChefHat
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { MOCK_DISH_PERFORMANCE, MOCK_DAILY_STATS } from '../../data/analyticsData';

export default function MenuAnalytics() {
    const { user } = useAuth();

    // Filter data based on user role
    const dishPerformance = useMemo(() => {
        if (user?.merchantId) {
            return MOCK_DISH_PERFORMANCE.filter(d => d.merchantId === user.merchantId);
        }
        return MOCK_DISH_PERFORMANCE;
    }, [user]);

    // Calculate summary stats
    const stats = useMemo(() => {
        const totalRevenue = dishPerformance.reduce((sum, d) => sum + d.totalRevenue, 0);
        const totalSold = dishPerformance.reduce((sum, d) => sum + d.totalSold, 0);
        const totalFavorites = dishPerformance.reduce((sum, d) => sum + d.favoritesCount, 0);

        // Sort by popularity (sold + favorites)
        const sortedDishes = [...dishPerformance].sort((a, b) =>
            (b.totalSold + b.favoritesCount) - (a.totalSold + a.favoritesCount)
        );

        return {
            totalRevenue,
            totalSold,
            totalFavorites,
            topDish: sortedDishes[0],
            worstDish: sortedDishes[sortedDishes.length - 1]
        };
    }, [dishPerformance]);

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-700">
            {/* HERO SECTION */}
            <div className="relative overflow-hidden rounded-3xl bg-primary p-8 lg:p-12 text-white shadow-2xl">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium border border-white/10">
                            <TrendingUp className="w-3 h-3" />
                            <span>Performance Menu</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                            Analytics & <span className="text-white/70 font-light italic">Favoris</span>
                        </h1>
                        <p className="text-white/60 text-lg max-w-2xl">
                            Découvrez vos plats stars et optimisez votre carte grâce aux données clients.
                        </p>
                    </div>
                </div>
            </div>

            {/* KEY METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-[2rem] border-l-4 border-pink-500">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-xl text-pink-600 dark:text-pink-400">
                            <Heart className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 px-2 py-1 rounded-full">
                            Total Favoris
                        </span>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                        {stats.totalFavorites} <span className="text-lg text-gray-400 font-normal">Likes</span>
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">Clients intéressés par vos plats</p>
                </div>

                <div className="glass-card p-6 rounded-[2rem] border-l-4 border-emerald-500">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                            <Utensils className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-full">
                            Plats Vendus
                        </span>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                        {stats.totalSold} <span className="text-lg text-gray-400 font-normal">Unités</span>
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">Volume total des ventes</p>
                </div>

                <div className="glass-card p-6 rounded-[2rem] border-l-4 border-amber-500">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400">
                            <Award className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-full">
                            Top Performance
                        </span>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mt-1 truncate">
                        {stats.topDish?.name || 'Aucune donnée'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">Votre best-seller actuel</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* CHARTS SECTION */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card p-8 rounded-[2.5rem]">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Tendances des Ventes</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={MOCK_DAILY_STATS}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* DETAILED LIST */}
                    <div className="glass-card rounded-[2.5rem] overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Détails par Plat</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 dark:bg-gray-800/50">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-black uppercase text-gray-400">Plat</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase text-gray-400 text-center">Ventes</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase text-gray-400 text-center">Favoris</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase text-gray-400 text-center">Revenus</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase text-gray-400">Tendance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {dishPerformance.map((dish) => (
                                        <tr key={dish.menuItemId} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                        <ChefHat className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 dark:text-white">{dish.name}</p>
                                                        <p className="text-xs text-gray-500">{dish.category}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center font-medium text-gray-700 dark:text-gray-300">
                                                {dish.totalSold}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-pink-50 text-pink-600 text-xs font-bold">
                                                    <Heart className="w-3 h-3 fill-current" />
                                                    {dish.favoritesCount}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center font-bold text-gray-900 dark:text-white">
                                                {(dish.totalRevenue / 1000).toFixed(0)}K
                                            </td>
                                            <td className="px-6 py-4">
                                                {dish.trend === 'UP' && (
                                                    <span className="inline-flex items-center gap-1 text-emerald-500 text-xs font-bold">
                                                        <ArrowUpRight className="w-4 h-4" /> En hausse
                                                    </span>
                                                )}
                                                {dish.trend === 'DOWN' && (
                                                    <span className="inline-flex items-center gap-1 text-red-500 text-xs font-bold">
                                                        <ArrowDownRight className="w-4 h-4" /> En baisse
                                                    </span>
                                                )}
                                                {dish.trend === 'STABLE' && (
                                                    <span className="inline-flex items-center gap-1 text-gray-400 text-xs font-bold">
                                                        Stable
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* RECOMMENDATIONS SIDEBAR */}
                <div className="space-y-6">
                    <div className="glass-card p-6 rounded-[2.5rem] bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-indigo-100 dark:border-indigo-900/30">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600">
                                <Award className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Conseils IA</h3>
                        </div>

                        <div className="space-y-4">
                            {dishPerformance.filter(d => d.recommendation).map((dish) => (
                                <div key={dish.menuItemId} className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                    <p className="text-xs font-bold text-indigo-500 uppercase mb-1">{dish.name}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {dish.recommendation}
                                    </p>
                                </div>
                            ))}
                            {dishPerformance.filter(d => d.recommendation).length === 0 && (
                                <p className="text-sm text-gray-500 italic">Aucune recommandation spécifique pour le moment.</p>
                            )}
                        </div>
                    </div>

                    <div className="glass-card p-6 rounded-[2.5rem]">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Top Catégories</h3>
                        <div className="space-y-4">
                            {['Burgers', 'Sushi', 'Plats Africains'].map((cat, i) => (
                                <div key={cat} className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{cat}</span>
                                    <div className="h-2 w-24 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full"
                                            style={{ width: `${80 - (i * 20)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    LayoutDashboard,
    Utensils,
    ChefHat,
    Megaphone,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Search
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navigation = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Restaurants', href: '/restaurants', icon: Utensils },
        { name: 'Ingrédients', href: '/ingredients', icon: ChefHat },
        { name: 'Promotions', href: '/promotions', icon: Megaphone },
        { name: 'Paramètres', href: '/settings', icon: Settings },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] flex overflow-hidden">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-2xl lg:shadow-none",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="h-full flex flex-col">
                    {/* Logo */}
                    <div className="h-24 flex items-center px-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                                <LayoutDashboard className="text-white w-6 h-6" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white">
                                ORGA<span className="text-primary">.</span>
                            </span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
                        <p className="px-4 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Menu Principal</p>
                        {navigation.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                className={({ isActive }) =>
                                    cn(
                                        "flex items-center px-4 py-3.5 text-sm font-bold rounded-2xl transition-all duration-300 group",
                                        isActive
                                            ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                                            : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-primary dark:hover:text-white"
                                    )
                                }
                            >
                                <item.icon className={cn(
                                    "mr-3 h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                                    "group-[.active]:text-white"
                                )} />
                                {item.name}
                            </NavLink>
                        ))}
                    </nav>

                    {/* User Profile & Logout */}
                    <div className="p-6 border-t border-gray-100 dark:border-gray-800">
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] p-4 mb-4">
                            <div className="flex items-center">
                                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg border border-primary/10">
                                    {user?.fullname?.charAt(0).toUpperCase() || 'A'}
                                </div>
                                <div className="ml-3 overflow-hidden">
                                    <p className="text-sm font-black text-gray-900 dark:text-white truncate">
                                        {user?.fullname || 'Admin User'}
                                    </p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight truncate">
                                        {user?.role || 'Administrateur'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all duration-300"
                        >
                            <LogOut className="h-5 w-5" />
                            Déconnexion
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 h-20 flex items-center justify-between px-8 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                        >
                            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>

                        <div className="hidden md:flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 px-4 py-2 rounded-xl border border-transparent focus-within:border-primary/20 focus-within:bg-white dark:focus-within:bg-gray-800 transition-all">
                            <Search className="w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Recherche globale..."
                                className="bg-transparent border-none text-sm focus:ring-0 w-64 text-gray-600 dark:text-gray-300"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="relative p-2.5 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group">
                            <Bell className="h-6 w-6 group-hover:shake" />
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
                        </button>
                        <div className="h-8 w-[1px] bg-gray-100 dark:bg-gray-800 mx-2"></div>
                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-black text-gray-900 dark:text-white leading-none">Status</p>
                                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter mt-1">En ligne</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 p-[2px]">
                                <div className="w-full h-full bg-white dark:bg-gray-900 rounded-[9px] flex items-center justify-center text-primary font-black text-xs">
                                    {user?.fullname?.charAt(0).toUpperCase() || 'A'}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
                    <div className="max-w-[1600px] mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

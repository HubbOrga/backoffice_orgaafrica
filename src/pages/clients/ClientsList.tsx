import { useState, useEffect, useMemo } from 'react';
import {
    Search,
    ShoppingBag,
    FileText,
    ChevronRight,
    Phone,
    Mail,
    X,
    Utensils,
    Loader2,
    Download
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { clientService } from '../../services/clientService';
import type { Client, Order, Invoice } from '../../types';
import { cn } from '../../lib/utils';

export default function ClientsList() {
    const { user } = useAuth();
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [clientHistory, setClientHistory] = useState<{ orders: Order[], invoices: Invoice[] } | null>(null);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    useEffect(() => {
        const fetchClients = async () => {
            setIsLoading(true);
            try {
                const data = await clientService.getAll(user);
                setClients(data);
            } catch (error) {
                console.error('Failed to fetch clients:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClients();
    }, [user]);

    const handleClientClick = async (client: Client) => {
        setSelectedClient(client);
        setIsLoadingHistory(true);
        try {
            const history = await clientService.getClientHistory(client.id, client.merchantId);
            setClientHistory(history);
        } catch (error) {
            console.error('Failed to fetch client history:', error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const filteredClients = useMemo(() => {
        return clients.filter(client =>
            client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.merchantName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [clients, searchTerm]);

    const handleExport = () => {
        const headers = ['Nom', 'Email', 'Téléphone', 'Restaurant', 'Commandes', 'Total Dépensé', 'Dernière commande'];
        const csvContent = [
            headers.join(','),
            ...filteredClients.map(client => [
                `"${client.name}"`,
                `"${client.email}"`,
                `"${client.phone || ''}"`,
                `"${client.merchantName}"`,
                `"${client.totalOrders}"`,
                `"${client.totalSpent}"`,
                `"${new Date(client.lastOrderDate).toLocaleDateString()}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'clients_export.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="flex h-[calc(100vh-100px)] gap-6 animate-in fade-in duration-700">
            {/* LIST SECTION */}
            <div className={cn(
                "flex-1 flex flex-col space-y-6 transition-all duration-500",
                selectedClient ? "w-1/2" : "w-full"
            )}>
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                            Clients
                        </h1>
                        <p className="text-gray-500">Gérez votre base de données clients</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleExport}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 font-bold rounded-xl transition-all duration-300"
                        >
                            <Download className="w-5 h-5" />
                            Exporter
                        </button>
                        <div className="relative max-w-md w-full md:w-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher un client..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* TABLE */}
                <div className="flex-1 glass-card rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col">
                    {isLoading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        </div>
                    ) : (
                        <div className="overflow-y-auto custom-scrollbar flex-1">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md z-10">
                                    <tr className="border-b border-gray-100 dark:border-gray-800">
                                        <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Client</th>
                                        {!user?.merchantId && (
                                            <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Restaurant</th>
                                        )}
                                        <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400 text-center">Commandes</th>
                                        <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Total Dépensé</th>
                                        <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Dernière commande</th>
                                        <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {filteredClients.map((client) => (
                                        <tr
                                            key={`${client.id}-${client.merchantId}`}
                                            onClick={() => handleClientClick(client)}
                                            className={cn(
                                                "group cursor-pointer transition-all hover:bg-gray-50/50 dark:hover:bg-gray-800/30",
                                                selectedClient?.id === client.id && selectedClient?.merchantId === client.merchantId ? "bg-primary/5 dark:bg-primary/10" : ""
                                            )}
                                        >
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center text-gray-500 font-bold">
                                                        {client.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 dark:text-white">{client.name}</p>
                                                        <p className="text-xs text-gray-500">{client.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            {!user?.merchantId && (
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <Utensils className="w-3 h-3 text-gray-400" />
                                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{client.merchantName}</span>
                                                    </div>
                                                </td>
                                            )}
                                            <td className="px-8 py-5 text-center">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                                    {client.totalOrders}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="font-black text-gray-900 dark:text-white">
                                                    {(client.totalSpent / 1000).toFixed(0)}K FCFA
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-sm text-gray-500">
                                                    {new Date(client.lastOrderDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* DETAILS PANEL */}
            {selectedClient && (
                <div className="w-[450px] glass-card rounded-[2.5rem] border border-gray-100 dark:border-gray-800 flex flex-col animate-in slide-in-from-right-10 duration-500">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Détails Client</h2>
                        <button
                            onClick={() => setSelectedClient(null)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <div className="p-6 flex flex-col items-center text-center border-b border-gray-100 dark:border-gray-800">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-3xl font-black text-primary mb-4">
                            {selectedClient.name.charAt(0)}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedClient.name}</h3>
                        <p className="text-gray-500 mb-6">{selectedClient.merchantName}</p>

                        <div className="flex gap-4 w-full">
                            <a href={`mailto:${selectedClient.email}`} className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                                <Mail className="w-4 h-4" /> Email
                            </a>
                            <a href={`tel:${selectedClient.phone}`} className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                                <Phone className="w-4 h-4" /> Appeler
                            </a>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                        {/* STATS */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800/30">
                                <p className="text-xs font-bold text-gray-500 uppercase mb-1">Dépenses</p>
                                <p className="text-xl font-black text-gray-900 dark:text-white">{(selectedClient.totalSpent / 1000).toFixed(0)}K</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30">
                                <p className="text-xs font-bold text-gray-500 uppercase mb-1">Commandes</p>
                                <p className="text-xl font-black text-gray-900 dark:text-white">{selectedClient.totalOrders}</p>
                            </div>
                        </div>

                        {/* HISTORY */}
                        <div>
                            <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Historique Récent</h4>
                            {isLoadingHistory ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {clientHistory?.orders.map(order => (
                                        <div key={order.id} className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                                    <ShoppingBag className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-gray-900 dark:text-white">Commande #{order.orderNumber || order.id.slice(0, 6)}</p>
                                                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-sm">{(order.totalPrice / 1000).toFixed(0)}K</p>
                                                <span className={cn(
                                                    "text-[10px] font-bold px-2 py-0.5 rounded-full",
                                                    order.status === 'COMPLETED' ? "bg-emerald-100 text-emerald-700" :
                                                        order.status === 'CANCELLED' ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                                                )}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* INVOICES */}
                        {clientHistory?.invoices && clientHistory.invoices.length > 0 && (
                            <div className="mt-6">
                                <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Factures</h4>
                                <div className="space-y-4">
                                    {clientHistory.invoices.map(invoice => (
                                        <div key={invoice.id} className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-gray-900 dark:text-white">{invoice.invoiceNumber}</p>
                                                    <p className="text-xs text-gray-500">{new Date(invoice.issuedAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-sm">{(invoice.amount / 1000).toFixed(0)}K</p>
                                                <span className={cn(
                                                    "text-[10px] font-bold px-2 py-0.5 rounded-full",
                                                    invoice.status === 'PAID' ? "bg-emerald-100 text-emerald-700" :
                                                        invoice.status === 'OVERDUE' ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                                                )}>
                                                    {invoice.status === 'PAID' ? 'PAYÉE' : invoice.status === 'OVERDUE' ? 'EN RETARD' : 'EN ATTENTE'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

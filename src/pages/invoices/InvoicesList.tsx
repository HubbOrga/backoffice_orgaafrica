
import { useState, useMemo, useEffect } from 'react';
import {
    FileText,
    CheckCircle,
    Clock,
    AlertTriangle,
    Download,
    Search,
    RefreshCw,
    Loader2
} from 'lucide-react';
import { invoiceService } from '../../services/invoiceService';
import type { Invoice } from '../../types';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

const StatusBadge = ({ status }: { status: 'PAID' | 'PENDING' | 'OVERDUE' }) => {
    const config = {
        PAID: { label: 'Payée', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: CheckCircle },
        PENDING: { label: 'En attente', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Clock },
        OVERDUE: { label: 'En retard', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: AlertTriangle },
    }[status];

    const Icon = config.icon;

    return (
        <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider", config.color)}>
            <Icon className="w-3.5 h-3.5" />
            {config.label}
        </span>
    );
};

export default function InvoicesList() {
    const { user } = useAuth();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'PENDING' | 'OVERDUE'>('ALL');

    const fetchInvoices = async () => {
        setIsLoading(true);
        try {
            const data = await invoiceService.getAll(user);
            setInvoices(data);
        } catch (error) {
            console.error('Failed to fetch invoices:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const filteredInvoices = useMemo(() => {
        return invoices.filter(invoice => {
            const matchesSearch =
                invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                invoice.merchantName.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'ALL' || invoice.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [invoices, searchTerm, statusFilter]);

    const stats = useMemo(() => {
        const total = invoices.reduce((sum, inv) => sum + inv.amount, 0);
        const paid = invoices.filter(inv => inv.status === 'PAID').reduce((sum, inv) => sum + inv.amount, 0);
        const pending = invoices.filter(inv => inv.status === 'PENDING').reduce((sum, inv) => sum + inv.amount, 0);
        const overdue = invoices.filter(inv => inv.status === 'OVERDUE').reduce((sum, inv) => sum + inv.amount, 0);

        return { total, paid, pending, overdue };
    }, [invoices]);

    if (isLoading && invoices.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <p className="text-gray-500 font-medium">Chargement des factures...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-700">
            {/* HERO SECTION */}
            <div className="relative overflow-hidden rounded-3xl bg-primary p-8 lg:p-12 text-white shadow-2xl">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium border border-white/10">
                            <FileText className="w-3 h-3" />
                            <span>Gestion Financière</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                            Factures & <span className="text-white/70 font-light italic">Paiements</span>
                        </h1>
                        <p className="text-white/60 text-lg max-w-2xl">
                            Suivez les factures, les paiements et les échéances en temps réel.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                const headers = ['N° Facture', 'Client', 'Restaurant', 'Date d\'émission', 'Échéance', 'Montant', 'Statut'];
                                const csvContent = [
                                    headers.join(','),
                                    ...filteredInvoices.map(invoice => [
                                        `"${invoice.invoiceNumber}"`,
                                        `"${invoice.customerName}"`,
                                        `"${invoice.merchantName}"`,
                                        `"${new Date(invoice.issuedAt).toLocaleDateString()}"`,
                                        `"${new Date(invoice.dueDate).toLocaleDateString()}"`,
                                        `"${invoice.amount}"`,
                                        `"${invoice.status}"`
                                    ].join(','))
                                ].join('\n');

                                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                const link = document.createElement('a');
                                if (link.download !== undefined) {
                                    const url = URL.createObjectURL(blob);
                                    link.setAttribute('href', url);
                                    link.setAttribute('download', 'factures_export.csv');
                                    link.style.visibility = 'hidden';
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                }
                            }}
                            className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/20 transition-all flex items-center gap-2 text-sm font-bold"
                        >
                            <Download className="w-5 h-5" />
                            <span>Exporter</span>
                        </button>
                        <button
                            onClick={fetchInvoices}
                            disabled={isLoading}
                            className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/20 transition-all disabled:opacity-50"
                        >
                            <RefreshCw className={cn("w-6 h-6", isLoading && "animate-spin")} />
                        </button>
                        <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 text-center min-w-[140px]">
                            <p className="text-sm text-white/60 mb-1">Total Facturé</p>
                            <p className="text-2xl font-black">{(stats.total / 1000).toFixed(1)}K <span className="text-sm font-normal text-white/60">FCFA</span></p>
                        </div>
                    </div>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-[2rem] border-l-4 border-emerald-500">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-full">
                            Payé
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Montant Encaissé</p>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                        {stats.paid.toLocaleString()} <span className="text-lg text-gray-400 font-normal">FCFA</span>
                    </h3>
                </div>

                <div className="glass-card p-6 rounded-[2rem] border-l-4 border-blue-500">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                            <Clock className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full">
                            En attente
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Montant à Venir</p>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                        {stats.pending.toLocaleString()} <span className="text-lg text-gray-400 font-normal">FCFA</span>
                    </h3>
                </div>

                <div className="glass-card p-6 rounded-[2rem] border-l-4 border-red-500">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-400">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded-full">
                            En retard
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Montant Impayé</p>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                        {stats.overdue.toLocaleString()} <span className="text-lg text-gray-400 font-normal">FCFA</span>
                    </h3>
                </div>
            </div>

            {/* FILTERS & LIST */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher une facture, un client..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                        {(['ALL', 'PAID', 'PENDING', 'OVERDUE'] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                                    statusFilter === status
                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                        : "bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                                )}
                            >
                                {status === 'ALL' ? 'Tout' :
                                    status === 'PAID' ? 'Payées' :
                                        status === 'PENDING' ? 'En attente' : 'En retard'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="glass-card rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400">N° Facture</th>
                                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Client / Restaurant</th>
                                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Date d'émission</th>
                                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Échéance</th>
                                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Montant TTC</th>
                                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400 text-center">Statut Paiement</th>
                                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {filteredInvoices.map((invoice) => (
                                    <tr key={invoice.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-black text-gray-900 dark:text-white">{invoice.invoiceNumber}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">{invoice.customerName}</p>
                                                <p className="text-xs text-gray-500">{invoice.merchantName}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-sm text-gray-500">
                                                {new Date(invoice.issuedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={cn(
                                                "text-sm font-medium",
                                                new Date(invoice.dueDate) < new Date() && invoice.status !== 'PAID'
                                                    ? "text-red-500"
                                                    : "text-gray-500"
                                            )}>
                                                {new Date(invoice.dueDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-sm font-black text-gray-900 dark:text-white">
                                                {invoice.amount.toLocaleString()} FCFA
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <StatusBadge status={invoice.status} />
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all" title="Télécharger PDF">
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredInvoices.length === 0 && (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Aucune facture trouvée</h3>
                            <p className="text-gray-500">Essayez de modifier vos filtres de recherche.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

import type { Invoice } from '../types';
import { MOCK_INVOICES } from '../data/invoicesData';

const SIMULATED_DELAY = 600;

export const invoiceService = {
    getAll: async (user?: any): Promise<Invoice[]> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));

        // If user is a restaurant owner/staff, filter by their merchantId
        if (user?.merchantId) {
            return MOCK_INVOICES.filter(inv => inv.merchantId === user.merchantId);
        }

        // Admin sees all
        return [...MOCK_INVOICES];
    },

    getById: async (id: string): Promise<Invoice | undefined> => {
        await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
        return MOCK_INVOICES.find(inv => inv.id === id);
    },

    create: async (invoice: Omit<Invoice, 'id'>): Promise<Invoice> => {
        await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
        const newInvoice = {
            ...invoice,
            id: `inv_${Date.now()}`
        };
        MOCK_INVOICES.push(newInvoice);
        return newInvoice;
    },

    updateStatus: async (id: string, status: Invoice['status']): Promise<Invoice> => {
        await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
        const invoiceIndex = MOCK_INVOICES.findIndex(inv => inv.id === id);
        if (invoiceIndex === -1) throw new Error('Invoice not found');

        MOCK_INVOICES[invoiceIndex] = {
            ...MOCK_INVOICES[invoiceIndex],
            status
        };
        return MOCK_INVOICES[invoiceIndex];
    }
};

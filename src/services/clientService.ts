import type { Client, Order, Invoice } from '../types';
import { MOCK_ORDERS } from '../data/ordersData';
import { MOCK_INVOICES } from '../data/invoicesData';

const SIMULATED_DELAY = 500;

export const clientService = {
    getAll: async (user?: any): Promise<Client[]> => {
        await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));

        // Group orders by (merchantId, customerId)
        const clientMap = new Map<string, Client>();

        MOCK_ORDERS.forEach(order => {
            const key = `${order.merchantId}-${order.customerId}`;

            if (!clientMap.has(key)) {
                clientMap.set(key, {
                    id: order.customerId,
                    name: order.user_name || 'Client Inconnu',
                    email: `${order.user_name?.toLowerCase().replace(/\s/g, '.')}@example.com`,
                    phone: '+228 90 00 00 00',
                    totalOrders: 0,
                    totalSpent: 0,
                    lastOrderDate: order.createdAt,
                    merchantId: order.merchantId,
                    merchantName: order.restaurant_name || 'Restaurant Inconnu',
                    status: 'ACTIVE'
                });
            }

            const client = clientMap.get(key)!;
            client.totalOrders += 1;
            client.totalSpent += order.totalPrice;
            if (new Date(order.createdAt) > new Date(client.lastOrderDate)) {
                client.lastOrderDate = order.createdAt;
            }
        });

        let clients = Array.from(clientMap.values());

        // Filter by merchant if user is restricted
        if (user?.merchantId) {
            clients = clients.filter(c => c.merchantId === user.merchantId);
        }

        return clients;
    },

    getClientHistory: async (clientId: string, merchantId: string): Promise<{ orders: Order[], invoices: Invoice[] }> => {
        await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));

        const orders = MOCK_ORDERS.filter(o => o.customerId === clientId && o.merchantId === merchantId);
        const invoices = MOCK_INVOICES.filter(i => i.customerId === clientId && i.merchantId === merchantId);

        return { orders, invoices };
    }
};

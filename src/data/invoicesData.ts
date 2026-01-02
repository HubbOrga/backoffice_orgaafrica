import type { Invoice } from '../types';

export const MOCK_INVOICES: Invoice[] = [
    {
        id: 'inv1',
        orderId: 'ord1',
        invoiceNumber: 'INV-2025-001',
        amount: 25000,
        status: 'PAID',
        issuedAt: '2025-12-28T12:30:00Z',
        dueDate: '2026-01-28T12:30:00Z',
        merchantId: '1',
        merchantName: 'Le Petit Bistro',
        customerId: 'user1',
        customerName: 'Jean Dupont'
    },
    {
        id: 'inv2',
        orderId: 'ord2',
        invoiceNumber: 'INV-2025-002',
        amount: 18500,
        status: 'PAID',
        issuedAt: '2025-12-28T19:00:00Z',
        dueDate: '2026-01-28T19:00:00Z',
        merchantId: '2',
        merchantName: 'Pizza Palace',
        customerId: 'user2',
        customerName: 'Marie Koné'
    },
    {
        id: 'inv3',
        orderId: 'ord4',
        invoiceNumber: 'INV-2025-003',
        amount: 35000,
        status: 'PENDING',
        issuedAt: '2025-12-29T13:00:00Z',
        dueDate: '2026-01-29T13:00:00Z',
        merchantId: '3',
        merchantName: 'Sushi Master',
        customerId: 'user4',
        customerName: 'Saliou Diallo'
    },
    {
        id: 'inv4',
        orderId: 'ord6',
        invoiceNumber: 'INV-2025-004',
        amount: 28000,
        status: 'OVERDUE',
        issuedAt: '2025-11-29T12:00:00Z',
        dueDate: '2025-12-29T12:00:00Z',
        merchantId: '4',
        merchantName: 'Chez Mama',
        customerId: 'user6',
        customerName: 'Koffi Mensah'
    },
    {
        id: 'inv5',
        orderId: 'ord9',
        invoiceNumber: 'INV-2025-005',
        amount: 26000,
        status: 'PAID',
        issuedAt: '2025-12-29T11:00:00Z',
        dueDate: '2026-01-29T11:00:00Z',
        merchantId: '2',
        merchantName: 'Pizza Palace',
        customerId: 'user1',
        customerName: 'Jean Dupont'
    },
    {
        id: 'inv6',
        orderId: 'ord10',
        invoiceNumber: 'INV-2025-006',
        amount: 35000,
        status: 'PENDING',
        issuedAt: '2025-12-27T19:30:00Z',
        dueDate: '2026-01-27T19:30:00Z',
        merchantId: '4',
        merchantName: 'Chez Mama',
        customerId: 'user2',
        customerName: 'Marie Koné'
    },
    {
        id: 'inv7',
        orderId: 'ord11',
        invoiceNumber: 'INV-2025-007',
        amount: 19500,
        status: 'PAID',
        issuedAt: '2025-12-25T12:00:00Z',
        dueDate: '2026-01-25T12:00:00Z',
        merchantId: '1',
        merchantName: 'Le Petit Bistro',
        customerId: 'user3',
        customerName: 'Abdoulaye Traoré'
    },
    {
        id: 'inv8',
        orderId: 'ord12',
        invoiceNumber: 'INV-2025-008',
        amount: 42000,
        status: 'PAID',
        issuedAt: '2025-12-26T20:00:00Z',
        dueDate: '2026-01-26T20:00:00Z',
        merchantId: '3',
        merchantName: 'Sushi Master',
        customerId: 'user4',
        customerName: 'Saliou Diallo'
    }
];

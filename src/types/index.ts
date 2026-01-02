/** 
 * TYPES GLOBAUX & ÉNUMÉRATIONS
 */

export type UUID = string;

export const OrderStatus = {
    PENDING: "PENDING",
    PREPARING: "PREPARING",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED"
} as const;
export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export const ReservationStatus = {
    CONFIRMED: "CONFIRMED",
    CANCELLED: "CANCELLED",
    COMPLETED: "COMPLETED"
} as const;
export type ReservationStatus = typeof ReservationStatus[keyof typeof ReservationStatus];

// --- MODULE : AUTH & USERS ---

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface User {
    id: UUID;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    avatar?: string | null;
    username?: string; // API User has firstName/lastName, mock had username
    fullname?: string; // UI helper
    merchantId?: UUID; // For restaurant owners/staff
}

export interface OTPRequest {
    phoneOrEmail: string;
    method: "SMS" | "EMAIL";
}

// --- MODULE : RBAC (Rôles & Permissions) ---

export interface Role {
    id: UUID;
    name: string;
    description?: string;
    permissions: string[]; // Liste des slugs de permissions
    usersCount?: number;
}

export interface Permission {
    id: string;
    name: string;
    description: string;
    module: string;
}

// --- MODULE : CATALOGUE (Menu, Categories, etc.) ---

export interface Category {
    id: UUID;
    name: string;
    description?: string;
    image?: string;
    subcategories?: Subcategory[];
}

export interface Subcategory {
    id: UUID;
    categoryId: UUID;
    name: string;
}

export interface MenuItem {
    id: UUID;
    merchantId: UUID;
    categoryId: UUID;
    subcategoryId?: UUID;
    name: string;
    description: string;
    price: number;
    image?: string;
    isAvailable: boolean;
    preparationTime?: number;
    supplements?: string[]; // IDs of supplements
}

export interface Supplement {
    id: UUID;
    name: string;
    price: number;
    isAvailable: boolean;
    category?: string;
}

export interface Promotion {
    id: UUID;
    title?: string; // API title
    name?: string; // UI name (alias for title)
    description: string;
    discountPercentage?: number;
    discount_type?: string;
    discount_value?: number;
    code?: string;
    restaurant?: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    status?: string;
    usage_count?: number;
    max_uses?: number | null;
}

// --- MODULE : MARCHANDS & STAFF ---

export interface Merchant {
    id: UUID;
    name: string;
    description: string;
    address: string;
    logo?: string;
    banner?: string;
    contactEmail: string;
    contactPhone: string;
    openingHours: Record<string, string>; // Ex: { "monday": "09:00-18:00" }
}

export interface Restaurant extends Merchant {
    rating?: number;
    reviews?: number;
    is_open?: boolean;
    cuisine?: string;
    image?: string; // Alias for logo
    is_verified?: boolean;
    opening_hours?: string; // Alias for openingHours (UI uses string)
    phone?: string; // Alias for contactPhone
}

export interface StaffMember {
    id: UUID;
    merchantId: UUID;
    userId: UUID;
    merchantRoleId: UUID;
    user?: User;
    roleName?: string; // UI helper
}

export interface MerchantRole {
    id: UUID;
    merchantId: UUID;
    name: string;
    permissions: string[];
}

// --- MODULE : OPÉRATIONS (Tables, Reservations, Orders) ---

export interface Table {
    id: UUID;
    merchantId: UUID;
    tableNumber: string;
    capacity: number;
    isAvailable: boolean;
    status?: 'available' | 'occupied' | 'reserved'; // UI helper
    location?: string;
}

export interface Reservation {
    id: UUID;
    merchantId: UUID;
    userId: UUID;
    tableId?: UUID;
    reservationTime: string;
    guestCount: number;
    status: ReservationStatus;
    note?: string;
    restaurant_name?: string; // UI helper
    user_name?: string; // UI helper
    date?: string; // UI helper (reservationTime is ISO)
    time?: string; // UI helper
    guests?: number; // guestCount in API
}

export interface Order {
    id: UUID;
    orderNumber: string;
    customerId: UUID;
    merchantId: UUID;
    tableId?: UUID;
    items: OrderItem[];
    totalPrice: number;
    status: OrderStatus;
    createdAt: string;
    restaurant_name?: string; // UI helper
    user_name?: string; // UI helper
}

export interface OrderItem {
    menuItemId: UUID;
    quantity: number;
    unitPrice: number;
    selectedSupplements?: UUID[];
    id?: string;
    name?: string;
    total_price?: number;
}

export interface Invoice {
    id: UUID;
    orderId: UUID;
    invoiceNumber: string;
    amount: number;
    status: 'PAID' | 'PENDING' | 'OVERDUE';
    pdfUrl?: string;
    issuedAt: string;
    dueDate: string;
    merchantId: UUID;
    merchantName: string;
    customerId: UUID;
    customerName: string;
}

// --- MODULE : PRÉFÉRENCES ---

export interface Favorite {
    id: UUID;
    userId: UUID;
    merchantId?: UUID;
    menuItemId?: UUID;
}

// UI Specific Types
export interface OrderStatistics {
    totalOrders: number;
    cancelledOrders: number;
    completedOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
}

export interface MerchantOrderStatistics extends OrderStatistics {
    restaurant_id: string;
    restaurant_name: string;
    totalReservations: number;
    cancelledReservations: number;
}

// Keeping Ingredient for now to avoid breaking anything that might still use it
export interface Ingredient {
    id: string;
    name: string;
    category: string;
    unit: string;
    stock_quantity: number;
    min_stock: number;
    price_per_unit: number;
    supplier: string;
    last_restock: string;
}

// --- MODULE : ANALYTICS ---

export interface DishPerformance {
    menuItemId: UUID;
    name: string;
    category: string;
    price: number;
    totalSold: number;
    totalRevenue: number;
    favoritesCount: number;
    viewsCount: number;
    trend: 'UP' | 'DOWN' | 'STABLE';
    recommendation?: string;
    merchantId: UUID;
}

export interface AnalyticsSummary {
    totalRevenue: number;
    totalOrders: number;
    topDishes: DishPerformance[];
    dailyStats: { date: string; revenue: number; orders: number }[];
}

// --- MODULE : CLIENTS ---

export interface Client {
    id: UUID;
    name: string;
    email?: string;
    phone?: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate: string;
    merchantId: UUID; // The restaurant they belong to in this context
    merchantName: string;
    status: 'ACTIVE' | 'INACTIVE'; // Active if ordered recently
}

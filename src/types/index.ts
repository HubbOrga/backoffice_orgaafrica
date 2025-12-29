export interface Permission {
    id: string;
    name: string;
    description: string;
    module: string;
}

export interface Role {
    id: string;
    name: string;
    description: string;
    permissions: string[]; // Permission IDs
    usersCount: number;
}

export interface User {
    id: string;
    username: string;
    fullname: string;
    email: string;
    phone: string;
    role: string; // Role ID or Role Name (we should probably use Role ID, but current UsersList uses string keys like 'admin')
    email_verified: boolean;
    created_at: string;
    avatar: string | null;
}

export interface Restaurant {
    id: string;
    name: string;
    address: string;
    phone: string;
    cuisine: string;
    rating: number;
    reviews: number;
    is_verified: boolean;
    is_open: boolean;
    opening_hours: string;
    image: string;
}

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

export interface Promotion {
    id: string;
    name: string;
    description: string;
    discount_type: string;
    discount_value: number;
    code: string;
    restaurant: string;
    start_date: string;
    end_date: string;
    status: string;
    usage_count: number;
    max_uses: number | null;
}

// ============================================
// COMMANDES & MODULES LIÉS
// ============================================

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface Order {
    id: string;
    restaurant_id: string;
    restaurant_name: string;
    user_id: string;
    user_name: string;
    status: OrderStatus;
    total_amount: number;
    created_at: string;
    updated_at: string;
    items: OrderItem[];
    reservation_id?: string;
    table_id?: string;
    supplements?: Supplement[];
}

export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
}

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Reservation {
    id: string;
    restaurant_id: string;
    restaurant_name: string;
    user_id: string;
    user_name: string;
    date: string;
    time: string;
    guests: number;
    status: ReservationStatus;
    table_id?: string;
    special_requests?: string;
    created_at: string;
}

export interface Table {
    id: string;
    restaurant_id: string;
    table_number: string;
    capacity: number;
    status: 'available' | 'occupied' | 'reserved';
    location: string;
}

export interface Supplement {
    id: string;
    name: string;
    price: number;
    category: string;
}

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

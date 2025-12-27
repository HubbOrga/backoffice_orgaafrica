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

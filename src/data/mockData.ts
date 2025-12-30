import type { Permission, Role, User, Restaurant, Ingredient, Promotion, Category, MenuItem, Table, StaffMember, MerchantRole } from '../types';

export const AVAILABLE_PERMISSIONS: Permission[] = [
    { id: 'analytics.view', name: 'Voir Statistiques Globales', description: 'Accès complet aux dashboards analytics', module: 'Analytics' },
    { id: 'analytics.department', name: 'Voir Statistiques Département', description: 'Accès aux stats de son propre département', module: 'Analytics' },
    { id: 'analytics.personal', name: 'Voir Statistiques Personnelles', description: 'Accès uniquement à ses propres stats', module: 'Analytics' },
    { id: 'growth.manage', name: 'Gérer KPIs Croissance', description: 'Accès aux outils marketing et KPIs', module: 'Croissance' },
    { id: 'users.read', name: 'Voir Utilisateurs', description: 'Consulter la liste des utilisateurs', module: 'Utilisateurs' },
    { id: 'users.write', name: 'Gérer Utilisateurs', description: 'Créer, modifier et supprimer des utilisateurs', module: 'Utilisateurs' },
    { id: 'restaurants.read', name: 'Voir Marchands', description: 'Consulter la liste des marchands', module: 'Marchands' },
    { id: 'restaurants.write', name: 'Gérer Marchands', description: 'Gérer les fiches marchands', module: 'Marchands' },
    { id: 'ops.daily', name: 'Gestion Opérationnelle', description: 'Tâches quotidiennes et stocks', module: 'Opérations' },
    { id: 'ops.assigned', name: 'Tâches Assignées', description: 'Accès uniquement aux tâches assignées', module: 'Opérations' },
    { id: 'roles.manage', name: 'Gérer les Rôles', description: 'Modifier les permissions du système', module: 'Administration' },
];

export const MOCK_ROLES: Role[] = [
    {
        id: '1',
        name: 'Head of OrgaAfrica',
        description: 'Accès total au système (Super Admin)',
        permissions: AVAILABLE_PERMISSIONS.map(p => p.id),
        usersCount: 1
    },
    {
        id: '2',
        name: 'Chef de Pôle',
        description: 'Accès aux statistiques et à la gestion de son département',
        permissions: ['analytics.department', 'users.read', 'restaurants.read', 'ops.daily'],
        usersCount: 4
    },
    {
        id: '3',
        name: 'Responsable Progression',
        description: 'Focus sur les KPIs de croissance, marketing et analytics globaux',
        permissions: ['analytics.view', 'growth.manage', 'restaurants.read'],
        usersCount: 2
    },
    {
        id: '4',
        name: 'Staff',
        description: 'Gestion opérationnelle quotidienne et support',
        permissions: ['users.read', 'restaurants.read', 'ops.daily'],
        usersCount: 8
    },
    {
        id: '5',
        name: 'Employé',
        description: 'Accès restreint aux tâches assignées',
        permissions: ['ops.assigned', 'restaurants.read'],
        usersCount: 15
    },
    {
        id: '6',
        name: 'Stagiaire',
        description: 'Accès consultation uniquement (Lecture seule)',
        permissions: ['users.read', 'restaurants.read'],
        usersCount: 5
    },
    {
        id: '7',
        name: 'Influenceur',
        description: 'Accès limité à ses propres statistiques de conversion',
        permissions: ['analytics.personal'],
        usersCount: 12
    },
    {
        id: '8',
        name: 'Propriétaire',
        description: 'Gère son restaurant et ses commandes',
        permissions: ['restaurants.write', 'ops.daily'],
        usersCount: 1
    }
];

export const INITIAL_USERS: User[] = [
    {
        id: '1',
        username: 'john_doe',
        fullname: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        phone: '+228 90 12 34 56',
        role: '1', // Head of OrgaAfrica
        isActive: true,
        createdAt: '2024-01-15',
        avatar: null
    },
    {
        id: '2',
        username: 'marie_curie',
        fullname: 'Marie Curie',
        firstName: 'Marie',
        lastName: 'Curie',
        email: 'marie.curie@email.com',
        phone: '+228 91 23 45 67',
        role: '2', // Chef de Pôle
        isActive: true,
        createdAt: '2024-02-20',
        avatar: null
    },
    {
        id: '3',
        username: 'albert_e',
        fullname: 'Albert Einstein',
        firstName: 'Albert',
        lastName: 'Einstein',
        email: 'albert.e@email.com',
        phone: '+228 92 34 56 78',
        role: '5', // Employé
        isActive: false,
        createdAt: '2024-03-10',
        avatar: null
    },
    {
        id: '4',
        username: 'ada_love',
        fullname: 'Ada Lovelace',
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada.love@email.com',
        phone: '+228 93 45 67 89',
        role: '8', // Propriétaire
        isActive: true,
        createdAt: '2024-03-25',
        avatar: null
    },
    {
        id: '5',
        username: 'nikola_t',
        fullname: 'Nikola Tesla',
        firstName: 'Nikola',
        lastName: 'Tesla',
        email: 'nikola.t@email.com',
        phone: '+228 94 56 78 90',
        role: '5', // Employé
        isActive: true,
        createdAt: '2024-04-05',
        avatar: null
    },
];

export const ROLE_COLORS: Record<string, string> = {
    '1': 'bg-black text-white dark:bg-white dark:text-black', // Head
    '2': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', // Chef
    '3': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', // Resp Progression
    '4': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', // Staff
    '5': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200', // Employé
    '6': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', // Stagiaire
    '7': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200', // Influenceur
    '8': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', // Propriétaire
};

export const INITIAL_RESTAURANTS: Restaurant[] = [
    {
        id: '1',
        name: 'Le Petit Bistro',
        description: 'Un charmant bistro français au cœur de Lomé.',
        address: '123 Rue du Commerce, Lomé',
        contactPhone: '+228 90 12 34 56',
        contactEmail: 'contact@petitbistro.tg',
        cuisine: 'Française',
        rating: 4.8,
        reviews: 234,
        is_verified: true,
        is_open: true,
        openingHours: { "monday": "08:00-22:00", "tuesday": "08:00-22:00", "wednesday": "08:00-22:00", "thursday": "08:00-22:00", "friday": "08:00-23:00", "saturday": "09:00-23:00", "sunday": "09:00-21:00" },
        logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop'
    },
    {
        id: '2',
        name: 'Pizza Palace',
        description: 'Les meilleures pizzas au feu de bois de la ville.',
        address: '45 Avenue de la Liberté, Lomé',
        contactPhone: '+228 91 23 45 67',
        contactEmail: 'info@pizzapalace.tg',
        cuisine: 'Italienne',
        rating: 4.5,
        reviews: 189,
        is_verified: true,
        is_open: true,
        openingHours: { "monday": "10:00-23:00", "tuesday": "10:00-23:00", "wednesday": "10:00-23:00", "thursday": "10:00-23:00", "friday": "10:00-00:00", "saturday": "10:00-00:00", "sunday": "12:00-22:00" },
        logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop'
    },
    {
        id: '3',
        name: 'Sushi Master',
        description: 'Authentique cuisine japonaise et sushis frais.',
        address: '78 Boulevard Maritime, Lomé',
        contactPhone: '+228 92 34 56 78',
        contactEmail: 'sushi@master.tg',
        cuisine: 'Japonaise',
        rating: 4.9,
        reviews: 312,
        is_verified: true,
        is_open: false,
        openingHours: { "monday": "11:00-21:00", "tuesday": "11:00-21:00", "wednesday": "11:00-21:00", "thursday": "11:00-21:00", "friday": "11:00-22:00", "saturday": "11:00-22:00", "sunday": "closed" },
        logo: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=200&h=200&fit=crop'
    },
    {
        id: '4',
        name: 'Chez Mama',
        description: 'Cuisine africaine traditionnelle et généreuse.',
        address: '56 Rue des Palmiers, Lomé',
        contactPhone: '+228 93 45 67 89',
        contactEmail: 'mama@cuisine.tg',
        cuisine: 'Africaine',
        rating: 4.7,
        reviews: 456,
        is_verified: false,
        is_open: true,
        openingHours: { "monday": "07:00-20:00", "tuesday": "07:00-20:00", "wednesday": "07:00-20:00", "thursday": "07:00-20:00", "friday": "07:00-20:00", "saturday": "08:00-21:00", "sunday": "08:00-15:00" },
        logo: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200&h=200&fit=crop'
    },
    {
        id: '5',
        name: 'Burger Express',
        description: 'Burgers gourmets et service rapide.',
        address: '89 Avenue du 13 Janvier, Lomé',
        contactPhone: '+228 94 56 78 90',
        contactEmail: 'burger@express.tg',
        cuisine: 'Américaine',
        rating: 4.3,
        reviews: 167,
        is_verified: true,
        is_open: true,
        openingHours: { "monday": "09:00-00:00", "tuesday": "09:00-00:00", "wednesday": "09:00-00:00", "thursday": "09:00-00:00", "friday": "09:00-02:00", "saturday": "09:00-02:00", "sunday": "10:00-23:00" },
        logo: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=200&h=200&fit=crop'
    },
    {
        id: '6',
        name: 'Wok & Roll',
        description: 'Saveurs d\'Asie sautées au wok.',
        address: '34 Rue du Marché, Lomé',
        contactPhone: '+228 95 67 89 01',
        contactEmail: 'wok@roll.tg',
        cuisine: 'Asiatique',
        rating: 4.6,
        reviews: 278,
        is_verified: true,
        is_open: true,
        openingHours: { "monday": "11:30-22:30", "tuesday": "11:30-22:30", "wednesday": "11:30-22:30", "thursday": "11:30-22:30", "friday": "11:30-23:30", "saturday": "11:30-23:30", "sunday": "12:00-21:00" },
        logo: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&h=200&fit=crop'
    },
];

export const MOCK_CATEGORIES: Category[] = [
    {
        id: 'cat1',
        name: 'Entrées',
        description: 'Pour bien commencer votre repas',
        subcategories: [
            { id: 'sub1', name: 'Salades', categoryId: 'cat1' },
            { id: 'sub2', name: 'Soupes', categoryId: 'cat1' },
            { id: 'sub3', name: 'Amuse-bouches', categoryId: 'cat1' },
        ]
    },
    {
        id: 'cat2',
        name: 'Plats Résistants',
        description: 'Nos spécialités généreuses',
        subcategories: [
            { id: 'sub4', name: 'Viandes', categoryId: 'cat2' },
            { id: 'sub5', name: 'Poissons', categoryId: 'cat2' },
            { id: 'sub6', name: 'Pâtes & Pizzas', categoryId: 'cat2' },
            { id: 'sub7', name: 'Plats Locaux', categoryId: 'cat2' },
        ]
    },
    {
        id: 'cat3',
        name: 'Boissons',
        description: 'Rafraîchissements et vins',
        subcategories: [
            { id: 'sub8', name: 'Softs', categoryId: 'cat3' },
            { id: 'sub9', name: 'Vins', categoryId: 'cat3' },
            { id: 'sub10', name: 'Cocktails', categoryId: 'cat3' },
        ]
    },
    {
        id: 'cat4',
        name: 'Desserts',
        description: 'Une touche sucrée',
        subcategories: [
            { id: 'sub11', name: 'Gâteaux', categoryId: 'cat4' },
            { id: 'sub12', name: 'Glaces', categoryId: 'cat4' },
            { id: 'sub13', name: 'Fruits', categoryId: 'cat4' },
        ]
    }
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
    {
        id: 'menu1',
        merchantId: '1',
        categoryId: 'cat2',
        subcategoryId: 'sub4',
        name: 'Steak Frites Maison',
        description: 'Bœuf tendre grillé servi avec frites fraîches et salade.',
        price: 10000,
        image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400&h=300&fit=crop',
        isAvailable: true,
        preparationTime: 20,
        supplements: ['sup1', 'sup2', 'sup3']
    },
    {
        id: 'menu2',
        merchantId: '1',
        categoryId: 'cat1',
        subcategoryId: 'sub1',
        name: 'Salade César',
        description: 'Poulet grillé, croûtons, parmesan et sauce césar maison.',
        price: 5000,
        image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&h=300&fit=crop',
        isAvailable: true,
        preparationTime: 15,
        supplements: ['sup3']
    },
    {
        id: 'menu3',
        merchantId: '2',
        categoryId: 'cat2',
        subcategoryId: 'sub6',
        name: 'Pizza Margherita',
        description: 'Tomate, mozzarella fior di latte, basilic frais et huile d\'olive.',
        price: 8000,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?w=400&h=300&fit=crop',
        isAvailable: true,
        preparationTime: 12,
        supplements: ['sup3']
    },
    {
        id: 'menu4',
        merchantId: '3',
        categoryId: 'cat2',
        subcategoryId: 'sub5',
        name: 'Plateau Sushi Deluxe',
        description: 'Assortiment de 24 pièces (Nigiri, Maki, California).',
        price: 25000,
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop',
        isAvailable: true,
        preparationTime: 30
    },
    {
        id: 'menu5',
        merchantId: '1',
        categoryId: 'cat3',
        subcategoryId: 'sub8',
        name: 'Coca-Cola 33cl',
        description: 'Boisson rafraîchissante.',
        price: 1500,
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=300&fit=crop',
        isAvailable: true,
        preparationTime: 2
    },
    {
        id: 'menu6',
        merchantId: '4',
        categoryId: 'cat2',
        subcategoryId: 'sub7',
        name: 'Poulet Yassa',
        description: 'Poulet mariné aux oignons et citron, servi avec du riz blanc.',
        price: 12000,
        image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=300&fit=crop',
        isAvailable: true,
        preparationTime: 25
    }
];

export const INITIAL_INGREDIENTS: Ingredient[] = [
    {
        id: '1',
        name: 'Tomates fraîches',
        category: 'Légumes',
        unit: 'kg',
        stock_quantity: 150,
        min_stock: 50,
        price_per_unit: 500,
        supplier: 'Ferme Bio Togo',
        last_restock: '2024-12-10'
    },
    {
        id: '2',
        name: 'Poulet fermier',
        category: 'Viandes',
        unit: 'kg',
        stock_quantity: 45,
        min_stock: 30,
        price_per_unit: 3500,
        supplier: 'Élevage du Nord',
        last_restock: '2024-12-12'
    },
];

export const INITIAL_PROMOTIONS: Promotion[] = [
    {
        id: '1',
        name: 'Happy Hour -30%',
        description: 'Réduction sur toutes les boissons entre 17h et 19h',
        discount_type: 'percentage',
        discount_value: 30,
        code: 'HAPPY30',
        restaurant: 'Le Petit Bistro',
        startDate: '2024-12-01',
        endDate: '2024-12-31',
        status: 'active',
        isActive: true,
        usage_count: 234,
        max_uses: 500
    },
    {
        id: '2',
        name: 'Offre Nouvel An',
        description: 'Menu spécial avec champagne offert',
        discount_type: 'fixed',
        discount_value: 5000,
        code: 'NEWYEAR24',
        restaurant: 'Sushi Master',
        startDate: '2024-12-25',
        endDate: '2025-01-05',
        status: 'scheduled',
        isActive: true,
        usage_count: 0,
        max_uses: 100
    },
    {
        id: '3',
        name: 'Pizza 2+1',
        description: 'Pour 2 pizzas achetées, la 3ème offerte',
        discount_type: 'bogo',
        discount_value: 100,
        code: 'PIZZA3FOR2',
        restaurant: 'Pizza Palace',
        startDate: '2024-11-15',
        endDate: '2024-12-15',
        status: 'active',
        isActive: true,
        usage_count: 456,
        max_uses: 1000
    },
    {
        id: '4',
        name: 'Livraison Gratuite',
        description: 'Livraison offerte sans minimum d\'achat',
        discount_type: 'free_delivery',
        discount_value: 0,
        code: 'FREELIV',
        restaurant: 'Burger Express',
        startDate: '2024-12-01',
        endDate: '2024-12-20',
        status: 'active',
        isActive: true,
        usage_count: 789,
        max_uses: null
    },
    {
        id: '5',
        name: 'Promo Été 2024',
        description: 'Réduction de 15% sur tout le menu',
        discount_type: 'percentage',
        discount_value: 15,
        code: 'SUMMER24',
        restaurant: 'Chez Mama',
        startDate: '2024-06-01',
        endDate: '2024-08-31',
        status: 'expired',
        isActive: false,
        usage_count: 1234,
        max_uses: 2000
    },
    {
        id: '6',
        name: 'Pause Café',
        description: '-20% sur les desserts et cafés',
        discount_type: 'percentage',
        discount_value: 20,
        code: 'COFFEE20',
        restaurant: 'Le Petit Bistro',
        startDate: '2024-12-10',
        endDate: '2024-12-25',
        status: 'paused',
        isActive: false,
        usage_count: 67,
        max_uses: 200
    }
];

export const MOCK_TABLES: Table[] = [
    { id: 't1', merchantId: '1', tableNumber: '1', capacity: 2, isAvailable: true, status: 'available' },
    { id: 't2', merchantId: '1', tableNumber: '2', capacity: 4, isAvailable: true, status: 'available' },
    { id: 't3', merchantId: '1', tableNumber: '3', capacity: 4, isAvailable: false, status: 'occupied' },
    { id: 't4', merchantId: '1', tableNumber: '4', capacity: 6, isAvailable: true, status: 'available' },
    { id: 't5', merchantId: '2', tableNumber: '1', capacity: 4, isAvailable: true, status: 'available' },
    { id: 't6', merchantId: '2', tableNumber: '2', capacity: 2, isAvailable: true, status: 'available' },
];

export const MOCK_MERCHANT_ROLES: MerchantRole[] = [
    { id: 'mr1', merchantId: '1', name: 'Admin', permissions: ['all'] },
    { id: 'mr2', merchantId: '1', name: 'Serveur', permissions: ['orders.read', 'orders.write'] },
    { id: 'mr3', merchantId: '1', name: 'Cuisinier', permissions: ['orders.read', 'menu.read'] },
];

export const MOCK_STAFF: StaffMember[] = [
    { id: 's1', merchantId: '1', userId: '1', merchantRoleId: 'mr1', roleName: 'Admin' },
    { id: 's2', merchantId: '1', userId: '2', merchantRoleId: 'mr2', roleName: 'Serveur' },
    { id: 's3', merchantId: '1', userId: '3', merchantRoleId: 'mr3', roleName: 'Cuisinier' },
];

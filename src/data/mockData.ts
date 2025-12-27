import type { Permission, Role, User, Restaurant, Ingredient, Promotion } from '../types';

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
        email: 'john.doe@email.com',
        phone: '+228 90 12 34 56',
        role: '1', // Head of OrgaAfrica
        email_verified: true,
        created_at: '2024-01-15',
        avatar: null
    },
    {
        id: '2',
        username: 'marie_curie',
        fullname: 'Marie Curie',
        email: 'marie.curie@email.com',
        phone: '+228 91 23 45 67',
        role: '2', // Chef de Pôle
        email_verified: true,
        created_at: '2024-02-20',
        avatar: null
    },
    {
        id: '3',
        username: 'albert_e',
        fullname: 'Albert Einstein',
        email: 'albert.e@email.com',
        phone: '+228 92 34 56 78',
        role: '5', // Employé
        email_verified: false,
        created_at: '2024-03-10',
        avatar: null
    },
    {
        id: '4',
        username: 'ada_love',
        fullname: 'Ada Lovelace',
        email: 'ada.love@email.com',
        phone: '+228 93 45 67 89',
        role: '8', // Propriétaire
        email_verified: true,
        created_at: '2024-03-25',
        avatar: null
    },
    {
        id: '5',
        username: 'nikola_t',
        fullname: 'Nikola Tesla',
        email: 'nikola.t@email.com',
        phone: '+228 94 56 78 90',
        role: '5', // Employé
        email_verified: true,
        created_at: '2024-04-05',
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
        address: '123 Rue du Commerce, Lomé',
        phone: '+228 90 12 34 56',
        cuisine: 'Française',
        rating: 4.8,
        reviews: 234,
        is_verified: true,
        is_open: true,
        opening_hours: '08:00 - 22:00',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop'
    },
    {
        id: '2',
        name: 'Pizza Palace',
        address: '45 Avenue de la Liberté, Lomé',
        phone: '+228 91 23 45 67',
        cuisine: 'Italienne',
        rating: 4.5,
        reviews: 189,
        is_verified: true,
        is_open: true,
        opening_hours: '10:00 - 23:00',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop'
    },
    {
        id: '3',
        name: 'Sushi Master',
        address: '78 Boulevard Maritime, Lomé',
        phone: '+228 92 34 56 78',
        cuisine: 'Japonaise',
        rating: 4.9,
        reviews: 312,
        is_verified: true,
        is_open: false,
        opening_hours: '11:00 - 21:00',
        image: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=200&h=200&fit=crop'
    },
    {
        id: '4',
        name: 'Chez Mama',
        address: '56 Rue des Palmiers, Lomé',
        phone: '+228 93 45 67 89',
        cuisine: 'Africaine',
        rating: 4.7,
        reviews: 456,
        is_verified: false,
        is_open: true,
        opening_hours: '07:00 - 20:00',
        image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200&h=200&fit=crop'
    },
    {
        id: '5',
        name: 'Burger Express',
        address: '89 Avenue du 13 Janvier, Lomé',
        phone: '+228 94 56 78 90',
        cuisine: 'Américaine',
        rating: 4.3,
        reviews: 167,
        is_verified: true,
        is_open: true,
        opening_hours: '09:00 - 00:00',
        image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=200&h=200&fit=crop'
    },
    {
        id: '6',
        name: 'Wok & Roll',
        address: '34 Rue du Marché, Lomé',
        phone: '+228 95 67 89 01',
        cuisine: 'Asiatique',
        rating: 4.6,
        reviews: 278,
        is_verified: true,
        is_open: true,
        opening_hours: '11:30 - 22:30',
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&h=200&fit=crop'
    },
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
    {
        id: '3',
        name: 'Huile de palme',
        category: 'Huiles',
        unit: 'L',
        stock_quantity: 80,
        min_stock: 40,
        price_per_unit: 1200,
        supplier: 'Palmier d\'Or',
        last_restock: '2024-12-08'
    },
    {
        id: '4',
        name: 'Riz parfumé',
        category: 'Céréales',
        unit: 'kg',
        stock_quantity: 200,
        min_stock: 100,
        price_per_unit: 800,
        supplier: 'Import Asie',
        last_restock: '2024-12-05'
    },
    {
        id: '5',
        name: 'Piment frais',
        category: 'Épices',
        unit: 'kg',
        stock_quantity: 15,
        min_stock: 20,
        price_per_unit: 2000,
        supplier: 'Épices du Sahel',
        last_restock: '2024-12-01'
    },
    {
        id: '6',
        name: 'Poisson fumé',
        category: 'Poissons',
        unit: 'kg',
        stock_quantity: 35,
        min_stock: 25,
        price_per_unit: 4500,
        supplier: 'Pêcherie Côtière',
        last_restock: '2024-12-11'
    },
    {
        id: '7',
        name: 'Oignons',
        category: 'Légumes',
        unit: 'kg',
        stock_quantity: 120,
        min_stock: 60,
        price_per_unit: 400,
        supplier: 'Ferme Bio Togo',
        last_restock: '2024-12-09'
    },
    {
        id: '8',
        name: 'Farine de blé',
        category: 'Céréales',
        unit: 'kg',
        stock_quantity: 5,
        min_stock: 50,
        price_per_unit: 600,
        supplier: 'Moulins Réunis',
        last_restock: '2024-11-28'
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
        start_date: '2024-12-01',
        end_date: '2024-12-31',
        status: 'active',
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
        start_date: '2024-12-25',
        end_date: '2025-01-05',
        status: 'scheduled',
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
        start_date: '2024-11-15',
        end_date: '2024-12-15',
        status: 'active',
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
        start_date: '2024-12-01',
        end_date: '2024-12-20',
        status: 'active',
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
        start_date: '2024-06-01',
        end_date: '2024-08-31',
        status: 'expired',
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
        start_date: '2024-12-10',
        end_date: '2024-12-25',
        status: 'paused',
        usage_count: 67,
        max_uses: 200
    }
];

import type { DishPerformance } from '../types';

export const MOCK_DISH_PERFORMANCE: DishPerformance[] = [
    {
        menuItemId: 'item1',
        name: 'Burger Signature',
        category: 'Burgers',
        price: 5000,
        totalSold: 150,
        totalRevenue: 750000,
        favoritesCount: 45,
        viewsCount: 1200,
        trend: 'UP',
        recommendation: 'Best-seller ! Mettez-le en avant sur la page d\'accueil.',
        merchantId: '1'
    },
    {
        menuItemId: 'item2',
        name: 'Salade César',
        category: 'Entrées',
        price: 3500,
        totalSold: 80,
        totalRevenue: 280000,
        favoritesCount: 20,
        viewsCount: 500,
        trend: 'STABLE',
        recommendation: 'Bonne performance. Essayez une offre duo avec une boisson.',
        merchantId: '1'
    },
    {
        menuItemId: 'item3',
        name: 'Pizza Margherita',
        category: 'Pizzas',
        price: 4000,
        totalSold: 200,
        totalRevenue: 800000,
        favoritesCount: 80,
        viewsCount: 2000,
        trend: 'UP',
        recommendation: 'Super populaire ! Créez une variante "Spéciale" plus chère.',
        merchantId: '2'
    },
    {
        menuItemId: 'item4',
        name: 'Pâtes Carbonara',
        category: 'Pâtes',
        price: 4500,
        totalSold: 30,
        totalRevenue: 135000,
        favoritesCount: 5,
        viewsCount: 150,
        trend: 'DOWN',
        recommendation: 'Peu de ventes. Améliorez la photo ou la description.',
        merchantId: '2'
    },
    {
        menuItemId: 'item5',
        name: 'Sushi Saumon',
        category: 'Sushi',
        price: 6000,
        totalSold: 120,
        totalRevenue: 720000,
        favoritesCount: 60,
        viewsCount: 1500,
        trend: 'UP',
        recommendation: 'Top des favoris. Envoyez une notif push aux fans.',
        merchantId: '3'
    },
    {
        menuItemId: 'item6',
        name: 'Maki Avocat',
        category: 'Sushi',
        price: 3000,
        totalSold: 90,
        totalRevenue: 270000,
        favoritesCount: 30,
        viewsCount: 800,
        trend: 'STABLE',
        merchantId: '3'
    },
    {
        menuItemId: 'item7',
        name: 'Poulet Yassa',
        category: 'Plats Africains',
        price: 4000,
        totalSold: 180,
        totalRevenue: 720000,
        favoritesCount: 90,
        viewsCount: 2500,
        trend: 'UP',
        recommendation: 'Incontournable. Assurez-vous d\'avoir assez de stock !',
        merchantId: '4'
    }
];

export const MOCK_DAILY_STATS = [
    { date: 'Lun', revenue: 150000, orders: 12 },
    { date: 'Mar', revenue: 180000, orders: 15 },
    { date: 'Mer', revenue: 160000, orders: 14 },
    { date: 'Jeu', revenue: 200000, orders: 18 },
    { date: 'Ven', revenue: 350000, orders: 28 },
    { date: 'Sam', revenue: 450000, orders: 35 },
    { date: 'Dim', revenue: 400000, orders: 30 },
];

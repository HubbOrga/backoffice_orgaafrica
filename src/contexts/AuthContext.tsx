import React, { createContext, useContext, useState } from 'react';

// ============================================
// MODE FRONT-END ONLY - DONNÉES MOCKÉES
// ============================================

interface User {
    id: string;
    email: string;
    username: string;
    fullname: string;
    phone: string;
    avatar?: string;
    email_verified: boolean;
    created_at: string;
    role: string;
    merchantId?: string;
}

// Utilisateur mocké pour le développement front-end
const MOCK_USER: User = {
    id: '1',
    email: 'admin@orga.com',
    username: 'Admin',
    fullname: 'Super Administrateur',
    phone: '+228 90 00 00 00',
    avatar: undefined,
    email_verified: true,
    created_at: new Date().toISOString(),
    role: 'Head of OrgaAfrica'
};

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: { email: string; password: string }) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        // Vérifier si l'utilisateur est déjà "connecté" (simulation via localStorage)
        const isLoggedIn = localStorage.getItem('mock_logged_in');
        const storedRole = localStorage.getItem('mock_user_role');

        if (isLoggedIn === 'true') {
            if (storedRole === 'Restaurant Owner') {
                return {
                    ...MOCK_USER,
                    id: '2',
                    email: 'resto@orga.com',
                    username: 'RestoOwner',
                    fullname: 'Propriétaire Restaurant',
                    role: 'Restaurant Owner',
                    merchantId: '1'
                };
            }
            return MOCK_USER;
        }
        return null;
    });
    const [isLoading, setIsLoading] = useState(false);

    const login = async (credentials: { email: string; password: string }) => {
        console.log('Logging in with:', credentials.email);
        setIsLoading(true);
        // Simulation d'un délai réseau
        await new Promise(resolve => setTimeout(resolve, 500));

        // Connexion simulée - Logique de rôle basée sur l'email
        let simulatedUser = { ...MOCK_USER };

        if (credentials.email.includes('resto')) {
            simulatedUser = {
                ...MOCK_USER,
                id: '2',
                email: credentials.email,
                username: 'RestoOwner',
                fullname: 'Propriétaire Restaurant',
                role: 'Restaurant Owner',
                merchantId: '1' // Simule l'ID du "Petit Bistro"
            };
        }

        localStorage.setItem('mock_logged_in', 'true');
        localStorage.setItem('mock_user_role', simulatedUser.role); // Persist role for reload
        setUser(simulatedUser);
        setIsLoading(false);
    };

    const logout = () => {
        localStorage.removeItem('mock_logged_in');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

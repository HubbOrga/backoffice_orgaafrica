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
    role: 'admin'
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
        return isLoggedIn === 'true' ? MOCK_USER : null;
    });
    const [isLoading, setIsLoading] = useState(false);

    const login = async (credentials: { email: string; password: string }) => {
        console.log('Logging in with:', credentials.email);
        setIsLoading(true);
        // Simulation d'un délai réseau
        await new Promise(resolve => setTimeout(resolve, 500));

        // Connexion simulée - accepte n'importe quelles identifiants
        localStorage.setItem('mock_logged_in', 'true');
        setUser(MOCK_USER);
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

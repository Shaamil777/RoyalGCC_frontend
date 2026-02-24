import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { getCurrentUser, isAuthenticated, logout as authLogout, User } from '@/services/auth';


interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    refreshUser: () => Promise<void>;
    handleLogout: () => Promise<void>;
    setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoggedIn: false,
    isLoading: true,
    refreshUser: async () => { },
    handleLogout: async () => { },
    setUser: () => { },
});


export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = useCallback(async () => {
        try {
            const authenticated = await isAuthenticated();
            if (authenticated) {
                const storedUser = await getCurrentUser();
                setUser(storedUser);
                setIsLoggedIn(true);
            } else {
                setUser(null);
                setIsLoggedIn(false);
            }
        } catch {
            setUser(null);
            setIsLoggedIn(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleLogout = useCallback(async () => {
        await authLogout();
        setUser(null);
        setIsLoggedIn(false);
    }, []);

    const handleSetUser = useCallback((newUser: User) => {
        setUser(newUser);
        setIsLoggedIn(true);
    }, []);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoggedIn,
                isLoading,
                refreshUser,
                handleLogout,
                setUser: handleSetUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

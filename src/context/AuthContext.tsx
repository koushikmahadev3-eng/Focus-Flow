// @ts-nocheck
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import {
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut
} from 'firebase/auth';

const AuthContext = createContext<any>({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (auth) {
            const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                setUser(currentUser);
                setLoading(false);
            });
            return () => unsubscribe();
        } else {
            // Mock Mode initialization
            setLoading(false);
        }
    }, []);

    const login = async () => {
        if (auth) {
            const provider = new GoogleAuthProvider();
            return signInWithPopup(auth, provider);
        } else {
            console.log("Mock Login");
            // Simulate login
            setUser({
                uid: 'mock-user-123',
                displayName: 'Student Demo',
                email: 'student@example.com'
            });
            return Promise.resolve();
        }
    };

    const logout = () => {
        if (auth) {
            return signOut(auth);
        } else {
            setUser(null);
            return Promise.resolve();
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

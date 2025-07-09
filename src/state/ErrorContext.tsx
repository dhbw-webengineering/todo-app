"use client";

import React, { createContext, useState, ReactNode, useCallback } from 'react';
export interface ErrorContextType {
    error: string | null;
    setError: (message: string | null) => void;
}

export const ErrorContext = createContext<ErrorContextType>({
    error: null,
    setError: () => { },
});

export function ErrorProvider({ children }: { children: ReactNode }) {
    const [error, setErrorState] = useState<string | null>(null);

    const setError = useCallback((message: string | null) => {
        setErrorState(message);
        if (message) {
            setTimeout(() => setErrorState(null), 5000);
        }
    }, []);

    return (
        <ErrorContext.Provider value={{ error, setError }}>
            {children}
        </ErrorContext.Provider>
    );
}

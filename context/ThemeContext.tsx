import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

type ThemeContextType = {
    isDarkMode: boolean;
    toggleTheme: () => void;
    colors: typeof lightColors | typeof darkColors;
};

const lightColors = {
    background: '#FFFFFF',
    text: '#000000',
    primary: '#007AFF',
    secondary: '#5856D6',
    card: '#F2F2F2',
    border: '#E5E5E5',
};

const darkColors = {
    background: '#000000',
    text: '#FFFFFF',
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    card: '#1C1C1E',
    border: '#38383A',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const systemColorScheme = useColorScheme();
    const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

    useEffect(() => {
        setIsDarkMode(systemColorScheme === 'dark');
    }, [systemColorScheme]);

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    const value = {
        isDarkMode,
        toggleTheme,
        colors: isDarkMode ? darkColors : lightColors,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
} 
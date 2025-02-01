import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

type ThemeContextType = {
    isDarkMode: boolean;
    toggleTheme: () => void;
    colors: typeof Colors.light | typeof Colors.dark;
    setManualTheme: (isDark: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const systemColorScheme = useNativeColorScheme();
    const [isManuallySet, setIsManuallySet] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

    useEffect(() => {
        if (!isManuallySet) {
            setIsDarkMode(systemColorScheme === 'dark');
        }
    }, [systemColorScheme, isManuallySet]);

    const toggleTheme = () => {
        setIsManuallySet(true);
        setIsDarkMode(prev => !prev);
    };

    const setManualTheme = (isDark: boolean) => {
        setIsManuallySet(true);
        setIsDarkMode(isDark);
    };

    const value = {
        isDarkMode,
        toggleTheme,
        setManualTheme,
        colors: isDarkMode ? Colors.dark : Colors.light,
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
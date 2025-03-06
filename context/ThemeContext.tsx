import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';
import colors from '@/constants/colors';

type ThemeContextType = {
    isDarkMode: boolean;
    toggleTheme: () => void;
    colors: typeof colors.light | typeof colors.dark;
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
        colors: isDarkMode ? colors.dark : colors.light,
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
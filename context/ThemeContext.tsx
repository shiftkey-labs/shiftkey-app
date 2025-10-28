import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme as useNativeColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "@/app/styles/tailwind";
import colors from "@/constants/colors";

type ThemePreference = "system" | "light" | "dark";
type ColorScheme = "light" | "dark";

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: typeof colors.light | typeof colors.dark;
  setManualTheme: (isDark: boolean) => void;
  useSystemTheme: () => void;
  themePreference: ThemePreference;
  resolvedColorScheme: ColorScheme;
};

const THEME_PREFERENCE_KEY = "themePreference";

const defaultContextValue: ThemeContextType = {
  isDarkMode: false,
  toggleTheme: () => {},
  setManualTheme: () => {},
  useSystemTheme: () => {},
  themePreference: "system",
  resolvedColorScheme: "light",
  colors: colors.light,
};

const ThemeContext = createContext<ThemeContextType>(defaultContextValue);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useNativeColorScheme();
  const [themePreference, setThemePreference] =
    useState<ThemePreference>("system");

  useEffect(() => {
    let isMounted = true;

    const loadPreference = async () => {
      try {
        const storedPreference = await AsyncStorage.getItem(
          THEME_PREFERENCE_KEY
        );

        if (
          isMounted &&
          (storedPreference === "dark" ||
            storedPreference === "light" ||
            storedPreference === "system")
        ) {
          setThemePreference(storedPreference);
        }
      } catch (error) {
        console.error("Failed to load theme preference:", error);
      }
    };

    void loadPreference();

    return () => {
      isMounted = false;
    };
  }, []);

  const resolvedColorScheme: ColorScheme = useMemo(() => {
    if (themePreference === "system") {
      return systemColorScheme === "dark" ? "dark" : "light";
    }
    return themePreference;
  }, [systemColorScheme, themePreference]);

  useEffect(() => {
    tw.setColorScheme(resolvedColorScheme);
  }, [resolvedColorScheme]);

  const persistPreference = useCallback((preference: ThemePreference) => {
    setThemePreference(preference);

    if (preference === "system") {
      AsyncStorage.removeItem(THEME_PREFERENCE_KEY).catch((error) => {
        console.error("Failed to clear theme preference:", error);
      });
      return;
    }

    AsyncStorage.setItem(THEME_PREFERENCE_KEY, preference).catch((error) => {
      console.error("Failed to save theme preference:", error);
    });
  }, []);

  const toggleTheme = useCallback(() => {
    const nextPreference = resolvedColorScheme === "dark" ? "light" : "dark";
    persistPreference(nextPreference);
  }, [persistPreference, resolvedColorScheme]);

  const setManualTheme = useCallback(
    (isDark: boolean) => {
      persistPreference(isDark ? "dark" : "light");
    },
    [persistPreference]
  );

  const useSystemTheme = useCallback(() => {
    persistPreference("system");
  }, [persistPreference]);

  const contextValue = useMemo(
    () => ({
      isDarkMode: resolvedColorScheme === "dark",
      toggleTheme,
      setManualTheme,
      useSystemTheme,
      themePreference,
      resolvedColorScheme,
      colors: resolvedColorScheme === "dark" ? colors.dark : colors.light,
    }),
    [
      resolvedColorScheme,
      setManualTheme,
      themePreference,
      toggleTheme,
      useSystemTheme,
    ]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

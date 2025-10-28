import { useTheme } from "@/context/ThemeContext";

export function useColorScheme() {
  const { resolvedColorScheme } = useTheme();
  return resolvedColorScheme;
}

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeType = "dark" | "light" | "galaxy";

type ThemeContextType = {
  applied: ThemeType;
  setTheme: (theme: ThemeType) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const THEME_KEY = "app_theme";

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [applied, setApplied] = useState<ThemeType>("galaxy"); // default Galaxy theme

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(THEME_KEY);
      if (saved === "dark" || saved === "light" || saved === "galaxy") setApplied(saved);
    })();
  }, []);

  const setTheme = async (theme: ThemeType) => {
    setApplied(theme);
    await AsyncStorage.setItem(THEME_KEY, theme);
  };

  return (
    <ThemeContext.Provider value={{ applied, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
};

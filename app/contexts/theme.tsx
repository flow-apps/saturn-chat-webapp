import React, {
  useContext,
  useCallback,
  useEffect,
  createContext,
  useMemo,
  useState,
} from "react";
import { ThemeProvider } from "styled-components";
import dark from "../styles/themes/dark";
import light from "../styles/themes/light";

interface ThemeControllerContextData {
  toggleTheme: () => void;
  currentThemeName: "light" | "dark";
}

const ThemeControllerContext = createContext<ThemeControllerContextData>(
  {} as ThemeControllerContextData
);

export const ThemeControllerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [themeName, setThemeName] = useState<"light" | "dark">("dark");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedTheme = localStorage.getItem("@SaturnChat:theme") as "light" | "dark" | null;

    if (savedTheme) {
      setThemeName(savedTheme);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      setThemeName("light");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeName((prevTheme) => {
      const nextTheme = prevTheme === "light" ? "dark" : "light";
      
      if (typeof window !== "undefined") {
        localStorage.setItem("@SaturnChat:theme", nextTheme);
      }
      
      return nextTheme;
    });
  }, []);

  const themes = useMemo(
    () => ({
      dark,
      light,
    }),
    []
  );

  const currentTheme = themes[themeName] || themes.dark;

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.setAttribute("data-theme", themeName);
    }
  }, [themeName]);

  return (
    <ThemeControllerContext.Provider
      value={{ toggleTheme, currentThemeName: themeName }}
    >
      <ThemeProvider theme={currentTheme}>{children}</ThemeProvider>
    </ThemeControllerContext.Provider>
  );
};

export const useThemeController = () => {
  return useContext(ThemeControllerContext);
};
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("app_theme");

    return savedTheme === "light" ? "light" : "dark";
  });

  useEffect(() => {
    const root = document.documentElement;

    root.setAttribute("data-theme", theme);

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("app_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) =>
      current === "dark" ? "light" : "dark"
    );
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}
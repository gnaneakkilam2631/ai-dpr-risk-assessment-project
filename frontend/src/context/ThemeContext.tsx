import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem(
      "guardian-theme"
    );

    if (
      savedTheme === "dark" ||
      savedTheme === "light"
    ) {
      return savedTheme;
    }

    return "light";
  });

  /* =========================================================
     APPLY THEME
  ========================================================= */

  useEffect(() => {
    const html = document.documentElement;

    // IMPORTANT:
    // Your CSS uses data-theme.
    html.setAttribute("data-theme", theme);

    // Also keep Tailwind-compatible dark class.
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }

    localStorage.setItem(
      "guardian-theme",
      theme
    );
  }, [theme]);

  /* =========================================================
     TOGGLE
  ========================================================= */

  const toggleTheme = () => {
    setThemeState((previous) =>
      previous === "light"
        ? "dark"
        : "light"
    );
  };

  /* =========================================================
     SET THEME
  ========================================================= */

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

/* =========================================================
   HOOK
========================================================= */

export const useTheme = (): ThemeContextType => {
  const context = useContext(
    ThemeContext
  );

  if (!context) {
    throw new Error(
      "useTheme must be used within ThemeProvider"
    );
  }

  return context;
};

export default ThemeContext;
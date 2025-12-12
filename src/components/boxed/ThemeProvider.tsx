/*
  封装的ThemeContext组件，提供主题，实现主题切换功能
  2025-04-07
  by MasaoMinn
*/
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

// 类型定义
type Theme = "light" | "dark";
type ThemeContextType = {
  theme: Theme;
  currentTheme: number;
  toggleTheme: () => void;
  nextTheme: () => void;
  prevTheme: () => void;
  setThemeIndex: (index: number) => void;
};

// Context 定义
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 自定义 Hook 确保使用安全
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const darkTheme = [{
  backgroundColor: '#1C1C1C',
  color: '#EEEEFE',
  borderColor: '#000274ff',
}, {
  backgroundColor: "#003c11ff",
  color: "#e8ffe1ff",
  borderColor: "#260048ff",
}, {
  backgroundColor: "#540000ff",
  color: "#dffff5ff",
  borderColor: "#002139ff",
}];

export const lightTheme = [{
  backgroundColor: '#EEEEEE',
  color: '#000000',
  borderColor: '#FF0000',
}, {
  backgroundColor: "#e6ff80ff",
  color: "#260048ff",
  borderColor: "#044f19ff",
}, {
  backgroundColor: "#c5ffd5ff",
  color: "#2d0028ff",
  borderColor: "#87872aff",
}];

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // 获取初始主题（优先 localStorage > 系统主题 > 默认 light）
  const getInitialTheme = useCallback((): Theme => {
    try {
      // 优先从 localStorage 获取
      const storedTheme = localStorage.getItem("theme") as Theme | null;
      if (storedTheme === "light" || storedTheme === "dark") {
        return storedTheme;
      }
      // 检测系统主题
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return systemDark ? "dark" : "light";
    } catch (e) {
      // 回退
      console.log(e);
      return "light";
    }
  }, []);

  // 获取初始主题索引（优先 localStorage > 默认 0）
  const getInitialThemeIndex = useCallback((): number => {
    try {
      const storedIndex = localStorage.getItem("themeIndex");
      const index = parseInt(storedIndex || "0", 10);
      // 确保索引在有效范围内
      const currentThemeArray = getInitialTheme() === "dark" ? darkTheme : lightTheme;
      return Math.min(Math.max(0, index), currentThemeArray.length - 1);
    } catch (e) {
      // 回退
      console.log(e);
      return 0;
    }
  }, [getInitialTheme]);

  const [theme, setTheme] = useState<Theme>(getInitialTheme());
  const [currentTheme, setCurrentTheme] = useState<number>(getInitialThemeIndex());

  // 不再从 cookie 同步 theme

  // 切换主题方法（明暗切换）
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      try {
        localStorage.setItem("theme", newTheme);
      } catch (e) {
        console.warn(e);
      }
      return newTheme;
    });
  }, []);

  // 切换到下一个主题变体
  const nextTheme = useCallback(() => {
    setCurrentTheme((prevIndex) => {
      const currentThemeArray = theme === "dark" ? darkTheme : lightTheme;
      const newIndex = (prevIndex + 1) % currentThemeArray.length;
      try {
        localStorage.setItem("themeIndex", newIndex.toString());
      } catch (e) {
        console.warn(e);
      }
      return newIndex;
    });
  }, [theme]);

  // 切换到上一个主题变体
  const prevTheme = useCallback(() => {
    setCurrentTheme((prevIndex) => {
      const currentThemeArray = theme === "dark" ? darkTheme : lightTheme;
      const newIndex = (prevIndex - 1 + currentThemeArray.length) % currentThemeArray.length;
      try {
        localStorage.setItem("themeIndex", newIndex.toString());
      } catch (e) {
        console.warn(e);
      }
      return newIndex;
    });
  }, [theme]);

  // 直接设置主题变体索引
  const setThemeIndex = useCallback((index: number) => {
    const currentThemeArray = theme === "dark" ? darkTheme : lightTheme;
    const validIndex = Math.min(Math.max(0, index), currentThemeArray.length - 1);
    setCurrentTheme(validIndex);
    try {
      localStorage.setItem("themeIndex", validIndex.toString());
    } catch (e) {
      console.warn(e);
    }
  }, [theme]);

  // 当主题（明暗）变化时，重置主题索引
  useEffect(() => {
    const initialIndex = getInitialThemeIndex();
    setCurrentTheme(initialIndex);
  }, [theme, getInitialThemeIndex]);

  // 监听系统主题变化（仅在未手动设置时响应）
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      try {
        // 如果 localStorage 中不存在手动设置的主题，则跟随系统
        if (!localStorage.getItem("theme")) {
          setTheme(e.matches ? "dark" : "light");
        }
      } catch (e) {
        console.log(e);
        // 忽略 localStorage 错误
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  });

  // 同步主题到 DOM（可结合 CSS 自定义属性使用）
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, currentTheme, nextTheme, prevTheme, setThemeIndex }}>
      {children}
    </ThemeContext.Provider>
  );
};
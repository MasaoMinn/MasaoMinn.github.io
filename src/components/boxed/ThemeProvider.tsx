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
import { useLocalStorageStore } from '@/store/LocalStorageStore';

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

// Cookie相关操作已移至CookieStore中管理

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
  extraColor: '#d7f5edff',
}, {
  backgroundColor: "#003c11ff",
  color: "#e8ffe1ff",
  borderColor: "#260048ff",
  extraColor: '#cccfffff',
}, {
  backgroundColor: "#540000ff",
  color: "#dffff5ff",
  borderColor: "#002139ff",
  extraColor: '#fff5ccff',
}];

export const lightTheme = [{
  backgroundColor: '#EEEEEE',
  color: '#000000',
  borderColor: '#b68989ff',
  extraColor: '#863030ff',
}, {
  backgroundColor: "#e6ff80ff",
  color: "#260048ff",
  borderColor: "#61b879ff",
  extraColor: '#292993ff',
}, {
  backgroundColor: "#c5ffd5ff",
  color: "#2d0028ff",
  borderColor: "#d0d063ff",
  extraColor: '#184b88ff',
}];

export const ThemeProvider = ({ children }: { children: ReactNode }) => {

  // 获取初始主题
  const getInitialTheme = useCallback((): Theme => {
    try {
      // 优先从localStorage获取
      const localStorageTheme = useLocalStorageStore.getState().getThemeCookie();
      if (localStorageTheme === "light" || localStorageTheme === "dark") {
        return localStorageTheme;
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
      // 优先从localStorage获取
      const localStorageIndex = useLocalStorageStore.getState().getThemeIndexCookie();
      if (localStorageIndex) {
        const index = parseInt(localStorageIndex, 10);
        if (!isNaN(index)) {
          // 确保索引在有效范围内
          const currentThemeArray = getInitialTheme() === "dark" ? darkTheme : lightTheme;
          return Math.min(Math.max(0, index), currentThemeArray.length - 1);
        }
      }

      // 如果没有localStorage，则返回默认值0
      return 0;
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
        // 使用LocalStorageStore的方法设置主题localStorage
        useLocalStorageStore.getState().setThemeCookie(newTheme);
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
        // 使用LocalStorageStore的方法设置主题索引localStorage
        useLocalStorageStore.getState().setThemeIndexCookie(newIndex.toString());
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
        // 使用LocalStorageStore的方法设置主题索引localStorage
        useLocalStorageStore.getState().setThemeIndexCookie(newIndex.toString());
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
      // 使用LocalStorageStore的方法设置主题索引localStorage
      useLocalStorageStore.getState().setThemeIndexCookie(validIndex.toString());
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
        // 如果localStorage中不存在手动设置的主题，则跟随系统
        if (!useLocalStorageStore.getState().getThemeCookie()) {
          const newTheme = e.matches ? "dark" : "light";
          setTheme(newTheme);
          // 使用LocalStorageStore的方法设置主题localStorage
          useLocalStorageStore.getState().setThemeCookie(newTheme);
        }
      } catch (e) {
        console.log(e);
        // 忽略错误
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

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
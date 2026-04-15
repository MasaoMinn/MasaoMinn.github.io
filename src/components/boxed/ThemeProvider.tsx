"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useLayoutEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { useLocalStorageStore } from "@/store/LocalStorageStore";

/* ================= types ================= */

type Theme = "light" | "dark";
export type ThemePalette = {
  backgroundColor: string;
  color: string;
  borderColor: string;
  extraColor: string;
  backgroundColor2: string;
  color2: string;
  extraColor2: string;
};

const THEME_NAME_KEYS = [
  "red",
  "orange",
  "yellow",
  "green",
  "cyan",
  "blue",
  "purple",
  "black",
  "white",
  "gray",
] as const;
const BASE_THEME_COUNT = THEME_NAME_KEYS.length;

type ThemeNameKey = (typeof THEME_NAME_KEYS)[number] | "custom";
type ThemeVariant = {
  nameKey: ThemeNameKey;
  palette: ThemePalette;
};

type ThemeContextType = {
  theme: Theme;
  currentTheme: number;
  currentThemeNameKey: ThemeNameKey;
  currentPalette: ThemePalette;
  themeNameKeys: ThemeNameKey[];
  hasCustomTheme: boolean;
  toggleTheme: () => void;
  nextTheme: () => void;
  prevTheme: () => void;
  setThemeIndex: (index: number) => void;
  setCustomThemePalette: (palette: ThemePalette) => void;
  removeCustomThemePalette: () => void;
};

/* ================= theme data ================= */

export const darkTheme: ThemePalette[] = [
  {
    backgroundColor: "#1f0a0f",
    color: "#ffe6ea",
    borderColor: "#7f1d2d",
    extraColor: "#e11d48",
    backgroundColor2: "#300d15",
    color2: "#ffd5dd",
    extraColor2: "#fb7185",
  },
  {
    backgroundColor: "#241406",
    color: "#ffedd8",
    borderColor: "#9a3412",
    extraColor: "#ea580c",
    backgroundColor2: "#331d09",
    color2: "#fed8b0",
    extraColor2: "#fb923c",
  },
  {
    backgroundColor: "#211d05",
    color: "#fef9c3",
    borderColor: "#713f12",
    extraColor: "#ca8a04",
    backgroundColor2: "#322a07",
    color2: "#fef08a",
    extraColor2: "#facc15",
  },
  {
    backgroundColor: "#062312",
    color: "#ddfbe8",
    borderColor: "#166534",
    extraColor: "#16a34a",
    backgroundColor2: "#08351a",
    color2: "#c4f6d7",
    extraColor2: "#4ade80",
  },
  {
    backgroundColor: "#06232e",
    color: "#d1f8ff",
    borderColor: "#155e75",
    extraColor: "#0891b2",
    backgroundColor2: "#0a3442",
    color2: "#b3f2fd",
    extraColor2: "#22d3ee",
  },
  {
    backgroundColor: "#0d1b3a",
    color: "#e1ecff",
    borderColor: "#1d4ed8",
    extraColor: "#3b82f6",
    backgroundColor2: "#102756",
    color2: "#cddfff",
    extraColor2: "#60a5fa",
  },
  {
    backgroundColor: "#2b0a44",
    color: "#f6e8ff",
    borderColor: "#7e22ce",
    extraColor: "#a855f7",
    backgroundColor2: "#401066",
    color2: "#edd9ff",
    extraColor2: "#c084fc",
  },
  {
    backgroundColor: "#050505",
    color: "#f5f5f5",
    borderColor: "#3f3f46",
    extraColor: "#d4d4d8",
    backgroundColor2: "#121214",
    color2: "#e5e7eb",
    extraColor2: "#a1a1aa",
  },
  {
    backgroundColor: "#1b2430",
    color: "#f8fbff",
    borderColor: "#cbd5e1",
    extraColor: "#f1f5f9",
    backgroundColor2: "#273445",
    color2: "#e8eef6",
    extraColor2: "#cbd5e1",
  },
  {
    backgroundColor: "#151518",
    color: "#ececf0",
    borderColor: "#52525b",
    extraColor: "#a1a1aa",
    backgroundColor2: "#232327",
    color2: "#f4f4f5",
    extraColor2: "#d4d4d8",
  },
];

export const lightTheme: ThemePalette[] = [
  {
    backgroundColor: "#fff1f2",
    color: "#4a0d14",
    borderColor: "#fda4af",
    extraColor: "#be123c",
    backgroundColor2: "#ffe4e6",
    color2: "#6b1221",
    extraColor2: "#e11d48",
  },
  {
    backgroundColor: "#fff7ed",
    color: "#4a2203",
    borderColor: "#fdba74",
    extraColor: "#c2410c",
    backgroundColor2: "#ffedd5",
    color2: "#7c2d12",
    extraColor2: "#ea580c",
  },
  {
    backgroundColor: "#fefce8",
    color: "#3f2f00",
    borderColor: "#fde047",
    extraColor: "#a16207",
    backgroundColor2: "#fef9c3",
    color2: "#5b3a00",
    extraColor2: "#ca8a04",
  },
  {
    backgroundColor: "#f0fdf4",
    color: "#052e16",
    borderColor: "#86efac",
    extraColor: "#15803d",
    backgroundColor2: "#dcfce7",
    color2: "#14532d",
    extraColor2: "#16a34a",
  },
  {
    backgroundColor: "#ecfeff",
    color: "#083344",
    borderColor: "#67e8f9",
    extraColor: "#0e7490",
    backgroundColor2: "#cffafe",
    color2: "#155e75",
    extraColor2: "#06b6d4",
  },
  {
    backgroundColor: "#eff6ff",
    color: "#172554",
    borderColor: "#93c5fd",
    extraColor: "#1d4ed8",
    backgroundColor2: "#dbeafe",
    color2: "#1e3a8a",
    extraColor2: "#2563eb",
  },
  {
    backgroundColor: "#faf5ff",
    color: "#3b0764",
    borderColor: "#d8b4fe",
    extraColor: "#7e22ce",
    backgroundColor2: "#f3e8ff",
    color2: "#581c87",
    extraColor2: "#9333ea",
  },
  {
    backgroundColor: "#f7f7f8",
    color: "#111111",
    borderColor: "#a1a1aa",
    extraColor: "#27272a",
    backgroundColor2: "#efeff1",
    color2: "#18181b",
    extraColor2: "#52525b",
  },
  {
    backgroundColor: "#ffffff",
    color: "#0f172a",
    borderColor: "#d4d4d8",
    extraColor: "#334155",
    backgroundColor2: "#f8fafc",
    color2: "#1e293b",
    extraColor2: "#64748b",
  },
  {
    backgroundColor: "#f6f7f8",
    color: "#202126",
    borderColor: "#b4b5bd",
    extraColor: "#5b5d69",
    backgroundColor2: "#ececf0",
    color2: "#2f3138",
    extraColor2: "#7a7d8a",
  },
];

const HEX_COLOR = /^#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

const isThemePalette = (value: unknown): value is ThemePalette => {
  if (!value || typeof value !== "object") return false;
  const palette = value as Partial<ThemePalette>;
  const requiredKeys: (keyof ThemePalette)[] = [
    "backgroundColor",
    "color",
    "borderColor",
    "extraColor",
    "backgroundColor2",
    "color2",
    "extraColor2",
  ];

  return requiredKeys.every((key) => {
    const colorValue = palette[key];
    return typeof colorValue === "string" && HEX_COLOR.test(colorValue);
  });
};

const parseCustomThemePalette = (raw: string | null): ThemePalette | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return isThemePalette(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const getThemeVariants = (
  mode: Theme,
  customThemePalette: ThemePalette | null
): ThemeVariant[] => {
  const list = mode === "dark" ? darkTheme : lightTheme;
  const variants: ThemeVariant[] = list.map((palette, index) => ({
    nameKey: THEME_NAME_KEYS[index] ?? "gray",
    palette,
  }));

  if (customThemePalette) {
    variants.push({
      nameKey: "custom",
      palette: customThemePalette,
    });
  }

  return variants;
};

type RgbColor = { r: number; g: number; b: number };

const clampChannel = (value: number) => Math.max(0, Math.min(255, value));

const hexToRgb = (hex: string): RgbColor | null => {
  const normalized = hex.trim().toLowerCase();
  const matched = normalized.match(/^#([0-9a-f]{6}|[0-9a-f]{8})$/);
  if (!matched) return null;

  const full = matched[1];
  const source = full.length === 8 ? full.slice(0, 6) : full;

  return {
    r: parseInt(source.slice(0, 2), 16),
    g: parseInt(source.slice(2, 4), 16),
    b: parseInt(source.slice(4, 6), 16),
  };
};

const rgbToHex = ({ r, g, b }: RgbColor): string =>
  `#${clampChannel(Math.round(r)).toString(16).padStart(2, "0")}${clampChannel(
    Math.round(g)
  )
    .toString(16)
    .padStart(2, "0")}${clampChannel(Math.round(b)).toString(16).padStart(2, "0")}`;

const mixHexColor = (base: string, target: string, ratio: number): string => {
  const baseRgb = hexToRgb(base);
  const targetRgb = hexToRgb(target);
  if (!baseRgb || !targetRgb) return base;

  return rgbToHex({
    r: baseRgb.r + (targetRgb.r - baseRgb.r) * ratio,
    g: baseRgb.g + (targetRgb.g - baseRgb.g) * ratio,
    b: baseRgb.b + (targetRgb.b - baseRgb.b) * ratio,
  });
};

const resolveButtonColors = (
  mode: Theme,
  palette: ThemePalette,
  isCustomTheme: boolean
) => {
  if (isCustomTheme) {
    return {
      primary: palette.extraColor,
      primaryHover: palette.extraColor2,
    };
  }

  if (mode === "light") {
    return {
      primary: mixHexColor(palette.extraColor, "#ffffff", 0.24),
      primaryHover: mixHexColor(palette.extraColor2, "#ffffff", 0.18),
    };
  }

  return {
    primary: mixHexColor(palette.extraColor, "#000000", 0.2),
    primaryHover: mixHexColor(palette.extraColor2, "#000000", 0.16),
  };
};

/* ================= context ================= */

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
};

const applyThemeTokens = (
  mode: Theme,
  palette: ThemePalette,
  isCustomTheme: boolean
) => {
  const buttonColors = resolveButtonColors(mode, palette, isCustomTheme);
  const root = document.documentElement;
  root.setAttribute("data-theme", mode);
  root.style.setProperty("--background", palette.backgroundColor);
  root.style.setProperty("--foreground", palette.color);
  root.style.setProperty("--border", palette.borderColor);
  root.style.setProperty("--input", palette.borderColor);
  root.style.setProperty("--ring", palette.extraColor2);
  root.style.setProperty("--primary", buttonColors.primary);
  root.style.setProperty("--primary-foreground", palette.color);
  root.style.setProperty("--secondary", palette.backgroundColor2);
  root.style.setProperty("--secondary-foreground", palette.color2);
  root.style.setProperty("--muted", palette.backgroundColor2);
  root.style.setProperty("--muted-foreground", palette.extraColor2);
  root.style.setProperty("--accent", buttonColors.primaryHover);
  root.style.setProperty("--accent-foreground", palette.color2);
  root.style.setProperty("--card", palette.backgroundColor2);
  root.style.setProperty("--card-foreground", palette.color2);
  root.style.setProperty("--popover", palette.backgroundColor2);
  root.style.setProperty("--popover-foreground", palette.color2);
  root.style.setProperty("--theme-bg", palette.backgroundColor);
  root.style.setProperty("--theme-fg", palette.color);
  root.style.setProperty("--theme-border", palette.borderColor);
  root.style.setProperty("--theme-accent", palette.extraColor);
  root.style.setProperty("--theme-bg-2", palette.backgroundColor2);
  root.style.setProperty("--theme-fg-2", palette.color2);
  root.style.setProperty("--theme-accent-2", palette.extraColor2);
  root.style.setProperty("--theme-button-bg", buttonColors.primary);
  root.style.setProperty("--theme-button-bg-hover", buttonColors.primaryHover);
};

/* ================= provider ================= */

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  /** ⚠️ 初始值不要读 localStorage */
  const [theme, setTheme] = useState<Theme>("light");
  const [currentTheme, setCurrentTheme] = useState(0);
  const [customThemePalette, setCustomThemePaletteState] =
    useState<ThemePalette | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const themeVariants = useMemo(
    () => getThemeVariants(theme, customThemePalette),
    [theme, customThemePalette]
  );
  const activeThemeIndex = Math.min(
    Math.max(currentTheme, 0),
    Math.max(themeVariants.length - 1, 0)
  );
  const currentThemeVariant = themeVariants[activeThemeIndex] ?? themeVariants[0];
  const currentPalette = currentThemeVariant?.palette ?? lightTheme[0];
  const currentThemeNameKey = currentThemeVariant?.nameKey ?? "gray";
  const themeNameKeys = themeVariants.map((variant) => variant.nameKey);

  /* ===== 首次 hydration：统一初始化 ===== */
  useEffect(() => {
    const store = useLocalStorageStore.getState();

    const storedTheme = store.getThemeCookie();
    const resolvedTheme: Theme =
      storedTheme === "dark" || storedTheme === "light" ? storedTheme : "light";

    const customPalette = parseCustomThemePalette(store.getCustomThemePalette());
    const variants = getThemeVariants(resolvedTheme, customPalette);
    const storedIndex = parseInt(store.getThemeIndexCookie() ?? "0", 10);
    const safeIndex = Number.isNaN(storedIndex)
      ? 0
      : Math.min(Math.max(0, storedIndex), variants.length - 1);

    setTheme(resolvedTheme);
    setCustomThemePaletteState(customPalette);
    setCurrentTheme(safeIndex);
    store.setThemeCookie(resolvedTheme);
    store.setThemeIndexCookie(String(safeIndex));

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (currentTheme < themeVariants.length) return;
    const safeIndex = Math.max(themeVariants.length - 1, 0);
    setCurrentTheme(safeIndex);
    useLocalStorageStore.getState().setThemeIndexCookie(String(safeIndex));
  }, [currentTheme, hydrated, themeVariants.length]);

  /* ===== DOM 同步（避免闪屏） ===== */
  useLayoutEffect(() => {
    if (!hydrated || !currentPalette) return;
    applyThemeTokens(theme, currentPalette, currentThemeNameKey === "custom");
  }, [theme, currentPalette, hydrated, currentThemeNameKey]);

  /* ================= actions ================= */

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      useLocalStorageStore.getState().setThemeCookie(next);
      return next;
    });
    setCurrentTheme((prev) => {
      const maxIndex =
        customThemePalette !== null ? BASE_THEME_COUNT : BASE_THEME_COUNT - 1;
      const safe = Math.min(prev, maxIndex);
      useLocalStorageStore.getState().setThemeIndexCookie(String(safe));
      return safe;
    });
  }, [customThemePalette]);

  const nextTheme = useCallback(() => {
    setCurrentTheme((prev) => {
      const next = (prev + 1) % getThemeVariants(theme, customThemePalette).length;
      useLocalStorageStore.getState().setThemeIndexCookie(String(next));
      return next;
    });
  }, [theme, customThemePalette]);

  const prevTheme = useCallback(() => {
    setCurrentTheme((prev) => {
      const arr = getThemeVariants(theme, customThemePalette);
      const next = (prev - 1 + arr.length) % arr.length;
      useLocalStorageStore.getState().setThemeIndexCookie(String(next));
      return next;
    });
  }, [theme, customThemePalette]);

  const setThemeIndex = useCallback(
    (index: number) => {
      const arr = getThemeVariants(theme, customThemePalette);
      const safe = Math.min(Math.max(0, index), arr.length - 1);
      setCurrentTheme(safe);
      useLocalStorageStore.getState().setThemeIndexCookie(String(safe));
    },
    [theme, customThemePalette]
  );

  const setCustomThemePalette = useCallback(
    (palette: ThemePalette) => {
      setCustomThemePaletteState(palette);
      useLocalStorageStore
        .getState()
        .setCustomThemePalette(JSON.stringify(palette));

      const customIndex = BASE_THEME_COUNT;
      setCurrentTheme(customIndex);
      useLocalStorageStore.getState().setThemeIndexCookie(String(customIndex));
    },
    []
  );

  const removeCustomThemePalette = useCallback(() => {
    setCustomThemePaletteState(null);
    useLocalStorageStore.getState().removeCustomThemePalette();
    setCurrentTheme((prev) => {
      const maxIndex = BASE_THEME_COUNT - 1;
      const safe = Math.min(prev, maxIndex);
      useLocalStorageStore.getState().setThemeIndexCookie(String(safe));
      return safe;
    });
  }, []);

  const hasCustomTheme = customThemePalette !== null;

  const contextValue = useMemo(
    () => ({
      theme,
      currentTheme: activeThemeIndex,
      currentThemeNameKey,
      currentPalette,
      themeNameKeys,
      hasCustomTheme,
      toggleTheme,
      nextTheme,
      prevTheme,
      setThemeIndex,
      setCustomThemePalette,
      removeCustomThemePalette,
    }),
    [
      theme,
      activeThemeIndex,
      currentThemeNameKey,
      currentPalette,
      themeNameKeys,
      hasCustomTheme,
      toggleTheme,
      nextTheme,
      prevTheme,
      setThemeIndex,
      setCustomThemePalette,
      removeCustomThemePalette,
    ]
  );

  /* ================= render ================= */

  if (!hydrated) {
    return null; // 或 Skeleton，彻底避免不一致
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

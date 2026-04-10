import { darkTheme, lightTheme } from "@/components/boxed/ThemeProvider";

type ThemeMode = "light" | "dark";
export type ThemePalette = {
  backgroundColor: string;
  color: string;
  borderColor: string;
  extraColor: string;
  backgroundColor2: string;
  color2: string;
  extraColor2: string;
};

export const getThemePalette = (
  theme: ThemeMode,
  currentTheme: number,
): ThemePalette => {
  const themeList = theme === "light" ? lightTheme : darkTheme;
  return themeList[currentTheme] ?? themeList[0];
};

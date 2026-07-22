export type ThemePalette = {
  backgroundColor: string;
  color: string;
  borderColor: string;
  extraColor: string;
  backgroundColor2: string;
  color2: string;
  extraColor2: string;
};

export const getThemePalette = (): ThemePalette => ({
  backgroundColor: "var(--background)",
  color: "var(--foreground)",
  borderColor: "var(--border)",
  extraColor: "var(--primary)",
  backgroundColor2: "var(--secondary)",
  color2: "var(--secondary-foreground)",
  extraColor2: "var(--muted-foreground)",
});

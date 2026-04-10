"use client";

import type { ReactNode } from "react";
import Catalog from "./Catalog";
import { useTheme } from "@/components/boxed/ThemeProvider";
import { getThemePalette } from "./theme-style";

type SunnyZyUiLayoutProps = {
  children: ReactNode;
};

export default function SunnyZyUiLayout({ children }: SunnyZyUiLayoutProps) {
  const { theme, currentTheme } = useTheme();
  const palette = getThemePalette(theme, currentTheme);

  return (
    <div
      className="min-h-screen px-4 py-6 transition-colors"
      style={{
        backgroundColor: palette.backgroundColor,
        color: palette.color,
      }}
    >
      <div className="mx-auto flex max-w-7xl gap-0">
        <Catalog />
        <main className="min-w-0 flex-1">
          <div
            className="max-w-6xl rounded-r-xl border border-l-0 p-4"
            style={{
              borderColor: palette.borderColor,
              backgroundColor: palette.backgroundColor2,
              color: palette.color2,
            }}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

import type { ReactNode } from "react";
import Catalog from "./Catalog";

type SunnyZyUiLayoutProps = {
  children: ReactNode;
};

export default function SunnyZyUiLayout({ children }: SunnyZyUiLayoutProps) {
  return (
    <div className="min-h-screen">
      <Catalog />
      <main className="min-h-screen pl-[19rem] pr-6 pt-20">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { componentRouters, routeToHref } from "./component-routes";

export default function Catalog() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-30 h-screen w-72 bg-transparent px-4 py-20">
      <div className="h-full rounded-xl border border-slate-200/70 bg-white/30 p-4 shadow-sm backdrop-blur-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-700">
          Sunny-ZY-UI Routes
        </h2>

        <nav className="space-y-2 overflow-y-auto">
          {componentRouters.map((route) => {
            const href = routeToHref(route.segments);
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className={`block rounded-md px-3 py-2 text-sm transition ${isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-white/70 hover:text-slate-900"
                  }`}
              >
                {route.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

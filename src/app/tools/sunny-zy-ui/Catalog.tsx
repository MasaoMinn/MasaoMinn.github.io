"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { componentRouters, routeToHref, toPathKey, type SunnyUiRoute } from "./component-routes";
import { getThemePalette } from "./theme-style";

type RouteTreeNode = {
  segment: string;
  pathSegments: string[];
  route?: SunnyUiRoute;
  children: Record<string, RouteTreeNode>;
};

const createNode = (segment: string, pathSegments: string[]): RouteTreeNode => ({
  segment,
  pathSegments,
  children: {},
});

const createRouteTree = (routes: SunnyUiRoute[]) => {
  const root = createNode("", []);

  routes.forEach((route) => {
    let cursor = root;
    route.segments.forEach((segment, index) => {
      if (!cursor.children[segment]) {
        cursor.children[segment] = createNode(segment, route.segments.slice(0, index + 1));
      }
      cursor = cursor.children[segment];
    });
    cursor.route = route;
  });

  return root;
};

const collectExpandableKeys = (node: RouteTreeNode): string[] => {
  const childNodes = Object.values(node.children);
  return childNodes.flatMap((child) => {
    const own = Object.keys(child.children).length > 0 ? [toPathKey(child.pathSegments)] : [];
    return [...own, ...collectExpandableKeys(child)];
  });
};

const normalizePathSegments = (pathname: string) => {
  if (pathname === "/tools/sunny-zy-ui") {
    return [];
  }
  const prefix = "/tools/sunny-zy-ui/";
  if (!pathname.startsWith(prefix)) {
    return [];
  }
  return pathname
    .slice(prefix.length)
    .split("/")
    .map((item) => item.trim())
    .filter(Boolean);
};

type TreeViewProps = {
  node: RouteTreeNode;
  pathname: string;
  expanded: Record<string, boolean>;
  onToggle: (key: string) => void;
  depth: number;
};

function TreeView({ node, pathname, expanded, onToggle, depth }: TreeViewProps) {
  const entries = Object.values(node.children).sort((a, b) =>
    toPathKey(a.pathSegments).localeCompare(toPathKey(b.pathSegments)),
  );

  return (
    <ul className="space-y-2">
      {entries.map((entry) => {
        const key = toPathKey(entry.pathSegments);
        const hasChildren = Object.keys(entry.children).length > 0;
        const isExpanded = expanded[key] ?? false;
        const showToggle = hasChildren && depth > 0;
        const href = routeToHref(entry.pathSegments);
        const isActive = pathname === href;
        const label = entry.route?.name ?? entry.segment;

        return (
          <li key={key}>
            <div className="flex items-center gap-1">
              {showToggle ? (
                <button
                  type="button"
                  onClick={() => onToggle(key)}
                  className="inline-flex h-6 w-6 items-center justify-center rounded border text-xs"
                  style={{ borderColor: "currentColor" }}
                  aria-label={isExpanded ? "Collapse" : "Expand"}
                >
                  {isExpanded ? "−" : "+"}
                </button>
              ) : null}
              <Link
                href={href}
                className="block flex-1 rounded-md px-2 py-2 text-sm transition-opacity hover:opacity-85"
                style={
                  isActive
                    ? {
                      fontWeight: 700,
                    }
                    : {
                      fontWeight: 500,
                    }
                }
              >
                {label}
              </Link>
            </div>

            {hasChildren && isExpanded ? (
              <div className="ml-5 mt-2 border-l pl-2">
                <TreeView
                  node={entry}
                  pathname={pathname}
                  expanded={expanded}
                  onToggle={onToggle}
                  depth={depth + 1}
                />
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export default function Catalog() {
  const pathname = usePathname();
  const palette = getThemePalette();
  const tree = useMemo(() => createRouteTree(componentRouters), []);
  const expandableKeys = useMemo(() => collectExpandableKeys(tree), [tree]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(expandableKeys.map((key) => [key, true])),
  );

  const currentPathSegments = useMemo(
    () => normalizePathSegments(pathname ?? "/tools/sunny-zy-ui"),
    [pathname],
  );

  useEffect(() => {
    if (currentPathSegments.length <= 1) {
      return;
    }
    const pathKeys = currentPathSegments
      .slice(0, -1)
      .map((_, index) => toPathKey(currentPathSegments.slice(0, index + 1)));

    setExpanded((prev) => {
      const next = { ...prev };
      pathKeys.forEach((key) => {
        next[key] = true;
      });
      return next;
    });
  }, [currentPathSegments]);

  const handleToggle = (key: string) => {
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <aside className="fixed left-4 top-20 z-40 w-64 shrink-0 bg-transparent">
      <div
        className="h-[calc(100vh-6rem)] rounded-xl border p-4 shadow-sm backdrop-blur-sm transition-colors"
        style={{
          borderColor: palette.borderColor,
          backgroundColor: palette.backgroundColor2,
          color: palette.color2,
        }}
      >

        <Link
          href="/tools/sunny-zy-ui"
          className="mb-3 block rounded-md border px-3 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{
            color: palette.color2,
            borderColor: palette.borderColor,
            backgroundColor: palette.backgroundColor2,
          }}
        >
          Sunny-ZY-UI
        </Link>

        <nav className="h-[calc(100%-5.5rem)] overflow-y-auto pr-1">
          <TreeView
            node={tree}
            pathname={pathname ?? ""}
            expanded={expanded}
            onToggle={handleToggle}
            depth={0}
          />
        </nav>
      </div>
    </aside>
  );
}

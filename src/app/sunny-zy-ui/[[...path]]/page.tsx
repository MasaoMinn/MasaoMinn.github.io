import { readFile } from "fs/promises";
import path from "path";
import { notFound } from "next/navigation";
import { staticPaths, toPathKey } from "../component-routes";
import MainPage from "./MainPage";

export function generateStaticParams() {
  return staticPaths.map((path) => ({ path }));
}

type SunnyZyUiCatchAllPageProps = {
  params: Promise<{
    path?: string[];
  }>;
};

const allowedPathSet = new Set(staticPaths.map(toPathKey));

async function loadBubbleBoxSourceCode() {
  const sourcePath = path.join(
    process.cwd(),
    "components",
    "ui",
    "matter",
    "BubbleBox.tsx",
  );
  try {
    return await readFile(sourcePath, "utf-8");
  } catch {
    return "";
  }
}

export default async function SunnyZyUiCatchAllPage({
  params,
}: SunnyZyUiCatchAllPageProps) {
  const { path = [] } = await params;
  const decodedPath = path.map((segment) => decodeURIComponent(segment));
  const pathKey = toPathKey(decodedPath);

  if (!allowedPathSet.has(pathKey)) {
    notFound();
  }

  if (path.length === 0) {
    return <MainPage />;
  }

  if (pathKey === "matter/bubble-box") {
    const BubbleBoxPreview = (await import("../matter/BubbleBoxPreview")).default;
    const bubbleBoxSourceCode = await loadBubbleBoxSourceCode();
    return <BubbleBoxPreview bubbleBoxSourceCode={bubbleBoxSourceCode} />;
  }

  if (pathKey === "matter") {
    return (
      <section className="rounded-xl border border-slate-300/60 bg-white/60 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Matter</h1>
        <p className="mt-3 text-sm text-slate-700">
          Matter component group. Choose a component in the catalog.
        </p>
      </section>
    );
  }

  notFound();
}

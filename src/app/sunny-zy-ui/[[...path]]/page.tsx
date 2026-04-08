import ComponentPreview from "@/components/boxed/sunny-zy-ui/ComponentPreview";
import { notFound } from "next/navigation";
import {
  findRouteBySegments,
  routeToHref,
  staticPaths,
  toPathKey,
} from "../component-routes";

export function generateStaticParams() {
  return staticPaths.map((path) => ({ path }));
}

type SunnyZyUiCatchAllPageProps = {
  params: Promise<{
    path?: string[];
  }>;
};

const allowedPathSet = new Set(staticPaths.map(toPathKey));

export default async function SunnyZyUiCatchAllPage({
  params,
}: SunnyZyUiCatchAllPageProps) {
  const { path = [] } = await params;
  const decodedPath = path.map((segment) => decodeURIComponent(segment));

  if (!allowedPathSet.has(toPathKey(decodedPath))) {
    notFound();
  }

  const currentRoute = findRouteBySegments(decodedPath);
  if (!currentRoute) {
    notFound();
  }

  return (
    <ComponentPreview
      routeName={currentRoute.name}
      routePath={routeToHref(currentRoute.segments)}
    />
  );
}

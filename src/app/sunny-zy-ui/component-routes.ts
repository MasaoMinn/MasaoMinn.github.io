export type SunnyUiRoute = {
  name: string;
  segments: string[];
};

export const componentRouters: SunnyUiRoute[] = [
  {
    name: "Matter",
    segments: ["matter"],
  },
  {
    name: "BubbleBox",
    segments: ["matter", "bubble-box"],
  },
];

export const toPathKey = (segments: string[]) => segments.join("/");

export const routeToHref = (segments: string[]) => {
  if (segments.length === 0) {
    return "/sunny-zy-ui";
  }
  return `/sunny-zy-ui/${segments.join("/")}`;
};

const routeMap = new Map(
  componentRouters.map((route) => [toPathKey(route.segments), route]),
);

export const findRouteBySegments = (segments: string[]) => {
  return routeMap.get(toPathKey(segments));
};

// Keep [] for optional catch-all export compatibility, while actual content defaults to /matter.
export const staticPaths = [[], ...componentRouters.map((route) => route.segments)];

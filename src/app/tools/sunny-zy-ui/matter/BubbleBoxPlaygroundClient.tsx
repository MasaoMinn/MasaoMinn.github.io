"use client";

import { useMemo, useState } from "react";
import ComponentPreviewer, {
  type objectField,
} from "@/components/boxed/ComponentPreviewer";
import ComponentPlaygroundDocs, {
  type PropsDocSection,
} from "@/components/boxed/ComponentPlaygroundDocs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import MarkdownComponent from "@/components/boxed/MarkdownComponent";

const FIXED_PREVIEW_WIDTH = 1200;
const FIXED_PREVIEW_HEIGHT = 675;
type BubbleBoxTab = "preview" | "code";

type BubbleBoxPlaygroundClientProps = {
  bubbleBoxSourceCode?: string;
};

const SHAPES = [
  "circle",
  "triangle",
  "rectangle",
  "trapezoid",
  "polygon",
  "ellipse",
  "parallelogram",
] as const;
type BubbleShapeOption = (typeof SHAPES)[number];

const randomFrom = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];
const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number, digits = 2) =>
  Number((Math.random() * (max - min) + min).toFixed(digits));
const randomHexColor = () =>
  `#${randomInt(0, 255).toString(16).padStart(2, "0")}${randomInt(0, 255)
    .toString(16)
    .padStart(2, "0")}${randomInt(0, 255).toString(16).padStart(2, "0")}`;

const createRandomBubble = (index: number) => {
  const shape = randomFrom<BubbleShapeOption>(SHAPES);
  return {
    label: `Bubble ${index + 1}`,
    shape,
    textColor: randomHexColor(),
    backgroundColor: randomHexColor(),
    rotate: randomInt(0, 10),
    scale: randomFloat(0.4, 3, 1),
    textRotate: Math.random() > 0.5,
    initialAngle: randomInt(0, 360),
    polygonSides: shape === "polygon" ? randomInt(3, 12) : undefined,
    trapezoidSlope: shape === "trapezoid" ? randomFloat(0.1, 0.45, 2) : undefined,
    ellipseAxisRatio: shape === "ellipse" ? randomFloat(1, 4, 2) : undefined,
    skew: shape === "parallelogram" ? randomFloat(-1, 1, 2) : undefined,
  };
};

const BUBBLE_BOX_PROPS_DOC: PropsDocSection = {
  title: "BubbleBoxProps",
  rows: [
    {
      name: "content",
      type: "BubbleProps[]",
      value: "required",
      description: "Bubbles rendered in the physics area.",
    },
    {
      name: "temperature",
      type: "number",
      value: "0 ~ 100, default 60",
      description: "Controls bubble moving speed.",
    },
    {
      name: "draggable",
      type: "boolean",
      value: "true | false, default false",
      description: "Whether bubbles can be dragged by mouse.",
    },
    {
      name: "fill",
      type: "boolean",
      value: "true | false",
      description: "Fill parent container height when no explicit height.",
    },
    {
      name: "width",
      type: "number | string",
      value: "e.g. 1200, \"100%\"",
      description: "Component width.",
    },
    {
      name: "height",
      type: "number | string",
      value: "e.g. 675, \"320px\"",
      description: "Component height.",
    },
  ],
};

const BUBBLE_PROPS_DOC: PropsDocSection = {
  title: "BubbleProps",
  rows: [
    {
      name: "label",
      type: "string",
      value: "any text",
      description: "Text rendered inside bubble.",
    },
    {
      name: "textColor",
      type: "string",
      value: "hex/rgb/hsl/named color",
      description: "Bubble text color.",
    },
    {
      name: "backgroundColor",
      type: "string",
      value: "hex/rgb/hsl/named color",
      description: "Bubble fill color.",
    },
    {
      name: "shape",
      type: "BubbleShape",
      value: "circle | triangle | rectangle | trapezoid | polygon | ellipse | parallelogram",
      description: "Bubble geometry type.",
    },
    {
      name: "polygonSides",
      type: "number",
      value: "3 ~ 12 (polygon only)",
      description: "Used only when shape is polygon.",
    },
    {
      name: "trapezoidSlope",
      type: "number",
      value: "0.1 ~ 0.45 (trapezoid only)",
      description: "Used only when shape is trapezoid.",
    },
    {
      name: "ellipseAxisRatio",
      type: "number",
      value: "1 ~ 4 (ellipse only)",
      description: "Major/minor axis ratio for ellipse shape.",
    },
    {
      name: "skew",
      type: "number",
      value: "-1 ~ 1 (parallelogram only)",
      description: "Horizontal skew amount for parallelogram shape.",
    },
    {
      name: "vertices",
      type: "{ x: number; y: number }[] | null",
      value: "custom convex vertices",
      description: "Optional custom vertices for custom shape.",
    },
    {
      name: "rotate",
      type: "number",
      value: "0 ~ 10",
      description: "Angular velocity factor.",
    },
    {
      name: "scale",
      type: "number",
      value: "0.4 ~ 3",
      description: "Bubble size factor.",
    },
    {
      name: "textRotate",
      type: "boolean",
      value: "true | false",
      description: "Rotate text with body angle.",
    },
    {
      name: "initialAngle",
      type: "number",
      value: "0 ~ 360",
      description: "Initial body angle in degrees.",
    },
  ],
};

const bubbleBoxPropsInfo: objectField[] = [
  {
    key: "temperature",
    prop: {
      label: "Temperature",
      type: "slider",
      defaultValue: 40,
      min: 0,
      max: 100,
      step: 1,
    },
  },
  {
    key: "draggable",
    prop: {
      label: "Draggable",
      type: "boolean",
      defaultValue: true,
    },
  },
  {
    key: "content",
    prop: {
      label: "Bubbles",
      type: "array",
      description: "Bubble list rendered by BubbleBox.",
      minItems: 1,
      itemLabel: "Bubble",
      createItem: ({ index }) => createRandomBubble(index),
      itemFields: [
        {
          key: "label",
          prop: {
            label: "Label",
            type: "string",
            defaultValue: "Bubble",
          },
        },
        {
          key: "shape",
          prop: {
            label: "Shape",
            type: "select",
            defaultValue: "circle",
            options: [
              "circle",
              "triangle",
              "rectangle",
              "trapezoid",
              "polygon",
              "ellipse",
              "parallelogram",
            ],
          },
        },
        {
          key: "textColor",
          prop: {
            label: "Text Color",
            type: "color",
            defaultValue: "#ffffff",
          },
        },
        {
          key: "backgroundColor",
          prop: {
            label: "Background Color",
            type: "color",
            defaultValue: "#38bdf8",
          },
        },
        {
          key: "polygonSides",
          prop: {
            label: "Polygon Sides",
            type: "number",
            defaultValue: 6,
            min: 3,
            max: 12,
            step: 1,
            visibleWhen: ({ parentObject }) => parentObject?.shape === "polygon",
          },
        },
        {
          key: "trapezoidSlope",
          prop: {
            label: "Trapezoid Slope",
            type: "slider",
            defaultValue: 0.25,
            min: 0.1,
            max: 0.45,
            step: 0.01,
            visibleWhen: ({ parentObject }) => parentObject?.shape === "trapezoid",
          },
        },
        {
          key: "ellipseAxisRatio",
          prop: {
            label: "Ellipse Axis Ratio",
            type: "slider",
            defaultValue: 1.6,
            min: 1,
            max: 4,
            step: 0.05,
            visibleWhen: ({ parentObject }) => parentObject?.shape === "ellipse",
          },
        },
        {
          key: "skew",
          prop: {
            label: "Parallelogram Skew",
            type: "slider",
            defaultValue: 0.25,
            min: -1,
            max: 1,
            step: 0.05,
            visibleWhen: ({ parentObject }) => parentObject?.shape === "parallelogram",
          },
        },
        {
          key: "rotate",
          prop: {
            label: "Rotate",
            type: "slider",
            defaultValue: 2,
            min: 0,
            max: 10,
            step: 1,
          },
        },
        {
          key: "scale",
          prop: {
            label: "Scale",
            type: "slider",
            defaultValue: 1,
            min: 0.4,
            max: 3,
            step: 0.1,
          },
        },
        {
          key: "textRotate",
          prop: {
            label: "Text Rotate",
            type: "boolean",
            defaultValue: false,
          },
        },
        {
          key: "initialAngle",
          prop: {
            label: "Initial Angle",
            type: "slider",
            defaultValue: 0,
            min: 0,
            max: 360,
            step: 1,
          },
        },
      ],
    },
  },
];

const bubbleBoxInitialProps: Record<string, unknown> = {
  content: [
    {
      label: "Matter-js",
      shape: "rectangle",
      backgroundColor: "#38bdf8",
      textColor: "#aa2b2b",
      rotate: 5,
      scale: 1.1,
      textRotate: false,
      initialAngle: 0,
    },
    {
      label: "React",
      shape: "polygon",
      backgroundColor: "#0080ff",
      textColor: "#00ffc3",
      polygonSides: 5,
      rotate: 3,
      scale: 0.95,
      textRotate: false,
      initialAngle: 30,
    },
    {
      label: "Sunny_ZY",
      shape: "trapezoid",
      backgroundColor: "#8f80b2",
      textColor: "#045f2b",
      trapezoidSlope: 0.25,
      rotate: 2,
      scale: 1.05,
      textRotate: false,
      initialAngle: 15,
    },
  ],
  temperature: 40,
  draggable: true,
};

export default function BubbleBoxPlaygroundClient({
  bubbleBoxSourceCode = "",
}: BubbleBoxPlaygroundClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab: BubbleBoxTab = searchParams.get("tab") === "code" ? "code" : "preview";
  const [liveProps, setLiveProps] =
    useState<Record<string, unknown>>(bubbleBoxInitialProps);

  const liveContent = useMemo(
    () =>
      Array.isArray(liveProps.content)
        ? liveProps.content
        : (bubbleBoxInitialProps.content as unknown[]),
    [liveProps.content],
  );
  const liveTemperature = useMemo(
    () =>
      typeof liveProps.temperature === "number"
        ? liveProps.temperature
        : (bubbleBoxInitialProps.temperature as number),
    [liveProps.temperature],
  );
  const liveDraggable = useMemo(
    () =>
      typeof liveProps.draggable === "boolean"
        ? liveProps.draggable
        : (bubbleBoxInitialProps.draggable as boolean),
    [liveProps.draggable],
  );

  const generatedJsx = useMemo(() => {
    const contentSource = JSON.stringify(liveContent, null, 2);
    return `<BubbleBox
  content={${contentSource}}
  temperature={${liveTemperature}}
  draggable={${liveDraggable}}
  fill={true}
  width="100%"
  height="100%"
/>`;
  }, [liveContent, liveTemperature, liveDraggable]);

  const downloadCommand = "pnpm dlx sunny-zy add matter/bubble-box";
  const downloadCommandMarkdown = useMemo(
    () => `\`\`\`bash\n${downloadCommand}\n\`\`\``,
    [downloadCommand],
  );
  const componentSourceMarkdown = useMemo(
    () =>
      `\`\`\`tsx\n${bubbleBoxSourceCode || "// BubbleBox source unavailable."}\n\`\`\``,
    [bubbleBoxSourceCode],
  );

  const handleTabChange = (nextTab: string) => {
    const tab = nextTab === "code" ? "code" : "preview";
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "code") {
      params.set("tab", "code");
    } else {
      params.delete("tab");
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <main className="w-full p-2 lg:p-3" style={{ color: "var(--foreground)" }}>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-2">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">BubbleBox Playground</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              This page contains BubbleBox-specific schema and data. ComponentPreviewer only provides generic preview and prop editing capabilities.
            </p>
          </div>
          <TabsList className="h-11 rounded-full p-1">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <span aria-hidden="true" className="mx-1 select-none text-sm font-semibold text-muted-foreground">
              |
            </span>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="preview">
          <ComponentPreviewer
            componentUrl="components/ui/matter/BubbleBox"
            propsInfo={bubbleBoxPropsInfo}
            initialProps={bubbleBoxInitialProps}
            onPropsChange={setLiveProps}
            previewFrameSize={{ width: FIXED_PREVIEW_WIDTH, height: FIXED_PREVIEW_HEIGHT }}
            previewComponentProps={{
              fill: true,
              width: "100%",
              height: "100%",
            }}
            previewStyle={{ minHeight: FIXED_PREVIEW_HEIGHT }}
          />
          <ComponentPlaygroundDocs
            className="mt-4"
            generatedJsx={generatedJsx}
            propsSections={[BUBBLE_BOX_PROPS_DOC, BUBBLE_PROPS_DOC]}
          />
        </TabsContent>

        <TabsContent value="code">
          <div className="mt-2 space-y-4">
            <div
              className="rounded-lg border p-4"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--secondary)",
              }}
            >
              <h3 className="text-lg font-semibold">Download Guide</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Install dependencies then import the component in your page.
              </p>
              <div className="mt-2">
                <MarkdownComponent content={downloadCommandMarkdown} className="max-w-none" />
              </div>
            </div>

            <div
              className="overflow-x-auto rounded-lg border"
              style={{
                borderColor: "var(--border)",
                background:
                  "linear-gradient(135deg, var(--secondary) 0%, var(--background) 100%)",
              }}
            >
              <div
                className="border-b px-3 py-2 text-sm font-semibold"
                style={{ borderColor: "var(--border)" }}
              >
                Source Code
              </div>
              <div className="px-2 pb-2">
                <MarkdownComponent content={componentSourceMarkdown} className="max-w-none" />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}

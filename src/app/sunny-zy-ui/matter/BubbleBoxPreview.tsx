"use client";

import { type CSSProperties, useMemo, useState } from "react";
import BubbleBox, {
  type BubbleProps,
  type BubbleShape,
} from "../../../../components/ui/matter/BubbleBox";
import { useTheme } from "@/components/boxed/ThemeProvider";
import { getThemePalette, type ThemePalette } from "@/app/sunny-zy-ui/theme-style";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type EditableBubbleBoxProps = {
  content: BubbleProps[];
  temperature: number;
  draggable: boolean;
};

type NumberControlItem = {
  key: "temperature";
  label: string;
  min: number;
  max: number;
  step: number;
};

type PropDocRow = {
  name: string;
  type: string;
  value: string;
  description: string;
};

const SHAPES: BubbleShape[] = [
  "circle",
  "triangle",
  "rectangle",
  "trapezoid",
  "pentagon",
  "hexagon",
  "octagon",
  "polygon",
  "starshape",
];

const NUMBER_CONTROLS: NumberControlItem[] = [
  { key: "temperature", label: "Temperature", min: 0, max: 100, step: 1 },
];

const BUBBLE_BOX_PROPS_DOC: PropDocRow[] = [
  {
    name: "content",
    type: "BubbleProps[]",
    value: "required, at least 1 item recommended",
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
    value: "true | false, default false",
    description: "Fill parent height when no explicit height.",
  },
  {
    name: "width",
    type: "number | string",
    value: "e.g. 1200, \"100%\"",
    description: "Preview uses fixed 1200.",
  },
  {
    name: "height",
    type: "number | string",
    value: "e.g. 675, \"320px\"",
    description: "Preview uses fixed 675.",
  },
];

const BUBBLE_PROPS_DOC: PropDocRow[] = [
  {
    name: "label",
    type: "string",
    value: "any text",
    description: "Text rendered inside bubble.",
  },
  {
    name: "textColor",
    type: "string",
    value: "hex color, e.g. #ffffff",
    description: "Bubble text color.",
  },
  {
    name: "backgroundColor",
    type: "string",
    value: "hex color, e.g. #38bdf8",
    description: "Bubble fill color.",
  },
  {
    name: "shape",
    type: "BubbleShape",
    value: SHAPES.join(" | "),
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
    name: "vertices",
    type: "Vertex2D[] | null",
    value: "custom normalized polygon points",
    description: "Optional custom convex vertices.",
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
];

const FIXED_WIDTH = 1200;
const FIXED_HEIGHT = 675;

const INITIAL_BUBBLE_CONTENT: BubbleProps[] = [
  {
    label: "Matter-js",
    shape: "rectangle",
    backgroundColor: "#38bdf8",
    textColor: "#aa2b2b",
    rotate: 5,
    scale: 1.1,
    textRotate: false,
  },
  {
    label: "React",
    shape: "starshape",
    backgroundColor: "#0080ff",
    textColor: "#002aff",
    rotate: 3,
    scale: 0.95,
    textRotate: false,
  },
  {
    label: "Sunny_ZY",
    shape: "trapezoid",
    backgroundColor: "#572eb6",
    textColor: "#005324",
    trapezoidSlope: 0.25,
    rotate: 2,
    scale: 1.05,
    textRotate: false,
  },
];

const randomFrom = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];
const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const randomScale = () => Number((Math.random() * (2.6 - 0.6) + 0.6).toFixed(1));
const randomTrapezoidSlope = () =>
  Number((Math.random() * (0.45 - 0.1) + 0.1).toFixed(2));
const randomHexColor = () =>
  `#${randomInt(0, 255).toString(16).padStart(2, "0")}${randomInt(0, 255)
    .toString(16)
    .padStart(2, "0")}${randomInt(0, 255).toString(16).padStart(2, "0")}`;

const createBubble = (index: number): BubbleProps => {
  const shape = randomFrom(SHAPES);
  return {
    label: `Bubble${index + 1}`,
    shape,
    backgroundColor: randomHexColor(),
    textColor: randomHexColor(),
    polygonSides: shape === "polygon" ? randomInt(3, 12) : undefined,
    trapezoidSlope: shape === "trapezoid" ? randomTrapezoidSlope() : undefined,
    rotate: randomInt(0, 10),
    scale: randomScale(),
    textRotate: Math.random() > 0.5,
  };
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const createSliderThemeStyle = (palette: ThemePalette) =>
({
  "--slider-track-color": palette.borderColor,
  "--slider-range-color": palette.extraColor,
  "--slider-thumb-bg": palette.backgroundColor,
  "--slider-thumb-border": palette.extraColor,
} as CSSProperties);

function PropsDocTable({
  title,
  rows,
  palette,
}: {
  title: string;
  rows: PropDocRow[];
  palette: ThemePalette;
}) {
  return (
    <div
      className="overflow-x-auto rounded-lg border"
      style={{ borderColor: palette.borderColor, backgroundColor: palette.backgroundColor }}
    >
      <div className="border-b px-3 py-2 text-sm font-semibold" style={{ borderColor: palette.borderColor }}>
        {title}
      </div>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b text-left" style={{ borderColor: palette.borderColor }}>
            <th className="px-3 py-2">Prop</th>
            <th className="px-3 py-2">Type</th>
            <th className="px-3 py-2">Values</th>
            <th className="px-3 py-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-b align-top" style={{ borderColor: palette.borderColor }}>
              <td className="px-3 py-2 font-mono">{row.name}</td>
              <td className="px-3 py-2">{row.type}</td>
              <td className="px-3 py-2">{row.value}</td>
              <td className="px-3 py-2">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BubbleConsole({
  content,
  onChange,
  palette,
}: {
  content: BubbleProps[];
  onChange: (nextContent: BubbleProps[]) => void;
  palette: ThemePalette;
}) {
  const updateBubble = <K extends keyof BubbleProps>(
    index: number,
    key: K,
    value: BubbleProps[K],
  ) => {
    const next = [...content];
    next[index] = { ...next[index], [key]: value };
    onChange(next);
  };
  const updateBubbleShape = (index: number, shape: BubbleShape) => {
    const next = [...content];
    const current = next[index] ?? createBubble(index);
    next[index] = {
      ...current,
      shape,
      polygonSides:
        shape === "polygon"
          ? typeof current.polygonSides === "number"
            ? current.polygonSides
            : 6
          : undefined,
      trapezoidSlope:
        shape === "trapezoid"
          ? typeof current.trapezoidSlope === "number"
            ? current.trapezoidSlope
            : 0.25
          : undefined,
    };
    onChange(next);
  };

  const addBubble = () => {
    onChange([...content, createBubble(content.length)]);
  };

  const deleteBubble = (index: number) => {
    onChange(content.filter((_, i) => i !== index));
  };

  return (
    <FieldSet className="gap-3 rounded-md border border-slate-200/70 p-3">
      <FieldLegend variant="label" className="mb-1">
        Content (BubbleConsole)
      </FieldLegend>
      <FieldDescription className="text-xs">
        Add / remove / edit bubble items.
      </FieldDescription>

      <div className="space-y-3">
        {content.map((bubble, index) => (
          <div key={`${bubble.label}-${index}`} className="rounded-md border border-slate-200/70 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-semibold">Bubble #{index + 1}</div>
              <Button variant="outline" size="sm" onClick={() => deleteBubble(index)}>
                Delete
              </Button>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3">
              <Field>
                <FieldLabel htmlFor={`bubble-label-${index}`}>Label</FieldLabel>
                <FieldContent>
                  <Input
                    id={`bubble-label-${index}`}
                    type="text"
                    value={bubble.label}
                    onChange={(event) => updateBubble(index, "label", event.target.value)}
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Shape</FieldLabel>
                <FieldContent>
                  <Select
                    value={bubble.shape ?? "circle"}
                    onValueChange={(value) => updateBubbleShape(index, value as BubbleShape)}
                  >
                    <SelectTrigger
                      style={{
                        backgroundColor: palette.backgroundColor,
                        borderColor: palette.borderColor,
                        color: palette.color,
                      }}
                    >
                      <SelectValue placeholder="Select shape" />
                    </SelectTrigger>
                    <SelectContent
                      style={{
                        backgroundColor: palette.backgroundColor2,
                        borderColor: palette.borderColor,
                        color: palette.color2,
                      }}
                    >
                      {SHAPES.map((shape) => (
                        <SelectItem key={shape} value={shape}>
                          {shape}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor={`bubble-bg-${index}`}>Background Color</FieldLabel>
                <FieldContent>
                  <Input
                    id={`bubble-bg-${index}`}
                    type="color"
                    className="h-10"
                    value={bubble.backgroundColor ?? "#38bdf8"}
                    onChange={(event) => updateBubble(index, "backgroundColor", event.target.value)}
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor={`bubble-text-${index}`}>Text Color</FieldLabel>
                <FieldContent>
                  <Input
                    id={`bubble-text-${index}`}
                    type="color"
                    className="h-10"
                    value={bubble.textColor ?? "#ffffff"}
                    onChange={(event) => updateBubble(index, "textColor", event.target.value)}
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Rotate ({bubble.rotate ?? 0})</FieldLabel>
                <FieldContent>
                  <Slider
                    min={0}
                    max={10}
                    step={1}
                    value={[bubble.rotate ?? 0]}
                    onValueChange={(value) => updateBubble(index, "rotate", value[0] ?? 0)}
                    style={createSliderThemeStyle(palette)}
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Scale ({(bubble.scale ?? 1).toFixed(1)})</FieldLabel>
                <FieldContent>
                  <Slider
                    min={0.4}
                    max={3}
                    step={0.1}
                    value={[bubble.scale ?? 1]}
                    onValueChange={(value) => updateBubble(index, "scale", value[0] ?? 1)}
                    style={createSliderThemeStyle(palette)}
                  />
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input
                      id={`bubble-text-rotate-${index}`}
                      type="checkbox"
                      checked={Boolean(bubble.textRotate)}
                      onChange={(event) => updateBubble(index, "textRotate", event.target.checked)}
                    />
                    <span>Text Rotate</span>
                  </label>
                </FieldContent>
              </Field>

              {bubble.shape === "polygon" ? (
                <Field>
                  <FieldLabel>
                    Polygon Sides ({bubble.polygonSides ?? 6})
                  </FieldLabel>
                  <FieldContent>
                    <Slider
                      min={3}
                      max={12}
                      step={1}
                      value={[bubble.polygonSides ?? 6]}
                      onValueChange={(value) =>
                        updateBubble(index, "polygonSides", Math.round(value[0] ?? 6))
                      }
                      style={createSliderThemeStyle(palette)}
                    />
                  </FieldContent>
                </Field>
              ) : null}

              {bubble.shape === "trapezoid" ? (
                <Field>
                  <FieldLabel>
                    Trapezoid Slope ({(bubble.trapezoidSlope ?? 0.25).toFixed(2)})
                  </FieldLabel>
                  <FieldContent>
                    <Slider
                      min={0.1}
                      max={0.45}
                      step={0.01}
                      value={[bubble.trapezoidSlope ?? 0.25]}
                      onValueChange={(value) =>
                        updateBubble(
                          index,
                          "trapezoidSlope",
                          Number((value[0] ?? 0.25).toFixed(2)),
                        )
                      }
                      style={createSliderThemeStyle(palette)}
                    />
                  </FieldContent>
                </Field>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={addBubble}>
        Add Bubble
      </Button>
    </FieldSet>
  );
}

function ComponentConsole({
  componentProps,
  onChange,
  palette,
}: {
  componentProps: EditableBubbleBoxProps;
  onChange: (next: EditableBubbleBoxProps) => void;
  palette: ThemePalette;
}) {
  const updateNumber = (item: NumberControlItem, value: number) => {
    const clamped = clamp(value, item.min, item.max);
    onChange({ ...componentProps, [item.key]: clamped });
  };

  return (
    <FieldGroup className="gap-3 rounded-xl border border-slate-300/60 bg-white/60 p-4">
      <FieldLegend>ComponentConsole</FieldLegend>
      {/* <FieldDescription className="text-xs">
        Width / Height are fixed: {FIXED_WIDTH} x {FIXED_HEIGHT}
      </FieldDescription> */}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3">
        {NUMBER_CONTROLS.map((item) => {
          const value = componentProps[item.key];
          return (
            <Field key={item.key}>
              <FieldLabel>
                {item.label}: {value}
              </FieldLabel>
              <FieldContent>
                <Slider
                  min={item.min}
                  max={item.max}
                  step={item.step}
                  value={[value]}
                  onValueChange={(next) => updateNumber(item, next[0] ?? value)}
                  style={createSliderThemeStyle(palette)}
                />
                <FieldDescription className="text-xs">
                  {item.min} - {item.max}
                </FieldDescription>
              </FieldContent>
            </Field>
          );
        })}

        <Field>
          <FieldLabel htmlFor="draggable">Draggable</FieldLabel>
          <FieldContent>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                id="draggable"
                type="checkbox"
                checked={componentProps.draggable}
                onChange={(event) =>
                  onChange({ ...componentProps, draggable: event.target.checked })
                }
              />
              <span>{componentProps.draggable ? "Enabled" : "Disabled"}</span>
            </label>
          </FieldContent>
        </Field>
      </div>

      <BubbleConsole
        content={componentProps.content}
        onChange={(content) => onChange({ ...componentProps, content })}
        palette={palette}
      />
    </FieldGroup>
  );
}

export default function BubbleBoxPreview() {
  const { theme, currentTheme } = useTheme();
  const palette = getThemePalette(theme, currentTheme);
  const [copied, setCopied] = useState(false);

  const [componentProps, setComponentProps] = useState<EditableBubbleBoxProps>({
    content: INITIAL_BUBBLE_CONTENT.map((item) => ({ ...item })),
    temperature: 40,
    draggable: true,
  });

  const bubbleBoxSource = useMemo(() => {
    const contentSource = JSON.stringify(componentProps.content, null, 2);
    return `<BubbleBox
  content={${contentSource}}
  temperature={${componentProps.temperature}}
  draggable={${componentProps.draggable}}
  fill={false}
  width={${FIXED_WIDTH}}
  height={${FIXED_HEIGHT}}
/>`;
  }, [componentProps]);

  const handleCopySource = async () => {
    try {
      await navigator.clipboard.writeText(bubbleBoxSource);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      className="rounded-xl border p-6 shadow-sm"
      style={{
        borderColor: palette.borderColor,
        backgroundColor: palette.backgroundColor2,
        color: palette.color2,
      }}
    >
      <h1 className="text-2xl font-semibold">BubbleBox</h1>
      <p className="mt-3 text-sm">
        Preview for <code className="rounded bg-slate-100 px-2 py-0.5">matter/BubbleBox</code>.
      </p>
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="overflow-x-auto">
          <BubbleBox
            content={componentProps.content}
            temperature={componentProps.temperature}
            draggable={componentProps.draggable}
            fill={false}
            width={FIXED_WIDTH}
            height={FIXED_HEIGHT}
          />
        </div>
        <ComponentConsole
          componentProps={componentProps}
          onChange={setComponentProps}
          palette={palette}
        />
      </div>
      <div
        className="group relative mt-4 overflow-x-auto rounded-lg border"
        style={{
          borderColor: palette.borderColor,
          background: `linear-gradient(135deg, ${palette.backgroundColor2} 0%, ${palette.backgroundColor} 100%)`,
        }}
      >
        <div
          className="flex items-center justify-between border-b px-3 py-2 text-sm font-semibold"
          style={{ borderColor: palette.borderColor }}
        >
          <span>Generated JSX</span>
          <Button
            size="sm"
            variant="outline"
            type="button"
            onClick={handleCopySource}
            // className="opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            style={{
              borderColor: palette.borderColor,
              backgroundColor: palette.backgroundColor,
              color: palette.color,
            }}
          >
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
        <pre
          className="p-3 text-xs leading-6"
          style={{ backgroundColor: palette.backgroundColor2, color: palette.color2 }}
        >
          <code>{bubbleBoxSource}</code>
        </pre>
      </div>
      <div className="mt-6 space-y-3">
        <PropsDocTable title="BubbleBoxProps" rows={BUBBLE_BOX_PROPS_DOC} palette={palette} />
        <PropsDocTable title="BubbleProps" rows={BUBBLE_PROPS_DOC} palette={palette} />
      </div>
    </section>
  );
}

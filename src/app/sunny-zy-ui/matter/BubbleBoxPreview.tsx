"use client";

import { type CSSProperties, type WheelEvent, useMemo, useState } from "react";
import BubbleBox, {
  type BubbleProps,
  type BubbleShape,
} from "../../../../components/ui/matter/BubbleBox";
import { ThemedButton } from "@/components/boxed/ThemedButton";
import { getThemePalette, type ThemePalette } from "@/app/sunny-zy-ui/theme-style";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { Bubbles, Trash } from "lucide-react";
import styled from "styled-components";

type EditableBubbleBoxProps = {
  content: BubbleProps[];
  temperature: number;
  draggable: boolean;
};

type PropDocRow = {
  name: string;
  type: string;
  value: string;
  description: string;
};

type BubbleVertex = {
  x: number;
  y: number;
};
type BubbleBoxTab = "preview" | "code";

const SHAPES: BubbleShape[] = [
  "circle",
  "triangle",
  "rectangle",
  "trapezoid",
  "polygon",
  "ellipse",
  "parallelogram",
];
type ShapeSelectValue = BubbleShape | "custom";
const SHAPE_OPTIONS: Array<{ value: ShapeSelectValue; label: string }> = [
  ...SHAPES.map((shape) => ({ value: shape, label: shape })),
  { value: "custom", label: "customize from vertices" },
];
const DEFAULT_CUSTOM_VERTICES: BubbleVertex[] = [
  { x: -8, y: 6 },
  { x: 8, y: 6 },
  { x: 0, y: -9 },
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
    value: `${SHAPES.join(" | ")} | custom (preview-only)`,
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
  {
    name: "initialAngle",
    type: "number",
    value: "0 ~ 360",
    description: "Initial body angle in degrees.",
  },
];
const VERTEX_2D_DOC: PropDocRow[] = [
  {
    name: "x",
    type: "number",
    value: "",
    description: "x coordinate of vertex.",
  },
  {
    name: "y",
    type: "number",
    value: "",
    description: "y coordinate of vertex.",
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
    shape: "polygon",
    backgroundColor: "#0080ff",
    textColor: "#00ffc3",
    polygonSides: 5,
    rotate: 3,
    scale: 0.95,
    textRotate: false,
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
  },
];

const randomFrom = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];
const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const randomScale = () => Number((Math.random() * (2.6 - 0.6) + 0.6).toFixed(1));
const randomTrapezoidSlope = () =>
  Number((Math.random() * (0.45 - 0.1) + 0.1).toFixed(2));
const randomEllipseAxisRatio = () =>
  Number((Math.random() * (4 - 1) + 1).toFixed(2));
const randomSkew = () => Number((Math.random() * (1 - -1) + -1).toFixed(2));
const randomVertex = (): BubbleVertex => ({
  x: randomInt(-100, 100),
  y: randomInt(-100, 100),
});
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
    ellipseAxisRatio: shape === "ellipse" ? randomEllipseAxisRatio() : undefined,
    skew: shape === "parallelogram" ? randomSkew() : undefined,
    initialAngle: randomInt(0, 359),
    rotate: randomInt(0, 10),
    scale: randomScale(),
    textRotate: Math.random() > 0.5,
  };
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));
const preventNumberInputWheel = (event: WheelEvent<HTMLInputElement>) => {
  event.currentTarget.blur();
};
const toShapeSelectValue = (bubble: BubbleProps): ShapeSelectValue =>
  Array.isArray(bubble.vertices) && bubble.vertices.length >= 3
    ? "custom"
    : (bubble.shape ?? "circle");
const getVerticesOrDefault = (vertices: BubbleProps["vertices"]): BubbleVertex[] => {
  if (Array.isArray(vertices) && vertices.length > 0) {
    return vertices.map((vertex) => ({
      x: Number(vertex.x),
      y: Number(vertex.y),
    }));
  }
  return DEFAULT_CUSTOM_VERTICES.map((vertex) => ({ ...vertex }));
};

const createSliderThemeStyle = (palette: ThemePalette) =>
({
  "--slider-track-color": palette.borderColor,
  "--slider-range-color": palette.extraColor,
  "--slider-thumb-bg": palette.backgroundColor,
  "--slider-thumb-border": palette.extraColor,
} as CSSProperties);

const ThemedFieldSet = styled(FieldSet) <{ $palette: ThemePalette }>`
  border-color: ${({ $palette }) => $palette.borderColor};
  background-color: ${({ $palette }) => $palette.backgroundColor2};
  color: ${({ $palette }) => $palette.color2};
  [data-slot="field"] {
    border: 1px solid ${({ $palette }) => $palette.borderColor};
    background-color: ${({ $palette }) => $palette.backgroundColor};
    color: ${({ $palette }) => $palette.color};
    border-radius: 0.5rem;
    padding: 0.5rem;
  }
  [data-slot="field-description"] {
    color: ${({ $palette }) => $palette.extraColor2};
  }
`;

const ThemedFieldGroup = styled(FieldGroup) <{ $palette: ThemePalette }>`
  border-color: ${({ $palette }) => $palette.borderColor};
  background-color: ${({ $palette }) => $palette.backgroundColor2};
  color: ${({ $palette }) => $palette.color2};
  [data-slot="field"] {
    border: 1px solid ${({ $palette }) => $palette.borderColor};
    background-color: ${({ $palette }) => $palette.backgroundColor};
    color: ${({ $palette }) => $palette.color};
    border-radius: 0.5rem;
    padding: 0.5rem;
  }
  [data-slot="field-description"] {
    color: ${({ $palette }) => $palette.extraColor2};
  }
`;

const ThemedFieldLegend = styled(FieldLegend) <{ $palette: ThemePalette }>`
  color: ${({ $palette }) => $palette.color2};
`;

const ThemedFieldDescription = styled(FieldDescription) <{ $palette: ThemePalette }>`
  color: ${({ $palette }) => $palette.extraColor2};
`;

const ThemedInput = styled(Input) <{ $palette: ThemePalette }>`
  && {
    border-color: ${({ $palette }) => $palette.borderColor} !important;
    background-color: ${({ $palette }) => $palette.backgroundColor2} !important;
    color: ${({ $palette }) => $palette.color2} !important;
  }
  &&::placeholder {
    color: ${({ $palette }) => $palette.extraColor2};
  }
  &&:focus-visible {
    border-color: ${({ $palette }) => $palette.extraColor} !important;
    box-shadow: 0 0 0 2px ${({ $palette }) => $palette.extraColor2} !important;
  }
  &&[type="color"] {
    padding: 0.125rem;
    background-color: ${({ $palette }) => $palette.backgroundColor2} !important;
  }
  &&[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  &&[type="color"]::-webkit-color-swatch {
    border: 1px solid ${({ $palette }) => $palette.borderColor};
    border-radius: 0.375rem;
  }
`;

const ThemedBubbleCard = styled.div<{ $palette: ThemePalette }>`
  border-color: ${({ $palette }) => $palette.borderColor};
  background-color: ${({ $palette }) => $palette.backgroundColor2};
`;

const ThemedTabsList = styled(TabsList) <{ $palette: ThemePalette }>`
  background-color: ${({ $palette }) => $palette.backgroundColor};
  color: ${({ $palette }) => $palette.color};
`;

const ThemedTabsTrigger = styled(TabsTrigger) <{ $palette: ThemePalette }>`
  && {
    color: ${({ $palette }) => $palette.color2};
  }
  &&[data-state="active"] {
    background-color: ${({ $palette }) => $palette.extraColor};
    color: ${({ $palette }) => $palette.backgroundColor};
    box-shadow: none;
  }
`;

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
      <div className="border-2 border-solid px-3 py-2 text-xl font-bold" style={{ borderColor: palette.borderColor }}>
        {title}
      </div>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b text-left" style={{ borderColor: palette.borderColor }}>
            <th className="border-r px-3 py-2" style={{ borderColor: palette.borderColor }}>
              Prop
            </th>
            <th className="border-r px-3 py-2" style={{ borderColor: palette.borderColor }}>
              Type
            </th>
            <th className="border-r px-3 py-2" style={{ borderColor: palette.borderColor }}>
              Values
            </th>
            <th className="px-3 py-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-b align-top" style={{ borderColor: palette.borderColor }}>
              <td className="border-r px-3 py-2 font-mono" style={{ borderColor: palette.borderColor }}>
                {row.name}
              </td>
              <td className="border-r px-3 py-2" style={{ borderColor: palette.borderColor }}>
                {row.type}
              </td>
              <td className="border-r px-3 py-2" style={{ borderColor: palette.borderColor }}>
                {row.value}
              </td>
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
  const updateBubbleShape = (index: number, shape: ShapeSelectValue) => {
    const next = [...content];
    const current = next[index] ?? createBubble(index);
    if (shape === "custom") {
      next[index] = {
        ...current,
        shape: current.shape ?? "polygon",
        vertices: getVerticesOrDefault(current.vertices),
        polygonSides: undefined,
        trapezoidSlope: undefined,
        ellipseAxisRatio: undefined,
        skew: undefined,
      };
      onChange(next);
      return;
    }
    next[index] = {
      ...current,
      shape,
      vertices: undefined,
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
      ellipseAxisRatio:
        shape === "ellipse"
          ? typeof current.ellipseAxisRatio === "number"
            ? current.ellipseAxisRatio
            : 1.6
          : undefined,
      skew:
        shape === "parallelogram"
          ? typeof current.skew === "number"
            ? current.skew
            : 0
          : undefined,
    };
    onChange(next);
  };
  const updateVertex = (
    bubbleIndex: number,
    vertexIndex: number,
    key: keyof BubbleVertex,
    value: number,
  ) => {
    const next = [...content];
    const current = next[bubbleIndex] ?? createBubble(bubbleIndex);
    const source = getVerticesOrDefault(current.vertices);
    const safeValue = Number.isFinite(value) ? Math.trunc(value) : 0;
    const vertices = source.map((vertex, index) =>
      index === vertexIndex ? { ...vertex, [key]: safeValue } : vertex,
    );
    next[bubbleIndex] = {
      ...current,
      shape: current.shape ?? "polygon",
      vertices,
    };
    onChange(next);
  };
  const addVertex = (bubbleIndex: number) => {
    const next = [...content];
    const current = next[bubbleIndex] ?? createBubble(bubbleIndex);
    const source = getVerticesOrDefault(current.vertices);
    next[bubbleIndex] = {
      ...current,
      shape: current.shape ?? "polygon",
      vertices: [...source, randomVertex()],
    };
    onChange(next);
  };
  const deleteVertex = (bubbleIndex: number, vertexIndex: number) => {
    const next = [...content];
    const current = next[bubbleIndex] ?? createBubble(bubbleIndex);
    const source = getVerticesOrDefault(current.vertices);
    if (source.length <= 3) {
      return;
    }
    next[bubbleIndex] = {
      ...current,
      shape: current.shape ?? "polygon",
      vertices: source.filter((_, index) => index !== vertexIndex),
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
    <ThemedFieldSet className="gap-3 rounded-md border p-3" $palette={palette}>
      <ThemedFieldLegend variant="label" className="mb-1" $palette={palette}>
        Content (BubbleConsole)
      </ThemedFieldLegend>
      <ThemedFieldDescription className="text-xs" $palette={palette}>
        Add / remove / edit bubble items.
      </ThemedFieldDescription>

      <div className="space-y-3">
        {content.map((bubble, index) => (
          <ThemedBubbleCard key={`${bubble.label}-${index}`} className="rounded-md border p-3" $palette={palette}>
            <div className="mb-2 flex items-center justify-between">
              <div className="mx-auto text-lg font-semibold"><Bubbles />Bubble #{index + 1}</div>
              <ThemedButton palette={palette} variant="outline" size="sm" onClick={() => deleteBubble(index)}>
                <Trash />
              </ThemedButton>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3">
              {(() => {
                const shapeSelectValue = toShapeSelectValue(bubble);
                const vertices = getVerticesOrDefault(bubble.vertices);
                return (
                  <>
                    <Field>
                      <FieldLabel htmlFor={`bubble-label-${index}`}>Label</FieldLabel>
                      <FieldContent>
                        <ThemedInput
                          id={`bubble-label-${index}`}
                          type="text"
                          $palette={palette}
                          value={bubble.label}
                          onChange={(event) => updateBubble(index, "label", event.target.value)}
                        />
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel>Shape</FieldLabel>
                      <FieldContent>
                        <Select
                          value={shapeSelectValue}
                          onValueChange={(value) => updateBubbleShape(index, value as ShapeSelectValue)}
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
                            {SHAPE_OPTIONS.map((shapeOption) => (
                              <SelectItem key={shapeOption.value} value={shapeOption.value}>
                                {shapeOption.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor={`bubble-bg-${index}`}>Background Color</FieldLabel>
                      <FieldContent>
                        <ThemedInput
                          id={`bubble-bg-${index}`}
                          type="color"
                          className="h-10"
                          $palette={palette}
                          value={bubble.backgroundColor ?? "#38bdf8"}
                          onChange={(event) => updateBubble(index, "backgroundColor", event.target.value)}
                        />
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor={`bubble-text-${index}`}>Text Color</FieldLabel>
                      <FieldContent>
                        <ThemedInput
                          id={`bubble-text-${index}`}
                          type="color"
                          className="h-10"
                          $palette={palette}
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
                          className="mx-auto w-full max-w-xs"
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

                    <Field>
                      <FieldLabel>
                        Initial Angle ({Math.round(bubble.initialAngle ?? 0)}deg)
                      </FieldLabel>
                      <FieldContent>
                        <Slider
                          min={0}
                          max={360}
                          step={1}
                          value={[bubble.initialAngle ?? 0]}
                          onValueChange={(value) =>
                            updateBubble(index, "initialAngle", Math.round(value[0] ?? 0))
                          }
                          style={createSliderThemeStyle(palette)}
                        />
                      </FieldContent>
                    </Field>

                    {shapeSelectValue === "polygon" ? (
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

                    {shapeSelectValue === "trapezoid" ? (
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

                    {shapeSelectValue === "ellipse" ? (
                      <Field>
                        <FieldLabel>
                          Ellipse Axis Ratio ({(bubble.ellipseAxisRatio ?? 1.6).toFixed(2)})
                        </FieldLabel>
                        <FieldContent>
                          <Slider
                            min={1}
                            max={4}
                            step={0.01}
                            value={[bubble.ellipseAxisRatio ?? 1.6]}
                            onValueChange={(value) =>
                              updateBubble(
                                index,
                                "ellipseAxisRatio",
                                Number((value[0] ?? 1.6).toFixed(2)),
                              )
                            }
                            style={createSliderThemeStyle(palette)}
                          />
                        </FieldContent>
                      </Field>
                    ) : null}

                    {shapeSelectValue === "parallelogram" ? (
                      <Field>
                        <FieldLabel>Skew ({(bubble.skew ?? 0).toFixed(2)})</FieldLabel>
                        <FieldContent>
                          <Slider
                            min={-1}
                            max={1}
                            step={0.01}
                            value={[bubble.skew ?? 0]}
                            onValueChange={(value) =>
                              updateBubble(index, "skew", Number((value[0] ?? 0).toFixed(2)))
                            }
                            style={createSliderThemeStyle(palette)}
                          />
                        </FieldContent>
                      </Field>
                    ) : null}
                    {shapeSelectValue === "custom" ? (
                      <Field className="col-span-full">
                        <FieldLabel>Vertices (custom shape)</FieldLabel>
                        <FieldContent>
                          <div className="space-y-2">
                            {vertices.map((vertex, vertexIndex) => (
                              <div key={`bubble-${index}-vertex-${vertexIndex}`} className="space-y-1">
                                <div className="grid grid-cols-[1fr_1fr_auto] items-center gap-2">
                                  <ThemedInput
                                    type="number"
                                    $palette={palette}
                                    value={vertex.x}
                                    onWheel={preventNumberInputWheel}
                                    onChange={(event) =>
                                      updateVertex(
                                        index,
                                        vertexIndex,
                                        "x",
                                        Number(event.target.valueAsNumber),
                                      )
                                    }
                                  />
                                  <ThemedInput
                                    type="number"
                                    $palette={palette}
                                    value={vertex.y}
                                    onWheel={preventNumberInputWheel}
                                    onChange={(event) =>
                                      updateVertex(
                                        index,
                                        vertexIndex,
                                        "y",
                                        Number(event.target.valueAsNumber),
                                      )
                                    }
                                  />
                                  <ThemedButton
                                    palette={palette}
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => deleteVertex(index, vertexIndex)}
                                    disabled={vertices.length <= 3}
                                  >
                                    <Trash />
                                  </ThemedButton>
                                </div>
                                {Math.abs(vertex.x) > 10000 || Math.abs(vertex.y) > 10000 ? (
                                  <FieldDescription className="text-xs text-amber-600">
                                    number may too large
                                  </FieldDescription>
                                ) : null}
                              </div>
                            ))}
                            <div className="flex items-center justify-between gap-2">
                              <ThemedFieldDescription className="text-xs" $palette={palette}>
                                At least 3 vertices. Integers only.
                              </ThemedFieldDescription>
                              <ThemedButton palette={palette} type="button" size="sm" variant="outline" onClick={() => addVertex(index)}>
                                Add Vertex
                              </ThemedButton>
                            </div>
                          </div>
                        </FieldContent>
                      </Field>
                    ) : null}
                  </>
                );
              })()}
            </div>
          </ThemedBubbleCard>
        ))}
      </div>

      <ThemedButton palette={palette} variant="outline" onClick={addBubble}>
        Add Bubble
      </ThemedButton>
    </ThemedFieldSet>
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
  return (
    <ThemedFieldGroup className="gap-3 rounded-xl border p-4" $palette={palette}>
      <ThemedFieldLegend $palette={palette}>ComponentConsole</ThemedFieldLegend>
      {/* <FieldDescription className="text-xs">
        Width / Height are fixed: {FIXED_WIDTH} x {FIXED_HEIGHT}
      </FieldDescription> */}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3">
        <Field>
          <FieldLabel>Temperature: {componentProps.temperature}</FieldLabel>
          <FieldContent>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[componentProps.temperature]}
              onValueChange={(next) =>
                onChange({
                  ...componentProps,
                  temperature: clamp(Math.round(next[0] ?? componentProps.temperature), 0, 100),
                })
              }
              style={createSliderThemeStyle(palette)}
            />
            <ThemedFieldDescription className="text-xs" $palette={palette}>0 - 100</ThemedFieldDescription>
          </FieldContent>
        </Field>

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
    </ThemedFieldGroup>
  );
}

export default function BubbleBoxPreview() {
  const palette = getThemePalette();
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab: BubbleBoxTab = searchParams.get("tab") === "code" ? "code" : "preview";

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

  const sourcePanel = (
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
        <ThemedButton
          palette={palette}
          size="sm"
          variant="outline"
          type="button"
          onClick={handleCopySource}
        >
          {copied ? "Copied" : "Copy"}
        </ThemedButton>
      </div>
      <pre
        className="p-3 text-xs leading-6"
        style={{ backgroundColor: palette.backgroundColor2, color: palette.color2 }}
      >
        <code>{bubbleBoxSource}</code>
      </pre>
    </div>
  );

  return (
    <section
      className="rounded-xl border p-6 shadow-sm"
      style={{
        borderColor: palette.borderColor,
        backgroundColor: palette.backgroundColor2,
        color: palette.color2,
      }}
    >
      <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-2">
        <div className="m-4 flex items-center justify-between gap-4">
          <h1 className="m-0 text-2xl font-semibold">BubbleBox</h1>
          <ThemedTabsList className="h-10 rounded-md p-1" $palette={palette}>
            <ThemedTabsTrigger value="preview" $palette={palette}>Preview</ThemedTabsTrigger>
            <ThemedTabsTrigger value="code" $palette={palette}>Code</ThemedTabsTrigger>
          </ThemedTabsList>
        </div>
        <p className="m-3 text-sm select-none">
          An UI component that renders floating bubbles<Bubbles />. Providing innovative solution for information presentation methods, making your website more interactive and interesting.
        </p>
        <TabsContent value="preview">
          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_420px]">
            <div className="overflow-x-auto">
              <BubbleBox
                content={componentProps.content}
                temperature={componentProps.temperature}
                draggable={componentProps.draggable}
                fill={false}
                width={FIXED_WIDTH}
                height={FIXED_HEIGHT}
                className="bg-transparent"
              />
            </div>
            <ComponentConsole
              componentProps={componentProps}
              onChange={setComponentProps}
              palette={palette}
            />
          </div>
          {sourcePanel}
          <div className="mt-6 space-y-3">
            <h3>{t("sunnyZyUi.matter.bubbleBox.props")}</h3>
            <PropsDocTable title="BubbleBoxProps" rows={BUBBLE_BOX_PROPS_DOC} palette={palette} />
            <PropsDocTable title="BubbleProps" rows={BUBBLE_PROPS_DOC} palette={palette} />
            <PropsDocTable title="Vertex2D" rows={VERTEX_2D_DOC} palette={palette} />
          </div>
        </TabsContent>
        <TabsContent value="code">
          <div className="mt-4 space-y-4">
            <div
              className="rounded-lg border p-4"
              style={{ borderColor: palette.borderColor, backgroundColor: palette.backgroundColor }}
            >
              <h3 className="text-lg font-semibold">Download Guide</h3>
              <p className="mt-1 text-sm" style={{ color: palette.extraColor2 }}>
                Install dependencies then import the component in your page.
              </p>
              <pre
                className="mt-3 rounded-md border p-3 text-xs leading-6"
                style={{ borderColor: palette.borderColor, backgroundColor: palette.backgroundColor2 }}
              >
                <code>{`pnpm add matter-js\npnpm add -D @types/matter-js\n\nimport BubbleBox from "@/components/ui/matter/BubbleBox";`}</code>
              </pre>
            </div>
            {sourcePanel}
          </div>
        </TabsContent>
      </Tabs>


    </section>
  );
}

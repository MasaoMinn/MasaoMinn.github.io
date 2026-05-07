"use client";

import React, {
  type CSSProperties,
  type ComponentType,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ThemedButton } from "@/components/boxed/ThemedButton";
import { Bubbles, Trash2 } from "lucide-react";

export type propType =
  | "string"
  | "number"
  | "boolean"
  | "array"
  | "color"
  | "slider"
  | "select";

export type colorFormat = "named" | "hex" | "rgb" | "hsl" | "css";

export interface basicProp<TType extends propType = propType> {
  label: string;
  type: TType;
  description?: string;
  required?: boolean;
  visibleWhen?: (ctx: {
    rootProps: Record<string, unknown>;
    parentObject?: Record<string, unknown>;
    keyPath: string;
  }) => boolean;
}

export interface stringProp extends basicProp<"string"> {
  defaultValue?: string;
  syntax?: string;
}

export interface numberProp extends basicProp<"number"> {
  defaultValue?: number;
  max?: number;
  min?: number;
  step?: number;
}

export interface booleanProp extends basicProp<"boolean"> {
  defaultValue?: boolean;
}

export interface selectProp extends basicProp<"select"> {
  defaultValue?: string;
  options?: string[];
}

export interface sliderProp extends basicProp<"slider"> {
  defaultValue?: number;
  min: number;
  max: number;
  step?: number;
}

export interface colorProp extends basicProp<"color"> {
  defaultValue?: string;
  acceptedFormats?: colorFormat[];
  allowTransparent?: boolean;
  placeholder?: string;
}

export interface objectField {
  key: string;
  prop: propDefinition;
}

export interface arrayProp extends basicProp<"array"> {
  item?: propDefinition;
  itemFields?: objectField[];
  itemLabel?: string;
  createItem?: (ctx: { index: number; currentItems: unknown[] }) => unknown;
  defaultValue?: unknown[];
  minItems?: number;
  maxItems?: number;
}

export type propDefinition =
  | stringProp
  | numberProp
  | booleanProp
  | selectProp
  | sliderProp
  | colorProp
  | arrayProp;

const HEX_COLOR_RE = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const RGB_COLOR_RE =
  /^rgba?\(\s*(?:\d{1,3}%?)\s*,\s*(?:\d{1,3}%?)\s*,\s*(?:\d{1,3}%?)(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/i;
const HSL_COLOR_RE =
  /^hsla?\(\s*(?:-?\d+(?:\.\d+)?)(?:deg|rad|grad|turn)?\s*,\s*(?:\d+(?:\.\d+)?)%\s*,\s*(?:\d+(?:\.\d+)?)%(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/i;

const NAMED_CSS_COLORS = new Set([
  "aliceblue",
  "antiquewhite",
  "aqua",
  "aquamarine",
  "azure",
  "beige",
  "bisque",
  "black",
  "blanchedalmond",
  "blue",
  "blueviolet",
  "brown",
  "burlywood",
  "cadetblue",
  "chartreuse",
  "chocolate",
  "coral",
  "cornflowerblue",
  "cornsilk",
  "crimson",
  "cyan",
  "darkblue",
  "darkcyan",
  "darkgoldenrod",
  "darkgray",
  "darkgreen",
  "darkgrey",
  "darkkhaki",
  "darkmagenta",
  "darkolivegreen",
  "darkorange",
  "darkorchid",
  "darkred",
  "darksalmon",
  "darkseagreen",
  "darkslateblue",
  "darkslategray",
  "darkslategrey",
  "darkturquoise",
  "darkviolet",
  "deeppink",
  "deepskyblue",
  "dimgray",
  "dimgrey",
  "dodgerblue",
  "firebrick",
  "floralwhite",
  "forestgreen",
  "fuchsia",
  "gainsboro",
  "ghostwhite",
  "gold",
  "goldenrod",
  "gray",
  "green",
  "greenyellow",
  "grey",
  "honeydew",
  "hotpink",
  "indianred",
  "indigo",
  "ivory",
  "khaki",
  "lavender",
  "lavenderblush",
  "lawngreen",
  "lemonchiffon",
  "lightblue",
  "lightcoral",
  "lightcyan",
  "lightgoldenrodyellow",
  "lightgray",
  "lightgreen",
  "lightgrey",
  "lightpink",
  "lightsalmon",
  "lightseagreen",
  "lightskyblue",
  "lightslategray",
  "lightslategrey",
  "lightsteelblue",
  "lightyellow",
  "lime",
  "limegreen",
  "linen",
  "magenta",
  "maroon",
  "mediumaquamarine",
  "mediumblue",
  "mediumorchid",
  "mediumpurple",
  "mediumseagreen",
  "mediumslateblue",
  "mediumspringgreen",
  "mediumturquoise",
  "mediumvioletred",
  "midnightblue",
  "mintcream",
  "mistyrose",
  "moccasin",
  "navajowhite",
  "navy",
  "oldlace",
  "olive",
  "olivedrab",
  "orange",
  "orangered",
  "orchid",
  "palegoldenrod",
  "palegreen",
  "paleturquoise",
  "palevioletred",
  "papayawhip",
  "peachpuff",
  "peru",
  "pink",
  "plum",
  "powderblue",
  "purple",
  "rebeccapurple",
  "red",
  "rosybrown",
  "royalblue",
  "saddlebrown",
  "salmon",
  "sandybrown",
  "seagreen",
  "seashell",
  "sienna",
  "silver",
  "skyblue",
  "slateblue",
  "slategray",
  "slategrey",
  "snow",
  "springgreen",
  "steelblue",
  "tan",
  "teal",
  "thistle",
  "tomato",
  "turquoise",
  "violet",
  "wheat",
  "white",
  "whitesmoke",
  "yellow",
  "yellowgreen",
  "transparent",
  "currentcolor",
]);

export function detectColorFormat(raw: string): colorFormat | null {
  const value = raw.trim();
  if (!value) return null;

  if (HEX_COLOR_RE.test(value)) return "hex";
  if (RGB_COLOR_RE.test(value)) return "rgb";
  if (HSL_COLOR_RE.test(value)) return "hsl";

  const lower = value.toLowerCase();
  if (NAMED_CSS_COLORS.has(lower)) return "named";

  if (typeof CSS !== "undefined" && typeof CSS.supports === "function") {
    if (CSS.supports("color", value)) return "css";
  }

  return null;
}

export function isValidColorValue(
  value: string,
  config?: Pick<colorProp, "acceptedFormats" | "allowTransparent">,
): boolean {
  const format = detectColorFormat(value);
  if (!format) return false;

  const normalized = value.trim().toLowerCase();
  if (!config?.allowTransparent && normalized === "transparent") return false;

  if (config?.acceptedFormats && config.acceptedFormats.length > 0) {
    return config.acceptedFormats.includes(format);
  }

  return true;
}

export interface ComponentPreviewerProps {
  componentUrl: string;
  propsInfo: objectField[];
  className?: string;
  style?: CSSProperties;
  previewFrameSize?: {
    width: number;
    height: number;
  };
  previewComponentProps?: Record<string, unknown>;
  previewClassName?: string;
  previewStyle?: CSSProperties;
  consoleClassName?: string;
  consoleStyle?: CSSProperties;
  initialProps?: Record<string, unknown>;
  onPropsChange?: (nextProps: Record<string, unknown>) => void;
}

type PreviewComponentType = ComponentType<any>;

const FILE_EXTENSION_RE = /\.(?:mjs|cjs|tsx?|jsx?)$/i;
const HEX_FOR_PICKER_RE =
  /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const THEME_PALETTE = {
  backgroundColor: "var(--background)",
  color: "var(--foreground)",
  borderColor: "var(--border)",
  extraColor: "var(--theme-button-bg, var(--primary))",
  backgroundColor2: "var(--secondary)",
  color2: "var(--secondary-foreground)",
  extraColor2: "var(--theme-button-bg-hover, var(--accent))",
} as const;

const createSliderThemeStyle = () =>
({
  "--slider-track-color": THEME_PALETTE.borderColor,
  "--slider-track-border": THEME_PALETTE.borderColor,
  "--slider-range-color": THEME_PALETTE.extraColor,
  "--slider-thumb-bg": THEME_PALETTE.extraColor2,
  "--slider-thumb-border": THEME_PALETTE.color,
  "--slider-thumb-glow": THEME_PALETTE.extraColor,
} as CSSProperties);

const normalizeComponentUrl = (rawUrl: string): string =>
  rawUrl
    .trim()
    .replace(/\\/g, "/")
    .replace(/[?#].*$/, "")
    .replace(FILE_EXTENSION_RE, "")
    .replace(/^\.\/+/, "")
    .replace(/^\/+/, "");

const pickComponentExport = (mod: unknown): PreviewComponentType | null => {
  if (!mod || typeof mod !== "object") return null;
  const moduleObject = mod as Record<string, unknown>;

  if (typeof moduleObject.default === "function") {
    return moduleObject.default as PreviewComponentType;
  }

  for (const [exportName, exported] of Object.entries(moduleObject)) {
    if (typeof exported !== "function") continue;
    if (exportName && exportName[0] === exportName[0]?.toUpperCase()) {
      return exported as PreviewComponentType;
    }
  }

  for (const exported of Object.values(moduleObject)) {
    if (typeof exported === "function") return exported as PreviewComponentType;
  }

  return null;
};

type ComponentModule = {
  default?: PreviewComponentType;
  [key: string]: unknown;
};

type ComponentLoader = () => Promise<ComponentModule>;

const KNOWN_COMPONENT_LOADERS: Record<string, ComponentLoader> = {
  "components/ui/matter/BubbleBox": () => import("../../../components/ui/matter/BubbleBox"),
  "ui/matter/BubbleBox": () => import("../../../components/ui/matter/BubbleBox"),
  "@/components/ui/matter/BubbleBox": () => import("../../../components/ui/matter/BubbleBox"),
  "src/components/ui/matter/BubbleBox": () => import("../../../components/ui/matter/BubbleBox"),
};

const resolveKnownLoader = (componentUrl: string): ComponentLoader | null => {
  const normalized = normalizeComponentUrl(componentUrl);
  const candidates = [
    normalized,
    normalized.replace(/^@\//, ""),
    normalized.replace(/^src\//, ""),
    normalized.replace(/^components\//, "components/"),
    `components/${normalized}`,
    `@/${normalized}`,
  ];

  for (const candidate of candidates) {
    if (KNOWN_COMPONENT_LOADERS[candidate]) {
      return KNOWN_COMPONENT_LOADERS[candidate];
    }
  }

  return null;
};

const loadComponentByUrl = async (
  componentUrl: string,
): Promise<PreviewComponentType> => {
  const normalized = normalizeComponentUrl(componentUrl);
  if (!normalized) {
    throw new Error("componentUrl is empty.");
  }

  const loader = resolveKnownLoader(componentUrl);
  if (!loader) {
    throw new Error(
      `Unsupported componentUrl "${componentUrl}". Add it to KNOWN_COMPONENT_LOADERS in ComponentPreviewer.`,
    );
  }

  const module = await loader();
  const component = pickComponentExport(module);
  if (!component) {
    throw new Error(`Component "${componentUrl}" has no valid React component export.`);
  }

  return component;
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

const expandShortHex = (hex: string): string => {
  const normalized = hex.toLowerCase();
  if (normalized.length === 4 || normalized.length === 5) {
    const [hash, r, g, b] = normalized;
    return `${hash}${r}${r}${g}${g}${b}${b}`;
  }
  if (normalized.length === 9) {
    return normalized.slice(0, 7);
  }
  return normalized;
};

const toColorPickerValue = (raw: string): string => {
  const value = raw.trim();
  if (HEX_FOR_PICKER_RE.test(value)) {
    return expandShortHex(value);
  }

  if (typeof document !== "undefined") {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (context) {
      context.fillStyle = "#000000";
      context.fillStyle = value || "#000000";
      const computed = context.fillStyle;
      if (HEX_FOR_PICKER_RE.test(computed)) {
        return expandShortHex(computed);
      }
    }
  }

  return "#000000";
};

const getDefaultValue = (schema: propDefinition): unknown => {
  switch (schema.type) {
    case "string":
      return schema.defaultValue ?? "";
    case "number":
      return schema.defaultValue ?? schema.min ?? 0;
    case "slider":
      return schema.defaultValue ?? schema.min;
    case "boolean":
      return schema.defaultValue ?? false;
    case "select":
      return schema.defaultValue ?? schema.options?.[0] ?? "";
    case "color":
      return schema.defaultValue ?? "";
    case "array":
      return schema.defaultValue ? [...schema.defaultValue] : [];
    default:
      return null;
  }
};

const getObjectFromFields = (fields: objectField[]): Record<string, unknown> => {
  const base: Record<string, unknown> = {};
  for (const field of fields) {
    base[field.key] = getDefaultValue(field.prop);
  }
  return base;
};

const getArrayItemDefaultValue = (schema: arrayProp): unknown => {
  if (schema.itemFields && schema.itemFields.length > 0) {
    return getObjectFromFields(schema.itemFields);
  }

  if (schema.item) {
    return getDefaultValue(schema.item);
  }

  return {};
};

const buildInitialProps = (
  propsInfo: objectField[],
  initialProps?: Record<string, unknown>,
): Record<string, unknown> => {
  const base: Record<string, unknown> = {};
  for (const field of propsInfo) {
    const hasProvidedInitial = !!initialProps &&
      Object.prototype.hasOwnProperty.call(initialProps, field.key);
    base[field.key] = hasProvidedInitial
      ? initialProps?.[field.key]
      : getDefaultValue(field.prop);
  }
  return base;
};

export default function ComponentPreviewer({
  componentUrl,
  propsInfo,
  className,
  style,
  previewFrameSize,
  previewComponentProps,
  previewClassName,
  previewStyle,
  consoleClassName,
  consoleStyle,
  initialProps,
  onPropsChange,
}: ComponentPreviewerProps) {
  const palette = THEME_PALETTE;
  const isComplexProp = (schema: propDefinition) => schema.type === "array";
  const compactFieldClassName = "space-y-1.5 rounded-xl px-3 py-3";
  const simpleGridClassName = "grid grid-cols-4 gap-2";
  const itemFieldGridClassName = "grid grid-cols-4 gap-2";
  const themedInputClassName =
    "h-10 border-[var(--border)] bg-[var(--secondary)] px-3 py-2 text-sm text-[var(--secondary-foreground)] placeholder:text-[var(--theme-button-bg-hover,var(--accent))] focus-visible:ring-[var(--theme-button-bg-hover,var(--accent))]";
  const themedSelectTriggerClassName =
    "h-10 border-[var(--border)] bg-[var(--secondary)] px-3 py-2 text-sm text-[var(--secondary-foreground)] data-[placeholder]:text-[var(--theme-button-bg-hover,var(--accent))] focus:ring-[var(--theme-button-bg-hover,var(--accent))]";
  const themedSelectContentClassName =
    "border-[var(--border)] bg-[var(--secondary)] text-xs text-[var(--secondary-foreground)]";

  const initialPropValues = useMemo(
    () => buildInitialProps(propsInfo, initialProps),
    [propsInfo, initialProps],
  );
  const [propValues, setPropValues] = useState<Record<string, unknown>>(initialPropValues);
  const [loadedComponent, setLoadedComponent] = useState<PreviewComponentType | null>(null);
  const [isLoadingComponent, setIsLoadingComponent] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    setPropValues(initialPropValues);
  }, [initialPropValues]);

  useEffect(() => {
    onPropsChange?.(propValues);
  }, [propValues, onPropsChange]);

  useEffect(() => {
    let active = true;
    setIsLoadingComponent(true);
    setLoadError(null);
    setLoadedComponent(null);

    loadComponentByUrl(componentUrl)
      .then((component) => {
        if (!active) return;
        setLoadedComponent(() => component);
      })
      .catch((error) => {
        if (!active) return;
        setLoadError(error instanceof Error ? error.message : "Failed to load component.");
      })
      .finally(() => {
        if (!active) return;
        setIsLoadingComponent(false);
      });

    return () => {
      active = false;
    };
  }, [componentUrl]);

  const updateTopLevelProp = (key: string, nextValue: unknown) => {
    setPropValues((previous) => ({
      ...previous,
      [key]: nextValue,
    }));
  };

  const isPropVisible = (
    schema: propDefinition,
    keyPath: string,
    parentObject?: Record<string, unknown>,
  ) => {
    if (!schema.visibleWhen) return true;
    try {
      return schema.visibleWhen({
        rootProps: propValues,
        parentObject,
        keyPath,
      });
    } catch {
      return true;
    }
  };

  const renderPropControl = (
    schema: propDefinition,
    value: unknown,
    onChange: (next: unknown) => void,
    keyPath: string,
  ): React.ReactNode => {
    const showRequired = schema.required ? (
      <span className="ml-1" style={{ color: palette.extraColor }}>
        *
      </span>
    ) : null;
    const description = schema.description ? (
      <p className="text-xs" style={{ color: palette.extraColor2 }}>
        {schema.description}
      </p>
    ) : null;

    if (schema.type === "string") {
      return (
        <div className={compactFieldClassName} style={{ backgroundColor: "inherit" }}>
          <label className="text-sm font-semibold leading-none" style={{ color: palette.color2 }}>
            {schema.label}
            {showRequired}
          </label>
          <Input
            value={typeof value === "string" ? value : ""}
            onChange={(event) => onChange(event.target.value)}
            placeholder={schema.syntax ?? "string"}
            className={themedInputClassName}
          />
          {description}
        </div>
      );
    }

    if (schema.type === "number") {
      const current = typeof value === "number" ? value : "";
      return (
        <div className={compactFieldClassName} style={{ backgroundColor: "inherit" }}>
          <label className="text-sm font-semibold leading-none" style={{ color: palette.color2 }}>
            {schema.label}
            {showRequired}
          </label>
          <Input
            type="number"
            value={current}
            min={schema.min}
            max={schema.max}
            step={schema.step}
            onChange={(event) => {
              const raw = event.target.value;
              if (raw === "") {
                onChange(undefined);
                return;
              }
              const next = Number(raw);
              if (!Number.isNaN(next)) onChange(next);
            }}
            className={themedInputClassName}
          />
          {description}
        </div>
      );
    }

    if (schema.type === "slider") {
      const current = typeof value === "number" ? value : (schema.defaultValue ?? schema.min);
      return (
        <div className={compactFieldClassName} style={{ backgroundColor: "inherit" }}>
          <div className="flex items-center justify-between gap-3">
            <label className="select-none text-sm font-semibold leading-none" style={{ color: palette.color2 }}>
              {schema.label}
              {showRequired}
            </label>
            <span className="select-none text-sm" style={{ color: palette.extraColor2 }}>{current}</span>
          </div>
          <Slider
            min={schema.min}
            max={schema.max}
            step={schema.step ?? 1}
            value={[current]}
            onValueChange={(next) => onChange(next[0])}
            style={createSliderThemeStyle()}
          />
          {description}
        </div>
      );
    }

    if (schema.type === "boolean") {
      return (
        <div className={compactFieldClassName} style={{ backgroundColor: "inherit" }}>
          <label className="text-sm font-semibold leading-none" style={{ color: palette.color2 }}>
            {schema.label}
            {showRequired}
          </label>
          <label className="inline-flex items-center gap-2 text-sm" style={{ color: palette.color2 }}>
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(event) => onChange(event.target.checked)}
              className="h-4 w-4"
              style={{ accentColor: palette.extraColor }}
            />
            <span>{Boolean(value) ? "Enabled" : "Disabled"}</span>
          </label>
          {description}
        </div>
      );
    }

    if (schema.type === "select") {
      const options = schema.options ?? [];
      const current = typeof value === "string" ? value : (schema.defaultValue ?? options[0] ?? "");
      return (
        <div className={compactFieldClassName} style={{ backgroundColor: "inherit" }}>
          <label className="text-sm font-semibold leading-none" style={{ color: palette.color2 }}>
            {schema.label}
            {showRequired}
          </label>
          <Select value={current} onValueChange={onChange}>
            <SelectTrigger className={themedSelectTriggerClassName}>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent className={themedSelectContentClassName}>
              {options.map((option) => (
                <SelectItem key={`${keyPath}-${option}`} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description}
        </div>
      );
    }

    if (schema.type === "color") {
      const current = typeof value === "string" ? value : (schema.defaultValue ?? "");
      const normalizedColor = toColorPickerValue(current);

      return (
        <div className={compactFieldClassName} style={{ backgroundColor: "inherit" }}>
          <label className="text-sm font-semibold leading-none" style={{ color: palette.color2 }}>
            {schema.label}
            {showRequired}
          </label>
          <Input
            type="color"
            value={normalizedColor}
            onChange={(event) => {
              const next = event.target.value.trim().toLowerCase();
              if (!HEX_COLOR_RE.test(next)) return;
              onChange(expandShortHex(next));
            }}
            aria-label={`${schema.label} color picker`}
            className={cn(
              themedInputClassName,
              "h-10 w-full cursor-pointer p-1 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border [&::-webkit-color-swatch]:border-[var(--border)]",
            )}
          />
          {description}
        </div>
      );
    }

    if (schema.type === "array") {
      const currentArray = Array.isArray(value) ? value : [];
      const canAdd = schema.maxItems == null || currentArray.length < schema.maxItems;
      const canRemove = (count: number) =>
        schema.minItems == null || count > schema.minItems;
      const arrayItemFields = schema.itemFields ?? null;
      const itemLabel = schema.itemLabel ?? schema.item?.label ?? "Item";

      return (
        <div
          className="space-y-2 rounded-xl p-2"
          style={{
            backgroundColor: "inherit",
          }}
        >
          <div className="space-y-1">
            <div className="text-2xl font-semibold" style={{ color: palette.color2 }}>
              {schema.label}
              {showRequired}
            </div>
            <div className="text-xs" style={{ color: palette.extraColor2 }}>
              {schema.description ?? "Add / remove / edit items."}
            </div>
          </div>
          <div className="overflow-hidden rounded-lg" style={{ backgroundColor: "inherit" }}>
            {currentArray.map((itemValue, index) => (
              <div
                key={`${keyPath}-${index}`}
                className={cn(
                  "p-3",
                  index > 0 && "border-t",
                )}
                style={{ borderColor: palette.borderColor, backgroundColor: "inherit" }}
              >
                <div className="mb-3 grid grid-cols-[1fr_auto_1fr] items-center">
                  <div />
                  <div className="flex items-center justify-center gap-2 text-lg font-semibold" style={{ color: palette.color2 }}>
                    <Bubbles className="h-5 w-5" />
                    <span>{itemLabel} #{index + 1}</span>
                  </div>
                  <ThemedButton
                    palette={palette}
                    type="button"
                    size="sm"
                    variant="outline"
                    className="justify-self-end rounded-full px-3"
                    disabled={!canRemove(currentArray.length)}
                    onClick={() => {
                      const next = currentArray.filter((_, idx) => idx !== index);
                      onChange(next);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </ThemedButton>
                </div>

                {arrayItemFields ? (
                  <div className={itemFieldGridClassName}>
                    {arrayItemFields.map((field) => {
                      const currentObject = isPlainObject(itemValue) ? itemValue : {};
                      if (!isPropVisible(field.prop, `${keyPath}[${index}].${field.key}`, currentObject)) {
                        return null;
                      }
                      const fieldValue = Object.prototype.hasOwnProperty.call(currentObject, field.key)
                        ? currentObject[field.key]
                        : getDefaultValue(field.prop);
                      return (
                        <div
                          key={`${keyPath}[${index}].${field.key}`}
                          className={cn(isComplexProp(field.prop) && "col-span-4")}
                        >
                          {renderPropControl(
                            field.prop,
                            fieldValue,
                            (nextFieldValue) => {
                              const next = [...currentArray];
                              const currentObject = isPlainObject(next[index]) ? next[index] : {};
                              next[index] = {
                                ...currentObject,
                                [field.key]: nextFieldValue,
                              };
                              onChange(next);
                            },
                            `${keyPath}[${index}].${field.key}`,
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : schema.item ? (
                  renderPropControl(
                    schema.item,
                    itemValue,
                    (nextItem) => {
                      const next = [...currentArray];
                      next[index] = nextItem;
                      onChange(next);
                    },
                    `${keyPath}[${index}]`,
                  )
                ) : (
                  <p className="text-xs" style={{ color: palette.extraColor2 }}>
                    No item schema configured.
                  </p>
                )}
              </div>
            ))}
            {currentArray.length === 0 ? (
              <p className="p-3 text-xs" style={{ color: palette.extraColor2 }}>
                No items. Click Add to create one.
              </p>
            ) : null}
          </div>
          <div className="flex justify-end">
            <ThemedButton
              palette={palette}
              type="button"
              size="sm"
              variant="outline"
              disabled={!canAdd}
              onClick={() => {
                const nextItem = schema.createItem
                  ? schema.createItem({
                    index: currentArray.length,
                    currentItems: currentArray,
                  })
                  : getArrayItemDefaultValue(schema);
                const next = [...currentArray, nextItem];
                onChange(next);
              }}
            >
              Add
            </ThemedButton>
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-md border border-dashed p-3 text-xs" style={{ borderColor: palette.borderColor, color: palette.extraColor2 }}>
        Unsupported prop schema.
      </div>
    );
  };

  const simpleProps = useMemo(
    () => propsInfo.filter((item) => !isComplexProp(item.prop)),
    [propsInfo],
  );
  const complexProps = useMemo(
    () => propsInfo.filter((item) => isComplexProp(item.prop)),
    [propsInfo],
  );
  const mergedComponentProps = useMemo(
    () => ({
      ...propValues,
      ...(previewComponentProps ?? {}),
    }),
    [propValues, previewComponentProps],
  );

  return (
    <section
      className={cn(
        "rounded-xl border p-2 shadow-sm lg:p-3",
        className,
      )}
      style={{
        borderColor: palette.borderColor,
        backgroundColor: palette.backgroundColor2,
        color: palette.color2,
        ...style,
      }}
    >
      <div className="mb-2 flex items-end justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold">Component Preview</h3>
          <p className="text-xs" style={{ color: palette.extraColor2 }}>
            Dynamic playground based on prop schema definitions.
          </p>
        </div>
      </div>

      <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_minmax(820px,1fr)]">
        <div
          className={cn(
            "min-h-[300px] overflow-auto rounded-xl border p-2 shadow-sm",
            previewClassName,
          )}
          style={{
            borderColor: palette.borderColor,
            background: `linear-gradient(135deg, ${palette.backgroundColor2} 0%, ${palette.backgroundColor} 100%)`,
            ...previewStyle,
          }}
        >
          {isLoadingComponent ? (
            <div className="text-sm" style={{ color: palette.extraColor2 }}>Loading component...</div>
          ) : null}
          {!isLoadingComponent && loadError ? (
            <div
              className="rounded-md border p-3 text-sm"
              style={{ borderColor: palette.extraColor, backgroundColor: palette.backgroundColor, color: palette.extraColor }}
            >
              {loadError}
            </div>
          ) : null}
          {!isLoadingComponent && !loadError && loadedComponent
            ? (
              previewFrameSize
                ? (
                  <div
                    className="relative mx-auto"
                    style={{
                      width: previewFrameSize.width,
                      height: previewFrameSize.height,
                    }}
                  >
                    {React.createElement(loadedComponent, mergedComponentProps)}
                  </div>
                )
                : React.createElement(loadedComponent, mergedComponentProps)
            )
            : null}
        </div>

        <aside
          className={cn(
            "rounded-xl border p-2 shadow-sm",
            consoleClassName,
          )}
          style={{
            borderColor: palette.borderColor,
            backgroundColor: palette.backgroundColor,
            ...consoleStyle,
          }}
        >
          <div className="mb-2">
            <h3 className="text-2xl font-semibold">ComponentConsole</h3>
          </div>
          <div className={simpleGridClassName}>
            {simpleProps.map((item) => {
              if (!isPropVisible(item.prop, item.key)) {
                return null;
              }
              const current = Object.prototype.hasOwnProperty.call(propValues, item.key)
                ? propValues[item.key]
                : getDefaultValue(item.prop);

              return (
                <div key={item.key}>
                  {renderPropControl(
                    item.prop,
                    current,
                    (nextValue) => updateTopLevelProp(item.key, nextValue),
                    item.key,
                  )}
                </div>
              );
            })}
          </div>
          {complexProps.length > 0 ? (
            <div className="mt-2 space-y-2">
              {complexProps.map((item) => {
                if (!isPropVisible(item.prop, item.key)) {
                  return null;
                }
                const current = Object.prototype.hasOwnProperty.call(propValues, item.key)
                  ? propValues[item.key]
                  : getDefaultValue(item.prop);

                return (
                  <div key={item.key}>
                    {renderPropControl(
                      item.prop,
                      current,
                      (nextValue) => updateTopLevelProp(item.key, nextValue),
                      item.key,
                    )}
                  </div>
                );
              })}
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  );
}

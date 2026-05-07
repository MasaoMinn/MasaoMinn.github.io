"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useTheme } from "@/components/boxed/ThemeProvider";
import { useLocalStorageStore } from "@/store/LocalStorageStore";

const CURSORLAB_SETTINGS_KEY = "cursorlab.settings.v1";

export const CURSOR_TRAIL_TYPES = [
  "circle",
  "circle-filled",
  "square",
  "square-filled",
  "triangle",
  "star",
  "dot",
] as const;

export const CURSOR_POINTER_STYLES = [
  "default",
  "crosshair",
  "grab",
  "copy",
  "none",
] as const;

export type CursorTrailType = (typeof CURSOR_TRAIL_TYPES)[number];
export type CursorPointerStyle = (typeof CURSOR_POINTER_STYLES)[number];

export type CursorLabSettings = {
  enabled: boolean;
  clickEffect: boolean;
  trailType: CursorTrailType;
  pointerStyle: CursorPointerStyle;
  size: number;
  thickness: number;
  delay: number;
};

const DEFAULT_CURSORLAB_SETTINGS: CursorLabSettings = {
  enabled: true,
  clickEffect: true,
  trailType: "circle",
  pointerStyle: "default",
  size: 18,
  thickness: 2,
  delay: 0.06,
};

type CursorLabContextType = {
  cursorSettings: CursorLabSettings;
  setCursorSettings: (patch: Partial<CursorLabSettings>) => void;
  resetCursorSettings: () => void;
};

const CursorLabContext = createContext<CursorLabContextType | null>(null);

type CursorLabStaticApi = {
  setCursorTrail: (trailType: CursorTrailType) => CursorLabStaticApi;
  setSize: (size: number) => CursorLabStaticApi;
  setThickness: (thickness: number) => CursorLabStaticApi;
  setColor: (color: string) => CursorLabStaticApi;
  trailDelay: (delay: number) => CursorLabStaticApi;
  setCustomCursor: (
    cursorType: string,
    param1?: number,
    param2?: number,
  ) => CursorLabStaticApi;
  setCustomStyle: (cssStyles: string | Record<string, string>) => CursorLabStaticApi;
  startTrail: () => CursorLabStaticApi;
  setDefault: () => void;
  setNormalCursor: () => CursorLabStaticApi;
  destroy: () => void;
};

type CursorLabCtor = new () => CursorLabStaticApi;

declare global {
  interface Window {
    cursorLabInstance?: unknown;
  }
}

const isObjectRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const isTrailType = (value: unknown): value is CursorTrailType =>
  typeof value === "string" &&
  (CURSOR_TRAIL_TYPES as readonly string[]).includes(value);

const isPointerStyle = (value: unknown): value is CursorPointerStyle =>
  typeof value === "string" &&
  (CURSOR_POINTER_STYLES as readonly string[]).includes(value);

const normalizeCursorSettings = (
  raw: Partial<CursorLabSettings> | null | undefined,
): CursorLabSettings => {
  const source = raw ?? {};
  return {
    enabled:
      typeof source.enabled === "boolean"
        ? source.enabled
        : DEFAULT_CURSORLAB_SETTINGS.enabled,
    clickEffect:
      typeof source.clickEffect === "boolean"
        ? source.clickEffect
        : DEFAULT_CURSORLAB_SETTINGS.clickEffect,
    trailType: isTrailType(source.trailType)
      ? source.trailType
      : DEFAULT_CURSORLAB_SETTINGS.trailType,
    pointerStyle: isPointerStyle(source.pointerStyle)
      ? source.pointerStyle
      : DEFAULT_CURSORLAB_SETTINGS.pointerStyle,
    size:
      typeof source.size === "number"
        ? clamp(source.size, 8, 48)
        : DEFAULT_CURSORLAB_SETTINGS.size,
    thickness:
      typeof source.thickness === "number"
        ? clamp(source.thickness, 1, 8)
        : DEFAULT_CURSORLAB_SETTINGS.thickness,
    delay:
      typeof source.delay === "number"
        ? clamp(source.delay, 0.02, 0.35)
        : DEFAULT_CURSORLAB_SETTINGS.delay,
  };
};

const parseCursorSettings = (raw: string | null): CursorLabSettings => {
  if (!raw) return DEFAULT_CURSORLAB_SETTINGS;
  try {
    const parsed = JSON.parse(raw);
    if (!isObjectRecord(parsed)) return DEFAULT_CURSORLAB_SETTINGS;
    return normalizeCursorSettings(parsed as Partial<CursorLabSettings>);
  } catch {
    return DEFAULT_CURSORLAB_SETTINGS;
  }
};

const hasCursorLabInstance = () =>
  typeof window !== "undefined" &&
  window.cursorLabInstance != null;

const readCursorLabApi = async (): Promise<CursorLabStaticApi | null> => {
  try {
    const mod = await import("cursorlab");
    const cursorLab = ((mod as unknown as { default?: unknown }).default ??
      mod) as Partial<CursorLabStaticApi>;
    if (!cursorLab || typeof cursorLab.setCursorTrail !== "function") {
      return null;
    }
    return cursorLab as CursorLabStaticApi;
  } catch {
    return null;
  }
};

const readCursorLabCtor = async (): Promise<CursorLabCtor | null> => {
  try {
    const mod = await import("cursorlab");
    const ctor = ((mod as unknown as { default?: unknown }).default ??
      mod) as unknown;
    if (typeof ctor !== "function") return null;
    return ctor as CursorLabCtor;
  } catch {
    return null;
  }
};

const applyCursorPointerStyle = (
  cursorLab: CursorLabStaticApi,
  pointerStyle: CursorPointerStyle,
) => {
  if (pointerStyle === "default") {
    cursorLab.setNormalCursor();
    return;
  }
  if (pointerStyle === "crosshair") {
    cursorLab.setCustomCursor("crosshair", 2, 14);
    return;
  }
  cursorLab.setCustomCursor(pointerStyle);
};

const applyCursorDelay = (cursorLab: CursorLabStaticApi, delay: number) => {
  const maybeTrailDelay = cursorLab as unknown as {
    trailDelay?: ((value: number) => unknown) | number;
    trailDelayValue?: number;
  };

  if (typeof maybeTrailDelay.trailDelay === "function") {
    try {
      maybeTrailDelay.trailDelay(delay);
      return;
    } catch {
      // fallthrough
    }
  }

  maybeTrailDelay.trailDelayValue = delay;
  if (hasCursorLabInstance() && isObjectRecord(window.cursorLabInstance)) {
    (window.cursorLabInstance as { trailDelayValue?: number }).trailDelayValue = delay;
  }
};

const toInternalTrailDelay = (uiDelay: number) =>
  clamp(0.37 - uiDelay, 0.02, 0.35);

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.trim().toLowerCase();
  const matched = normalized.match(/^#([0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (!matched) return hex;
  const source = matched[1].length === 8 ? matched[1].slice(0, 6) : matched[1];
  const r = parseInt(source.slice(0, 2), 16);
  const g = parseInt(source.slice(2, 4), 16);
  const b = parseInt(source.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1)})`;
};

const buildTrailStyle = (trailType: CursorTrailType) => {
  if (trailType === "triangle") {
    return `
      .cursorlab-trail {
        box-shadow: none !important;
        filter:
          drop-shadow(0 0 8px color-mix(in srgb, var(--cursorlab-trail-color) 65%, transparent))
          drop-shadow(0 0 14px color-mix(in srgb, var(--cursorlab-trail-color) 42%, transparent));
        transition: filter 140ms ease;
      }
    `;
  }

  return `
    .cursorlab-trail {
      filter: none;
      box-shadow:
        0 0 10px color-mix(in srgb, var(--cursorlab-trail-color) 55%, transparent),
        0 0 22px color-mix(in srgb, var(--cursorlab-trail-color) 30%, transparent) !important;
      transition: box-shadow 140ms ease, filter 140ms ease;
    }
  `;
};

const applyCursorConfig = (
  cursorLab: CursorLabStaticApi,
  settings: CursorLabSettings,
  trailColor: string,
) => {
  const cursor = cursorLab
    .setCursorTrail(settings.trailType)
    .setColor(trailColor)
    .setSize(settings.size)
    .setThickness(settings.thickness)
    .setCustomStyle(buildTrailStyle(settings.trailType));

  applyCursorDelay(cursor, toInternalTrailDelay(settings.delay));
  // User要求只显示自定义光标，不显示原生鼠标。
  applyCursorPointerStyle(cursor, "none");
};

const applyTailCursorConfig = (
  cursorLab: CursorLabStaticApi,
  settings: CursorLabSettings,
  trailColor: string,
  index: number,
) => {
  const size = Math.max(8, settings.size - (index + 1) * 2.8);
  const thickness = Math.max(1, settings.thickness - index * 0.55);
  const alpha = Math.max(0.18, 0.56 - index * 0.12);
  const delay = clamp(toInternalTrailDelay(settings.delay) + 0.04 * (index + 1), 0.02, 0.35);
  const color = hexToRgba(trailColor, alpha);

  const cursor = cursorLab
    .setCursorTrail(settings.trailType)
    .setColor(color)
    .setSize(size)
    .setThickness(thickness);

  applyCursorDelay(cursor, delay);
  applyCursorPointerStyle(cursor, "none");
};

export function useCursorLab() {
  const context = useContext(CursorLabContext);
  if (!context) {
    throw new Error("useCursorLab must be used within CursorLabProvider");
  }
  return context;
}

export default function CursorLabProvider({ children }: { children: ReactNode }) {
  const { currentPalette } = useTheme();
  const [cursorSettings, setCursorSettingsState] = useState<CursorLabSettings>(
    DEFAULT_CURSORLAB_SETTINGS,
  );
  const [hydrated, setHydrated] = useState(false);
  const [cursorLabReady, setCursorLabReady] = useState(false);
  const cursorLabRef = useRef<CursorLabStaticApi | null>(null);
  const tailInstancesRef = useRef<CursorLabStaticApi[]>([]);

  const destroyTailInstances = useCallback(() => {
    for (const instance of tailInstancesRef.current) {
      try {
        instance.destroy();
      } catch {
        // ignore
      }
    }
    tailInstancesRef.current = [];
  }, []);

  const setCursorSettings = useCallback((patch: Partial<CursorLabSettings>) => {
    setCursorSettingsState((prev) =>
      normalizeCursorSettings({
        ...prev,
        ...patch,
      }),
    );
  }, []);

  const resetCursorSettings = useCallback(() => {
    setCursorSettingsState(DEFAULT_CURSORLAB_SETTINGS);
  }, []);

  useEffect(() => {
    const store = useLocalStorageStore.getState();
    const stored = store.getItem(CURSORLAB_SETTINGS_KEY);
    setCursorSettingsState(parseCursorSettings(stored));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    useLocalStorageStore
      .getState()
      .setItem(CURSORLAB_SETTINGS_KEY, JSON.stringify(cursorSettings));
  }, [cursorSettings, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.style.setProperty(
      "--cursorlab-trail-color",
      currentPalette.extraColor,
    );
    document.documentElement.style.setProperty(
      "--cursorlab-click-color",
      currentPalette.extraColor2,
    );
  }, [currentPalette, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;

    const init = async () => {
      const api = await readCursorLabApi();
      if (!api || cancelled) return;
      cursorLabRef.current = api;
      setCursorLabReady(true);
    };

    void init();

    return () => {
      cancelled = true;
      destroyTailInstances();
      if (cursorLabRef.current && hasCursorLabInstance()) {
        cursorLabRef.current.destroy();
      }
      cursorLabRef.current = null;
      setCursorLabReady(false);
    };
  }, [destroyTailInstances, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const className = "cursorlab-hide-native";
    const root = document.documentElement;
    if (cursorSettings.enabled) {
      root.classList.add(className);
      return () => {
        root.classList.remove(className);
      };
    }
    root.classList.remove(className);
    return;
  }, [cursorSettings.enabled, hydrated]);

  useEffect(() => {
    if (!hydrated || !cursorLabReady) return;
    const cursorLab = cursorLabRef.current;
    if (!cursorLab) return;

    if (!cursorSettings.enabled) {
      destroyTailInstances();
      cursorLab.setDefault();
      cursorLab.setNormalCursor();
      return;
    }

    applyCursorConfig(cursorLab, cursorSettings, currentPalette.extraColor);
    cursorLab.startTrail();
  }, [cursorLabReady, cursorSettings.enabled, currentPalette.extraColor, destroyTailInstances, hydrated]);

  useEffect(() => {
    if (!hydrated || !cursorLabReady || !cursorSettings.enabled) return;
    const cursorLab = cursorLabRef.current;
    if (!cursorLab) return;
    applyCursorConfig(cursorLab, cursorSettings, currentPalette.extraColor);
  }, [
    cursorLabReady,
    cursorSettings.enabled,
    cursorSettings.delay,
    cursorSettings.size,
    cursorSettings.thickness,
    cursorSettings.trailType,
    currentPalette.extraColor,
    hydrated,
  ]);

  useEffect(() => {
    if (!hydrated || !cursorSettings.enabled) {
      destroyTailInstances();
      return;
    }

    let cancelled = false;

    const run = async () => {
      const TailCtor = await readCursorLabCtor();
      if (!TailCtor || cancelled) return;

      destroyTailInstances();

      const tailCount = 4;
      const nextInstances: CursorLabStaticApi[] = [];
      for (let i = 0; i < tailCount; i += 1) {
        const instance = new TailCtor();
        applyTailCursorConfig(instance, cursorSettings, currentPalette.extraColor, i);
        instance.startTrail();
        nextInstances.push(instance);
      }
      tailInstancesRef.current = nextInstances;
    };

    void run();

    return () => {
      cancelled = true;
      destroyTailInstances();
    };
  }, [
    cursorSettings.delay,
    cursorSettings.enabled,
    cursorSettings.size,
    cursorSettings.thickness,
    cursorSettings.trailType,
    currentPalette.extraColor,
    destroyTailInstances,
    hydrated,
  ]);

  useEffect(() => {
    if (!hydrated) return;
    if (!cursorSettings.enabled || !cursorSettings.clickEffect) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      const burst = document.createElement("span");
      burst.className = "cursorlab-click-burst";
      burst.style.left = `${event.clientX}px`;
      burst.style.top = `${event.clientY}px`;
      document.body.appendChild(burst);
      burst.addEventListener("animationend", () => burst.remove(), { once: true });
    };

    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [cursorSettings.clickEffect, cursorSettings.enabled, hydrated]);

  const contextValue = useMemo(
    () => ({
      cursorSettings,
      setCursorSettings,
      resetCursorSettings,
    }),
    [cursorSettings, setCursorSettings, resetCursorSettings],
  );

  return (
    <CursorLabContext.Provider value={contextValue}>
      {children}
    </CursorLabContext.Provider>
  );
}

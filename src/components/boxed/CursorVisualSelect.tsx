"use client";

import type { ReactNode } from "react";

type CursorVisualSelectProps = {
  id: string;
  label: string;
  value: string;
  valueLabel: string;
  preview: ReactNode;
  options: readonly string[];
  disabled?: boolean;
  onSelect: (value: string) => void;
};

export function CursorVisualSelect({
  id,
  label,
  value,
  valueLabel,
  preview,
  options,
  disabled = false,
  onSelect,
}: CursorVisualSelectProps) {
  const selectNextOption = () => {
    const currentIndex = options.indexOf(value);
    const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % options.length;
    const nextValue = options[nextIndex];
    if (nextValue) onSelect(nextValue);
  };

  return (
    <div className="cursorlab-visual-select-wrap">
      <div className="small mb-1">{label}</div>
      <button
        type="button"
        id={id}
        className="cursorlab-visual-select"
        disabled={disabled}
        onClick={selectNextOption}
      >
        <span className="cursorlab-visual-thumb" aria-hidden="true">
          {preview}
        </span>
        <span className="cursorlab-visual-value">
          <strong>{valueLabel}</strong>
        </span>
        <span className="cursorlab-visual-chevron" aria-hidden="true">
          ↻
        </span>
      </button>
    </div>
  );
}

export function CursorShapePreview({ shape }: { shape: string }) {
  return <span className="cursorlab-preview-shape" data-shape={shape} />;
}

export function CursorClickTypePreview({ type }: { type: string }) {
  if (type === "particles") {
    return (
      <span className="cursorlab-preview-particles">
        {Array.from({ length: 5 }, (_, index) => <i key={index} />)}
      </span>
    );
  }
  return <span className="cursorlab-preview-pulse" />;
}

export function CursorIntensityPreview({ intensity }: { intensity: string }) {
  const barCount = intensity === "soft" ? 1 : intensity === "lively" ? 3 : 2;
  return (
    <span className="cursorlab-preview-energy">
      {Array.from({ length: barCount }, (_, index) => <i key={index} />)}
    </span>
  );
}

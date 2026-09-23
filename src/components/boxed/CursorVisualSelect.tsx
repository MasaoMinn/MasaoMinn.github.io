"use client";

import type { ReactNode } from "react";

export type CursorVisualOption = {
  value: string;
  label: string;
  description?: string;
  preview: ReactNode;
  wide?: boolean;
};

type CursorVisualSelectProps = {
  id: string;
  label: string;
  value: string;
  valueLabel: string;
  description: string;
  preview: ReactNode;
  options: CursorVisualOption[];
  expanded: boolean;
  disabled?: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
};

export function CursorVisualSelect({
  id,
  label,
  value,
  valueLabel,
  description,
  preview,
  options,
  expanded,
  disabled = false,
  onToggle,
  onSelect,
}: CursorVisualSelectProps) {
  const optionsId = `${id}-options`;

  return (
    <div className="cursorlab-visual-select-wrap">
      <div className="small mb-1">{label}</div>
      <button
        type="button"
        id={id}
        className="cursorlab-visual-select"
        aria-expanded={expanded}
        aria-controls={optionsId}
        disabled={disabled}
        onClick={onToggle}
      >
        <span className="cursorlab-visual-thumb" aria-hidden="true">
          {preview}
        </span>
        <span className="cursorlab-visual-value">
          <strong>{valueLabel}</strong>
          <small>{description}</small>
        </span>
        <span className="cursorlab-visual-chevron" aria-hidden="true">
          {expanded ? "⌄" : "›"}
        </span>
      </button>

      {expanded ? (
        <div
          id={optionsId}
          className="cursorlab-inline-options"
          role="listbox"
          aria-labelledby={id}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              className={`cursorlab-inline-option${option.wide ? " is-wide" : ""}${
                option.value === value ? " is-selected" : ""
              }`}
              onClick={() => onSelect(option.value)}
            >
              <span className="cursorlab-visual-thumb" aria-hidden="true">
                {option.preview}
              </span>
              <span className="cursorlab-option-copy">
                <strong>{option.label}</strong>
                {option.description ? <small>{option.description}</small> : null}
              </span>
            </button>
          ))}
        </div>
      ) : null}
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

"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, style, ...props }, ref) => {
  const mergedStyle = {
    "--slider-track-color": "var(--border)",
    "--slider-track-border": "var(--border)",
    "--slider-range-color": "var(--theme-button-bg, var(--primary))",
    "--slider-thumb-bg": "var(--theme-button-bg-hover, var(--accent))",
    "--slider-thumb-border": "var(--foreground)",
    "--slider-thumb-glow": "var(--theme-button-bg, var(--primary))",
    "--slider-thumb-shadow":
      "0 0 0 3px var(--background), 0 0 16px var(--slider-thumb-glow), 0 6px 16px rgba(0,0,0,0.28)",
    ...(style ?? {}),
  } as React.CSSProperties

  return (
    <SliderPrimitive.Root
      ref={ref}
      style={mergedStyle}
      className={cn(
        "relative flex h-12 w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        className="relative h-6 w-full grow overflow-hidden rounded-full"
        style={{
          backgroundColor: "var(--slider-track-color)",
          border: "2px solid var(--slider-track-border)",
        }}
      >
        <SliderPrimitive.Range
          className="absolute h-full rounded-full"
          style={{ backgroundColor: "var(--slider-range-color)" }}
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className="slider-thumb-animated relative z-20 block h-10 w-10 rounded-full border-2 ring-offset-background transition-[transform,box-shadow,background-color,border-color] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        style={{
          borderColor: "var(--slider-thumb-border)",
          backgroundColor: "var(--slider-thumb-bg)",
          boxShadow: "var(--slider-thumb-shadow)",
        }}
      />
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }

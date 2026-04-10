"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, style, ...props }, ref) => {
  const mergedStyle = {
    "--slider-track-color": "#cbd5e1",
    "--slider-range-color": "#475569",
    "--slider-thumb-bg": "#ffffff",
    "--slider-thumb-border": "#475569",
    ...(style ?? {}),
  } as React.CSSProperties

  return (
    <SliderPrimitive.Root
      ref={ref}
      style={mergedStyle}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        className="relative h-3 w-full grow overflow-hidden rounded-full"
        style={{
          backgroundColor: "var(--slider-track-color)",
          border: "1px solid var(--slider-thumb-border)",
        }}
      >
        <SliderPrimitive.Range
          className="absolute h-full"
          style={{ backgroundColor: "var(--slider-range-color)" }}
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className="block h-7 w-7 rounded-full border-2 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        style={{
          borderColor: "var(--slider-thumb-border)",
          backgroundColor: "var(--slider-thumb-bg)",
        }}
      />
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }

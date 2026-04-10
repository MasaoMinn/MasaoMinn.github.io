"use client";

import { useState } from "react";
import BubbleBox, { BubbleProps, type BubbleBoxProps } from "../../../../components/ui/matter/BubbleBox";

export default function BubbleBoxPreview() {
  const [componentProps, setComponentProps] = useState<BubbleBoxProps>({
    content: [],
    temperature: 40,
    draggable: true,
    width: 720,
    height: 380,
  })
  const ComponentConsole = () => {
    const BubbleConsole = () => {
      return (
        <></>
      )
    }
  }
  return (
    <section className="rounded-xl border border-slate-300/60 bg-white/60 p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">BubbleBox</h1>
      <p className="mt-3 text-sm text-slate-700">
        Preview for <code className="rounded bg-slate-100 px-2 py-0.5">matter/BubbleBox</code>.
      </p>
      <div className="mt-4">
        <BubbleBox {...componentProps} />
      </div>
    </section>
  );
}

type ComponentPreviewProps = {
  routeName: string;
  routePath: string;
};

export default function ComponentPreview({
  routeName,
  routePath,
}: ComponentPreviewProps) {
  return (
    <section className="rounded-xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur-sm">
      <h1 className="text-xl font-semibold text-slate-900">{routeName}</h1>
      <p className="mt-2 text-sm text-slate-700">
        Component preview placeholder. Preview logic will be added later.
      </p>
      <p className="mt-3 text-sm text-slate-700">
        Current route:{" "}
        <code className="rounded bg-slate-100 px-2 py-0.5 text-slate-800">
          {routePath}
        </code>
      </p>
    </section>
  );
}

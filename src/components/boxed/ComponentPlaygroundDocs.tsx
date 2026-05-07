"use client";

import MarkdownComponent from "@/components/boxed/MarkdownComponent";

export type PropsDocRow = {
  name: string;
  type: string;
  value: string;
  description: string;
};

export type PropsDocSection = {
  title: string;
  rows: PropsDocRow[];
};

type ComponentPlaygroundDocsProps = {
  generatedJsx: string;
  propsSections: PropsDocSection[];
  className?: string;
};

function PropsDocTable({ section }: { section: PropsDocSection }) {
  return (
    <div
      className="overflow-x-auto rounded-lg border"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--background)",
      }}
    >
      <div
        className="border-b px-3 py-2 text-lg font-semibold"
        style={{ borderColor: "var(--border)" }}
      >
        {section.title}
      </div>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b text-left" style={{ borderColor: "var(--border)" }}>
            <th className="border-r px-3 py-2" style={{ borderColor: "var(--border)" }}>Prop</th>
            <th className="border-r px-3 py-2" style={{ borderColor: "var(--border)" }}>Type</th>
            <th className="border-r px-3 py-2" style={{ borderColor: "var(--border)" }}>Values</th>
            <th className="px-3 py-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {section.rows.map((row) => (
            <tr key={`${section.title}-${row.name}`} className="border-b align-top" style={{ borderColor: "var(--border)" }}>
              <td className="border-r px-3 py-2 font-mono" style={{ borderColor: "var(--border)" }}>{row.name}</td>
              <td className="border-r px-3 py-2" style={{ borderColor: "var(--border)" }}>{row.type}</td>
              <td className="border-r px-3 py-2" style={{ borderColor: "var(--border)" }}>{row.value}</td>
              <td className="px-3 py-2">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ComponentPlaygroundDocs({
  generatedJsx,
  propsSections,
  className,
}: ComponentPlaygroundDocsProps) {
  const generatedJsxMarkdown = `\`\`\`tsx\n${generatedJsx}\n\`\`\``;

  return (
    <section className={className}>
      <div
        className="overflow-x-auto rounded-lg border"
        style={{
          borderColor: "var(--border)",
          background:
            "linear-gradient(135deg, var(--secondary) 0%, var(--background) 100%)",
        }}
      >
        <div
          className="border-b px-3 py-2 text-sm font-semibold"
          style={{ borderColor: "var(--border)" }}
        >
          Generated JSX
        </div>
        <div className="px-2 pb-2">
          <MarkdownComponent content={generatedJsxMarkdown} className="max-w-none" />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <h3 className="text-lg font-semibold">Props</h3>
        {propsSections.map((section) => (
          <PropsDocTable key={section.title} section={section} />
        ))}
      </div>
    </section>
  );
}


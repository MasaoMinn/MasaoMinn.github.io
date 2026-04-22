"use client";

import React, { useCallback, useState } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface MarkdownComponentProps {
  content: string;
  className?: string;
  loadingText?: string;
}

export default function MarkdownComponent({
  content,
  className = "prose max-w-none prose-headings:text-[var(--foreground)] prose-p:text-[var(--foreground)] prose-strong:text-[var(--foreground)] prose-li:text-[var(--foreground)] prose-a:text-[var(--primary)] prose-code:text-[var(--foreground)] prose-hr:border-[var(--border)]",
  loadingText = "Loading...",
}: MarkdownComponentProps) {
  const displayContent = content || loadingText;

  /* ---------------- CodeBlock ---------------- */

  const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [copied, setCopied] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const extractText = useCallback((node: React.ReactNode): string => {
      if (typeof node === "string") return node;
      if (Array.isArray(node)) return node.map(extractText).join("");

      if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
        return extractText(node.props.children);
      }

      return "";
    }, []);

    const handleCopy = useCallback(() => {
      const text = extractText(children);
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    }, [children, extractText]);

    return (
      <pre
        className="not-prose relative my-4 overflow-x-auto rounded-xl"
        style={{
          backgroundColor: "var(--secondary)",
          border: "1px solid var(--border)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.10)",
          padding: "1rem 5rem 1rem 1rem",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          type="button"
          onClick={handleCopy}
          className="z-10 rounded-md px-2 py-1 text-xs transition-opacity duration-200"
          style={{
            position: "absolute",
            right: "1rem",
            top: "1rem",
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
            cursor: "pointer",
            opacity: isHovered || copied ? 1 : 0,
            pointerEvents: isHovered || copied ? "auto" : "none",
          }}
        >
          {copied ? "Copied" : "Copy"}
        </button>

        {children}
      </pre>
    );
  };

  /* ---------------- markdown components ---------------- */

  const components: Components = {
    pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,

    code: ({ className, children, ...props }) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code
            className={`rounded px-1.5 py-0.5 font-mono text-sm`}
            style={{
              display: "inline",
              whiteSpace: "nowrap",
              backgroundColor: "var(--secondary)",
              color: "var(--foreground)",
            }}
            {...props}
          >
            {children}
          </code>
        );
      }

      // ✅ 代码块中的 code
      return (
        <code
          className={`block font-mono text-sm leading-relaxed ${className}`}
          style={{ color: "var(--foreground)" }}
          {...props}
        >
          {children}
        </code>
      );
    },
  };

  return (
    <article className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {displayContent}
      </ReactMarkdown>
    </article>
  );
}

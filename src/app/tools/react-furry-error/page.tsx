"use client";

import { useEffect } from "react";

const DOCUMENTATION_URL =
  "https://kcnhl2uub4k0.feishu.cn/wiki/WkOUwdykxiXjx8kLNH3chhpQn0c";

export default function ReactFurryErrorRedirectPage() {
  useEffect(() => {
    window.location.replace(DOCUMENTATION_URL);
  }, []);

  return (
    <main className="theme-page flex min-h-screen items-center justify-center px-4 py-12">
      <p className="text-center text-sm">
        正在前往 react-furry-error 文档。若没有自动跳转，请
        <a
          className="ml-1 underline underline-offset-4"
          href={DOCUMENTATION_URL}
          rel="noopener noreferrer"
        >
          点击这里
        </a>
        。
      </p>
    </main>
  );
}

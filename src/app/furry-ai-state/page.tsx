"use client";

import { useEffect } from "react";

const FURRY_AI_STATE_URL =
  "https://kcnhl2uub4k0.feishu.cn/wiki/OuBCwjPX7iBL9PkZOjccKvGQnGf?from=from_copylink";

export default function FurryAiStatePage() {
  useEffect(() => {
    window.location.replace(FURRY_AI_STATE_URL);
  }, []);

  return (
    <main>
      <p>
        正在前往 Furry AI State…如果没有自动跳转，请
        <a href={FURRY_AI_STATE_URL}>点击这里</a>。
      </p>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import MarkdownComponent from "@/components/boxed/MarkdownComponent";

// 缓存过期时间（毫秒） - 这里设置为24小时
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000;

export default function DocumentComponent({ slug, lang }: { slug: string; lang: string }) {
  const { t } = useTranslation();
  const [content, setContent] = useState("Loading...");
  const [error, setError] = useState<string | null>(null);
  const url = `https://cdn.jsdelivr.net/gh/MasaoMinn/react-furry-error-docs@main/docs/${slug}_${lang || "en"}.md`;

  // 生成缓存键
  const getCacheKey = (slug: string, lang: string) => `react-furry-error-${slug}-${lang}`;

  // 从缓存获取数据
  const getFromCache = (key: string) => {
    try {
      const cached = localStorage.getItem(key);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        // 检查缓存是否过期
        if (Date.now() - timestamp < CACHE_EXPIRY_TIME) {
          return data;
        }
      }
    } catch (error) {
      console.error("Error reading from cache:", error);
    }
    return null;
  };

  // 保存数据到缓存
  const saveToCache = (key: string, data: string) => {
    try {
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error("Error saving to cache:", error);
    }
  };

  useEffect(() => {
    const load = async () => {
      const cacheKey = getCacheKey(slug, lang);

      // 先尝试从缓存获取
      const cachedContent = getFromCache(cacheKey);
      if (cachedContent) {
        setContent(cachedContent);
        return;
      }

      // 缓存没有或已过期，从CDN获取
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error();
        const data = await res.text();
        setContent(data);
        // 保存到缓存
        saveToCache(cacheKey, data);
      } catch {
        try {
          const fallback = await fetch(url.replace(lang, "en"));
          if (!fallback.ok) throw new Error();
          const data = await fallback.text();
          setContent(data);
          // 保存到缓存
          saveToCache(getCacheKey(slug, "en"), data);
        } catch {
          setError(t("fileError"));
        }
      }
    };

    load();
  }, [slug, lang, url, t]);

  return (
    <article className="prose max-w-none">
      {error && <p className="text-red-500">{error}</p>}
      <MarkdownComponent content={content} loadingText="Loading..." />
    </article>
  );
}
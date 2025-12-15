"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from '../../i18n';
import MarkdownComponent from "@/components/boxed/MarkdownComponent";

export default function DocsPage() {
  const [content, setContent] = useState<string>("Loading...");
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    // 获取当前语言，默认为英语
    const currentLanguage = i18n.language || 'en';
    console.log(currentLanguage)

    // 构建基于当前语言的md文件路径
    fetch(`/article/introduction_${currentLanguage}.md`)
      .then((res) => {
        if (!res.ok) {
          return fetch("/article/introduction_en.md")
            .then(fallbackRes => {
              if (!fallbackRes.ok) {
                setError(fallbackRes.statusText + t('fileError'));
              }
              return fallbackRes.text();
            });
        }
        return res.text();
      })
      .then(setContent)
      .catch((err) => {
        setError(err.message);
      });
  }, [t]);

  return (
    <article className="prose max-w-none">
      {error && <p className="text-red-500">{error}</p>}
      <MarkdownComponent content={content} loadingText="Loading..." />
    </article>
  );
}
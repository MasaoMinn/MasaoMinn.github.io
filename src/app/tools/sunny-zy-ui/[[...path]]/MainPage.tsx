"use client";
import { useTranslation } from "react-i18next";

export default function MainPage() {
  const { t } = useTranslation();
  return (
    <section className="rounded-xl border border-slate-300/60 bg-white/60 p-6 shadow-sm">
      <div className="cursor-pointer" onClick={() => { window.open('https://github.com/MasaoMinn/sunny-ui', '_blank') }}><h1 className="text-2xl font-semibold">{t("sunnyZyUi.mainPage.title")}</h1></div>
      <p className="mt-3 text-sm text-slate-700">
        {t("sunnyZyUi.mainPage.description")}
      </p>
      <p className="mt-2 text-sm text-slate-700">
        {t("sunnyZyUi.mainPage.groups")}:{" "}
        <code className="rounded bg-slate-100 px-2 py-0.5">matter</code>
      </p>
      <p className="mt-2 text-sm text-slate-700">
        {t("sunnyZyUi.mainPage.components")}:{" "}
        <code className="rounded bg-slate-100 px-2 py-0.5">BubbleBox</code>
      </p>
    </section>
  );
}
"use client";
import { useTranslation } from "react-i18next";
import DocumentComponent from "../Doc";

export default function Page() {
  const { i18n } = useTranslation();
  return (
    <DocumentComponent slug="installation" lang={i18n.language} />
  );
}
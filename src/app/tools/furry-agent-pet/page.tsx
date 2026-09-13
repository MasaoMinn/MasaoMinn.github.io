"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const REPOSITORY_URL = "https://github.com/MasaoMinn/furry-agent-pet";

export default function FurryAgentPetRedirectPage() {
  const { t } = useTranslation();

  useEffect(() => {
    window.location.replace(REPOSITORY_URL);
  }, []);

  return (
    <main className="theme-page flex min-h-screen items-center justify-center px-4 py-12">
      <p className="text-center text-sm">
        {t("redirects.furry_agent_pet.message")}{" "}
        <a
          className="underline underline-offset-4"
          href={REPOSITORY_URL}
          rel="noopener noreferrer"
        >
          {t("redirects.furry_agent_pet.link")}
        </a>
      </p>
    </main>
  );
}

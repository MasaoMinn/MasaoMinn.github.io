"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import MarkdownComponent from "@/components/boxed/MarkdownComponent";
import styles from "./ExperienceTabs.module.css";

const categories = ["developer", "oi", "language"] as const;
type Category = (typeof categories)[number];

export default function ExperienceTabs() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Category>("developer");
  const [expanded, setExpanded] = useState(true);

  const timeline = t(`experience.${activeTab}.timeline`, {
    returnObjects: true,
  }) as string[];

  const toggleTab = (category: Category) => {
    if (category === activeTab) {
      setExpanded((current) => !current);
    } else {
      setActiveTab(category);
      setExpanded(true);
    }
  };

  return (
    <section className={styles.experience} aria-label={t("experience.tabs_label")}>
      <Tabs.Root value={activeTab} activationMode="manual" className={styles.tabsRoot}>
        <div className={styles.tabFrame} data-expanded={expanded}>
          <Tabs.List className={styles.tabList} aria-label={t("experience.tabs_label")}>
            {categories.map((category) => (
              <Tabs.Trigger
                key={category}
                id={`experience-tab-${category}`}
                value={category}
                className={styles.tab}
                aria-expanded={activeTab === category && expanded}
                aria-controls="experience-panel"
                onMouseDown={(event) => {
                  // Activate on click so Radix's earlier mouse-down selection cannot toggle a new tab closed.
                  if (event.button === 0 && !event.ctrlKey) {
                    event.preventDefault();
                    event.currentTarget.focus();
                  }
                }}
                onClick={() => toggleTab(category)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    toggleTab(category);
                  }
                }}
              >
                {t(`experience.${category}.label`)}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          <ChevronDown className={styles.chevron} aria-hidden="true" />
        </div>
        <div
          id="experience-panel"
          role="tabpanel"
          aria-labelledby={`experience-tab-${activeTab}`}
          aria-hidden={!expanded}
          className={styles.panelViewport}
          data-expanded={expanded}
        >
          <div className={styles.panelClip}>
            <div key={activeTab} className={styles.panel}>
              <h2 className={styles.title}>{t(`experience.${activeTab}.title`)}</h2>
              <ol className={styles.timeline}>
                {timeline.map((entry) => (
                  <li key={entry} className={styles.entry}>
                    <MarkdownComponent content={entry} className={styles.markdown} linkTarget="_blank" />
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </Tabs.Root>
    </section>
  );
}

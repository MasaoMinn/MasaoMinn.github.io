"use client";

import Image from "next/image";
import * as Tabs from "@radix-ui/react-tabs";
import { useTranslation } from "react-i18next";
import ThemedButton from "@/components/boxed/ThemedButton";
import ImgCarousel from "./Carousel";
import SocialLinkSection from "./SocialLinkSection";
import styles from "./page.module.css";

const socialLinks = [
  {
    id: "x",
    url: "https://x.com/Kinotsuki372929",
    iconSrc: "/social-icons/x.svg",
    platformKey: "x",
  },
  {
    id: "personal-website",
    url: "https://tangetsu.top",
    iconSrc: "/social-icons/personal-website.ico",
    platformKey: "personal_website",
  },
  {
    id: "pixiv",
    url: "https://www.pixiv.net/users/99841003",
    iconSrc: "/social-icons/pixiv.svg",
    platformKey: "pixiv",
  },
  {
    id: "deviantart",
    url: "https://www.deviantart.com/sunnytangetsu",
    iconSrc: "/social-icons/deviantart.svg",
    platformKey: "deviantart",
  },
  {
    id: "strayfawnstudio",
    url: "https://strayfawnstudio.com/community/index.php?/profile/12300-sunny_tangetsu/",
    iconSrc: "/social-icons/strayfawnstudio.png",
    platformKey: "strayfawnstudio",
  },
  {
    id: "qq",
    url: "https://qm.qq.com/q/QTfus78dqe",
    iconSrc: "/LXFS/QQicon.png",
    platformKey: "qq",
  },
  {
    id: "xiaohongshu",
    url: "https://www.xiaohongshu.com/user/profile/649132e3000000000f004dc5?xhsshare=userQrCode",
    iconSrc: "/LXFS/xiaohongshuicon.png",
    platformKey: "xiaohongshu",
  },
  {
    id: "douyin",
    url: "https://www.douyin.com/user/MS4wLjABAAAA3ZnB6dr1lknUupJiF0XZrWZ1mUtsvpRJfuSgmT94WRJpfkvO5S4Jja5h4yFo9vyM?from_tab_name=main",
    iconSrc: "/LXFS/douyinicon.png",
    platformKey: "douyin",
  },
] as const;

const qrTabs = [
  {
    id: "qq",
    imageSrc: "/LXFS/QQ.jpg",
    platformKey: "qq",
    width: 1065,
    height: 1931,
  },
  {
    id: "xiaohongshu",
    imageSrc: "/LXFS/xiaohongshu.jpg",
    platformKey: "xiaohongshu",
    width: 1038,
    height: 1671,
  },
  {
    id: "douyin",
    imageSrc: "/LXFS/douyin.png",
    platformKey: "douyin",
    width: 1242,
    height: 1855,
  },
] as const;

export default function FurryPage() {
  const { t } = useTranslation();
  const platform = (key: string) => t(`furry_contact.platforms.${key}`);

  return (
    <main className={`theme-page ${styles.page}`}>
      <ThemedButton
        variant="outline"
        onClick={() => window.history.back()}
        className={styles.backButton}
      >
        <span aria-hidden="true">←</span>
        {t("mainpage.back")}
      </ThemedButton>

      <div className={styles.content}>
        <section className={`theme-surface ${styles.profileCard}`}>
          <div className={styles.carouselPanel}>
            <ImgCarousel />
          </div>
          <div className={styles.profileCopy}>
            <h1 className={styles.profileTitle}>{t("furry_contact.profile_title")}</h1>
            <p className={styles.profileIntro}>{t("mainpage.furry.intro")}</p>
          </div>
        </section>

        <section className={`theme-surface ${styles.contactCard}`}>
          <div className={styles.contactHeading}>
            <h2>{t("furry_contact.title")}</h2>
            <p>{t("furry_contact.hint")}</p>
          </div>

          <div className={styles.socialRow}>
            {socialLinks.map((link) => {
              const platformName = platform(link.platformKey);

              return (
                <SocialLinkSection
                  key={link.id}
                  url={link.url}
                  iconSrc={link.iconSrc}
                  ariaLabel={t("furry_contact.visit", { platform: platformName })}
                  iconAlt={t("furry_contact.icon_alt", { platform: platformName })}
                  tooltipText={platformName}
                />
              );
            })}
          </div>

          <Tabs.Root defaultValue="qq" className={styles.qrTabs}>
            <Tabs.List
              className={styles.qrTabList}
              aria-label={t("furry_contact.qr_tabs_label")}
            >
              {qrTabs.map((tab) => (
                <Tabs.Trigger
                  key={tab.id}
                  value={tab.id}
                  className={styles.qrTabTrigger}
                >
                  {platform(tab.platformKey)}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            {qrTabs.map((tab) => {
              const platformName = platform(tab.platformKey);

              return (
                <Tabs.Content
                  key={tab.id}
                  value={tab.id}
                  className={styles.qrTabContent}
                >
                  <Image
                    src={tab.imageSrc}
                    alt={t("furry_contact.qr_alt", { platform: platformName })}
                    width={tab.width}
                    height={tab.height}
                    className={styles.qrImage}
                  />
                </Tabs.Content>
              );
            })}
          </Tabs.Root>
        </section>
      </div>
    </main>
  );
}

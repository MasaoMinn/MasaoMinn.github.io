"use client";
import { useEffect } from "react";
import Container from "react-bootstrap/Container";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useModalStore } from "@/store/ModalStore";
import { useLocalStorageStore } from "@/store/LocalStorageStore";
import { CookieModal } from "@/components/layout/modals/CookieModal";
import MarkdownComponent from "@/components/boxed/MarkdownComponent";
import styles from "./App.module.css";

type IconKind =
  | "fox"
  | "bug"
  | "spark"
  | "maze"
  | "palette"
  | "grid"
  | "cube"
  | "chat"
  | "profile"
  | "code"
  | "mirror"
  | "cloud"
  | "rocket";

type LinkItem = {
  label: string;
  caption: string;
  href: string;
  icon: IconKind;
  image?: string;
  kind: "internal" | "external";
  tags: string[];
};

type LinkGroup = {
  id: string;
  icon: IconKind;
  title: string;
  description: string;
  accent: string;
  links: LinkItem[];
  animationDelay: string;
};

const LinkIcon = ({ icon }: { icon: IconKind }) => {
  if (icon === "fox") {
    return (
      <svg viewBox="0 0 24 24" className={styles.iconSvg} aria-hidden="true">
        <path d="M4 7l4-3 2 3m10 0l-4-3-2 3" />
        <path d="M5 8c0 6 3.5 10 7 10s7-4 7-10H5z" />
        <path d="M9.5 13h0m5 0h0M11 15.5c.8.6 1.2.6 2 0" />
      </svg>
    );
  }
  if (icon === "bug") {
    return (
      <svg viewBox="0 0 24 24" className={styles.iconSvg} aria-hidden="true">
        <path d="M12 7V4m0 3a4 4 0 014 4v5a4 4 0 01-8 0v-5a4 4 0 014-4z" />
        <path d="M6 10h12M5 14h14M7 18l-2 2m12-2l2 2" />
      </svg>
    );
  }
  if (icon === "spark") {
    return (
      <svg viewBox="0 0 24 24" className={styles.iconSvg} aria-hidden="true">
        <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" />
        <path d="M18.5 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z" />
      </svg>
    );
  }
  if (icon === "maze") {
    return (
      <svg viewBox="0 0 24 24" className={styles.iconSvg} aria-hidden="true">
        <path d="M4 4h16v16H4z" />
        <path d="M8 8h4v4H8zm8 0v8h-4m-4 0h4v-4" />
      </svg>
    );
  }
  if (icon === "palette") {
    return (
      <svg viewBox="0 0 24 24" className={styles.iconSvg} aria-hidden="true">
        <path d="M12 4a8 8 0 100 16h2a2 2 0 000-4h-2a2 2 0 110-4h4a4 4 0 004-4 8 8 0 00-8-4z" />
        <path d="M8 9h0m-2 3h0m3 3h0" />
      </svg>
    );
  }
  if (icon === "grid") {
    return (
      <svg viewBox="0 0 24 24" className={styles.iconSvg} aria-hidden="true">
        <path d="M4 4h7v7H4zm9 0h7v7h-7zM4 13h7v7H4zm9 0h7v7h-7z" />
      </svg>
    );
  }
  if (icon === "cube") {
    return (
      <svg viewBox="0 0 24 24" className={styles.iconSvg} aria-hidden="true">
        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
        <path d="M12 21v-9M4 7.5l8 4.5 8-4.5" />
      </svg>
    );
  }
  if (icon === "chat") {
    return (
      <svg viewBox="0 0 24 24" className={styles.iconSvg} aria-hidden="true">
        <path d="M4 5h16v10H8l-4 4z" />
        <path d="M8 10h8m-8-3h5" />
      </svg>
    );
  }
  if (icon === "profile") {
    return (
      <svg viewBox="0 0 24 24" className={styles.iconSvg} aria-hidden="true">
        <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
        <path d="M5 20a7 7 0 0114 0" />
      </svg>
    );
  }
  if (icon === "code") {
    return (
      <svg viewBox="0 0 24 24" className={styles.iconSvg} aria-hidden="true">
        <path d="M8 7l-5 5 5 5m8-10l5 5-5 5M14 5l-4 14" />
      </svg>
    );
  }
  if (icon === "mirror") {
    return (
      <svg viewBox="0 0 24 24" className={styles.iconSvg} aria-hidden="true">
        <path d="M4 6h10v10H4zM10 8h10v10H10z" />
      </svg>
    );
  }
  if (icon === "cloud") {
    return (
      <svg viewBox="0 0 24 24" className={styles.iconSvg} aria-hidden="true">
        <path d="M6 17h11a4 4 0 10-.7-7.9A5 5 0 006 10a3.5 3.5 0 000 7z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={styles.iconSvg} aria-hidden="true">
      <path d="M12 3l3 6 6 .8-4.5 4.5 1.1 6.2L12 18l-5.6 3 1.1-6.2L3 9.8 9 9l3-6z" />
    </svg>
  );
};

const App = () => {
  const { t } = useTranslation();
  const { modal, showModal } = useModalStore();

  const developerIntroMarkdown = t("mainpage.introduction");

  // 检查并显示cookie同意弹窗
  useEffect(() => {
    const { cookiePermission, cookieQueryShown, setCookieQueryShown } = useLocalStorageStore.getState();
    // 只有当用户没有同意cookie且弹窗还没有显示过时，才显示弹窗
    if (!cookiePermission && !cookieQueryShown) {
      // 标记弹窗已显示
      setCookieQueryShown();
      // 显示弹窗
      showModal({ type: "cookie", title: "Cookie 同意", message: "本网站使用cookie来提升您的浏览体验。" });
    }
  }, [showModal]);

  const isCookieModalVisible = modal.type === "cookie";

  const linkGroups: LinkGroup[] = [
    {
      id: "react-furry",
      icon: "fox",
      title: t("mainpage.react_furry.title"),
      description: t("mainpage.react_furry.description"),
      accent: "#ff7d9a",
      links: [
        {
          label: t("mainpage.react_furry.persona"),
          caption: t("mainpage.react_furry.hover.persona"),
          href: "/react-furry",
          icon: "fox",
          image: "/mainpage/projects/react-furry.png",
          kind: "internal",
          tags: ["React", "Fursona", "Copyright"],
        },
      ],
      animationDelay: "0.02s",
    },
    {
      id: "minigame",
      icon: "maze",
      title: t("mainpage.minigame.title"),
      description: t("mainpage.minigame.description"),
      accent: "#f7b733",
      links: [
        {
          label: t("mainpage.minigame.bwite"),
          caption: t("mainpage.minigame.hover.bwite"),
          href: "/BWIte/index.html",
          icon: "grid",
          image: "/mainpage/projects/BWIte.png",
          kind: "internal",
          tags: ["JavaScript", "H5", "Puzzle"],
        },
        {
          label: t("mainpage.minigame.color"),
          caption: t("mainpage.minigame.hover.color"),
          href: "/Color/index.html",
          icon: "palette",
          image: "/mainpage/projects/Color.png",
          kind: "internal",
          tags: ["JavaScript", "H5", "Color"],
        },
        {
          label: t("mainpage.minigame.light"),
          caption: t("mainpage.minigame.hover.light"),
          href: "/LightMaze",
          icon: "maze",
          image: "/mainpage/projects/Light.png",
          kind: "internal",
          tags: ["JavaScript", "H5", "2 Players"],
        },
      ],
      animationDelay: "0.08s",
    },
    {
      id: "tools",
      icon: "cube",
      title: t("mainpage.tools.title"),
      description: t("mainpage.tools.description"),
      accent: "#47c2ff",
      links: [
        {
          label: "sunny-zy-ui",
          caption: t("mainpage.tools.hover.sunny_zy_ui"),
          href: "/tools/sunny-zy-ui",
          icon: "cube",
          kind: "internal",
          tags: ["React", "UI", "Components"],
        },
        {
          label: t("mainpage.react_furry.error"),
          caption: t("mainpage.react_furry.hover.error"),
          href: "/tools/react-furry-error",
          icon: "bug",
          image: "/mainpage/projects/furry-ts-error.png",
          kind: "internal",
          tags: ["React", "npm", "Error Handling"],
        },
        {
          label: "Furry AI State",
          caption: "Open the Furry AI State project documentation.",
          href: "/furry-ai-state",
          icon: "chat",
          image: "/mainpage/projects/furry-ai-state.png",
          kind: "internal",
          tags: ["AI", "Furry", "State"],
        },
      ],
      animationDelay: "0.14s",
    },
  ];

  const renderProject = (item: LinkItem) => {
    const content = (
      <>
        <span className={styles.itemIcon} aria-hidden="true">
          {item.image ? (
            <Image
              src={item.image}
              alt=""
              width={256}
              height={256}
              className={styles.itemIconImage}
            />
          ) : (
            <LinkIcon icon={item.icon} />
          )}
        </span>
        <span className={styles.itemContent}>
          <strong className={styles.itemTitle}>{item.label}</strong>
          <span className={styles.itemDescription}>{item.caption}</span>
        </span>
        <span className={styles.itemTags} aria-label={`${item.label} tags`}>
          {item.tags.map((tag) => (
            <span className={styles.itemTag} key={tag}>{tag}</span>
          ))}
        </span>
        <span className={styles.itemArrow} aria-hidden="true">
          <ArrowRight />
        </span>
      </>
    );

    return (
      <a
        href={item.href}
        className={styles.projectLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  };

  const renderGroup = (group: LinkGroup) => {
    return (
      <section
        className={styles.projectGroup}
        style={
          {
            "--group-accent": group.accent,
            animationDelay: group.animationDelay,
          } as React.CSSProperties
        }
      >
        <div className={styles.groupHeader}>
          <div className={styles.groupIcon} aria-hidden="true">
            <LinkIcon icon={group.icon} />
          </div>
          <div className={styles.groupCopy}>
            <h2 className={styles.groupTitle}>{group.title}</h2>
            <p className={styles.groupDescription}>{group.description}</p>
          </div>
        </div>
        <div className={styles.groupProjects} aria-label={`${group.title} links`}>
          {group.links.map((item) => (
            <div key={`${group.id}-${item.label}`} className={styles.projectItemRow}>
              {renderProject(item)}
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <Container
      className={`${styles.appShell} min-vh-100 text-center theme-page`}
      fluid
    >
      <div className={styles.backdropAura} aria-hidden="true" />
      <div className={styles.backdropGrid} aria-hidden="true" />

      <header className={styles.pageHeader}>
        {/* <p className={styles.pageEyebrow}>Personal Launchpad</p> */}
        <h1 className={styles.pageTitle}>{t("mainpage.title")}</h1>
        <p className={styles.pageDescription}>{t("mainpage.description")}</p>
      </header>

      <section className={styles.profileCard} aria-label="Developer profile">
        <div className={styles.profileAvatarPanel}>
          <Image
            src="/head.svg"
            alt="Site developer avatar"
            width={360}
            height={360}
            className={styles.profileAvatar}
            priority
          />
        </div>
        <div className={styles.profileIntroPanel}>
          <MarkdownComponent
            content={developerIntroMarkdown}
            className={styles.profileMarkdown}
          />
        </div>
      </section>

      <div className={styles.projectList}>
        {linkGroups.map((group) => (
          <div className={styles.projectItem} key={group.id}>
            {renderGroup(group)}
          </div>
        ))}
      </div>

      <CookieModal show={isCookieModalVisible} />
    </Container>
  );
}
export default App;

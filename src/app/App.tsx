"use client";
import { CSSProperties, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { useTheme, lightTheme, darkTheme } from "@/components/boxed/ThemeProvider";
import { useTranslation } from "react-i18next";
import { useModalStore } from "@/store/ModalStore";
import { useLocalStorageStore } from "@/store/LocalStorageStore";
import { CookieModal } from "@/components/layout/modals/CookieModal";
import ThemedButton from "@/components/boxed/ThemedButton";
import styles from "./App.module.css";

type ActionItem = {
  label: string;
  onClick: () => void;
};

type CardItem = {
  title: string;
  description: string;
  actions: ActionItem[];
  animationDelay: string;
};

type AppCssVars = CSSProperties & {
  "--app-bg": string;
  "--app-text": string;
  "--app-border": string;
  "--app-accent": string;
};

const App = () => {
  const { t } = useTranslation();
  const { theme, currentTheme } = useTheme();
  const { modal, showModal } = useModalStore();
  const activeTheme = theme === "light" ? lightTheme[currentTheme] : darkTheme[currentTheme];

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
  const appStyle: AppCssVars = {
    "--app-bg": activeTheme.backgroundColor,
    "--app-text": activeTheme.color,
    "--app-border": activeTheme.borderColor,
    "--app-accent": activeTheme.extraColor,
    backgroundColor: activeTheme.backgroundColor,
    color: activeTheme.color,
  };

  const spotlightCard: CardItem = {
    title: t("mainpage.react_furry.title"),
    description: t("mainpage.react_furry.description"),
    actions: [
      {
        label: t("mainpage.react_furry.persona"),
        onClick: () => {
          window.location.href = "/react-furry";
        },
      },
      {
        label: t("mainpage.react_furry.error"),
        onClick: () => {
          window.location.href = "/react-furry-error";
        },
      },
    ],
    animationDelay: "0.05s",
  };

  const featureCards: CardItem[] = [
    {
      title: t("mainpage.minigame.title"),
      description: t("mainpage.minigame.description"),
      actions: [
        {
          label: t("mainpage.minigame.bwite"),
          onClick: () => {
            window.location.href = "/BWIte/index.html";
          },
        },
        {
          label: t("mainpage.minigame.color"),
          onClick: () => {
            window.location.href = "/Color/index.html";
          },
        },
        {
          label: t("mainpage.minigame.light"),
          onClick: () => {
            window.location.href = "/LightMaze";
          },
        },
      ],
      animationDelay: "0.12s",
    },
    {
      title: t("mainpage.tools.title"),
      description: t("mainpage.tools.description"),
      actions: [
        {
          label: t("mainpage.tools.tobe"),
          onClick: () => {
            window.location.href = "/";
          },
        },
        {
          label: t("mainpage.tools.furry"),
          onClick: () => {
            window.location.href = "/Furry";
          },
        },
      ],
      animationDelay: "0.2s",
    },
  ];

  const linksCard: CardItem = {
    title: t("mainpage.vercel.title"),
    description: t("mainpage.vercel.description"),
    actions: [
      {
        label: t("mainpage.vercel.mirror"),
        onClick: () => {
          window.open("https://masaominn.vercel.app/", "_blank", "noopener,noreferrer");
        },
      },
      {
        label: t("mainpage.vercel.personal"),
        onClick: () => {
          window.open("https://kinotsuki.vercel.app/", "_blank", "noopener,noreferrer");
        },
      },
      {
        label: t("mainpage.vercel.make_your_oc_alive"),
        onClick: () => {
          window.open("https://make-your-oc-alive.vercel.app/", "_blank", "noopener,noreferrer");
        },
      },
    ],
    animationDelay: "0.28s",
  };

  const renderCard = (card: CardItem, className?: string) => {
    return (
      <section
        className={`${styles.appCard}${className ? ` ${className}` : ""}`}
        style={{ animationDelay: card.animationDelay }}
      >
        <h2 className={styles.cardTitle}>{card.title}</h2>
        <p className={styles.cardDescription}>{card.description}</p>
        <div className={styles.cardDivider} />
        <div className={styles.actionGrid}>
          {card.actions.map((action) => (
            <ThemedButton className="w-100" key={action.label} onClick={action.onClick}>
              {action.label}
            </ThemedButton>
          ))}
        </div>
      </section>
    );
  };

  return (
    <Container
      className={`${styles.appShell} min-vh-100 text-center`}
      style={appStyle}
      data-theme-mode={theme}
      fluid
    >
      <div className={styles.ambientOne} aria-hidden="true" />
      <div className={styles.ambientTwo} aria-hidden="true" />
      <div className={styles.texture} aria-hidden="true" />

      <Row className="g-4 justify-content-center pt-5">
        <Col xs={12} lg={10} xl={9}>
          {renderCard(spotlightCard, styles.heroCard)}
        </Col>
      </Row>

      <Row className="g-4 justify-content-center mt-1">
        {featureCards.map((card) => (
          <Col xs={12} md={6} lg={5} xl={4} key={card.title}>
            {renderCard(card)}
          </Col>
        ))}
      </Row>

      <Row className="g-4 justify-content-center mt-1 pb-4">
        <Col xs={12} lg={10} xl={9}>
          {renderCard(linksCard)}
        </Col>
      </Row>

      <CookieModal show={isCookieModalVisible} />
    </Container>
  );
}
export default App;

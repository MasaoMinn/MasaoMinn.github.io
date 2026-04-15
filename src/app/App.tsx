"use client";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { useTranslation } from "react-i18next";
import { useModalStore } from "@/store/ModalStore";
import { useLocalStorageStore } from "@/store/LocalStorageStore";
import { CookieModal } from "@/components/layout/modals/CookieModal";
import ThemedButton from "@/components/boxed/ThemedButton";
import styles from "./App.module.css";

type ActionItem = {
  label: string;
  hoverDescription: string;
  onClick: () => void;
};

type CardItem = {
  id: string;
  title: string;
  description: string;
  actions: ActionItem[];
  animationDelay: string;
};

const App = () => {
  const { t } = useTranslation();
  const { modal, showModal } = useModalStore();
  const [hoveredActionHints, setHoveredActionHints] = useState<Record<string, string | null>>({});

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

  const spotlightCard: CardItem = {
    id: "spotlight",
    title: t("mainpage.react_furry.title"),
    description: t("mainpage.react_furry.description"),
    actions: [
      {
        label: t("mainpage.react_furry.persona"),
        hoverDescription: t("mainpage.react_furry.hover.persona"),
        onClick: () => {
          window.location.href = "/react-furry";
        },
      },
      {
        label: t("mainpage.react_furry.error"),
        hoverDescription: t("mainpage.react_furry.hover.error"),
        onClick: () => {
          window.location.href = "/react-furry-error";
        },
      },
    ],
    animationDelay: "0.05s",
  };

  const featureCards: CardItem[] = [
    {
      id: "minigame",
      title: t("mainpage.minigame.title"),
      description: t("mainpage.minigame.description"),
      actions: [
        {
          label: t("mainpage.minigame.bwite"),
          hoverDescription: t("mainpage.minigame.hover.bwite"),
          onClick: () => {
            window.location.href = "/BWIte/index.html";
          },
        },
        {
          label: t("mainpage.minigame.color"),
          hoverDescription: t("mainpage.minigame.hover.color"),
          onClick: () => {
            window.location.href = "/Color/index.html";
          },
        },
        {
          label: t("mainpage.minigame.light"),
          hoverDescription: t("mainpage.minigame.hover.light"),
          onClick: () => {
            window.location.href = "/LightMaze";
          },
        },
      ],
      animationDelay: "0.12s",
    },
    {
      id: "tools",
      title: t("mainpage.tools.title"),
      description: t("mainpage.tools.description"),
      actions: [
        {
          label: "sunny-zy-ui",
          hoverDescription: t("mainpage.tools.hover.sunny_zy_ui"),
          onClick: () => {
            window.location.href = "/sunny-zy-ui";
          }
        }, {
          label: t("mainpage.tools.furry"),
          hoverDescription: t("mainpage.tools.hover.furry"),
          onClick: () => {
            window.location.href = "/Furry";
          },
        }, {
          label: t("mainpage.tools.tobe"),
          hoverDescription: t("mainpage.tools.hover.tobe"),
          onClick: () => {
            window.location.href = "/";
          },
        },
      ],
      animationDelay: "0.2s",
    },
  ];

  const linksCard: CardItem = {
    id: "vercel_links",
    title: t("mainpage.vercel.title"),
    description: t("mainpage.vercel.description"),
    actions: [
      {
        label: t("mainpage.vercel.mirror"),
        hoverDescription: t("mainpage.vercel.hover.mirror"),
        onClick: () => {
          window.open("https://masaominn.vercel.app/", "_blank", "noopener,noreferrer");
        },
      },
      {
        label: t("mainpage.vercel.personal"),
        hoverDescription: t("mainpage.vercel.hover.personal"),
        onClick: () => {
          window.open("https://kinotsuki.vercel.app/", "_blank", "noopener,noreferrer");
        },
      },
      {
        label: t("mainpage.vercel.make_your_oc_alive"),
        hoverDescription: t("mainpage.vercel.hover.make_your_oc_alive"),
        onClick: () => {
          window.open("https://make-your-oc-alive.vercel.app/", "_blank", "noopener,noreferrer");
        },
      },
    ],
    animationDelay: "0.28s",
  };

  const renderCard = (card: CardItem, className?: string) => {
    const hoverHint = hoveredActionHints[card.id] ?? null;

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
            <ThemedButton
              className="w-100"
              key={action.label}
              onClick={action.onClick}
              onMouseEnter={() => {
                setHoveredActionHints((prev) => ({ ...prev, [card.id]: action.hoverDescription }));
              }}
              onMouseLeave={() => {
                setHoveredActionHints((prev) => ({ ...prev, [card.id]: null }));
              }}
            >
              {action.label}
            </ThemedButton>
          ))}
        </div>
        <p className={`${styles.hoverHint}${hoverHint ? ` ${styles.hoverHintVisible}` : ""}`}>
          {hoverHint ?? ""}
        </p>
      </section>
    );
  };

  return (
    <Container
      className={`${styles.appShell} min-vh-100 text-center theme-page`}
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

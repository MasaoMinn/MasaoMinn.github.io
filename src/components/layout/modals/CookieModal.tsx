"use client";
import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useModalStore } from "@/store/ModalStore";
import { useLocalStorageStore } from "@/store/LocalStorageStore";
import { useTheme } from "@/components/boxed/ThemeProvider";
import { useTranslation } from "react-i18next";
import Image from "next/image";

interface CookieModalProps {
  show: boolean;
}

export const CookieModal: React.FC<CookieModalProps> = ({ show }) => {
  const { hideModal } = useModalStore();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const { acceptCookies, declineCookies, setThemeCookie } = useLocalStorageStore();

  const handleAccept = () => {
    // 使用CookieStore的方法接受cookie
    acceptCookies();
    // 存储当前主题到cookie
    setThemeCookie(theme);
    hideModal();
  };

  const handleDecline = () => {
    try {
      // 使用CookieStore的方法拒绝cookie
      declineCookies();
      hideModal();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal
      show={show}
      onHide={hideModal}
      centered
      backdrop="static"
      dialogClassName="cookie-modal"
      className="align-center justify-content-center"
      size="lg"
    >
      <Modal.Header
        closeButton
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Modal.Title>{t('cookie.title')}</Modal.Title>
      </Modal.Header>
      <Image
        src="/cookie.png"
        alt="Cookie"
        width={500}
        height={400}
        className="mb-4 mx-auto d-block"
        style={{ backgroundColor: "var(--background)" }}
      />
      <Modal.Body
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <p>{t('cookie.content')}</p>
      </Modal.Body>
      <Modal.Footer
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <Button
          variant="outline-secondary"
          onClick={handleDecline}
          style={{
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        >
          {t('cookie.reject')}
        </Button>
        <Button
          variant="primary"
          onClick={handleAccept}
          style={{
            backgroundColor: "var(--primary)",
            borderColor: "var(--primary)",
            color: "var(--primary-foreground)",
          }}
        >
          {t('cookie.accept')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

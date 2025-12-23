"use client";
import { Col, Row, Stack } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { useTheme, lightTheme, darkTheme } from "@/components/boxed/ThemeProvider";
import { useTranslation } from 'react-i18next'
import React, { useEffect } from "react";
import { useModalStore } from "@/store/ModalStore";
import { useLocalStorageStore } from "@/store/LocalStorageStore";
import { CookieModal } from "@/components/layout/modals/CookieModal";
import { BoldButton } from "@/components/boxed/MotionComponents";
const App = () => {
  const { t } = useTranslation();
  const { theme, currentTheme } = useTheme();
  const { modal, showModal } = useModalStore();

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

  // 定义统一的Stack样式
  const stackStyles = {
    borderRadius: "12px",
    border: "2px solid",
    borderColor: theme === 'light' ? lightTheme[currentTheme].borderColor : darkTheme[currentTheme].borderColor,
    boxShadow: theme === 'light' ? `0 0 20px ${lightTheme[currentTheme].borderColor}80` : `0 0 20px ${darkTheme[currentTheme].borderColor}80`,
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",

  };

  // 定义统一的按钮样式
  const buttonStyles = {
    borderRadius: "12px",
    fontWeight: 500,
    transition: "all 0.3s ease",
    borderWidth: "2px",
    backgroundColor: theme === 'light' ? lightTheme[currentTheme].borderColor : darkTheme[currentTheme].borderColor,
    color: theme === 'light' ? lightTheme[currentTheme].color : darkTheme[currentTheme].color,
    transform: "translateY(0)",
    boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
  };

  return (
    <Container className="min-vh-100 text-center" style={theme === 'light' ? { ...lightTheme[currentTheme] } : { ...darkTheme[currentTheme] }} fluid>
      <Row className="mb-4 justify-content-center pt-5">
        <Col sm={6}>
          <Stack gap={0} style={stackStyles}>
            <div className="p-2"><h3><b>{t('mainpage.react_furry.title')}</b></h3></div>
            <div className="p-2 text-primary">{t('mainpage.react_furry.description')}</div>
            <div style={{
              height: "1px",
              margin: "0.5rem 0"
            }} />
            <div className="p-2">
              <BoldButton onClick={() => {
                window.location.href = "/react-furry";
              }} style={buttonStyles}>{t('mainpage.react_furry.persona')}</BoldButton>
            </div>
            <div className="p-2">
              <BoldButton onClick={() => {
                window.location.href = "/react-furry-error";
              }} style={buttonStyles}>{t('mainpage.react_furry.error')}</BoldButton>
            </div>
          </Stack>
        </Col>
      </Row>
      <Row style={{ width: "67%", margin: "0 auto" }}>
        <Col sm={6} className="mb-4 mb-md-0">
          <Stack gap={0} style={stackStyles}>
            <div className="p-2"><h3><b>{t('mainpage.minigame.title')}</b></h3></div>
            <div className="p-2 text-primary">{t('mainpage.minigame.description')}</div>
            <div style={{
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(138, 43, 226, 0.5), transparent)",
              margin: "0.5rem 0"
            }} />
            <div className="p-2">
              <BoldButton onClick={() => {
                window.location.href = "/BWIte/index.html";
              }} style={buttonStyles}>{t('mainpage.minigame.bwite')}</BoldButton>
            </div>
            <div className="p-2">
              <BoldButton onClick={() => {
                window.location.href = "/Color/index.html";
              }} style={buttonStyles}>{t('mainpage.minigame.color')}</BoldButton>
            </div>
            <div className="p-2">
              <BoldButton onClick={() => {
                window.location.href = "/LightMaze";
              }} style={buttonStyles}>{t('mainpage.minigame.light')}</BoldButton>
            </div>
          </Stack>
        </Col>
        <Col sm={6} className="mb-4 mb-md-0">
          <Stack gap={0} style={stackStyles}>
            <div className="p-2"><h3><b>{t('mainpage.tools.title')}</b></h3></div>
            <div className="p-2 text-primary">{t('mainpage.tools.description')}</div>
            <div style={{
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(138, 43, 226, 0.5), transparent)",
              margin: "0.5rem 0"
            }} />
            <div className="p-2">
              <BoldButton onClick={() => {
                window.location.href = "/";
              }} style={buttonStyles}>{t('mainpage.tools.tobe')}</BoldButton>
            </div>
            <div className="p-2">
              <BoldButton onClick={() => {
                window.location.href = "/Furry";
              }} style={buttonStyles}>{t('mainpage.tools.furry')}</BoldButton>
            </div>
          </Stack>
        </Col>
      </Row>
      <Row className="mb-4 mt-4 justify-content-center" style={{ margin: "0 auto" }}>
        <Col sm={6}>
          <Stack gap={0} style={stackStyles}>
            <div className="p-2"><h3><b>{t('mainpage.vercel.title')}</b></h3></div>
            <div className="p-2 text-primary">{t('mainpage.vercel.description')}</div>
            <div style={{
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(138, 43, 226, 0.5), transparent)",
              margin: "0.5rem 0"
            }} />
            <div className="p-2">
              <BoldButton onClick={() => {
                window.open("https://masaominn.vercel.app/", "_blank");
              }} style={buttonStyles}>{t('mainpage.vercel.mirror')}</BoldButton>
            </div>
            <div className="p-2">
              <BoldButton onClick={() => {
                window.open("https://kinotsuki.vercel.app/", "_blank");
              }} style={buttonStyles}>{t('mainpage.vercel.personal')}</BoldButton>
            </div>
            <div className="p-2">
              <BoldButton onClick={() => {
                window.open("https://make-your-oc-alive.vercel.app/", "_blank");
              }} style={buttonStyles}>{t('mainpage.vercel.make_your_oc_alive')}</BoldButton>
            </div>
          </Stack>
        </Col>
      </Row>

      <CookieModal show={isCookieModalVisible} />
    </Container>
  );
}
export default App;
"use client";
import { Button, Col, Row, Stack } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { useTheme, lightTheme, darkTheme } from "@/components/boxed/ThemeProvider";
import { useTranslation } from 'react-i18next'
import React from "react";
import { useModalStore } from "@/store/ModalStore";
import { MyToast } from "@/components/boxed/Toast";
const App = () => {
  const { t } = useTranslation();
  const { theme, currentTheme } = useTheme();
  const { toast } = useModalStore();

  // 定义统一的Stack样式
  const stackStyles = {
    borderRadius: "12px",
    border: "2px solid",
    boxShadow: theme === "light"
      ? "0 0 20px rgba(138, 43, 226, 0.5)"
      : "0 0 20px rgba(138, 43, 226, 0.7)",
    transition: "all 0.3s ease",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    borderColor: theme === "light"
      ? "rgba(138, 43, 226, 0.5)"
      : "rgba(138, 43, 226, 0.7)",
  };

  // 定义统一的按钮样式
  const buttonStyles = {
    borderRadius: "12px",
    fontWeight: 500,
    transition: "all 0.3s ease",
    borderWidth: "2px",
  };

  // 定义悬停效果的样式
  const stackHoverStyles = {
    transform: "translateY(-5px)",
    boxShadow: "0 10px 25px rgba(138, 43, 226, 0.7)",
  };

  // 定义按钮悬停效果
  const buttonHoverStyles = {
    transform: "translateY(-2px)",
    boxShadow: "0 5px 15px rgba(138, 43, 226, 0.5)",
  };

  return (
    <Container className="min-vh-100 text-center" style={theme === 'light' ? { ...lightTheme[currentTheme] } : { ...darkTheme[currentTheme] }} fluid>
      <Row className="mb-4 justify-content-center">
        <Col sm={6}>
          <Stack gap={0} style={stackStyles} onMouseEnter={(e) => {
            Object.assign(e.currentTarget.style, stackHoverStyles);
          }} onMouseLeave={(e) => {
            Object.assign(e.currentTarget.style, stackStyles);
          }}>
            <div className="p-2"><h3><b>{t('mainpage.react_furry.title')}</b></h3></div>
            <div className="p-2 text-primary">{t('mainpage.react_furry.description')}</div>
            <div style={{
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(138, 43, 226, 0.5), transparent)",
              margin: "0.5rem 0"
            }} />
            <div className="p-2">
              <Button href="/react-furry" target="_blank" variant={theme} style={buttonStyles} onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, buttonHoverStyles);
              }} onMouseLeave={(e) => {
                Object.assign(e.currentTarget.style, buttonStyles);
              }}>{t('mainpage.react_furry.persona')}</Button>
            </div>
            <div className="p-2">
              <Button href="/react-furry-error" target="_blank" variant={theme} style={buttonStyles} onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, buttonHoverStyles);
              }} onMouseLeave={(e) => {
                Object.assign(e.currentTarget.style, buttonStyles);
              }}>{t('mainpage.react_furry.error')}</Button>
            </div>
          </Stack>
        </Col>
      </Row>
      <Row style={{ width: "67%", margin: "0 auto" }}>
        <Col className="mb-4 mb-md-0">
          <Stack gap={0} style={stackStyles} onMouseEnter={(e) => {
            Object.assign(e.currentTarget.style, stackHoverStyles);
          }} onMouseLeave={(e) => {
            Object.assign(e.currentTarget.style, stackStyles);
          }}>
            <div className="p-2"><h3><b>{t('mainpage.minigame.title')}</b></h3></div>
            <div className="p-2 text-primary">{t('mainpage.minigame.description')}</div>
            <div style={{
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(138, 43, 226, 0.5), transparent)",
              margin: "0.5rem 0"
            }} />
            <div className="p-2">
              <Button href="/BWIte/index.html" variant={theme} style={buttonStyles} onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, buttonHoverStyles);
              }} onMouseLeave={(e) => {
                Object.assign(e.currentTarget.style, buttonStyles);
              }}>{t('mainpage.minigame.bwite')}</Button>
            </div>
            <div className="p-2">
              <Button href="/Color/index.html" variant={theme} style={buttonStyles} onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, buttonHoverStyles);
              }} onMouseLeave={(e) => {
                Object.assign(e.currentTarget.style, buttonStyles);
              }}>{t('mainpage.minigame.color')}</Button>
            </div>
            <div className="p-2">
              <Button href="/LightMaze" variant={theme} style={buttonStyles} onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, buttonHoverStyles);
              }} onMouseLeave={(e) => {
                Object.assign(e.currentTarget.style, buttonStyles);
              }}>{t('mainpage.minigame.light')}</Button>
            </div>
          </Stack>
        </Col>
        <Col>
          <Stack gap={0} style={stackStyles} onMouseEnter={(e) => {
            Object.assign(e.currentTarget.style, stackHoverStyles);
          }} onMouseLeave={(e) => {
            Object.assign(e.currentTarget.style, stackStyles);
          }}>
            <div className="p-2"><h3><b>{t('mainpage.tools.title')}</b></h3></div>
            <div className="p-2 text-primary">{t('mainpage.tools.description')}</div>
            <div style={{
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(138, 43, 226, 0.5), transparent)",
              margin: "0.5rem 0"
            }} />
            <div className="p-2">
              <Button href="/" variant={theme} style={buttonStyles} onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, buttonHoverStyles);
              }} onMouseLeave={(e) => {
                Object.assign(e.currentTarget.style, buttonStyles);
              }}>{t('mainpage.tools.tobe')}</Button>
            </div>
            <div className="p-2">
              <Button href="/Furry" variant={theme} style={buttonStyles} onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, buttonHoverStyles);
              }} onMouseLeave={(e) => {
                Object.assign(e.currentTarget.style, buttonStyles);
              }}>{t('mainpage.tools.furry')}</Button>
            </div>
          </Stack>
        </Col>
      </Row>
      <Row><MyToast {...toast} /></Row>
    </Container>
  );
}
export default App;
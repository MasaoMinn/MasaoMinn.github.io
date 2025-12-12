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
    transform: "translateY(0)",
    boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
  };

  // 定义悬停效果的样式
  const stackHoverStyles = {
    transform: "translateY(-5px)",
  };

  // 定义按钮悬停效果
  const buttonHoverStyles = {
    transform: "translateY(-2px)",
    boxShadow: "0 5px 15px rgba(208, 194, 221, 0.5)",
    backgroundColor: theme === 'light' ? lightTheme[currentTheme].borderColor : darkTheme[currentTheme].borderColor,
  };

  return (
    <Container className="min-vh-100 text-center" style={theme === 'light' ? { ...lightTheme[currentTheme] } : { ...darkTheme[currentTheme] }} fluid>
      <Row className="mb-4 justify-content-center pt-5">
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
"use client";
import { Button, Col, Image, Row, Stack } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { useTheme, lightTheme, darkTheme } from "@/components/boxed/ThemeProvider";
import { useTranslation } from 'react-i18next'
import React from "react";
import Experience from "@/components/layout/Experience";
import { useModalStore } from "./store/ModalStore";
import { MyToast } from "@/components/boxed/Toast";
const Introduction = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <div className="" style={theme == "light" ? { backgroundColor: "#F4FFC8", color: "#00211F" } : { backgroundColor: "#161712", color: "#D5FFFA" }}>
      <h3>{t('intro.iam')} <b>{t('intro.name')}</b></h3>
      <p></p>
      <p>{t('intro.college')}</p>
      <p>{t('intro.cpp')}</p>
      <p>{t('intro.react')}</p>
      <p>{t('intro.language')}</p>
      <p>{t('intro.japan')}</p>
      <p>{t('intro.hobby')}</p>
      <p>{t('intro.pokemon')}</p>
      <p>{t('intro.motto')}</p>
    </div>
  )
}
const Main = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { toast } = useModalStore();
  const [activeTab, setActiveTab] = React.useState<'OI' | 'Developper' | 'Language'>('OI');
  const tabTitles = [
    { key: 'OI', label: t('mainpage.oi.label') },
    { key: 'Developper', label: t('mainpage.developper.label') },
    { key: 'Language', label: t('mainpage.language.label') }
  ];
  const [hasStorageAccess, setHasStorageAccess] = React.useState<boolean>(false);

  // Check if localStorage/cookie access is available
  const checkStorageAccess = React.useCallback(() => {
    try {
      // Test localStorage access
      const testKey = 'storage_test';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      setHasStorageAccess(true);
    } catch (error) {
      console.log(error);
      setHasStorageAccess(false);
    }
  }, []);

  // Check storage access on component mount
  React.useEffect(() => {
    checkStorageAccess();
  }, [checkStorageAccess]);

  return (
    <Container className="" style={theme === 'light' ? { ...lightTheme } : { ...darkTheme }} fluid>
      <Row className="justify-content-center align-items-center" style={{ minHeight: "260px", marginBottom: "2rem" }}>
        <Col xs={12} md={4} className="d-flex justify-content-center align-items-center">
          <Image
            src="/head.jpg"
            alt="header"
            style={{
              objectFit: "cover",
              borderRadius: "50%",
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              border: theme === 'light' ? "2px solid #F4FFC8" : "2px solid #161712"
            }}
            fluid
          />
        </Col>
        <Col xs={12} md={6} className="d-flex justify-content-center align-items-center">
          <Introduction />
        </Col>
      </Row>
      <Row className="justify-content-center align-items-center" style={{ minHeight: "120px", marginBottom: "1vw" }}>
        <Col className="d-flex flex-column align-items-center">
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
            {tabTitles.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'OI' | 'Developper' | 'Language')}
                style={{
                  fontWeight: activeTab === tab.key ? 'bold' : 'normal',
                  fontSize: '1.2rem',
                  background: activeTab === tab.key ? '#e0f7fa' : 'transparent',
                  color: activeTab === tab.key ? '#00796b' : 'inherit',
                  border: 'none',
                  borderBottom: activeTab === tab.key ? '2px solid #00796b' : '2px solid transparent',
                  cursor: 'pointer',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div style={{ width: '60%' }}>
            <Experience type={activeTab} />
          </div>
        </Col>
      </Row>
      <Row className="text-center" style={{ width: "67%", margin: "0 auto" }}>
        <Col style={{ borderColor: "blue", borderWidth: "2px", borderStyle: "solid", borderRadius: "10px", marginRight: "3vw" }}>
          <Stack gap={0}>
            <div className="p-2"><h3><b>{t('mainpage.minigame.title')}</b></h3></div>
            <div className="p-2 text-primary">{t('mainpage.minigame.description')}</div>
            {!hasStorageAccess && (
              <div className="p-2 text-warning" style={{ fontSize: '0.9rem' }}>
                ⚠️ {t('error.cookie_message')}
              </div>
            )}
            <div className="hr" />
            <div className="p-2">
              <Button href="/BWIte/index.html" variant={theme} className="">{t('mainpage.minigame.bwite')}</Button>
            </div>
            <div className="p-2">
              <Button href="/Color/index.html" variant={theme} className="">{t('mainpage.minigame.color')}</Button>
            </div>
            <div className="p-2">
              <Button href="/LightMaze" variant={theme} className="">{t('mainpage.minigame.light')}</Button>
            </div>
          </Stack>
        </Col>
        <Col style={{ borderColor: "blue", borderWidth: "2px", borderStyle: "solid", borderRadius: "10px" }}>
          <Stack gap={0}>
            <div className="p-2"><h3><b>{t('mainpage.tools.title')}</b></h3></div>
            <div className="p-2 text-primary">{t('mainpage.tools.description')}</div>
            <div className="hr" />
            <div className="p-2">
              <Button href="/" variant={theme} className="">{t('mainpage.tools.tobe')}</Button>
            </div>
            <div className="p-2">
              <Button href="/Furry" variant={theme} className="">{t('mainpage.tools.furry')}</Button>
            </div>
          </Stack>
        </Col>
      </Row>
      <Row><MyToast {...toast} /></Row>
    </Container>
  );
}
export default Main;

"use client";
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTheme, darkTheme, lightTheme } from '@/components/boxed/ThemeProvider';
// import Picture from '@/components/boxed/Picture';
// import GradientText from '@/components/GradientText';
import { Image } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { theme, currentTheme } = useTheme();
  const { t } = useTranslation();
  return (
    <Container fluid className="min-vh-100 text-center py-8" style={theme === 'dark' ? darkTheme[currentTheme] : lightTheme[currentTheme]}>
      <Row className="mb-8 justify-content-center">
        <Col>
          <div className="position-relative">
            <Image
              src="/react-furry/avater.svg"
              alt="React Furry Persona"
              height={100}
              width={600}
            />
          </div>
        </Col>
      </Row>
      <Row className="mb-12">
        <Col>
          <h1 className="lead mt-4" style={{ maxWidth: '50vw', margin: '0 auto', fontFamily: 'var(--font-playpen-sans), sans-serif' }}>
            {t('mainpage.react_furry.title')}
          </h1>
        </Col>
      </Row>

      {children}


    </Container>
  );
}
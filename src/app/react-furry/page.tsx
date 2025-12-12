"use client";
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTheme, darkTheme, lightTheme } from '@/components/boxed/ThemeProvider';
// import Picture from '@/components/boxed/Picture';
// import GradientText from '@/components/GradientText';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

export default function ReactImgPage() {
  const { theme, currentTheme } = useTheme();
  const { t } = useTranslation();
  return (
    <Container fluid className="min-vh-100 text-center py-8" style={theme === 'dark' ? darkTheme[currentTheme] : lightTheme[currentTheme]}>
      <Container>
        <Row className="mb-8 justify-content-center" style={{ height: '10vw' }}>
          <Col>
            <Image
              src="/react-furry/avater.svg"
              alt="React Furry Persona"
              height={100}
              width={600}
            />
          </Col>
        </Row>

        <Row className="mb-12">
          <Col>
            <h1 className="lead" style={{ maxWidth: '50vw', margin: '0 auto', fontFamily: 'var(--font-playpen-sans), sans-serif' }}>
              {t('mainpage.react_furry.title')}
            </h1>
          </Col>
        </Row>

        <Row className="justify-content-center mb-8">
          <Col xs={12} md={9} lg={8}>
            <div className="border rounded-lg p-4 shadow-lg position-relative mt-4" style={{ backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f8f9fa', height: '30vw' }}>
              <Image
                src="/react-furry/React.png"
                alt="React Furry Persona"
                fill
              />
              <div className="mt-4">
                <h3 className="mb-2" style={{ fontFamily: 'var(--font-kiwi-maru), serif' }}>React Logo</h3>
                <p className="text-muted" style={{ fontFamily: 'var(--font-kiwi-maru), serif' }}>The iconic React logo displayed using the custom Picture component.</p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
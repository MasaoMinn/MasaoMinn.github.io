"use client";
import { BoldButton } from '@/components/boxed/MotionComponents';
import { useTheme, darkTheme, lightTheme } from '@/components/boxed/ThemeProvider';
import Masonry from '@/components/Masonry';
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

// 这是react-furry根路由的默认内容
// 当访问/react-furry时显示的内容
export default function ReactFurryRootPage() {
  const { t } = useTranslation();
  const { theme, currentTheme } = useTheme();
  const baseUrl = `https://cdn.jsdelivr.net/gh/MasaoMinn/react-furry-error-docs@main/react/`;
  const items = [
    {
      id: "0",
      img: baseUrl + 'ReactExplain.png',
      url: baseUrl + 'ReactExplain.png',
    },
    {
      id: "1",
      img: baseUrl + 'react-furry-moji.png',
      url: baseUrl + 'react-furry-moji.png',
    },
    {
      id: "2",
      img: baseUrl + 'not_found.png',
      url: baseUrl + 'not_found.png',
    },
    {
      id: "3",
      img: baseUrl + 'hook.png',
      url: baseUrl + 'hook.png',
    },
    {
      id: "4",
      img: baseUrl + 'nani.png',
      url: baseUrl + 'nani.png',
    }, {
      id: "5",
      img: baseUrl + 'base.png',
      url: baseUrl + 'base.png',
    }

  ];
  return (
    <Container fluid className="min-vh-100 text-center py-8" style={theme === 'dark' ? darkTheme[currentTheme] : lightTheme[currentTheme]}>
      <Row>
        <Col>
          <BoldButton
            onClick={() => {
              window.location.href = '/react-furry/fursona';
            }}
          >{t('react_furry.get')}</BoldButton>
        </Col>
      </Row>
      <Masonry
        items={items}
        ease="power3.out"
        duration={0.6}
        stagger={0.05}
        animateFrom="bottom"
        scaleOnHover={true}
        hoverScale={0.95}
        blurToFocus={true}
        colorShiftOnHover={false}
      />
    </Container>
  );
}
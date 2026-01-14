"use client";
import { useTheme, darkTheme, lightTheme } from '@/components/boxed/ThemeProvider';
import React from 'react';
import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

// 这是react-furry根路由的默认内容
// 当访问/react-furry时显示的内容
export default function ReactFurryRootPage() {
  const { t } = useTranslation();
  const { theme, currentTheme } = useTheme();
  return (
    <Container fluid className="min-vh-100 text-center py-8" style={theme === 'dark' ? darkTheme[currentTheme] : lightTheme[currentTheme]}>

    </Container>
  );
}
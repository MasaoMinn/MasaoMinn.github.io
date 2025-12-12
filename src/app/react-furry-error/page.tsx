"use client";
import { Container, Button } from 'react-bootstrap';
import { useTheme, lightTheme, darkTheme } from '@/components/boxed/ThemeProvider';
import { useTranslation } from 'react-i18next';

export default function ReactFurryErrorPage() {
  const { theme, currentTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <Container
      className="min-vh-100 d-flex flex-column justify-content-center align-items-center"
      style={theme === 'light' ? lightTheme[currentTheme] : darkTheme[currentTheme]}
      fluid
    >
      <h1><b>{t('under_construction')}</b></h1>
      <Button href="/" variant={theme} className="mt-3">
        {t('error.back_to_home')}
      </Button>
    </Container>
  );
}
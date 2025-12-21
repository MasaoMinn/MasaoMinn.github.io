"use client";
import { Container, Row, Col, Stack } from 'react-bootstrap';
import { useTheme, lightTheme, darkTheme } from '@/components/boxed/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import "highlight.js/styles/github.css";

export default function ReactFurryErrorLayout({ children }: { children: React.ReactNode }) {
  const { theme, currentTheme } = useTheme();
  const { t } = useTranslation();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === `/react-furry-error/${path}`;

  return (
    <Container
      className="min-vh-100 d-flex"
      style={theme === 'light' ? lightTheme[currentTheme] : darkTheme[currentTheme]}
      fluid
    >
      <Row className='min-vh-100'>
        <Col xs={2}>
          <Stack
            className='min-vh-100 p-3 mt-2 fixed border border-2 rounded'
            gap={3}
            style={{
              width: '10vw',
              // fontSize: '1vw',
              borderColor: theme === 'light' ? lightTheme[currentTheme].borderColor : darkTheme[currentTheme].borderColor,
              backgroundColor: theme === 'light' ? lightTheme[currentTheme].backgroundColor : darkTheme[currentTheme].backgroundColor
            }}
          >
            <Link
              href="/react-furry-error/introduction"
              className={`p-2 cursor-pointer rounded`}
              style={{
                color: theme === 'light' ? lightTheme[currentTheme].color : darkTheme[currentTheme].color,
                backgroundColor: isActive('introduction')
                  ? (theme === 'light' ? lightTheme[currentTheme].borderColor : darkTheme[currentTheme].borderColor)
                  : 'transparent'
              }}
            >
              {t('reactFurryError.introduction')}
            </Link>
            <Link
              href="/react-furry-error/install"
              className={`p-2 cursor-pointer rounded`}
              style={{
                color: theme === 'light' ? lightTheme[currentTheme].color : darkTheme[currentTheme].color,
                backgroundColor: isActive('install')
                  ? (theme === 'light' ? lightTheme[currentTheme].borderColor : darkTheme[currentTheme].borderColor)
                  : 'transparent'
              }}
            >
              {t('reactFurryError.install')}
            </Link>
            <Link
              href="/react-furry-error/mechanism"
              className={`p-2 cursor-pointer rounded`}
              style={{
                color: theme === 'light' ? lightTheme[currentTheme].color : darkTheme[currentTheme].color,
                backgroundColor: isActive('mechanism')
                  ? (theme === 'light' ? lightTheme[currentTheme].borderColor : darkTheme[currentTheme].borderColor)
                  : 'transparent'
              }}
            >
              {t('reactFurryError.mechanism')}
            </Link>
            <Link
              href="/react-furry-error/gallery"
              className={`p-2 cursor-pointer rounded`}
              style={{
                color: theme === 'light' ? lightTheme[currentTheme].color : darkTheme[currentTheme].color,
                backgroundColor: isActive('gallery')
                  ? (theme === 'light' ? lightTheme[currentTheme].borderColor : darkTheme[currentTheme].borderColor)
                  : 'transparent'
              }}
            >
              {t('reactFurryError.gallery')}
            </Link>
          </Stack>
        </Col>
        <Col style={{ width: '84vw' }} className='p-5'>
          {children}
        </Col>
      </Row>
    </Container>
  );
}
"use client";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useTheme } from "@/components/boxed/ThemeProvider";
import { useTranslation } from 'react-i18next';
import i18n from '@/app/i18n';
function BasicExample() {
  const { theme, toggleTheme, currentTheme, nextTheme, prevTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <Navbar expand="lg" className="bg-body-tertiary" bg={theme} data-bs-theme={theme}>
      <Container>
        <Navbar.Brand href="./">{t('mainpage.title')}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
          </Nav><Nav>
            <NavDropdown title={t('lang')} id='lang'>
              <NavDropdown.Item onClick={() => i18n.changeLanguage('en')}>{'English'}</NavDropdown.Item>
              <NavDropdown.Item onClick={() => i18n.changeLanguage('zh')}>{'简体中文'}</NavDropdown.Item>
              <NavDropdown.Item onClick={() => i18n.changeLanguage('jp')}>{'日本語'}</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title={t('mainpage.dropdown')} id="basic-nav-dropdown">
              <NavDropdown.Item>
                <div className="d-flex gap-2 w-100">
                  <Button onClick={prevTheme} variant={theme} className='flex-fill'>
                    ⏮️
                  </Button>
                  <Button onClick={toggleTheme} variant={theme} className='flex-fill'>
                    {t('mainpage.theme')} {theme === "light" ? "🌙" : "☀️"}
                  </Button>
                  <Button onClick={nextTheme} variant={theme} className='flex-fill'>
                    ⏭️
                  </Button>
                </div>
                <div className="mt-2 text-center">
                  {t('mainpage.theme_variant')} {currentTheme + 1}
                </div>
              </NavDropdown.Item>
              <NavDropdown.Item href='./About'><Button variant={theme} className='w-100'>{t('mainpage.about')}</Button></NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="https://github.com/MasaoMinn/MasaoMinn.github.io">{t('mainpage.seeme')}</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BasicExample;
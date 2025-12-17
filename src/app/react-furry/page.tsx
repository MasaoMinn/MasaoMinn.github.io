"use client";
import React from 'react';
import { Container, Row, Col, Button, Carousel } from 'react-bootstrap';
import { useTheme, darkTheme, lightTheme } from '@/components/boxed/ThemeProvider';
// import Picture from '@/components/boxed/Picture';
// import GradientText from '@/components/GradientText';
import { Image } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { BoldDiv } from '@/components/boxed/MotionComponents';

export default function ReactImgPage() {
  const { theme, currentTheme } = useTheme();
  const { t } = useTranslation();
  const iconSize: number = 20;
  const imageGallery = [
    "/react-furry/front.png",
    "/react-furry/hook.png",
    "/react-furry/dom.png",
  ]
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

      <Row className="justify-content-center mt-8 align-items-center">
        <Col xs={12}
          lg={8}
          xl={6}
          className="justify-content-center mt-3"
          style={{ border: "2px solid blue", borderRadius: "10px", padding: "10px", backgroundColor: "white" }}>
          <Carousel>
            {imageGallery.map((src, i) => (
              <Carousel.Item key={i}>
                <Image
                  className="d-block w-100"
                  src={src}
                  alt={`card-${i + 1}`}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
      </Row>
      <Row className="justify-content-center mb-8">
        <Col xs={12} md={9} lg={8}>
          <div className="border rounded-lg p-4 shadow-lg position-relative mt-4" style={{ backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f8f9fa', height: '36vw' }}>
            <Image
              src="/react-furry/React.png"
              alt="React Furry Persona"
              className='w-100 h-100'
            />
          </div>
        </Col>
      </Row>

      <Row className='mt-5'>
        <Col>
          <BoldDiv>
            <Button
              as="a"
              href="/react-furry/avater.svg"
              download="react-furry-avatar.svg"
              variant={theme}
              style={{
                backgroundColor: theme === 'dark' ? darkTheme[currentTheme].borderColor : lightTheme[currentTheme].borderColor,
                borderColor: theme === 'dark' ? darkTheme[currentTheme].borderColor : lightTheme[currentTheme].borderColor
              }}
            >
              {t('react_furry.download')}{' SVG'}
            </Button>
          </BoldDiv>
        </Col>
        <Col>
          <BoldDiv>
            <Button
              as="a"
              href="/react-furry/avater.png"
              download="react-furry-avatar.png"
              variant={theme}
              style={{
                backgroundColor: theme === 'dark' ? darkTheme[currentTheme].borderColor : lightTheme[currentTheme].borderColor,
                borderColor: theme === 'dark' ? darkTheme[currentTheme].borderColor : lightTheme[currentTheme].borderColor
              }}
            >
              {t('react_furry.download')}{' PNG'}
            </Button>
          </BoldDiv>
        </Col>
      </Row>
      <Row>
        <Col>
          <a href="https://masaominn.github.io/react-furry">React in Furry</a> © 2025 by <a href="https://masaominn.github.io/furry">Sunny_Tangetsu</a> is licensed under <a href="https://creativecommons.org/licenses/by-nc/4.0/">CC BY-NC 4.0</a>
          <Image src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" alt="CC" height={iconSize} width={iconSize} style={{ maxWidth: '1em', maxHeight: '1em', marginLeft: '0.2em', display: 'inline-block', verticalAlign: 'middle' }} />
          <Image src="https://mirrors.creativecommons.org/presskit/icons/by.svg" alt="BY" height={iconSize} width={iconSize} style={{ maxWidth: '1em', maxHeight: '1em', marginLeft: '0.2em', display: 'inline-block', verticalAlign: 'middle' }} />
          <Image src="https://mirrors.creativecommons.org/presskit/icons/nc.svg" alt="NC" height={iconSize} width={iconSize} style={{ maxWidth: '1em', maxHeight: '1em', marginLeft: '0.2em', display: 'inline-block', verticalAlign: 'middle' }} />
        </Col>
      </Row>


    </Container>
  );
}
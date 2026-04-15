"use client";
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
// import Picture from '@/components/boxed/Picture';
// import GradientText from '@/components/GradientText';
import { Image } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { BoldDiv } from '@/components/boxed/MotionComponents';

export default function ReactImgPage() {
  const { t } = useTranslation();
  const iconSize: number = 20;
  return (
    <Container fluid className="theme-page min-vh-100 text-center py-8">
      <Row className="justify-content-center mb-8">
        <Col xs={12} md={9} lg={8}>
          <BoldDiv className="border rounded-lg p-4 shadow-lg position-relative mt-4">
            <Image
              src="/react-furry/ReactExplain.png"
              alt="React Furry Persona"
              className='w-100 h-100'
            />
          </BoldDiv>
        </Col>
      </Row>

      <Row className='mt-5'>
        <Col>
          <BoldDiv>
            <Button
              as="a"
              href="/react-furry/avater.svg"
              download="react-furry-avatar.svg"
              style={{
                backgroundColor: "var(--primary)",
                borderColor: "var(--primary)",
                color: "var(--primary-foreground)",
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
              style={{
                backgroundColor: "var(--primary)",
                borderColor: "var(--primary)",
                color: "var(--primary-foreground)",
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

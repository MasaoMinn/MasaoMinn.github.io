import React from 'react';
import { Row, Col, Accordion } from 'react-bootstrap';
import Image from 'next/image';
import ThemedButton from '@/components/boxed/ThemedButton';

interface SocialLinkSectionProps {
  url: string;
  qqNumber?: string;
  ariaLabel: string;
  iconSrc: string;
  iconAlt: string;
  buttonText: string;
  qrCodeSrc: string;
  qrCodeAlt: string;
  accordionHeader: string;
}

const SocialLinkSection: React.FC<SocialLinkSectionProps> = ({
  url,
  ariaLabel,
  iconSrc,
  iconAlt,
  buttonText,
  qrCodeSrc,
  qrCodeAlt,
  accordionHeader,
}) => {
  return (
    <>
      <Row className="justify-content-center g-1">
        <Col xs={9} md={6} className="d-flex justify-content-center">
          <ThemedButton
            variant="outline"
            aria-label={ariaLabel}
            className="px-4 py-2 d-flex align-items-center"
            onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
          >
            <Image
              src={iconSrc}
              alt={iconAlt}
              width={20}
              height={20}
              className="me-2"
            />
            {buttonText}
          </ThemedButton>
        </Col>
      </Row>
      <Row className="mt-1 justify-content-center">
        <Col xs={10} md={6} lg={4}>
          <Accordion
            defaultActiveKey={null}
            flush
            className="my-3 rounded-lg border-2 border-solid"
            style={{
              borderColor: "var(--border)",
              ["--bs-accordion-color" as string]: "var(--foreground)",
              ["--bs-accordion-bg" as string]: "var(--background)",
              ["--bs-accordion-border-color" as string]: "var(--border)",
              ["--bs-accordion-btn-color" as string]: "var(--foreground)",
              ["--bs-accordion-btn-bg" as string]: "var(--background)",
              ["--bs-accordion-active-bg" as string]: "var(--secondary)",
              ["--bs-accordion-active-color" as string]: "var(--secondary-foreground)",
            }}
          >
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <span className="text-primary me-2">
                  <i className="bi bi-chevron-down" />
                </span>
                {accordionHeader}
              </Accordion.Header>
              <Accordion.Body>
                <div className="position-relative w-100 h-auto">
                   <Image
                    src={qrCodeSrc}
                    alt={qrCodeAlt}
                    width={500}
                    height={500}
                    className="img-thumbnail hover-shadow w-100 h-auto"
                    style={{
                      transform: 'scale(0.98)',
                      transition: 'transform 0.3s ease',
                    }}
                    onLoadingComplete={(img) => {
                        img.style.transform = 'scale(1)';
                    }}
                  />
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>
    </>
  );
};

export default SocialLinkSection;

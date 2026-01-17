import React from 'react';
import { Row, Col, Button, Accordion } from 'react-bootstrap';
import Image from 'next/image';

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
          <Button
            variant="info"
            href={url}
            aria-label={ariaLabel}
            className="px-4 py-2 d-flex align-items-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={iconSrc}
              alt={iconAlt}
              width={20}
              height={20}
              className="me-2"
            />
            {buttonText}
          </Button>
        </Col>
      </Row>
      <Row className="mt-1 justify-content-center">
        <Col xs={10} md={6} lg={4}>
          <Accordion
            defaultActiveKey={null}
            flush
            className="my-3 border-2 border-blue-600 border-solid rounded-lg"
            style={{ borderColor: "blue" }} // Keep inline style if Tailwind config doesn't cover this exact blue or overrides
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

"use client";

import { Button, Col, Container, Image, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { BoldDiv } from "@/components/boxed/MotionComponents";

const buttonStyle = {
  backgroundColor: "var(--primary)",
  borderColor: "var(--primary)",
  color: "var(--primary-foreground)",
};

export default function ReactFursonaPage() {
  const { t } = useTranslation();
  const iconSize = 20;

  return (
    <Container fluid className="theme-page min-vh-100 text-center py-8">
      <Row className="justify-content-center mb-8">
        <Col xs={12} md={9} lg={8}>
          <BoldDiv className="border rounded-lg p-4 shadow-lg position-relative mt-4">
            <Image
              src="/react-furry/ReactExplain.png"
              alt="React Furry Persona"
              className="w-100 h-100"
            />
          </BoldDiv>
        </Col>
      </Row>

      <Row className="justify-content-center mt-5 mb-4">
        <Col xs={12} md={8} lg={6}>
          <BoldDiv>
            <Button
              as="a"
              href="https://gallery.tangetsu.top/react"
              className="w-100"
              style={buttonStyle}
              target="_blank"
            >
              {t("react_furry.album")}
            </Button>
          </BoldDiv>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <BoldDiv>
            <Button
              as="a"
              href="/react-furry/avater.svg"
              download="react-furry-avatar.svg"
              style={buttonStyle}
            >
              {t("react_furry.download")} SVG
            </Button>
          </BoldDiv>
        </Col>
        <Col>
          <BoldDiv>
            <Button
              as="a"
              href="/react-furry/avater.png"
              download="react-furry-avatar.png"
              style={buttonStyle}
            >
              {t("react_furry.download")} PNG
            </Button>
          </BoldDiv>
        </Col>
      </Row>

      <Row>
        <Col>
          <a href="/react-fursona">React in Furry</a> © 2025 by{" "}
          <a href="/Furry">Sunny_Tangetsu</a> is licensed under{" "}
          <a href="https://creativecommons.org/licenses/by-nc/4.0/">
            CC BY-NC 4.0
          </a>
          <Image
            src="https://mirrors.creativecommons.org/presskit/icons/cc.svg"
            alt="CC"
            height={iconSize}
            width={iconSize}
            style={{
              maxWidth: "1em",
              maxHeight: "1em",
              marginLeft: "0.2em",
              display: "inline-block",
              verticalAlign: "middle",
            }}
          />
          <Image
            src="https://mirrors.creativecommons.org/presskit/icons/by.svg"
            alt="BY"
            height={iconSize}
            width={iconSize}
            style={{
              maxWidth: "1em",
              maxHeight: "1em",
              marginLeft: "0.2em",
              display: "inline-block",
              verticalAlign: "middle",
            }}
          />
          <Image
            src="https://mirrors.creativecommons.org/presskit/icons/nc.svg"
            alt="NC"
            height={iconSize}
            width={iconSize}
            style={{
              maxWidth: "1em",
              maxHeight: "1em",
              marginLeft: "0.2em",
              display: "inline-block",
              verticalAlign: "middle",
            }}
          />
        </Col>
      </Row>
    </Container>
  );
}

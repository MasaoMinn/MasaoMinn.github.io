"use client";

import type { ReactNode } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ThemedButton from "@/components/boxed/ThemedButton";

export default function ReactFursonaLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();

  return (
    <Container fluid className="theme-page min-vh-100 text-center py-8">
      <Row className="mb-8 justify-content-center">
        <Col xs={1}>
          <ThemedButton onClick={() => window.history.back()}>
            {t("mainpage.back")}
          </ThemedButton>
        </Col>
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
          <h1
            className="lead mt-4"
            style={{
              maxWidth: "50vw",
              margin: "0 auto",
              fontFamily: "var(--font-playpen-sans), sans-serif",
            }}
          >
            {t("mainpage.react_furry.title")}
          </h1>
        </Col>
      </Row>

      {children}
    </Container>
  );
}

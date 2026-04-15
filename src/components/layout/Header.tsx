"use client";

import { useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import {
  type ThemePalette,
  useTheme,
} from "@/components/boxed/ThemeProvider";
import { useTranslation } from "react-i18next";
import i18n from "@/app/i18n";
import { useLocalStorageStore } from "@/store/LocalStorageStore";

const COLOR_FIELDS: Array<{ key: keyof ThemePalette; labelKey: string }> = [
  { key: "backgroundColor", labelKey: "mainpage.custom_theme.fields.backgroundColor" },
  { key: "color", labelKey: "mainpage.custom_theme.fields.color" },
  { key: "borderColor", labelKey: "mainpage.custom_theme.fields.borderColor" },
  { key: "extraColor", labelKey: "mainpage.custom_theme.fields.extraColor" },
  { key: "backgroundColor2", labelKey: "mainpage.custom_theme.fields.backgroundColor2" },
  { key: "color2", labelKey: "mainpage.custom_theme.fields.color2" },
  { key: "extraColor2", labelKey: "mainpage.custom_theme.fields.extraColor2" },
];

const HEX_6 = /^#[0-9a-fA-F]{6}$/;
const HEX_8 = /^#[0-9a-fA-F]{8}$/;
const FALLBACK_COLOR = "#000000";

const normalizeColor = (value: string, fallback: string): string => {
  const trimmed = value.trim();
  if (HEX_6.test(trimmed)) {
    return trimmed.toLowerCase();
  }
  if (HEX_8.test(trimmed)) {
    return trimmed.slice(0, 7).toLowerCase();
  }
  return fallback;
};

const normalizePalette = (palette: ThemePalette): ThemePalette => ({
  backgroundColor: normalizeColor(palette.backgroundColor, FALLBACK_COLOR),
  color: normalizeColor(palette.color, FALLBACK_COLOR),
  borderColor: normalizeColor(palette.borderColor, FALLBACK_COLOR),
  extraColor: normalizeColor(palette.extraColor, FALLBACK_COLOR),
  backgroundColor2: normalizeColor(palette.backgroundColor2, FALLBACK_COLOR),
  color2: normalizeColor(palette.color2, FALLBACK_COLOR),
  extraColor2: normalizeColor(palette.extraColor2, FALLBACK_COLOR),
});

function BasicExample() {
  const {
    theme,
    toggleTheme,
    currentTheme,
    currentThemeNameKey,
    currentPalette,
    hasCustomTheme,
    nextTheme,
    prevTheme,
    setCustomThemePalette,
    removeCustomThemePalette,
  } = useTheme();
  const { t } = useTranslation();
  const [showCustomThemeModal, setShowCustomThemeModal] = useState(false);
  const [customThemeDraft, setCustomThemeDraft] = useState<ThemePalette>(() =>
    normalizePalette(currentPalette)
  );

  const currentThemeName = t(`mainpage.theme_names.${currentThemeNameKey}`, {
    defaultValue: currentThemeNameKey,
  });
  const currentThemeModeLabel = t(`mainpage.theme_modes.${theme}`, {
    defaultValue: theme,
  });
  const isCustomThemeActive = currentThemeNameKey === "custom";

  const openCustomThemeModal = () => {
    setCustomThemeDraft(normalizePalette(currentPalette));
    setShowCustomThemeModal(true);
  };

  const updateDraftColor = (key: keyof ThemePalette, value: string) => {
    setCustomThemeDraft((prev) => ({
      ...prev,
      [key]: normalizeColor(value, prev[key]),
    }));
  };

  const saveCustomTheme = () => {
    setCustomThemePalette(normalizePalette(customThemeDraft));
    setShowCustomThemeModal(false);
  };

  return (
    <>
      <Navbar
        expand="lg"
        className="bg-body-tertiary"
        bg={theme}
        data-bs-theme={theme}
      >
        <Container>
          <Navbar.Brand href="/">{t("mainpage.title")}</Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse
            id="basic-navbar-nav"
            className="overflow-visible"
          >
            <Nav className="me-auto" />

            <Nav>
              <NavDropdown title={t("lang")} id="lang" autoClose="outside">
                <NavDropdown.Item
                  onClick={() => {
                    i18n.changeLanguage("en");
                    useLocalStorageStore
                      .getState()
                      .setLanguageCookie("en");
                  }}
                >
                  English
                </NavDropdown.Item>

                <NavDropdown.Item
                  onClick={() => {
                    i18n.changeLanguage("zh");
                    useLocalStorageStore
                      .getState()
                      .setLanguageCookie("zh");
                  }}
                >
                  简体中文
                </NavDropdown.Item>

                <NavDropdown.Item
                  onClick={() => {
                    i18n.changeLanguage("jp");
                    useLocalStorageStore
                      .getState()
                      .setLanguageCookie("jp");
                  }}
                >
                  日本語
                </NavDropdown.Item>
              </NavDropdown>

              <NavDropdown
                title={t("mainpage.dropdown")}
                id="theme-dropdown"
                autoClose
                align="end"
                className="theme-more-dropdown"
              >
                <div
                  className="px-3 py-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className="rounded-3 p-2 border mb-2"
                    style={{
                      backgroundColor: currentPalette.backgroundColor2,
                      borderColor: currentPalette.borderColor,
                      boxShadow: `0 6px 16px -10px ${currentPalette.extraColor2}`,
                    }}
                  >
                    <div className="d-flex gap-2">
                    <Button
                      onClick={prevTheme}
                      variant="outline-secondary"
                      className="px-3 fw-semibold"
                      style={{
                        borderColor: currentPalette.borderColor,
                        color: currentPalette.color2,
                        backgroundColor: currentPalette.backgroundColor,
                      }}
                    >
                      ←
                    </Button>

                    <Button
                      onClick={toggleTheme}
                      className="flex-fill"
                      style={{
                        borderColor: currentPalette.borderColor,
                        color: currentPalette.color,
                        background: `linear-gradient(135deg, ${currentPalette.backgroundColor} 0%, ${currentPalette.backgroundColor2} 100%)`,
                        boxShadow: `inset 0 0 0 1px ${currentPalette.borderColor}`,
                        fontWeight: 600,
                      }}
                    >
                      {t("mainpage.theme")} {currentThemeName}
                      {isCustomThemeActive ? "" : ` (${currentThemeModeLabel})`}{" "}
                      {theme === "light" ? "🌙" : "☀️"}
                    </Button>

                    <Button
                      onClick={nextTheme}
                      variant="outline-secondary"
                      className="px-3 fw-semibold"
                      style={{
                        borderColor: currentPalette.borderColor,
                        color: currentPalette.color2,
                        backgroundColor: currentPalette.backgroundColor,
                      }}
                    >
                      →
                    </Button>
                  </div>
                  </div>

                  <div className="text-center small opacity-75">
                    {t("mainpage.theme_variant")} {currentTheme + 1}: {currentThemeName}
                  </div>
                </div>

                <NavDropdown.Divider />

                <div
                  className="px-3 py-2 d-flex align-items-center gap-2 flex-nowrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="link"
                    className="p-0 text-start text-decoration-none flex-grow-1 text-nowrap"
                    style={{
                      color: currentPalette.color,
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    onClick={openCustomThemeModal}
                  >
                    {t("mainpage.custom_theme.open")}
                    {hasCustomTheme ? ` (${t("mainpage.custom_theme.updated")})` : ""}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    disabled={!hasCustomTheme}
                    onClick={removeCustomThemePalette}
                  >
                    {t("mainpage.custom_theme.remove")}
                  </Button>
                </div>

                <NavDropdown.Divider />

                <NavDropdown.Item href="./About">
                  {t("mainpage.about")}
                </NavDropdown.Item>

                <NavDropdown.Item
                  href="https://github.com/MasaoMinn/MasaoMinn.github.io"
                  target="_blank"
                >
                  {t("mainpage.seeme")}
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal
        show={showCustomThemeModal}
        onHide={() => setShowCustomThemeModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("mainpage.custom_theme.title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="small text-muted mb-3">
            {t("mainpage.custom_theme.description")}
          </p>
          <Form>
            {COLOR_FIELDS.map(({ key, labelKey }) => (
              <Form.Group className="mb-3" key={key}>
                <Form.Label>{t(labelKey)}</Form.Label>
                <div className="d-flex align-items-center gap-2">
                  <Form.Control
                    type="color"
                    value={normalizeColor(customThemeDraft[key], FALLBACK_COLOR)}
                    onChange={(e) => updateDraftColor(key, e.target.value)}
                    style={{ width: "3rem", height: "2.25rem", padding: 2 }}
                  />
                  <Form.Control
                    type="text"
                    value={customThemeDraft[key]}
                    onChange={(e) => updateDraftColor(key, e.target.value)}
                    placeholder="#000000"
                  />
                </div>
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant={theme} onClick={() => setShowCustomThemeModal(false)}>
            {t("mainpage.custom_theme.cancel")}
          </Button>
          <Button variant={theme} onClick={saveCustomTheme}>
            {t("mainpage.custom_theme.save")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default BasicExample;

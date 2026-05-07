"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import {
  CURSOR_TRAIL_TYPES,
  useCursorLab,
} from "@/components/boxed/CursorLabProvider";
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

const DESKTOP_DROPDOWN_CLOSE_DISTANCE = 42;

type Point = { x: number; y: number };

const getDistanceToRect = (point: Point, rect: DOMRect): number => {
  const dx =
    point.x < rect.left
      ? rect.left - point.x
      : point.x > rect.right
        ? point.x - rect.right
        : 0;
  const dy =
    point.y < rect.top
      ? rect.top - point.y
      : point.y > rect.bottom
        ? point.y - rect.bottom
        : 0;
  return Math.hypot(dx, dy);
};

const unionRects = (a: DOMRect, b: DOMRect): DOMRect =>
  new DOMRect(
    Math.min(a.left, b.left),
    Math.min(a.top, b.top),
    Math.max(a.right, b.right) - Math.min(a.left, b.left),
    Math.max(a.bottom, b.bottom) - Math.min(a.top, b.top)
  );

const getDropdownInteractionRect = (host: HTMLDivElement): DOMRect | null => {
  const toggle = host.querySelector<HTMLElement>(".dropdown-toggle");
  const menu = host.querySelector<HTMLElement>(".dropdown-menu.show");

  if (!toggle && !menu) return null;
  if (!menu && toggle) return toggle.getBoundingClientRect();
  if (!toggle && menu) return menu.getBoundingClientRect();

  return unionRects(
    toggle!.getBoundingClientRect(),
    menu!.getBoundingClientRect()
  );
};

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
  const { cursorSettings, setCursorSettings, resetCursorSettings } = useCursorLab();
  const { t } = useTranslation();
  const [showCustomThemeModal, setShowCustomThemeModal] = useState(false);
  const [isDesktopPointer, setIsDesktopPointer] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [customThemeDraft, setCustomThemeDraft] = useState<ThemePalette>(() =>
    normalizePalette(currentPalette)
  );
  const langDropdownHostRef = useRef<HTMLDivElement | null>(null);
  const themeDropdownHostRef = useRef<HTMLDivElement | null>(null);

  const currentThemeName = t(`mainpage.theme_names.${currentThemeNameKey}`, {
    defaultValue: currentThemeNameKey,
  });
  const currentThemeModeLabel = t(`mainpage.theme_modes.${theme}`, {
    defaultValue: theme,
  });
  const isCustomThemeActive = currentThemeNameKey === "custom";
  const cursorTrailOptions = useMemo(
    () =>
      CURSOR_TRAIL_TYPES.map((value) => ({
        value,
        label: t(`mainpage.cursor.trail_types.${value}`, { defaultValue: value }),
      })),
    [t],
  );

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

  const handleLanguageChange = (lang: "en" | "zh" | "jp") => {
    i18n.changeLanguage(lang);
    useLocalStorageStore
      .getState()
      .setLanguageCookie(lang);
    setShowLangDropdown(false);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setIsDesktopPointer(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (isDesktopPointer) return;
    setShowLangDropdown(false);
    setShowThemeDropdown(false);
  }, [isDesktopPointer]);

  useEffect(() => {
    if (!isDesktopPointer) return;
    if (!showLangDropdown && !showThemeDropdown) return;

    let rafId: number | null = null;
    const onMouseMove = (event: MouseEvent) => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        const point: Point = { x: event.clientX, y: event.clientY };

        if (showLangDropdown && langDropdownHostRef.current) {
          const rect = getDropdownInteractionRect(langDropdownHostRef.current);
          if (rect && getDistanceToRect(point, rect) > DESKTOP_DROPDOWN_CLOSE_DISTANCE) {
            setShowLangDropdown(false);
          }
        }

        if (showThemeDropdown && themeDropdownHostRef.current) {
          const rect = getDropdownInteractionRect(themeDropdownHostRef.current);
          if (rect && getDistanceToRect(point, rect) > DESKTOP_DROPDOWN_CLOSE_DISTANCE) {
            setShowThemeDropdown(false);
          }
        }
      });
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isDesktopPointer, showLangDropdown, showThemeDropdown]);

  return (
    <>
      <Navbar
        expand="lg"
        className="theme-header sticky-top"
        data-bs-theme={theme}
      >
        <Container className="theme-header-inner">
          <Navbar.Brand className="theme-header-brand" href="/">
            {t("mainpage.title")}
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse
            id="basic-navbar-nav"
            className="overflow-visible"
          >
            <Nav className="me-auto" />

            <Nav>
              <div ref={langDropdownHostRef}>
                <NavDropdown
                  title={t("lang")}
                  id="lang"
                  autoClose
                  className="theme-header-dropdown"
                  show={isDesktopPointer ? showLangDropdown : undefined}
                  onToggle={(nextShow) => {
                    if (!isDesktopPointer) return;
                    setShowLangDropdown(nextShow);
                    if (nextShow) setShowThemeDropdown(false);
                  }}
                >
                  <NavDropdown.Item
                    className="theme-header-item"
                    onClick={() => {
                      handleLanguageChange("en");
                    }}
                  >
                    English
                  </NavDropdown.Item>

                  <NavDropdown.Item
                    className="theme-header-item"
                    onClick={() => {
                      handleLanguageChange("zh");
                    }}
                  >
                    简体中文
                  </NavDropdown.Item>

                  <NavDropdown.Item
                    className="theme-header-item"
                    onClick={() => {
                      handleLanguageChange("jp");
                    }}
                  >
                    日本語
                  </NavDropdown.Item>
                </NavDropdown>
              </div>

              <div ref={themeDropdownHostRef}>
                <NavDropdown
                  title={t("mainpage.dropdown")}
                  id="theme-dropdown"
                  autoClose
                  align="end"
                  className="theme-header-dropdown theme-more-dropdown"
                  show={isDesktopPointer ? showThemeDropdown : undefined}
                  onToggle={(nextShow) => {
                    if (!isDesktopPointer) return;
                    setShowThemeDropdown(nextShow);
                    if (nextShow) setShowLangDropdown(false);
                  }}
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
                    {hasCustomTheme ? (
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={removeCustomThemePalette}
                      >
                        {t("mainpage.custom_theme.remove")}
                      </Button>
                    ) : null}
                  </div>

                  <NavDropdown.Divider />

                  <div
                    className="px-3 py-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className="rounded-3 p-2 border"
                      style={{
                        backgroundColor: currentPalette.backgroundColor2,
                        borderColor: currentPalette.borderColor,
                        boxShadow: `0 6px 16px -10px ${currentPalette.extraColor2}`,
                      }}
                    >
                      <div className="mb-2 d-flex align-items-center justify-content-between gap-2">
                        <div className="fw-semibold small">
                          {t("mainpage.cursor.title")}
                        </div>
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          onClick={() => resetCursorSettings()}
                          style={{
                            borderColor: currentPalette.borderColor,
                            color: currentPalette.color2,
                            backgroundColor: currentPalette.backgroundColor,
                          }}
                        >
                          {t("mainpage.cursor.reset")}
                        </Button>
                      </div>

                      <div className="d-flex flex-column gap-2">
                        <Form.Check
                          type="switch"
                          id="cursorlab-enable"
                          label={t("mainpage.cursor.enable")}
                          checked={cursorSettings.enabled}
                          onChange={(event) =>
                            setCursorSettings({ enabled: event.target.checked })
                          }
                        />
                        <Form.Check
                          type="switch"
                          id="cursorlab-click"
                          label={t("mainpage.cursor.click_effect")}
                          checked={cursorSettings.clickEffect}
                          disabled={!cursorSettings.enabled}
                          onChange={(event) =>
                            setCursorSettings({ clickEffect: event.target.checked })
                          }
                        />

                        <Form.Group>
                          <Form.Label className="small mb-1">
                            {t("mainpage.cursor.trail_shape")}
                          </Form.Label>
                          <Form.Select
                            size="sm"
                            value={cursorSettings.trailType}
                            disabled={!cursorSettings.enabled}
                            onChange={(event) =>
                              setCursorSettings({
                                trailType: event.target.value as (typeof CURSOR_TRAIL_TYPES)[number],
                              })
                            }
                            style={{
                              backgroundColor: currentPalette.backgroundColor,
                              color: currentPalette.color2,
                              borderColor: currentPalette.borderColor,
                            }}
                          >
                            {cursorTrailOptions.map((item) => (
                              <option key={item.value} value={item.value}>
                                {item.label}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>

                        <Form.Group>
                          <div className="d-flex justify-content-between small">
                            <span>{t("mainpage.cursor.size")}</span>
                            <span>{cursorSettings.size}px</span>
                          </div>
                          <Form.Range
                            min={8}
                            max={48}
                            step={1}
                            value={cursorSettings.size}
                            disabled={!cursorSettings.enabled}
                            onChange={(event) =>
                              setCursorSettings({
                                size: Number(event.target.value),
                              })
                            }
                          />
                        </Form.Group>

                        <Form.Group>
                          <div className="d-flex justify-content-between small">
                            <span>{t("mainpage.cursor.thickness")}</span>
                            <span>{cursorSettings.thickness}</span>
                          </div>
                          <Form.Range
                            min={1}
                            max={8}
                            step={1}
                            value={cursorSettings.thickness}
                            disabled={!cursorSettings.enabled}
                            onChange={(event) =>
                              setCursorSettings({
                                thickness: Number(event.target.value),
                              })
                            }
                          />
                        </Form.Group>

                        <Form.Group>
                          <div className="d-flex justify-content-between small">
                            <span>{t("mainpage.cursor.delay")}</span>
                            <span>{cursorSettings.delay.toFixed(2)}</span>
                          </div>
                          <Form.Range
                            min={0.02}
                            max={0.35}
                            step={0.01}
                            value={cursorSettings.delay}
                            disabled={!cursorSettings.enabled}
                            onChange={(event) =>
                              setCursorSettings({
                                delay: Number(event.target.value),
                              })
                            }
                          />
                        </Form.Group>
                      </div>
                    </div>
                  </div>

                  <NavDropdown.Divider />

                  <NavDropdown.Item className="theme-header-item" href="./About">
                    {t("mainpage.about")}
                  </NavDropdown.Item>

                  <NavDropdown.Item
                    className="theme-header-item"
                    href="https://github.com/MasaoMinn/MasaoMinn.github.io"
                    target="_blank"
                  >
                    {t("mainpage.seeme")}
                  </NavDropdown.Item>
                </NavDropdown>
              </div>
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
                  <span
                    className="w-[10rem] select-none"
                  >{customThemeDraft[key]}</span>
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

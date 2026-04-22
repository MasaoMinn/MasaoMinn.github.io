"use client";

import { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import MarkdownComponent from "@/components/boxed/MarkdownComponent";
import styles from "./profile.module.css";

type ProfileContentProps = {
  markdown: string;
  loadError: string | null;
};

type FloatingPosition = {
  x: number;
  y: number;
};

const FLOAT_SIZE = 86;
const FLOAT_MARGIN = 20;
const DRAG_THRESHOLD = 6;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export default function ProfileContent({ markdown, loadError }: ProfileContentProps) {
  const [showWechatModal, setShowWechatModal] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<FloatingPosition>({
    x: 0,
    y: 0,
  });

  const snappedSideRef = useRef<"left" | "right">("right");
  const pointerIdRef = useRef<number | null>(null);
  const dragStartRef = useRef({
    x: 0,
    y: 0,
    posX: 0,
    posY: 0,
  });
  const suppressClickRef = useRef(false);

  const clampPosition = (x: number, y: number): FloatingPosition => {
    const maxX = window.innerWidth - FLOAT_SIZE - FLOAT_MARGIN;
    const maxY = window.innerHeight - FLOAT_SIZE - FLOAT_MARGIN;
    return {
      x: clamp(x, FLOAT_MARGIN, Math.max(FLOAT_MARGIN, maxX)),
      y: clamp(y, FLOAT_MARGIN, Math.max(FLOAT_MARGIN, maxY)),
    };
  };

  const snapToSide = (x: number, y: number) => {
    const centerX = x + FLOAT_SIZE / 2;
    const useRight = centerX >= window.innerWidth / 2;
    const snappedX = useRight
      ? window.innerWidth - FLOAT_SIZE - FLOAT_MARGIN
      : FLOAT_MARGIN;

    snappedSideRef.current = useRight ? "right" : "left";
    setPosition(clampPosition(snappedX, y));
  };

  useEffect(() => {
    const initialX = window.innerWidth - FLOAT_SIZE - FLOAT_MARGIN;
    const initialY = window.innerHeight - FLOAT_SIZE - FLOAT_MARGIN;
    setPosition(clampPosition(initialX, initialY));
    snappedSideRef.current = "right";
    setIsReady(true);

    const handleResize = () => {
      setPosition((prev) => {
        const x =
          snappedSideRef.current === "right"
            ? window.innerWidth - FLOAT_SIZE - FLOAT_MARGIN
            : FLOAT_MARGIN;
        return clampPosition(x, prev.y);
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePointerDown: React.PointerEventHandler<HTMLButtonElement> = (event) => {
    pointerIdRef.current = event.pointerId;
    suppressClickRef.current = false;
    dragStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      posX: position.x,
      posY: position.y,
    };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove: React.PointerEventHandler<HTMLButtonElement> = (event) => {
    if (pointerIdRef.current !== event.pointerId || !isDragging) {
      return;
    }

    const deltaX = event.clientX - dragStartRef.current.x;
    const deltaY = event.clientY - dragStartRef.current.y;

    if (Math.abs(deltaX) > DRAG_THRESHOLD || Math.abs(deltaY) > DRAG_THRESHOLD) {
      suppressClickRef.current = true;
    }

    setPosition(
      clampPosition(
        dragStartRef.current.posX + deltaX,
        dragStartRef.current.posY + deltaY
      )
    );
  };

  const handlePointerUp: React.PointerEventHandler<HTMLButtonElement> = (event) => {
    if (pointerIdRef.current !== event.pointerId) {
      return;
    }

    pointerIdRef.current = null;
    setIsDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
    snapToSide(position.x, position.y);
  };

  const handleClick = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    setShowWechatModal(true);
  };

  return (
    <>
      <article className="theme-surface rounded-4 border p-3 p-md-4">
        {loadError ? (
          <p style={{ color: "var(--primary)" }}>{loadError}</p>
        ) : (
          <MarkdownComponent content={markdown} loadingText="Loading..." />
        )}
      </article>

      <button
        type="button"
        className={`${styles.hireMeButton}${isDragging ? ` ${styles.dragging}` : ""}`}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={
          isReady
            ? {
                left: `${position.x}px`,
                top: `${position.y}px`,
              }
            : undefined
        }
        aria-label="hire me"
      >
        hire me
      </button>

      <Modal
        centered
        show={showWechatModal}
        onHide={() => setShowWechatModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Wechat</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img
            src="/wechat.jpg"
            alt="Wechat QR Code"
            className={styles.wechatImage}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => setShowWechatModal(false)}
            style={{
              backgroundColor: "var(--theme-button-bg, var(--primary))",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import BootstrapButton from "react-bootstrap/Button";
import { Globe2, Images, KeyRound, Lock, RefreshCw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  pictureApi,
  type PictureAlbum,
  type PictureImage,
} from "@/lib/picture-api";
import styles from "./picture.module.css";

type UnlockState = {
  album: PictureAlbum;
  key: string;
  error: string;
  isSubmitting: boolean;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));

export default function PictureGalleryPage() {
  const [albums, setAlbums] = useState<PictureAlbum[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [images, setImages] = useState<PictureImage[]>([]);
  const [unlockTokens, setUnlockTokens] = useState<Record<string, string>>({});
  const [unlockState, setUnlockState] = useState<UnlockState | null>(null);
  const [isLoadingAlbums, setIsLoadingAlbums] = useState(true);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [error, setError] = useState("");

  const selectedAlbum = useMemo(
    () => albums.find((album) => album.id === selectedAlbumId) ?? null,
    [albums, selectedAlbumId],
  );

  const loadAlbums = useCallback(async () => {
    setIsLoadingAlbums(true);
    setError("");
    try {
      const nextAlbums = await pictureApi.listAlbums();
      setAlbums(nextAlbums);
      setSelectedAlbumId((current) => current ?? nextAlbums[0]?.id ?? null);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "相册加载失败。");
    } finally {
      setIsLoadingAlbums(false);
    }
  }, []);

  const loadImages = useCallback(
    async (album: PictureAlbum) => {
      if (album.visibility === "private" && !unlockTokens[album.id]) {
        setImages([]);
        setUnlockState({
          album,
          key: "",
          error: "",
          isSubmitting: false,
        });
        return;
      }

      setIsLoadingImages(true);
      setError("");
      try {
        const nextImages = await pictureApi.listImages(
          album.id,
          unlockTokens[album.id],
        );
        setImages(nextImages);
      } catch (nextError) {
        setImages([]);
        setError(nextError instanceof Error ? nextError.message : "图片加载失败。");
      } finally {
        setIsLoadingImages(false);
      }
    },
    [unlockTokens],
  );

  useEffect(() => {
    loadAlbums();
  }, [loadAlbums]);

  useEffect(() => {
    if (!selectedAlbum) {
      setImages([]);
      return;
    }

    loadImages(selectedAlbum);
  }, [loadImages, selectedAlbum]);

  const handleSelectAlbum = (album: PictureAlbum) => {
    setSelectedAlbumId(album.id);
    if (album.visibility === "private" && !unlockTokens[album.id]) {
      setUnlockState({
        album,
        key: "",
        error: "",
        isSubmitting: false,
      });
    }
  };

  const handleUnlock = async () => {
    if (!unlockState) return;
    setUnlockState((current) =>
      current ? { ...current, isSubmitting: true, error: "" } : current,
    );

    try {
      const token = await pictureApi.unlockAlbum(
        unlockState.album.id,
        unlockState.key,
      );
      if (!token) {
        throw new Error("该相册不需要解锁。");
      }

      setUnlockTokens((current) => ({
        ...current,
        [unlockState.album.id]: token,
      }));
      setSelectedAlbumId(unlockState.album.id);
      setUnlockState(null);
    } catch (nextError) {
      setUnlockState((current) =>
        current
          ? {
              ...current,
              isSubmitting: false,
              error:
                nextError instanceof Error ? nextError.message : "密钥验证失败。",
            }
          : current,
      );
    }
  };

  return (
    <main className={`${styles.page} theme-page`}>
      <section className={styles.hero}>
        <div>
          <h1 className={styles.title}>Picture</h1>
          <p className={styles.subtitle}>
            相册与照片展示。Public 相册直接开放，Private 相册需要密钥后查看。
          </p>
        </div>
        <div className={styles.heroActions}>
          <Button variant="outline" onClick={loadAlbums} disabled={isLoadingAlbums}>
            <RefreshCw aria-hidden="true" />
            刷新
          </Button>
          <Link className={styles.adminLink} href="/picture/admin">
            <Settings aria-hidden="true" />
            管理
          </Link>
        </div>
      </section>

      {error ? <div className={styles.error}>{error}</div> : null}

      <section className={styles.shell} aria-label="相册">
        <aside className={styles.albumRail}>
          <div className={styles.railHeader}>
            <div>
              <h2>相册</h2>
              <span>{albums.length} 个相册</span>
            </div>
          </div>

          {isLoadingAlbums ? (
            <p className={styles.emptyText}>正在加载相册...</p>
          ) : albums.length === 0 ? (
            <p className={styles.emptyText}>
              还没有相册。进入管理页添加第一个相册。
            </p>
          ) : (
            <div className={styles.albumList}>
              {albums.map((album) => {
                const isSelected = album.id === selectedAlbumId;
                const isPrivate = album.visibility === "private";
                return (
                  <button
                    className={`${styles.albumCard} ${
                      isSelected ? styles.albumCardActive : ""
                    }`}
                    key={album.id}
                    type="button"
                    onClick={() => handleSelectAlbum(album)}
                  >
                    <span className={styles.albumIcon}>
                      {isPrivate ? (
                        <Lock aria-hidden="true" />
                      ) : (
                        <Globe2 aria-hidden="true" />
                      )}
                    </span>
                    <span className={styles.albumMeta}>
                      <span className={styles.albumName}>{album.name}</span>
                      <span className={styles.albumDesc}>
                        {album.description || "暂无描述"}
                      </span>
                      <span className={styles.albumStats}>
                        {album.imageCount} 张图片 · {isPrivate ? "Private" : "Public"}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </aside>

        <div className={styles.galleryPanel}>
          {selectedAlbum ? (
            <div className={styles.galleryHeader}>
              <div>
                <h2>{selectedAlbum.name}</h2>
                <p>{selectedAlbum.description || "暂无相册描述"}</p>
              </div>
              <span className={styles.visibilityBadge}>
                {selectedAlbum.visibility === "private" ? (
                  <Lock aria-hidden="true" />
                ) : (
                  <Globe2 aria-hidden="true" />
                )}
                {selectedAlbum.visibility}
              </span>
            </div>
          ) : null}

          {!selectedAlbum ? (
            <div className={styles.emptyState}>
              <Images aria-hidden="true" />
              <p>选择一个相册查看图片。</p>
            </div>
          ) : selectedAlbum.visibility === "private" &&
            !unlockTokens[selectedAlbum.id] ? (
            <div className={styles.emptyState}>
              <KeyRound aria-hidden="true" />
              <p>这个相册是 Private。点击相册并输入密钥后查看。</p>
              <Button
                type="button"
                onClick={() =>
                  setUnlockState({
                    album: selectedAlbum,
                    key: "",
                    error: "",
                    isSubmitting: false,
                  })
                }
              >
                输入密钥
              </Button>
            </div>
          ) : isLoadingImages ? (
            <p className={styles.emptyText}>正在加载图片...</p>
          ) : images.length === 0 ? (
            <div className={styles.emptyState}>
              <Images aria-hidden="true" />
              <p>这个相册还没有图片。</p>
              <span>创建日期：{formatDate(selectedAlbum.createdAt)}</span>
            </div>
          ) : (
            <div className={styles.photoGrid}>
              {images.map((image) => (
                <figure className={styles.photoItem} key={image.id}>
                  <img
                    alt={image.description || selectedAlbum.name}
                    loading="lazy"
                    src={pictureApi.imageUrl(
                      image,
                      selectedAlbum.visibility === "private"
                        ? unlockTokens[selectedAlbum.id]
                        : undefined,
                    )}
                  />
                  <figcaption>
                    <span>{image.description || "暂无图片描述"}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>

      <Modal
        centered
        show={Boolean(unlockState)}
        onHide={() => setUnlockState(null)}
      >
        <Modal.Header closeButton>
          <Modal.Title>输入 Private 相册密钥</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={(event) => {
              event.preventDefault();
              handleUnlock();
            }}
          >
            <Form.Group controlId="picture-private-key">
              <Form.Label>{unlockState?.album.name}</Form.Label>
              <Form.Control
                autoFocus
                type="password"
                value={unlockState?.key ?? ""}
                onChange={(event) =>
                  setUnlockState((current) =>
                    current ? { ...current, key: event.target.value } : current,
                  )
                }
              />
            </Form.Group>
            {unlockState?.error ? (
              <p className={styles.modalError}>{unlockState.error}</p>
            ) : null}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <BootstrapButton variant="secondary" onClick={() => setUnlockState(null)}>
            取消
          </BootstrapButton>
          <BootstrapButton
            variant="dark"
            onClick={handleUnlock}
            disabled={!unlockState?.key || unlockState.isSubmitting}
          >
            解锁
          </BootstrapButton>
        </Modal.Footer>
      </Modal>
    </main>
  );
}

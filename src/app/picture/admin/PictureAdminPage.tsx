"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import Form from "react-bootstrap/Form";
import { ArrowLeft, ImagePlus, Lock, Plus, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  pictureApi,
  type AlbumVisibility,
  type PictureAlbum,
  type PictureImage,
} from "@/lib/picture-api";
import styles from "../picture.module.css";

const ADMIN_KEY_STORAGE_KEY = "picture-admin-key";

const formatFileSize = (size: number) => {
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
};

export default function PictureAdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [albums, setAlbums] = useState<PictureAlbum[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [images, setImages] = useState<PictureImage[]>([]);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [newAlbumDescription, setNewAlbumDescription] = useState("");
  const [newAlbumVisibility, setNewAlbumVisibility] =
    useState<AlbumVisibility>("public");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const selectedAlbum = useMemo(
    () => albums.find((album) => album.id === selectedAlbumId) ?? null,
    [albums, selectedAlbumId],
  );

  const requireAdminKey = () => {
    if (!adminKey.trim()) {
      throw new Error("请先输入管理密钥。");
    }
    return adminKey.trim();
  };

  const loadAlbums = useCallback(async () => {
    setError("");
    try {
      const nextAlbums = await pictureApi.listAlbums();
      setAlbums(nextAlbums);
      setSelectedAlbumId((current) => current ?? nextAlbums[0]?.id ?? null);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "相册加载失败。");
    }
  }, []);

  const loadImages = useCallback(async () => {
    if (!selectedAlbumId || !adminKey.trim()) {
      setImages([]);
      return;
    }

    setError("");
    try {
      const nextImages = await pictureApi.listImagesForAdmin(
        adminKey.trim(),
        selectedAlbumId,
      );
      setImages(nextImages);
    } catch (nextError) {
      setImages([]);
      setError(nextError instanceof Error ? nextError.message : "图片加载失败。");
    }
  }, [adminKey, selectedAlbumId]);

  useEffect(() => {
    setAdminKey(sessionStorage.getItem(ADMIN_KEY_STORAGE_KEY) ?? "");
    loadAlbums();
  }, [loadAlbums]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const handleAdminKeyChange = (value: string) => {
    setAdminKey(value);
    sessionStorage.setItem(ADMIN_KEY_STORAGE_KEY, value);
  };

  const runAction = async (action: () => Promise<void>) => {
    setIsBusy(true);
    setError("");
    setMessage("");
    try {
      await action();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "操作失败。");
    } finally {
      setIsBusy(false);
    }
  };

  const handleCreateAlbum = () =>
    runAction(async () => {
      const key = requireAdminKey();
      if (!newAlbumName.trim()) throw new Error("请输入相册名称。");
      const album = await pictureApi.createAlbum(key, {
        name: newAlbumName.trim(),
        description: newAlbumDescription.trim(),
        visibility: newAlbumVisibility,
      });
      setNewAlbumName("");
      setNewAlbumDescription("");
      setNewAlbumVisibility("public");
      setMessage(`已创建相册：${album.name}`);
      await loadAlbums();
      setSelectedAlbumId(album.id);
    });

  const handleDeleteAlbum = (album: PictureAlbum) =>
    runAction(async () => {
      const key = requireAdminKey();
      const confirmed = window.confirm(
        `确认删除相册「${album.name}」和其中所有图片吗？`,
      );
      if (!confirmed) return;
      await pictureApi.deleteAlbum(key, album.id);
      setMessage(`已删除相册：${album.name}`);
      setSelectedAlbumId(null);
      setImages([]);
      await loadAlbums();
    });

  const handleUploadImage = () =>
    runAction(async () => {
      const key = requireAdminKey();
      if (!selectedAlbum) throw new Error("请先选择相册。");
      if (!uploadFile) throw new Error("请选择要上传的图片。");
      await pictureApi.uploadImage(
        key,
        selectedAlbum.id,
        uploadFile,
        uploadDescription.trim(),
      );
      setUploadDescription("");
      setUploadFile(null);
      setMessage("图片已上传。");
      await loadAlbums();
      await loadImages();
    });

  const handleDeleteImage = (image: PictureImage) =>
    runAction(async () => {
      const key = requireAdminKey();
      const confirmed = window.confirm("确认删除这张图片吗？");
      if (!confirmed) return;
      await pictureApi.deleteImage(key, image.id);
      setMessage("图片已删除。");
      await loadAlbums();
      await loadImages();
    });

  return (
    <main className={`${styles.page} theme-page`}>
      <div className={styles.adminPage}>
        <section className={styles.hero}>
          <div>
            <h1 className={styles.title}>Picture Admin</h1>
            <p className={styles.subtitle}>
              管理相册和图片。管理密钥只保存在当前浏览器 sessionStorage，不会写入源码。
            </p>
          </div>
          <div className={styles.heroActions}>
            <Link className={styles.adminLink} href="/picture">
              <ArrowLeft aria-hidden="true" />
              返回展示页
            </Link>
            <Button type="button" variant="outline" onClick={loadAlbums}>
              <RefreshCw aria-hidden="true" />
              刷新
            </Button>
          </div>
        </section>

        {error ? <div className={styles.error}>{error}</div> : null}
        {message ? <div className={styles.success}>{message}</div> : null}

        <section className={styles.adminGrid}>
          <aside className={styles.adminPanel}>
            <div className={styles.adminHeader}>
              <div>
                <h2>访问控制</h2>
                <p className={styles.adminHint}>写操作需要 Cloudflare Secret 中的管理密钥。</p>
              </div>
              <Lock aria-hidden="true" />
            </div>

            <div className={styles.adminStack}>
              <Form.Group controlId="picture-admin-key">
                <Form.Label>管理密钥</Form.Label>
                <Form.Control
                  type="password"
                  value={adminKey}
                  onChange={(event) => handleAdminKeyChange(event.target.value)}
                  placeholder="输入管理密钥"
                />
              </Form.Group>

              <hr />

              <Form
                onSubmit={(event) => {
                  event.preventDefault();
                  handleCreateAlbum();
                }}
              >
                <div className={styles.adminHeader}>
                  <div>
                    <h2>添加相册</h2>
                    <p className={styles.adminHint}>相册包含名称、描述和 public/private 类型。</p>
                  </div>
                  <Plus aria-hidden="true" />
                </div>

                <Form.Group controlId="picture-album-name">
                  <Form.Label>名称</Form.Label>
                  <Form.Control
                    value={newAlbumName}
                    onChange={(event) => setNewAlbumName(event.target.value)}
                    placeholder="例如：旅行照片"
                  />
                </Form.Group>

                <Form.Group controlId="picture-album-description">
                  <Form.Label>描述</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newAlbumDescription}
                    onChange={(event) => setNewAlbumDescription(event.target.value)}
                    placeholder="写一点相册说明"
                  />
                </Form.Group>

                <Form.Group controlId="picture-album-visibility">
                  <Form.Label>类型</Form.Label>
                  <Form.Select
                    value={newAlbumVisibility}
                    onChange={(event) =>
                      setNewAlbumVisibility(event.target.value as AlbumVisibility)
                    }
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </Form.Select>
                </Form.Group>

                <Button type="submit" disabled={isBusy}>
                  <Plus aria-hidden="true" />
                  添加相册
                </Button>
              </Form>
            </div>
          </aside>

          <div className={styles.adminPanel}>
            <div className={styles.adminToolbar}>
              <div>
                <h2>相册内容</h2>
                <p className={styles.adminHint}>
                  选择相册后上传图片、查看图片记录或删除内容。
                </p>
              </div>
            </div>

            <div className={styles.albumList}>
              {albums.map((album) => (
                <button
                  className={`${styles.albumCard} ${
                    album.id === selectedAlbumId ? styles.albumCardActive : ""
                  }`}
                  key={album.id}
                  type="button"
                  onClick={() => setSelectedAlbumId(album.id)}
                >
                  <span className={styles.albumMeta}>
                    <span className={styles.albumName}>{album.name}</span>
                    <span className={styles.albumDesc}>
                      {album.description || "暂无描述"}
                    </span>
                    <span className={styles.albumStats}>
                      {album.imageCount} 张图片 · {album.visibility}
                    </span>
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDeleteAlbum(album);
                    }}
                    disabled={isBusy}
                  >
                    <Trash2 aria-hidden="true" />
                    删除
                  </Button>
                </button>
              ))}
            </div>

            {selectedAlbum ? (
              <div className={styles.adminStack}>
                <hr />
                <Form
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleUploadImage();
                  }}
                >
                  <div className={styles.adminHeader}>
                    <div>
                      <h2>向「{selectedAlbum.name}」添加图片</h2>
                      <p className={styles.adminHint}>
                        单张图片最大 20 MB，图片描述会在展示页 hover/focus 时显示。
                      </p>
                    </div>
                    <ImagePlus aria-hidden="true" />
                  </div>

                  <Form.Group controlId="picture-upload-file">
                    <Form.Label>图片</Form.Label>
                    <Form.Control
                      accept="image/*"
                      type="file"
                      onChange={(event) => {
                        const input = event.currentTarget as HTMLInputElement;
                        setUploadFile(input.files?.[0] ?? null);
                      }}
                    />
                  </Form.Group>

                  <Form.Group controlId="picture-upload-description">
                    <Form.Label>图片描述</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={uploadDescription}
                      onChange={(event) => setUploadDescription(event.target.value)}
                      placeholder="这张图片的说明"
                    />
                  </Form.Group>

                  <Button type="submit" disabled={isBusy || !uploadFile}>
                    <ImagePlus aria-hidden="true" />
                    上传图片
                  </Button>
                </Form>

                <div className={styles.adminStack}>
                  <h2>图片列表</h2>
                  {!adminKey.trim() ? (
                    <p className={styles.emptyText}>输入管理密钥后加载图片记录。</p>
                  ) : images.length === 0 ? (
                    <p className={styles.emptyText}>该相册暂无图片。</p>
                  ) : (
                    images.map((image) => (
                      <div className={styles.imageRow} key={image.id}>
                        {selectedAlbum.visibility === "public" ? (
                          <img
                            alt={image.description || selectedAlbum.name}
                            src={pictureApi.imageUrl(image)}
                          />
                        ) : (
                          <div className={styles.privateThumb}>
                            <Lock aria-hidden="true" />
                          </div>
                        )}
                        <div>
                          <p>{image.description || "暂无图片描述"}</p>
                          <span className={styles.smallMeta}>
                            {image.contentType} · {formatFileSize(image.size)}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteImage(image)}
                          disabled={isBusy}
                        >
                          <Trash2 aria-hidden="true" />
                          删除
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <p className={styles.emptyText}>请选择一个相册。</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

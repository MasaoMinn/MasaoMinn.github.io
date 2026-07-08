export type AlbumVisibility = "public" | "private";

export type PictureAlbum = {
  id: string;
  name: string;
  description: string;
  visibility: AlbumVisibility;
  imageCount: number;
  createdAt: string;
  updatedAt: string;
};

export type PictureImage = {
  id: string;
  albumId: string;
  description: string;
  contentType: string;
  size: number;
  createdAt: string;
  url: string;
};

export type CreateAlbumInput = {
  name: string;
  description: string;
  visibility: AlbumVisibility;
};

const DEFAULT_API_BASE_URL = "/api/picture";

export const pictureApiBaseUrl = (
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_PICTURE_API_BASE_URL || DEFAULT_API_BASE_URL
    : DEFAULT_API_BASE_URL
).replace(/\/+$/, "");

type ApiErrorBody = {
  error?: string;
};

const parseJson = async <T>(response: Response): Promise<T> => {
  const text = await response.text();
  if (!text) return {} as T;
  return JSON.parse(text) as T;
};

const requestJson = async <T>(
  path: string,
  init: RequestInit = {},
): Promise<T> => {
  const response = await fetch(`${pictureApiBaseUrl}${path}`, {
    ...init,
    headers: {
      ...(init.body instanceof FormData
        ? {}
        : { "content-type": "application/json" }),
      ...init.headers,
    },
  });

  if (!response.ok) {
    const body: ApiErrorBody = await parseJson<ApiErrorBody>(response).catch(
      () => ({}),
    );
    throw new Error(body.error || `Picture API request failed: ${response.status}`);
  }

  return parseJson<T>(response);
};

const authHeaders = (adminKey: string): HeadersInit => ({
  "x-admin-key": adminKey,
});

const albumTokenHeaders = (token?: string): HeadersInit =>
  token ? { authorization: `Bearer ${token}` } : {};

export const pictureApi = {
  async listAlbums(): Promise<PictureAlbum[]> {
    const body = await requestJson<{ albums: PictureAlbum[] }>("/albums");
    return body.albums;
  },

  async listImages(albumId: string, token?: string): Promise<PictureImage[]> {
    const body = await requestJson<{ images: PictureImage[] }>(
      `/albums/${albumId}/images`,
      { headers: albumTokenHeaders(token) },
    );
    return body.images;
  },

  async listImagesForAdmin(
    adminKey: string,
    albumId: string,
  ): Promise<PictureImage[]> {
    const body = await requestJson<{ images: PictureImage[] }>(
      `/albums/${albumId}/images`,
      { headers: authHeaders(adminKey) },
    );
    return body.images;
  },

  async unlockAlbum(albumId: string, key: string): Promise<string | null> {
    const body = await requestJson<{ token: string | null }>(
      `/albums/${albumId}/unlock`,
      {
        method: "POST",
        body: JSON.stringify({ key }),
      },
    );
    return body.token;
  },

  async createAlbum(
    adminKey: string,
    input: CreateAlbumInput,
  ): Promise<PictureAlbum> {
    const body = await requestJson<{ album: PictureAlbum }>("/albums", {
      method: "POST",
      headers: authHeaders(adminKey),
      body: JSON.stringify(input),
    });
    return body.album;
  },

  async deleteAlbum(adminKey: string, albumId: string): Promise<void> {
    await requestJson<{ ok: boolean }>(`/albums/${albumId}`, {
      method: "DELETE",
      headers: authHeaders(adminKey),
    });
  },

  async uploadImage(
    adminKey: string,
    albumId: string,
    file: File,
    description: string,
  ): Promise<PictureImage> {
    const formData = new FormData();
    formData.set("file", file);
    formData.set("description", description);

    const body = await requestJson<{ image: PictureImage }>(
      `/albums/${albumId}/images`,
      {
        method: "POST",
        headers: authHeaders(adminKey),
        body: formData,
      },
    );
    return body.image;
  },

  async deleteImage(adminKey: string, imageId: string): Promise<void> {
    await requestJson<{ ok: boolean }>(`/images/${imageId}`, {
      method: "DELETE",
      headers: authHeaders(adminKey),
    });
  },

  imageUrl(image: PictureImage, token?: string): string {
    if (!token) return image.url;
    const url = new URL(image.url);
    url.searchParams.set("token", token);
    return url.toString();
  },
};

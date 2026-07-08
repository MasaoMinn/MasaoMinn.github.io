type AlbumVisibility = "public" | "private";

type Env = {
  PICTURE_DB: D1Database;
  PICTURE_BUCKET: R2Bucket;
  ASSETS: Fetcher;
  PRIVATE_ALBUM_KEY: string;
  ADMIN_ALBUM_KEY: string;
  UNLOCK_TOKEN_SECRET: string;
  CORS_ORIGINS?: string;
  UNLOCK_TOKEN_TTL_SECONDS?: string;
};

type D1Database = {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
};

type D1PreparedStatement = {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  all<T = unknown>(): Promise<D1Result<T>>;
  run<T = unknown>(): Promise<D1Result<T>>;
};

type D1Result<T = unknown> = {
  results?: T[];
  success: boolean;
  meta?: Record<string, unknown>;
};

type R2Bucket = {
  get(key: string): Promise<R2ObjectBody | null>;
  put(
    key: string,
    value: ReadableStream | ArrayBuffer | ArrayBufferView | string | Blob,
    options?: { httpMetadata?: { contentType?: string } },
  ): Promise<unknown>;
  delete(keys: string | string[]): Promise<void>;
};

type R2ObjectBody = {
  body: ReadableStream;
  httpMetadata?: { contentType?: string };
  size?: number;
  uploaded?: Date;
};

type Fetcher = {
  fetch(request: Request): Promise<Response>;
};

type AlbumRow = {
  id: string;
  name: string;
  description: string;
  visibility: AlbumVisibility;
  created_at: string;
  updated_at: string;
  image_count?: number;
};

type ImageRow = {
  id: string;
  album_id: string;
  object_key: string;
  description: string;
  content_type: string;
  size: number;
  created_at: string;
  album_visibility?: AlbumVisibility;
};

const DEFAULT_CORS_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:8787",
  "https://masaominn.github.io",
];

const API_PREFIX = "/api/picture";
const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const textEncoder = new TextEncoder();

const json = (
  body: unknown,
  status: number,
  request: Request,
  env: Env,
): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...corsHeaders(request, env),
    },
  });

const corsHeaders = (request: Request, env: Env): Record<string, string> => {
  const origin = request.headers.get("origin");
  const allowed = (env.CORS_ORIGINS?.split(",") ?? DEFAULT_CORS_ORIGINS)
    .map((item) => item.trim())
    .filter(Boolean);
  const allowOrigin = origin && allowed.includes(origin) ? origin : allowed[0];

  return {
    "access-control-allow-origin": allowOrigin,
    "access-control-allow-methods": "GET,POST,DELETE,OPTIONS",
    "access-control-allow-headers":
      "content-type,authorization,x-admin-key,x-album-token",
    "access-control-max-age": "86400",
    vary: "Origin",
  };
};

const readJson = async <T>(request: Request): Promise<T> => {
  try {
    return (await request.json()) as T;
  } catch {
    throw new ApiError(400, "Invalid JSON body.");
  }
};

const assertAdmin = (request: Request, env: Env) => {
  const supplied = request.headers.get("x-admin-key");
  if (!env.ADMIN_ALBUM_KEY || supplied !== env.ADMIN_ALBUM_KEY) {
    throw new ApiError(401, "Admin key is required.");
  }
};

const getAlbum = async (env: Env, albumId: string): Promise<AlbumRow> => {
  const album = await env.PICTURE_DB.prepare(
    "SELECT id, name, description, visibility, created_at, updated_at FROM albums WHERE id = ?",
  )
    .bind(albumId)
    .first<AlbumRow>();

  if (!album) {
    throw new ApiError(404, "Album not found.");
  }

  return album;
};

const toAlbumPayload = (album: AlbumRow) => ({
  id: album.id,
  name: album.name,
  description: album.description,
  visibility: album.visibility,
  imageCount: Number(album.image_count ?? 0),
  createdAt: album.created_at,
  updatedAt: album.updated_at,
});

const toImagePayload = (image: ImageRow, request: Request) => ({
  id: image.id,
  albumId: image.album_id,
  description: image.description,
  contentType: image.content_type,
  size: image.size,
  createdAt: image.created_at,
  url: new URL(`${API_PREFIX}/images/${image.id}/blob`, request.url).toString(),
});

const base64Url = (bytes: Uint8Array): string => {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
};

const unbase64Url = (value: string): ArrayBuffer => {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(
    Math.ceil(value.length / 4) * 4,
    "=",
  );
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes.buffer;
};

const signingKey = (env: Env) =>
  crypto.subtle.importKey(
    "raw",
    textEncoder.encode(env.UNLOCK_TOKEN_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );

const createUnlockToken = async (env: Env, albumId: string): Promise<string> => {
  if (!env.UNLOCK_TOKEN_SECRET) {
    throw new ApiError(500, "Unlock token secret is not configured.");
  }

  const ttl = Number(env.UNLOCK_TOKEN_TTL_SECONDS ?? 1800);
  const payload = {
    albumId,
    exp: Math.floor(Date.now() / 1000) + (Number.isFinite(ttl) ? ttl : 1800),
  };
  const encodedPayload = base64Url(textEncoder.encode(JSON.stringify(payload)));
  const signature = await crypto.subtle.sign(
    "HMAC",
    await signingKey(env),
    textEncoder.encode(encodedPayload),
  );

  return `${encodedPayload}.${base64Url(new Uint8Array(signature))}`;
};

const verifyUnlockToken = async (
  env: Env,
  albumId: string,
  token: string | null,
): Promise<boolean> => {
  if (!token || !env.UNLOCK_TOKEN_SECRET) return false;
  const [encodedPayload, encodedSignature] = token.split(".");
  if (!encodedPayload || !encodedSignature) return false;

  const isValid = await crypto.subtle.verify(
    "HMAC",
    await signingKey(env),
    unbase64Url(encodedSignature),
    textEncoder.encode(encodedPayload),
  );
  if (!isValid) return false;

  try {
    const payload = JSON.parse(
      new TextDecoder().decode(unbase64Url(encodedPayload)),
    ) as { albumId?: string; exp?: number };

    return (
      payload.albumId === albumId &&
      typeof payload.exp === "number" &&
      payload.exp > Math.floor(Date.now() / 1000)
    );
  } catch {
    return false;
  }
};

const getUnlockToken = (request: Request): string | null => {
  const tokenParam = new URL(request.url).searchParams.get("token");
  if (tokenParam) return tokenParam;

  const authorization = request.headers.get("authorization");
  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice("Bearer ".length);
  }

  return request.headers.get("x-album-token");
};

const assertAlbumReadable = async (
  request: Request,
  env: Env,
  album: AlbumRow,
) => {
  if (album.visibility === "public") return;
  if (request.headers.get("x-admin-key") === env.ADMIN_ALBUM_KEY) return;
  const token = getUnlockToken(request);
  const isUnlocked = await verifyUnlockToken(env, album.id, token);
  if (!isUnlocked) {
    throw new ApiError(403, "This private album is locked.");
  }
};

const sanitizeFileName = (name: string): string => {
  const sanitized = name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return sanitized || "image";
};

const listAlbums = async (request: Request, env: Env) => {
  const rows = await env.PICTURE_DB.prepare(
    `SELECT
      albums.id,
      albums.name,
      albums.description,
      albums.visibility,
      albums.created_at,
      albums.updated_at,
      COUNT(images.id) AS image_count
    FROM albums
    LEFT JOIN images ON images.album_id = albums.id
    GROUP BY albums.id
    ORDER BY albums.created_at DESC`,
  ).all<AlbumRow>();

  return json({ albums: (rows.results ?? []).map(toAlbumPayload) }, 200, request, env);
};

const createAlbum = async (request: Request, env: Env) => {
  assertAdmin(request, env);
  const body = await readJson<{
    name?: string;
    description?: string;
    visibility?: AlbumVisibility;
  }>(request);

  const name = body.name?.trim();
  const description = body.description?.trim() ?? "";
  const visibility = body.visibility;

  if (!name) throw new ApiError(400, "Album name is required.");
  if (visibility !== "public" && visibility !== "private") {
    throw new ApiError(400, "Album visibility must be public or private.");
  }

  const id = crypto.randomUUID();
  await env.PICTURE_DB.prepare(
    `INSERT INTO albums (id, name, description, visibility, created_at, updated_at)
     VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
  )
    .bind(id, name, description, visibility)
    .run();

  const album = await getAlbum(env, id);
  return json({ album: toAlbumPayload(album) }, 201, request, env);
};

const deleteAlbum = async (request: Request, env: Env, albumId: string) => {
  assertAdmin(request, env);
  await getAlbum(env, albumId);

  const imageRows = await env.PICTURE_DB.prepare(
    "SELECT object_key FROM images WHERE album_id = ?",
  )
    .bind(albumId)
    .all<{ object_key: string }>();

  const objectKeys = (imageRows.results ?? []).map((row) => row.object_key);
  if (objectKeys.length > 0) {
    await env.PICTURE_BUCKET.delete(objectKeys);
  }

  await env.PICTURE_DB.prepare("DELETE FROM albums WHERE id = ?")
    .bind(albumId)
    .run();

  return json({ ok: true }, 200, request, env);
};

const listImages = async (request: Request, env: Env, albumId: string) => {
  const album = await getAlbum(env, albumId);
  await assertAlbumReadable(request, env, album);

  const rows = await env.PICTURE_DB.prepare(
    `SELECT id, album_id, object_key, description, content_type, size, created_at
     FROM images
     WHERE album_id = ?
     ORDER BY created_at DESC`,
  )
    .bind(albumId)
    .all<ImageRow>();

  return json(
    {
      album: toAlbumPayload(album),
      images: (rows.results ?? []).map((image) => toImagePayload(image, request)),
    },
    200,
    request,
    env,
  );
};

const uploadImage = async (request: Request, env: Env, albumId: string) => {
  assertAdmin(request, env);
  await getAlbum(env, albumId);

  const formData = await request.formData();
  const file = formData.get("file");
  const description = String(formData.get("description") ?? "").trim();

  if (!(file instanceof File)) {
    throw new ApiError(400, "Image file is required.");
  }
  if (!file.type.startsWith("image/")) {
    throw new ApiError(400, "Only image uploads are supported.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new ApiError(400, "Image must be 20 MB or smaller.");
  }

  const id = crypto.randomUUID();
  const objectKey = `albums/${albumId}/${id}-${sanitizeFileName(file.name)}`;

  await env.PICTURE_BUCKET.put(objectKey, file, {
    httpMetadata: { contentType: file.type || "application/octet-stream" },
  });

  await env.PICTURE_DB.prepare(
    `INSERT INTO images (id, album_id, object_key, description, content_type, size, created_at)
     VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
  )
    .bind(
      id,
      albumId,
      objectKey,
      description,
      file.type || "application/octet-stream",
      file.size,
    )
    .run();

  const image = await env.PICTURE_DB.prepare(
    `SELECT id, album_id, object_key, description, content_type, size, created_at
     FROM images WHERE id = ?`,
  )
    .bind(id)
    .first<ImageRow>();

  return json({ image: toImagePayload(image!, request) }, 201, request, env);
};

const deleteImage = async (request: Request, env: Env, imageId: string) => {
  assertAdmin(request, env);
  const image = await env.PICTURE_DB.prepare(
    "SELECT id, object_key FROM images WHERE id = ?",
  )
    .bind(imageId)
    .first<Pick<ImageRow, "id" | "object_key">>();

  if (!image) throw new ApiError(404, "Image not found.");

  await env.PICTURE_BUCKET.delete(image.object_key);
  await env.PICTURE_DB.prepare("DELETE FROM images WHERE id = ?")
    .bind(imageId)
    .run();

  return json({ ok: true }, 200, request, env);
};

const unlockAlbum = async (request: Request, env: Env, albumId: string) => {
  const album = await getAlbum(env, albumId);
  const body = await readJson<{ key?: string }>(request);

  if (album.visibility !== "private") {
    return json({ token: null, album: toAlbumPayload(album) }, 200, request, env);
  }

  if (!env.PRIVATE_ALBUM_KEY || body.key !== env.PRIVATE_ALBUM_KEY) {
    throw new ApiError(401, "Private album key is invalid.");
  }

  return json(
    {
      token: await createUnlockToken(env, albumId),
      album: toAlbumPayload(album),
    },
    200,
    request,
    env,
  );
};

const getImageBlob = async (request: Request, env: Env, imageId: string) => {
  const image = await env.PICTURE_DB.prepare(
    `SELECT
      images.id,
      images.album_id,
      images.object_key,
      images.description,
      images.content_type,
      images.size,
      images.created_at,
      albums.visibility AS album_visibility
    FROM images
    INNER JOIN albums ON albums.id = images.album_id
    WHERE images.id = ?`,
  )
    .bind(imageId)
    .first<ImageRow>();

  if (!image) throw new ApiError(404, "Image not found.");

  await assertAlbumReadable(request, env, {
    id: image.album_id,
    name: "",
    description: "",
    visibility: image.album_visibility ?? "private",
    created_at: "",
    updated_at: "",
  });

  const object = await env.PICTURE_BUCKET.get(image.object_key);
  if (!object) throw new ApiError(404, "Image object not found.");

  return new Response(object.body, {
    headers: {
      "content-type":
        object.httpMetadata?.contentType ||
        image.content_type ||
        "application/octet-stream",
      "cache-control":
        image.album_visibility === "public"
          ? "public, max-age=300"
          : "private, no-store",
      ...corsHeaders(request, env),
    },
  });
};

const route = async (request: Request, env: Env): Promise<Response> => {
  const url = new URL(request.url);
  const isPictureApi =
    url.pathname === API_PREFIX || url.pathname.startsWith(`${API_PREFIX}/`);

  if (!isPictureApi) {
    return env.ASSETS.fetch(request);
  }

  const apiPathname = url.pathname.slice(API_PREFIX.length) || "/";
  const segments = apiPathname.split("/").filter(Boolean);

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(request, env) });
  }

  if (segments.length === 0) {
    return json({ ok: true, service: "picture-api" }, 200, request, env);
  }

  if (segments[0] === "albums" && segments.length === 1) {
    if (request.method === "GET") return listAlbums(request, env);
    if (request.method === "POST") return createAlbum(request, env);
  }

  if (segments[0] === "albums" && segments.length === 2) {
    if (request.method === "DELETE") return deleteAlbum(request, env, segments[1]);
  }

  if (segments[0] === "albums" && segments[2] === "images") {
    if (request.method === "GET") return listImages(request, env, segments[1]);
    if (request.method === "POST") return uploadImage(request, env, segments[1]);
  }

  if (segments[0] === "albums" && segments[2] === "unlock") {
    if (request.method === "POST") return unlockAlbum(request, env, segments[1]);
  }

  if (segments[0] === "images" && segments.length === 2) {
    if (request.method === "DELETE") return deleteImage(request, env, segments[1]);
  }

  if (segments[0] === "images" && segments[2] === "blob") {
    if (request.method === "GET") return getImageBlob(request, env, segments[1]);
  }

  throw new ApiError(404, "Route not found.");
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      return await route(request, env);
    } catch (error) {
      if (error instanceof ApiError) {
        return json({ error: error.message }, error.status, request, env);
      }

      console.error(error);
      return json({ error: "Unexpected server error." }, 500, request, env);
    }
  },
};

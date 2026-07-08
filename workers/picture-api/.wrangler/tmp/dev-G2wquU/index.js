var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/index.ts
var DEFAULT_CORS_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:8787",
  "https://masaominn.github.io"
];
var API_PREFIX = "/api/picture";
var MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
var ApiError = class extends Error {
  static {
    __name(this, "ApiError");
  }
  constructor(status, message) {
    super(message);
    this.status = status;
  }
};
var textEncoder = new TextEncoder();
var json = /* @__PURE__ */ __name((body, status, request, env) => new Response(JSON.stringify(body), {
  status,
  headers: {
    "content-type": "application/json; charset=utf-8",
    ...corsHeaders(request, env)
  }
}), "json");
var corsHeaders = /* @__PURE__ */ __name((request, env) => {
  const origin = request.headers.get("origin");
  const allowed = (env.CORS_ORIGINS?.split(",") ?? DEFAULT_CORS_ORIGINS).map((item) => item.trim()).filter(Boolean);
  const allowOrigin = origin && allowed.includes(origin) ? origin : allowed[0];
  return {
    "access-control-allow-origin": allowOrigin,
    "access-control-allow-methods": "GET,POST,DELETE,OPTIONS",
    "access-control-allow-headers": "content-type,authorization,x-admin-key,x-album-token",
    "access-control-max-age": "86400",
    vary: "Origin"
  };
}, "corsHeaders");
var readJson = /* @__PURE__ */ __name(async (request) => {
  try {
    return await request.json();
  } catch {
    throw new ApiError(400, "Invalid JSON body.");
  }
}, "readJson");
var assertAdmin = /* @__PURE__ */ __name((request, env) => {
  const supplied = request.headers.get("x-admin-key");
  if (!env.ADMIN_ALBUM_KEY || supplied !== env.ADMIN_ALBUM_KEY) {
    throw new ApiError(401, "Admin key is required.");
  }
}, "assertAdmin");
var getAlbum = /* @__PURE__ */ __name(async (env, albumId) => {
  const album = await env.PICTURE_DB.prepare(
    "SELECT id, name, description, visibility, created_at, updated_at FROM albums WHERE id = ?"
  ).bind(albumId).first();
  if (!album) {
    throw new ApiError(404, "Album not found.");
  }
  return album;
}, "getAlbum");
var toAlbumPayload = /* @__PURE__ */ __name((album) => ({
  id: album.id,
  name: album.name,
  description: album.description,
  visibility: album.visibility,
  imageCount: Number(album.image_count ?? 0),
  createdAt: album.created_at,
  updatedAt: album.updated_at
}), "toAlbumPayload");
var toImagePayload = /* @__PURE__ */ __name((image, request) => ({
  id: image.id,
  albumId: image.album_id,
  description: image.description,
  contentType: image.content_type,
  size: image.size,
  createdAt: image.created_at,
  url: new URL(`${API_PREFIX}/images/${image.id}/blob`, request.url).toString()
}), "toImagePayload");
var base64Url = /* @__PURE__ */ __name((bytes) => {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}, "base64Url");
var unbase64Url = /* @__PURE__ */ __name((value) => {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(
    Math.ceil(value.length / 4) * 4,
    "="
  );
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes.buffer;
}, "unbase64Url");
var signingKey = /* @__PURE__ */ __name((env) => crypto.subtle.importKey(
  "raw",
  textEncoder.encode(env.UNLOCK_TOKEN_SECRET),
  { name: "HMAC", hash: "SHA-256" },
  false,
  ["sign", "verify"]
), "signingKey");
var createUnlockToken = /* @__PURE__ */ __name(async (env, albumId) => {
  if (!env.UNLOCK_TOKEN_SECRET) {
    throw new ApiError(500, "Unlock token secret is not configured.");
  }
  const ttl = Number(env.UNLOCK_TOKEN_TTL_SECONDS ?? 1800);
  const payload = {
    albumId,
    exp: Math.floor(Date.now() / 1e3) + (Number.isFinite(ttl) ? ttl : 1800)
  };
  const encodedPayload = base64Url(textEncoder.encode(JSON.stringify(payload)));
  const signature = await crypto.subtle.sign(
    "HMAC",
    await signingKey(env),
    textEncoder.encode(encodedPayload)
  );
  return `${encodedPayload}.${base64Url(new Uint8Array(signature))}`;
}, "createUnlockToken");
var verifyUnlockToken = /* @__PURE__ */ __name(async (env, albumId, token) => {
  if (!token || !env.UNLOCK_TOKEN_SECRET) return false;
  const [encodedPayload, encodedSignature] = token.split(".");
  if (!encodedPayload || !encodedSignature) return false;
  const isValid = await crypto.subtle.verify(
    "HMAC",
    await signingKey(env),
    unbase64Url(encodedSignature),
    textEncoder.encode(encodedPayload)
  );
  if (!isValid) return false;
  try {
    const payload = JSON.parse(
      new TextDecoder().decode(unbase64Url(encodedPayload))
    );
    return payload.albumId === albumId && typeof payload.exp === "number" && payload.exp > Math.floor(Date.now() / 1e3);
  } catch {
    return false;
  }
}, "verifyUnlockToken");
var getUnlockToken = /* @__PURE__ */ __name((request) => {
  const tokenParam = new URL(request.url).searchParams.get("token");
  if (tokenParam) return tokenParam;
  const authorization = request.headers.get("authorization");
  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice("Bearer ".length);
  }
  return request.headers.get("x-album-token");
}, "getUnlockToken");
var assertAlbumReadable = /* @__PURE__ */ __name(async (request, env, album) => {
  if (album.visibility === "public") return;
  if (request.headers.get("x-admin-key") === env.ADMIN_ALBUM_KEY) return;
  const token = getUnlockToken(request);
  const isUnlocked = await verifyUnlockToken(env, album.id, token);
  if (!isUnlocked) {
    throw new ApiError(403, "This private album is locked.");
  }
}, "assertAlbumReadable");
var sanitizeFileName = /* @__PURE__ */ __name((name) => {
  const sanitized = name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
  return sanitized || "image";
}, "sanitizeFileName");
var listAlbums = /* @__PURE__ */ __name(async (request, env) => {
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
    ORDER BY albums.created_at DESC`
  ).all();
  return json({ albums: (rows.results ?? []).map(toAlbumPayload) }, 200, request, env);
}, "listAlbums");
var createAlbum = /* @__PURE__ */ __name(async (request, env) => {
  assertAdmin(request, env);
  const body = await readJson(request);
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
     VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
  ).bind(id, name, description, visibility).run();
  const album = await getAlbum(env, id);
  return json({ album: toAlbumPayload(album) }, 201, request, env);
}, "createAlbum");
var deleteAlbum = /* @__PURE__ */ __name(async (request, env, albumId) => {
  assertAdmin(request, env);
  await getAlbum(env, albumId);
  const imageRows = await env.PICTURE_DB.prepare(
    "SELECT object_key FROM images WHERE album_id = ?"
  ).bind(albumId).all();
  const objectKeys = (imageRows.results ?? []).map((row) => row.object_key);
  if (objectKeys.length > 0) {
    await env.PICTURE_BUCKET.delete(objectKeys);
  }
  await env.PICTURE_DB.prepare("DELETE FROM albums WHERE id = ?").bind(albumId).run();
  return json({ ok: true }, 200, request, env);
}, "deleteAlbum");
var listImages = /* @__PURE__ */ __name(async (request, env, albumId) => {
  const album = await getAlbum(env, albumId);
  await assertAlbumReadable(request, env, album);
  const rows = await env.PICTURE_DB.prepare(
    `SELECT id, album_id, object_key, description, content_type, size, created_at
     FROM images
     WHERE album_id = ?
     ORDER BY created_at DESC`
  ).bind(albumId).all();
  return json(
    {
      album: toAlbumPayload(album),
      images: (rows.results ?? []).map((image) => toImagePayload(image, request))
    },
    200,
    request,
    env
  );
}, "listImages");
var uploadImage = /* @__PURE__ */ __name(async (request, env, albumId) => {
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
    httpMetadata: { contentType: file.type || "application/octet-stream" }
  });
  await env.PICTURE_DB.prepare(
    `INSERT INTO images (id, album_id, object_key, description, content_type, size, created_at)
     VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
  ).bind(
    id,
    albumId,
    objectKey,
    description,
    file.type || "application/octet-stream",
    file.size
  ).run();
  const image = await env.PICTURE_DB.prepare(
    `SELECT id, album_id, object_key, description, content_type, size, created_at
     FROM images WHERE id = ?`
  ).bind(id).first();
  return json({ image: toImagePayload(image, request) }, 201, request, env);
}, "uploadImage");
var deleteImage = /* @__PURE__ */ __name(async (request, env, imageId) => {
  assertAdmin(request, env);
  const image = await env.PICTURE_DB.prepare(
    "SELECT id, object_key FROM images WHERE id = ?"
  ).bind(imageId).first();
  if (!image) throw new ApiError(404, "Image not found.");
  await env.PICTURE_BUCKET.delete(image.object_key);
  await env.PICTURE_DB.prepare("DELETE FROM images WHERE id = ?").bind(imageId).run();
  return json({ ok: true }, 200, request, env);
}, "deleteImage");
var unlockAlbum = /* @__PURE__ */ __name(async (request, env, albumId) => {
  const album = await getAlbum(env, albumId);
  const body = await readJson(request);
  if (album.visibility !== "private") {
    return json({ token: null, album: toAlbumPayload(album) }, 200, request, env);
  }
  if (!env.PRIVATE_ALBUM_KEY || body.key !== env.PRIVATE_ALBUM_KEY) {
    throw new ApiError(401, "Private album key is invalid.");
  }
  return json(
    {
      token: await createUnlockToken(env, albumId),
      album: toAlbumPayload(album)
    },
    200,
    request,
    env
  );
}, "unlockAlbum");
var getImageBlob = /* @__PURE__ */ __name(async (request, env, imageId) => {
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
    WHERE images.id = ?`
  ).bind(imageId).first();
  if (!image) throw new ApiError(404, "Image not found.");
  await assertAlbumReadable(request, env, {
    id: image.album_id,
    name: "",
    description: "",
    visibility: image.album_visibility ?? "private",
    created_at: "",
    updated_at: ""
  });
  const object = await env.PICTURE_BUCKET.get(image.object_key);
  if (!object) throw new ApiError(404, "Image object not found.");
  return new Response(object.body, {
    headers: {
      "content-type": object.httpMetadata?.contentType || image.content_type || "application/octet-stream",
      "cache-control": image.album_visibility === "public" ? "public, max-age=300" : "private, no-store",
      ...corsHeaders(request, env)
    }
  });
}, "getImageBlob");
var route = /* @__PURE__ */ __name(async (request, env) => {
  const url = new URL(request.url);
  const isPictureApi = url.pathname === API_PREFIX || url.pathname.startsWith(`${API_PREFIX}/`);
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
}, "route");
var src_default = {
  async fetch(request, env) {
    try {
      return await route(request, env);
    } catch (error) {
      if (error instanceof ApiError) {
        return json({ error: error.message }, error.status, request, env);
      }
      console.error(error);
      return json({ error: "Unexpected server error." }, 500, request, env);
    }
  }
};

// C:/Users/MMKJ/AppData/Local/pnpm/store/v11/links/@/wrangler/4.107.0/2d5c67d637d9ff3fb9a4745ee980c577e41ecbafec0f609e89d151076d1e1158/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// C:/Users/MMKJ/AppData/Local/pnpm/store/v11/links/@/wrangler/4.107.0/2d5c67d637d9ff3fb9a4745ee980c577e41ecbafec0f609e89d151076d1e1158/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-is5Ee6/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// C:/Users/MMKJ/AppData/Local/pnpm/store/v11/links/@/wrangler/4.107.0/2d5c67d637d9ff3fb9a4745ee980c577e41ecbafec0f609e89d151076d1e1158/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-is5Ee6/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map

const HOME_PATH = "/";
const SHANGHAI_TIME_ZONE = "Asia/Shanghai";
const PROJECT_IDS = new Set([
  "react-fursona",
  "fursona-gallery",
  "sunny-zy-ui",
  "react-furry-error",
  "furry-ai-state",
  "furry-agent-pet",
  "bwite",
  "color-sense",
  "light-maze",
]);

type LikeCountRow = {
  project_id: string;
  like_count: number;
};

type LikedProjectRow = {
  project_id: string;
};

function json(data: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Cache-Control", "no-store");
  headers.set("X-Content-Type-Options", "nosniff");
  return Response.json(data, { ...init, headers });
}

function allowedOrigins(env: Env): Set<string> {
  return new Set(env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean));
}

function isOriginAllowed(request: Request, env: Env): boolean {
  const origin = request.headers.get("Origin");
  return origin === null || allowedOrigins(env).has(origin);
}

function addCors(response: Response, request: Request, env: Env): Response {
  const origin = request.headers.get("Origin");
  if (!origin || !allowedOrigins(env).has(origin)) {
    return response;
  }

  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, X-Visitor-Id");
  headers.set("Access-Control-Max-Age", "86400");
  headers.set("Vary", "Origin");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

function visitorIdFrom(request: Request): string | null {
  const visitorId = request.headers.get("X-Visitor-Id")?.trim();
  if (!visitorId || !/^[a-zA-Z0-9_-]{16,128}$/.test(visitorId)) {
    return null;
  }
  return visitorId;
}

async function hashVisitorId(visitorId: string): Promise<string> {
  const bytes = new TextEncoder().encode(visitorId);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function shanghaiDay(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: SHANGHAI_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

async function getLikeCount(env: Env, projectId: string): Promise<number> {
  const row = await env.DB.prepare(
    "SELECT COUNT(*) AS like_count FROM project_likes WHERE project_id = ?",
  ).bind(projectId).first<{ like_count: number }>();
  return Number(row?.like_count ?? 0);
}

async function getMetrics(request: Request, env: Env): Promise<Response> {
  const visitorId = visitorIdFrom(request);
  if (!visitorId) {
    return json({ error: "invalid_visitor_id" }, { status: 400 });
  }

  const visitorHash = await hashVisitorId(visitorId);
  const today = shanghaiDay();
  const [counter, likeCounts, likedProjects] = await Promise.all([
    env.DB.prepare("SELECT total_views FROM page_counters WHERE path = ?")
      .bind(HOME_PATH)
      .first<{ total_views: number }>(),
    env.DB.prepare(
      "SELECT project_id, COUNT(*) AS like_count FROM project_likes GROUP BY project_id",
    ).all<LikeCountRow>(),
    env.DB.prepare(
      "SELECT project_id FROM project_likes WHERE visitor_hash = ? AND like_day = ?",
    ).bind(visitorHash, today).all<LikedProjectRow>(),
  ]);

  const likes = Object.fromEntries(
    likeCounts.results.map((row) => [row.project_id, Number(row.like_count)]),
  );

  return json({
    totalViews: Number(counter?.total_views ?? 0),
    likes,
    likedToday: likedProjects.results.map((row) => row.project_id),
  });
}

async function recordVisit(request: Request, env: Env): Promise<Response> {
  const visitorId = visitorIdFrom(request);
  if (!visitorId) {
    return json({ error: "invalid_visitor_id" }, { status: 400 });
  }

  const visitorHash = await hashVisitorId(visitorId);
  const today = shanghaiDay();
  const insert = await env.DB.prepare(`
    INSERT OR IGNORE INTO daily_page_visits (path, visitor_hash, visit_day)
    VALUES (?, ?, ?)
  `).bind(HOME_PATH, visitorHash, today).run();
  const counter = await env.DB.prepare(
    "SELECT total_views FROM page_counters WHERE path = ?",
  ).bind(HOME_PATH).first<{ total_views: number }>();

  return json({
    totalViews: Number(counter?.total_views ?? 0),
    counted: insert.meta.changes > 0,
  });
}

async function addProjectLike(request: Request, env: Env, projectId: string): Promise<Response> {
  if (!PROJECT_IDS.has(projectId)) {
    return json({ error: "unknown_project" }, { status: 404 });
  }

  const visitorId = visitorIdFrom(request);
  if (!visitorId) {
    return json({ error: "invalid_visitor_id" }, { status: 400 });
  }

  const visitorHash = await hashVisitorId(visitorId);
  const today = shanghaiDay();
  const result = await env.DB.prepare(`
    INSERT OR IGNORE INTO project_likes (project_id, visitor_hash, like_day)
    VALUES (?, ?, ?)
  `).bind(projectId, visitorHash, today).run();
  const count = await getLikeCount(env, projectId);
  const duplicate = result.meta.changes === 0;

  return json(
    { projectId, count, duplicate },
    { status: duplicate ? 409 : 201 },
  );
}

async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);

  if (!isOriginAllowed(request, env)) {
    return json({ error: "origin_not_allowed" }, { status: 403 });
  }

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  if (request.method === "GET" && url.pathname === "/health") {
    return json({ ok: true });
  }

  if (request.method === "GET" && url.pathname === "/api/metrics") {
    return getMetrics(request, env);
  }

  if (request.method === "POST" && url.pathname === "/api/visits") {
    return recordVisit(request, env);
  }

  const likeMatch = url.pathname.match(/^\/api\/projects\/([^/]+)\/likes$/);
  if (request.method === "POST" && likeMatch) {
    return addProjectLike(request, env, decodeURIComponent(likeMatch[1]));
  }

  return json({ error: "not_found" }, { status: 404 });
}

export default {
  async fetch(request, env): Promise<Response> {
    try {
      const response = await handleRequest(request, env);
      return addCors(response, request, env);
    } catch (error) {
      console.error(JSON.stringify({
        message: "site metrics request failed",
        path: new URL(request.url).pathname,
        error: error instanceof Error ? error.message : String(error),
      }));
      return addCors(json({ error: "internal_error" }, { status: 500 }), request, env);
    }
  },
} satisfies ExportedHandler<Env>;

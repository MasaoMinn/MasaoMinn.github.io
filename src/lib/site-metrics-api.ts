const configuredApiUrl = process.env.NEXT_PUBLIC_SITE_METRICS_API_URL?.trim();
const DEFAULT_PRODUCTION_API_URL = "https://masaominn-site-metrics.2134361910.workers.dev";

const API_BASE_URL = configuredApiUrl
  ? configuredApiUrl.replace(/\/+$/, "")
  : DEFAULT_PRODUCTION_API_URL;

const VISITOR_ID_KEY = "masaominn_site_metrics_visitor_id";

export type SiteMetrics = {
  totalViews: number;
  likes: Record<string, number>;
  likedToday: string[];
};

export type LikeResult = {
  projectId: string;
  count: number;
  duplicate: boolean;
};

function getVisitorId(): string {
  const existing = window.localStorage.getItem(VISITOR_ID_KEY);
  if (existing) {
    return existing;
  }

  const visitorId = window.crypto.randomUUID();
  window.localStorage.setItem(VISITOR_ID_KEY, visitorId);
  return visitorId;
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const visitorId = getVisitorId();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "X-Visitor-Id": visitorId,
      ...init?.headers,
    },
  });

  const data = await response.json() as T & { error?: string };
  if (!response.ok && response.status !== 409) {
    throw new Error(data.error ?? "Site metrics request failed.");
  }

  return data;
}

export function recordPageVisit(): Promise<{ totalViews: number; counted: boolean }> {
  return apiRequest("/api/visits", { method: "POST" });
}

export function getSiteMetrics(): Promise<SiteMetrics> {
  return apiRequest("/api/metrics");
}

export function likeProject(projectId: string): Promise<LikeResult> {
  return apiRequest(`/api/projects/${encodeURIComponent(projectId)}/likes`, {
    method: "POST",
  });
}

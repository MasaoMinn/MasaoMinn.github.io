"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Eye, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  getSiteMetrics,
  likeProject,
  recordPageVisit,
  type LikeResult,
  type VisitorLocation,
} from "@/lib/site-metrics-api";
import { getBrowserLabel } from "@/lib/browser-info";
import styles from "./SiteMetrics.module.css";

type MetricsContextValue = {
  totalViews: number | null;
  visitIncrementKey: number;
  visitorLocation: VisitorLocation | null;
  likes: Record<string, number>;
  likedToday: Set<string>;
  submitLike: (projectId: string) => Promise<LikeResult>;
};

const MetricsContext = createContext<MetricsContextValue | null>(null);

const PARTICLE_VECTORS = [
  [-42, -8], [-34, -34], [-9, -47], [18, -44], [42, -24], [48, 5], [35, 33],
  [8, 47], [-20, 42], [-43, 23], [-27, 3], [0, -30], [27, -3], [12, 27],
] as const;

export function SiteMetricsProvider({ children }: { children: ReactNode }) {
  const [totalViews, setTotalViews] = useState<number | null>(null);
  const [visitIncrementKey, setVisitIncrementKey] = useState(0);
  const [visitorLocation, setVisitorLocation] = useState<VisitorLocation | null>(null);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [likedToday, setLikedToday] = useState<Set<string>>(new Set());
  const hasLoaded = useRef(false);
  const visitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (visitTimer.current) clearTimeout(visitTimer.current);
  }, []);

  useEffect(() => {
    if (hasLoaded.current) {
      return;
    }
    hasLoaded.current = true;

    const load = async () => {
      const [visitResult, metricsResult] = await Promise.allSettled([
        recordPageVisit(),
        getSiteMetrics(),
      ]);

      if (visitResult.status === "fulfilled") {
        const { totalViews: nextTotalViews, counted } = visitResult.value;
        setVisitorLocation(visitResult.value.location ?? null);
        if (counted) {
          setTotalViews(Math.max(0, nextTotalViews - 1));
          visitTimer.current = setTimeout(() => {
            setTotalViews(nextTotalViews);
            setVisitIncrementKey((current) => current + 1);
            visitTimer.current = null;
          }, 450);
        } else {
          setTotalViews(nextTotalViews);
        }
      } else {
        console.error("Unable to record page visit", visitResult.reason);
      }

      if (metricsResult.status === "fulfilled") {
        setLikes(metricsResult.value.likes);
        setLikedToday(new Set(metricsResult.value.likedToday));
      } else {
        console.error("Unable to load project likes", metricsResult.reason);
      }
    };

    void load();
  }, []);

  const submitLike = useCallback(async (projectId: string) => {
    const result = await likeProject(projectId);
    setLikes((current) => ({ ...current, [projectId]: result.count }));
    setLikedToday((current) => new Set(current).add(projectId));
    return result;
  }, []);

  return (
    <MetricsContext.Provider value={{ totalViews, visitIncrementKey, visitorLocation, likes, likedToday, submitLike }}>
      {children}
    </MetricsContext.Provider>
  );
}

function useMetrics() {
  const context = useContext(MetricsContext);
  if (!context) {
    throw new Error("Site metrics components must be used within SiteMetricsProvider.");
  }
  return context;
}

function formatVisitorLocation(location: VisitorLocation | null, language: string): string | null {
  if (!location) return null;

  const locale = language.startsWith("jp") ? "ja" : language;
  const country = location.country && /^[A-Z]{2}$/.test(location.country) && location.country !== "T1"
    ? new Intl.DisplayNames([locale], { type: "region" }).of(location.country)
    : null;
  const region = location.region?.trim();
  const city = location.city?.trim();
  const parts = language.startsWith("en")
    ? [city, region, country]
    : [country, region, city];
  const uniqueParts = parts.filter((part, index): part is string =>
    Boolean(part) && parts.findIndex((item) => item?.toLowerCase() === part?.toLowerCase()) === index,
  );

  return uniqueParts.length > 0 ? uniqueParts.join(language.startsWith("en") ? ", " : " · ") : null;
}

export function SiteVisitCounter() {
  const { t, i18n } = useTranslation();
  const { totalViews, visitIncrementKey, visitorLocation } = useMetrics();
  const [browserLabel, setBrowserLabel] = useState<string | null>(null);
  const locationLabel = formatVisitorLocation(visitorLocation, i18n.resolvedLanguage ?? i18n.language);

  useEffect(() => {
    let active = true;
    void getBrowserLabel().then((label) => {
      if (active) setBrowserLabel(label);
    });
    return () => { active = false; };
  }, []);

  return (
    <div className={styles.visitSummary}>
      <div className={styles.visitCounter} aria-live="polite">
        <Eye aria-hidden="true" />
        <span>{t("mainpage.metrics.total_visits")}</span>
        <span className={styles.visitNumber}>
          <strong className={visitIncrementKey > 0 ? styles.visitCountBump : undefined}>
            {totalViews === null ? "—" : totalViews.toLocaleString()}
          </strong>
          {visitIncrementKey > 0 && (
            <span className={styles.visitPlusOne} key={visitIncrementKey} aria-hidden="true">+1</span>
          )}
        </span>
      </div>
      <div className={styles.visitorDetails}>
        <span>{locationLabel
          ? t("mainpage.metrics.welcome_from", { location: locationLabel })
          : t("mainpage.metrics.welcome")}</span>
        <span>{t("mainpage.metrics.browser", {
          browser: browserLabel ?? t("mainpage.metrics.unknown_browser"),
        })}</span>
      </div>
    </div>
  );
}

export function ProjectLikeButton({ projectId, projectName }: { projectId: string; projectName: string }) {
  const { t } = useTranslation();
  const { likes, likedToday, submitLike } = useMetrics();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDuplicateMessage, setShowDuplicateMessage] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const burstTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasLiked = likedToday.has(projectId);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    if (burstTimer.current) clearTimeout(burstTimer.current);
  }, []);

  const showDuplicateToast = () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setShowDuplicateMessage(true);
    toastTimer.current = setTimeout(() => setShowDuplicateMessage(false), 2200);
  };

  const playBurst = () => {
    if (burstTimer.current) clearTimeout(burstTimer.current);
    setBurstKey((current) => current + 1);
    burstTimer.current = setTimeout(() => setBurstKey(0), 800);
  };

  const handleLike = async () => {
    if (hasLiked) {
      showDuplicateToast();
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitLike(projectId);
      if (result.duplicate) {
        showDuplicateToast();
      } else {
        playBurst();
      }
    } catch (error) {
      console.error("Unable to like project", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const count = likes[projectId] ?? 0;
  const label = hasLiked
    ? t("mainpage.metrics.liked_project", { project: projectName })
    : t("mainpage.metrics.like_project", { project: projectName });

  return (
    <div className={styles.likeControl}>
      <button
        type="button"
        className={`${styles.likeButton} ${hasLiked ? styles.liked : ""}`}
        aria-label={label}
        aria-pressed={hasLiked}
        disabled={isSubmitting}
        onClick={() => void handleLike()}
      >
        <Heart aria-hidden="true" fill={hasLiked ? "currentColor" : "none"} />
        <span>{count.toLocaleString()}</span>
      </button>
      {burstKey > 0 && (
        <span className={styles.particleLayer} key={burstKey} aria-hidden="true">
          {PARTICLE_VECTORS.map(([x, y], index) => (
            <span
              className={styles.particle}
              key={`${x}-${y}`}
              style={{
                "--particle-x": `${x}px`,
                "--particle-y": `${y}px`,
                "--particle-delay": `${index * 8}ms`,
              } as CSSProperties}
            />
          ))}
        </span>
      )}
      {showDuplicateMessage && createPortal(
        <div className={styles.duplicateToast} role="status">
          {t("mainpage.metrics.already_liked_today")}
        </div>,
        document.body,
      )}
    </div>
  );
}

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
} from "@/lib/site-metrics-api";
import styles from "./SiteMetrics.module.css";

type MetricsContextValue = {
  totalViews: number | null;
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
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [likedToday, setLikedToday] = useState<Set<string>>(new Set());
  const hasLoaded = useRef(false);

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
        setTotalViews(visitResult.value.totalViews);
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
    <MetricsContext.Provider value={{ totalViews, likes, likedToday, submitLike }}>
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

export function SiteVisitCounter() {
  const { t } = useTranslation();
  const { totalViews } = useMetrics();

  return (
    <div className={styles.visitCounter} aria-live="polite">
      <Eye aria-hidden="true" />
      <span>{t("mainpage.metrics.total_visits")}</span>
      <strong>{totalViews === null ? "—" : totalViews.toLocaleString()}</strong>
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

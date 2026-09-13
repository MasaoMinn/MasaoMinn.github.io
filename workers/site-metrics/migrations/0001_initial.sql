CREATE TABLE IF NOT EXISTS page_counters (
  path TEXT PRIMARY KEY,
  total_views INTEGER NOT NULL DEFAULT 0 CHECK (total_views >= 0),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_likes (
  project_id TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  like_day TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (project_id, visitor_hash, like_day)
);

CREATE INDEX IF NOT EXISTS project_likes_project_id_idx
  ON project_likes (project_id);

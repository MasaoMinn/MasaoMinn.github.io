CREATE TABLE IF NOT EXISTS daily_page_visits (
  path TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  visit_day TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (path, visitor_hash, visit_day)
);

CREATE TRIGGER IF NOT EXISTS daily_page_visits_increment_counter
AFTER INSERT ON daily_page_visits
BEGIN
  INSERT INTO page_counters (path, total_views, updated_at)
  VALUES (NEW.path, 1, CURRENT_TIMESTAMP)
  ON CONFLICT(path) DO UPDATE SET
    total_views = total_views + 1,
    updated_at = CURRENT_TIMESTAMP;
END;

CREATE INDEX IF NOT EXISTS daily_page_visits_day_idx
  ON daily_page_visits (visit_day);

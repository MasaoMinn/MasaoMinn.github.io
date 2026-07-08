CREATE TABLE IF NOT EXISTS albums (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  visibility TEXT NOT NULL CHECK (visibility IN ('public', 'private')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS images (
  id TEXT PRIMARY KEY,
  album_id TEXT NOT NULL,
  object_key TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  content_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_images_album_id_created_at
  ON images(album_id, created_at DESC);

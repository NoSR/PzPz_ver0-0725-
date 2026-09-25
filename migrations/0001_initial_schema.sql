CREATE TABLE IF NOT EXISTS admins (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login_at TEXT
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id TEXT PRIMARY KEY,
  admin_id TEXT NOT NULL REFERENCES admins(id),
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  revoked_at TEXT,
  ip_hash TEXT,
  user_agent TEXT
);

CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id TEXT PRIMARY KEY,
  admin_id TEXT NOT NULL REFERENCES admins(id),
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  change_summary TEXT,
  request_metadata_hash TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS games (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  summary TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
  min_players INTEGER NOT NULL CHECK (min_players > 0),
  max_players INTEGER NOT NULL CHECK (max_players >= min_players),
  play_time_minutes INTEGER NOT NULL CHECK (play_time_minutes > 0),
  price_per_person_krw INTEGER NOT NULL CHECK (price_per_person_krw >= 0),
  image_url TEXT NOT NULL,
  tags_json TEXT NOT NULL DEFAULT '[]',
  category TEXT NOT NULL,
  is_featured INTEGER NOT NULL DEFAULT 0 CHECK (is_featured IN (0, 1)),
  highlight_badges_json TEXT NOT NULL DEFAULT '[]',
  landing_content TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_enabled INTEGER NOT NULL DEFAULT 1 CHECK (is_enabled IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS booking_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  timezone TEXT NOT NULL DEFAULT 'Asia/Seoul',
  booking_min_lead_minutes INTEGER NOT NULL DEFAULT 60 CHECK (booking_min_lead_minutes >= 0),
  booking_max_days_ahead INTEGER NOT NULL DEFAULT 60 CHECK (booking_max_days_ahead >= 1),
  customer_completion_message TEXT NOT NULL DEFAULT '예약 요청이 접수되었습니다. 매장에서 확인 후 연락드리겠습니다.',
  cancellation_policy TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS game_schedule_rules (
  id TEXT PRIMARY KEY,
  game_id TEXT NOT NULL REFERENCES games(id),
  weekday INTEGER NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  opening_time TEXT NOT NULL,
  closing_time TEXT NOT NULL,
  slot_interval_minutes INTEGER NOT NULL CHECK (slot_interval_minutes > 0),
  is_enabled INTEGER NOT NULL DEFAULT 1 CHECK (is_enabled IN (0, 1)),
  UNIQUE (game_id, weekday)
);

CREATE TABLE IF NOT EXISTS game_blackouts (
  id TEXT PRIMARY KEY,
  game_id TEXT NOT NULL REFERENCES games(id),
  blackout_date TEXT NOT NULL,
  reason TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (game_id, blackout_date)
);

CREATE TABLE IF NOT EXISTS booking_fields (
  id TEXT PRIMARY KEY,
  field_key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  placeholder TEXT,
  field_type TEXT NOT NULL CHECK (field_type IN ('text', 'tel', 'email', 'address', 'select', 'number', 'textarea')),
  is_required INTEGER NOT NULL DEFAULT 0 CHECK (is_required IN (0, 1)),
  is_enabled INTEGER NOT NULL DEFAULT 1 CHECK (is_enabled IN (0, 1)),
  options_json TEXT NOT NULL DEFAULT '[]',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  game_id TEXT NOT NULL REFERENCES games(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  booking_date TEXT NOT NULL,
  booking_time TEXT NOT NULL,
  player_count INTEGER NOT NULL CHECK (player_count > 0),
  total_price_krw INTEGER NOT NULL CHECK (total_price_krw >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no-show')),
  customer_data_json TEXT NOT NULL DEFAULT '{}',
  admin_note TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  confirmed_at TEXT,
  cancelled_at TEXT,
  completed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_active
  ON admin_sessions(token_hash, expires_at)
  WHERE revoked_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_games_enabled_order
  ON games(is_enabled, display_order);

CREATE INDEX IF NOT EXISTS idx_booking_schedule_rules_game
  ON game_schedule_rules(game_id, weekday)
  WHERE is_enabled = 1;

CREATE INDEX IF NOT EXISTS idx_bookings_admin_list
  ON bookings(booking_date, booking_time, status);

CREATE INDEX IF NOT EXISTS idx_bookings_game_date
  ON bookings(game_id, booking_date);

CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_one_active_game_slot
  ON bookings(game_id, booking_date, booking_time)
  WHERE status IN ('pending', 'confirmed');
-- Development-only data for local API verification. Replace with approved store data before Preview/Production seeding.
INSERT INTO games (
  id, title, subtitle, summary, description, difficulty, min_players, max_players,
  play_time_minutes, price_per_person_krw, image_url, category, display_order
) VALUES (
  'game-local-1', '로컬 테스트 퍼즐룸', '개발용 예약 게임', '로컬 예약 API 검증용 게임입니다.',
  '실제 매장 콘텐츠로 교체할 개발용 레코드입니다.', 3, 2, 6, 90, 22000,
  'https://example.test/puzzle-room.jpg', 'development', 1
) ON CONFLICT(id) DO UPDATE SET
  title = excluded.title,
  min_players = excluded.min_players,
  max_players = excluded.max_players,
  price_per_person_krw = excluded.price_per_person_krw,
  is_enabled = 1;

INSERT INTO booking_settings (
  id, timezone, booking_min_lead_minutes, booking_max_days_ahead, customer_completion_message
) VALUES (
  1, 'Asia/Seoul', 0, 60, '예약 요청이 접수되었습니다. 매장에서 확인 후 연락드리겠습니다.'
) ON CONFLICT(id) DO UPDATE SET
  timezone = excluded.timezone,
  booking_min_lead_minutes = excluded.booking_min_lead_minutes,
  booking_max_days_ahead = excluded.booking_max_days_ahead,
  customer_completion_message = excluded.customer_completion_message,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO booking_fields (id, field_key, label, field_type, is_required, is_enabled, display_order)
VALUES ('field-local-request', 'specialRequest', '요청 사항', 'textarea', 0, 1, 1)
ON CONFLICT(field_key) DO UPDATE SET
  label = excluded.label,
  field_type = excluded.field_type,
  is_required = excluded.is_required,
  is_enabled = excluded.is_enabled,
  display_order = excluded.display_order,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO game_schedule_rules (id, game_id, weekday, opening_time, closing_time, slot_interval_minutes, is_enabled)
VALUES
  ('schedule-local-0', 'game-local-1', 0, '11:00', '23:00', 90, 1),
  ('schedule-local-1', 'game-local-1', 1, '11:00', '23:00', 90, 1),
  ('schedule-local-2', 'game-local-1', 2, '11:00', '23:00', 90, 1),
  ('schedule-local-3', 'game-local-1', 3, '11:00', '23:00', 90, 1),
  ('schedule-local-4', 'game-local-1', 4, '11:00', '23:00', 90, 1),
  ('schedule-local-5', 'game-local-1', 5, '11:00', '23:00', 90, 1),
  ('schedule-local-6', 'game-local-1', 6, '11:00', '23:00', 90, 1)
ON CONFLICT(game_id, weekday) DO UPDATE SET
  opening_time = excluded.opening_time,
  closing_time = excluded.closing_time,
  slot_interval_minutes = excluded.slot_interval_minutes,
  is_enabled = excluded.is_enabled;
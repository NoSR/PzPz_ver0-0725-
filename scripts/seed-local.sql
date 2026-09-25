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

INSERT INTO games (
  id, title, subtitle, summary, description, difficulty, min_players, max_players,
  play_time_minutes, price_per_person_krw, image_url, category, display_order
) VALUES
  ('game-1', '큐브 스페이스: 차원의 문', '시공간이 뒤엉킨 3D 퍼즐 차원에서 탈출하라!', '로컬 예약 UI 검증용 게임입니다.', '실제 매장 콘텐츠로 교체할 개발용 레코드입니다.', 3, 2, 6, 60, 22000, 'https://example.test/game-1.jpg', '입체 퍼즐룸', 10),
  ('game-2', '미스테리 룸: 아티팩트의 비밀', '고대 유물 속에 숨겨진 퍼즐 고리를 풀어라', '로컬 예약 UI 검증용 게임입니다.', '실제 매장 콘텐츠로 교체할 개발용 레코드입니다.', 4, 2, 5, 70, 24000, 'https://example.test/game-2.jpg', '어드벤처 퍼즐', 20),
  ('game-3', '마법의 퍼즐 저택', '알록달록 젤리 마법사와 함께하는 퍼즐 파티!', '로컬 예약 UI 검증용 게임입니다.', '실제 매장 콘텐츠로 교체할 개발용 레코드입니다.', 2, 2, 4, 50, 20000, 'https://example.test/game-3.jpg', '파티 퍼즐룸', 30)
ON CONFLICT(id) DO UPDATE SET
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

INSERT INTO game_schedule_rules (id, game_id, weekday, opening_time, closing_time, slot_interval_minutes, is_enabled)
VALUES
  ('schedule-game-1-0', 'game-1', 0, '11:00', '23:00', 90, 1),
  ('schedule-game-1-1', 'game-1', 1, '11:00', '23:00', 90, 1),
  ('schedule-game-1-2', 'game-1', 2, '11:00', '23:00', 90, 1),
  ('schedule-game-1-3', 'game-1', 3, '11:00', '23:00', 90, 1),
  ('schedule-game-1-4', 'game-1', 4, '11:00', '23:00', 90, 1),
  ('schedule-game-1-5', 'game-1', 5, '11:00', '23:00', 90, 1),
  ('schedule-game-1-6', 'game-1', 6, '11:00', '23:00', 90, 1),
  ('schedule-game-2-0', 'game-2', 0, '11:00', '23:00', 90, 1),
  ('schedule-game-2-1', 'game-2', 1, '11:00', '23:00', 90, 1),
  ('schedule-game-2-2', 'game-2', 2, '11:00', '23:00', 90, 1),
  ('schedule-game-2-3', 'game-2', 3, '11:00', '23:00', 90, 1),
  ('schedule-game-2-4', 'game-2', 4, '11:00', '23:00', 90, 1),
  ('schedule-game-2-5', 'game-2', 5, '11:00', '23:00', 90, 1),
  ('schedule-game-2-6', 'game-2', 6, '11:00', '23:00', 90, 1),
  ('schedule-game-3-0', 'game-3', 0, '11:00', '23:00', 90, 1),
  ('schedule-game-3-1', 'game-3', 1, '11:00', '23:00', 90, 1),
  ('schedule-game-3-2', 'game-3', 2, '11:00', '23:00', 90, 1),
  ('schedule-game-3-3', 'game-3', 3, '11:00', '23:00', 90, 1),
  ('schedule-game-3-4', 'game-3', 4, '11:00', '23:00', 90, 1),
  ('schedule-game-3-5', 'game-3', 5, '11:00', '23:00', 90, 1),
  ('schedule-game-3-6', 'game-3', 6, '11:00', '23:00', 90, 1)
ON CONFLICT(game_id, weekday) DO UPDATE SET
  opening_time = excluded.opening_time,
  closing_time = excluded.closing_time,
  slot_interval_minutes = excluded.slot_interval_minutes,
  is_enabled = excluded.is_enabled;
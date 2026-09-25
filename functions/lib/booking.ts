export type GameRecord = {
  id: string;
  title: string;
  min_players: number;
  max_players: number;
  price_per_person_krw: number;
};

export type BookingSettings = {
  timezone: string;
  booking_min_lead_minutes: number;
  booking_max_days_ahead: number;
  customer_completion_message: string;
};

export type ScheduleRule = {
  opening_time: string;
  closing_time: string;
  slot_interval_minutes: number;
};

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^\d{2}:\d{2}$/;

export const json = (body: unknown, status = 200): Response =>
  Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });

export const isValidDate = (value: string): boolean => {
  if (!DATE_PATTERN.test(value)) {
    return false;
  }

  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

export const isValidTime = (value: string): boolean => {
  if (!TIME_PATTERN.test(value)) {
    return false;
  }

  const [hours, minutes] = value.split(':').map(Number);
  return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
};

export const koreaDateTime = (date: Date): string => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes): string => parts.find((part) => part.type === type)?.value ?? '';

  return `${value('year')}-${value('month')}-${value('day')}T${value('hour')}:${value('minute')}`;
};

export const koreaDate = (date: Date): string => koreaDateTime(date).slice(0, 10);

export const weekdayForDate = (date: string): number => new Date(`${date}T12:00:00Z`).getUTCDay();

const minutesForTime = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const timeForMinutes = (minutes: number): string =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

export const slotsForRule = (rule: ScheduleRule): string[] => {
  const openingMinutes = minutesForTime(rule.opening_time);
  const closingMinutes = minutesForTime(rule.closing_time);
  const slots: string[] = [];

  for (let slot = openingMinutes; slot < closingMinutes; slot += rule.slot_interval_minutes) {
    slots.push(timeForMinutes(slot));
  }

  return slots;
};

export const isDateWithinBookingWindow = (date: string, settings: BookingSettings, now = new Date()): boolean => {
  const firstBookableDate = koreaDate(new Date(now.getTime() + settings.booking_min_lead_minutes * 60_000));
  const lastBookableDate = koreaDate(new Date(now.getTime() + settings.booking_max_days_ahead * 86_400_000));

  return date >= firstBookableDate && date <= lastBookableDate;
};

export const isDateTimePastLeadTime = (date: string, time: string, settings: BookingSettings, now = new Date()): boolean =>
  `${date}T${time}` < koreaDateTime(new Date(now.getTime() + settings.booking_min_lead_minutes * 60_000));

export const normalizeKoreanPhone = (phone: string): string | null => {
  const digits = phone.replace(/[^\d+]/g, '');
  const normalized = digits.startsWith('+82') ? `0${digits.slice(3)}` : digits;

  return /^0\d{8,10}$/.test(normalized) ? normalized : null;
};
import { Booking, BookingStatus } from '../types';

type BookingListResponse = { bookings: Booking[] };
type ApiError = { error?: string };

const readError = async (response: Response): Promise<string> => {
  try {
    const body = await response.json() as ApiError;
    return body.error ?? '관리자 예약 요청에 실패했습니다.';
  } catch {
    return '관리자 예약 요청에 실패했습니다.';
  }
};

export const getAdminBookings = async (status?: BookingStatus | 'all'): Promise<Booking[]> => {
  const query = status && status !== 'all' ? `?status=${encodeURIComponent(status)}` : '';
  const response = await fetch(`/api/admin/bookings${query}`, { credentials: 'same-origin' });
  if (!response.ok) throw new Error(await readError(response));
  const body = await response.json() as BookingListResponse;
  return body.bookings;
};

export const updateAdminBooking = async (id: string, status: BookingStatus, note?: string): Promise<void> => {
  const response = await fetch(`/api/admin/bookings/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, note }),
  });
  if (!response.ok) throw new Error(await readError(response));
};
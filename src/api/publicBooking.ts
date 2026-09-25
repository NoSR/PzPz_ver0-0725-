export type AvailabilitySlot = {
  time: string;
  available: boolean;
  reason: 'closed' | 'reserved' | null;
};

export type Availability = {
  gameId: string;
  date: string;
  game: {
    title: string;
    minPlayers: number;
    maxPlayers: number;
    pricePerPerson: number;
  };
  slots: AvailabilitySlot[];
};

export type BookingConfirmation = {
  bookingId: string;
  status: 'pending';
  gameTitle: string;
  date: string;
  time: string;
  playerCount: number;
  totalPrice: number;
  message: string;
};

type ApiError = {
  error?: string;
};

const readError = async (response: Response): Promise<string> => {
  try {
    const body = await response.json() as ApiError;
    return body.error ?? '요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.';
  } catch {
    return '요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.';
  }
};

export const getAvailability = async (gameId: string, date: string): Promise<Availability> => {
  const query = new URLSearchParams({ gameId, date });
  const response = await fetch(`/api/public/availability?${query}`);

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json() as Promise<Availability>;
};

export const createBooking = async (input: {
  gameId: string;
  date: string;
  time: string;
  playerCount: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerData: Record<string, string>;
}): Promise<BookingConfirmation> => {
  const response = await fetch('/api/public/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json() as Promise<BookingConfirmation>;
};
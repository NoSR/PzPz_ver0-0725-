import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { SEASONAL_THEMES } from '../utils/themeUtils';
import { Availability, BookingConfirmation, createBooking, getAvailability } from '../api/publicBooking';
import confetti from 'canvas-confetti';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  User as UserIcon, 
  Sparkles,
  DollarSign
} from 'lucide-react';

export const BookingModal: React.FC = () => {
  const {
    selectedGameForBooking,
    isBookingModalOpen,
    setIsBookingModalOpen,
    bookingFields,
    seasonalTheme,
    showToast,
  } = useStore();

  const theme = SEASONAL_THEMES[seasonalTheme] || SEASONAL_THEMES['trendy-lavender'];

  // Form states
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 10);
  });

  const [selectedTime, setSelectedTime] = useState<string>('');
  const [players, setPlayers] = useState<number>(selectedGameForBooking?.minPlayers || 2);
  const [customFormValues, setCustomFormValues] = useState<Record<string, string>>({
    userName: '',
    userPhone: '',
    userEmail: '',
    userAddress: '',
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);

  useEffect(() => {
    if (!isBookingModalOpen || !selectedGameForBooking || !selectedDate) {
      return;
    }

    let cancelled = false;

    const loadAvailability = async () => {
      setSlotsLoading(true);
      setErrorMsg(null);

      try {
        const nextAvailability = await getAvailability(selectedGameForBooking.id, selectedDate);
        if (cancelled) return;

        setAvailability(nextAvailability);
        setPlayers((currentPlayers) => Math.min(
          Math.max(currentPlayers, nextAvailability.game.minPlayers),
          nextAvailability.game.maxPlayers,
        ));
        setSelectedTime((currentTime) => {
          const currentSlot = nextAvailability.slots.find((slot) => slot.time === currentTime);
          return currentSlot?.available ? currentTime : nextAvailability.slots.find((slot) => slot.available)?.time ?? '';
        });
      } catch (error) {
        if (!cancelled) {
          setAvailability(null);
          setSelectedTime('');
          setErrorMsg(error instanceof Error ? error.message : '예약 가능 시간을 불러오지 못했습니다.');
        }
      } finally {
        if (!cancelled) setSlotsLoading(false);
      }
    };

    void loadAvailability();

    return () => {
      cancelled = true;
    };
  }, [isBookingModalOpen, selectedDate, selectedGameForBooking]);

  if (!isBookingModalOpen || !selectedGameForBooking) return null;

  const activeFields = bookingFields
    .filter((f) => f.enabled)
    .sort((a, b) => a.order - b.order);

  const bookingGame = availability?.game ?? {
    title: selectedGameForBooking.title,
    minPlayers: selectedGameForBooking.minPlayers,
    maxPlayers: selectedGameForBooking.maxPlayers,
    pricePerPerson: selectedGameForBooking.pricePerPerson,
  };

  const handleCustomFieldChange = (key: string, val: string) => {
    setCustomFormValues((prev) => ({ ...prev, [key]: val }));
  };

  const calculateTotal = () => {
    return bookingGame.pricePerPerson * players;
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validate required dynamic fields
    for (const field of activeFields) {
      if (field.required) {
        let val = customFormValues[field.key];
        if (field.key === 'players') val = players.toString();
        
        if (!val || val.trim() === '') {
          setErrorMsg(`'${field.label}' 항목은 필수 입력값입니다.`);
          return;
        }
      }
    }


    if (!selectedTime || !availability) {
      setErrorMsg('예약 가능한 시간을 선택해주세요.');
      return;
    }

    const extraData: Record<string, string> = {};
    for (const [key, value] of Object.entries(customFormValues)) {
      if (!['userName', 'userPhone', 'userEmail', 'userAddress', 'players'].includes(key) && typeof value === 'string') {
        extraData[key] = value;
      }
    }

    setIsSubmitting(true);

    try {
      const result = await createBooking({
        gameId: selectedGameForBooking.id,
        date: selectedDate,
        time: selectedTime,
        playerCount: players,
        customerName: customFormValues.userName ?? '',
        customerPhone: customFormValues.userPhone ?? '',
        customerEmail: customFormValues.userEmail || undefined,
        customerData: extraData,
      });

      setConfirmation(result);
      showToast(`예약 요청이 접수되었습니다. 예약 번호: ${result.bookingId}`);

      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch {
        // Canvas effects must never block a successful reservation.
      }
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : '예약 요청을 처리하지 못했습니다.');
      setAvailability(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setConfirmation(null);
    setErrorMsg(null);
    setIsBookingModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto space-y-6">
        
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-500">
            <Sparkles className="w-3.5 h-3.5" />
            <span>온라인 실시간 예약 시스템</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            {selectedGameForBooking.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            1인 {bookingGame.pricePerPerson.toLocaleString()}원 · 권장 인원 {bookingGame.minPlayers}~{bookingGame.maxPlayers}인
          </p>
        </div>

        {/* Error banner */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-500 font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {confirmation ? (
          <div className="space-y-5 text-center">
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
              <p className="text-sm font-black text-slate-900 dark:text-white">예약 요청이 접수되었습니다.</p>
              <p className="text-xs text-slate-600 dark:text-slate-300">{confirmation.message}</p>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">예약 번호: {confirmation.bookingId}</p>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {confirmation.date} {confirmation.time} / {confirmation.playerCount}명 / {confirmation.totalPrice.toLocaleString()}원
            </div>
            <button type="button" onClick={handleClose} className={`w-full py-3.5 rounded-2xl text-sm font-black ${theme.buttonBg} ${theme.buttonHover}`}>
              확인
            </button>
          </div>
        ) : (
        <form onSubmit={handleSubmitBooking} className="space-y-5">
          
          {/* Step 1: Select Date & Time */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-purple-500" />
              <span>1. 방문 날짜 & 시간 선택</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">날짜</span>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block mb-1">인원 수</span>
                <select
                  value={players}
                  onChange={(e) => setPlayers(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {Array.from({ length: bookingGame.maxPlayers - bookingGame.minPlayers + 1 }).map((_, idx) => {
                    const count = bookingGame.minPlayers + idx;
                    return (
                      <option key={count} value={count}>
                        {count}명 (총 {(bookingGame.pricePerPerson * count).toLocaleString()}원)
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Time slot grid */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-1.5">시간 타임</span>
              {slotsLoading ? (
                <p className="text-xs text-slate-400 py-3">예약 가능 시간을 확인하고 있습니다.</p>
              ) : availability?.slots.length ? (
              <div className="grid grid-cols-4 gap-2">
                {availability.slots.map((slot) => (
                  <button
                    type="button"
                    key={slot.time}
                    disabled={!slot.available}
                    onClick={() => setSelectedTime(slot.time)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedTime === slot.time
                        ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                        : slot.available
                          ? 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-purple-400'
                          : 'bg-slate-100/50 dark:bg-slate-950/50 border-slate-200/60 dark:border-slate-800 text-slate-400 cursor-not-allowed line-through'
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
              ) : (
                <p className="text-xs text-slate-400 py-3">선택한 날짜에는 예약 가능한 시간이 없습니다.</p>
              )}
            </div>
          </div>

          {/* Step 2: Dynamic Admin-configured Fields */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <UserIcon className="w-4 h-4 text-purple-500" />
                <span>2. 예약자 정보 입력</span>
              </span>
              <span className="text-[10px] text-purple-400">
                (관리자 설정 폼 항목 적용됨)
              </span>
            </label>

            <div className="space-y-3">
              {activeFields.map((field) => {
                if (field.key === 'players') return null; // handled above

                const currentVal = customFormValues[field.key] || '';

                return (
                  <div key={field.id}>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>

                    {field.type === 'textarea' ? (
                      <textarea
                        rows={2}
                        value={currentVal}
                        onChange={(e) => handleCustomFieldChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    ) : (
                      <input
                        type={field.type === 'tel' ? 'tel' : field.type === 'email' ? 'email' : 'text'}
                        value={currentVal}
                        onChange={(e) => handleCustomFieldChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Price Summary Box */}
          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block">최종 결제 금액 (현장결제)</span>
              <span className="text-xl font-black text-purple-600 dark:text-purple-300">
                {calculateTotal().toLocaleString()}원
              </span>
            </div>
            <div className="text-right text-[11px] text-slate-400 font-bold">
              {selectedDate} ({selectedTime}) / {players}인
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || slotsLoading || !selectedTime}
            className={`w-full py-4 rounded-2xl font-black text-sm ${theme.buttonBg} ${theme.buttonHover} shadow-xl transition-all`}
          >
            {isSubmitting ? '예약 요청을 접수하고 있습니다...' : '예약 완료 및 접수하기 🎯'}
          </button>

        </form>
        )}

      </div>
    </div>
  );
};

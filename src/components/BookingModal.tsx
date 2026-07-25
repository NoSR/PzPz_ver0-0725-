import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { SEASONAL_THEMES } from '../utils/themeUtils';
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
    addBooking,
    user,
    setIsAuthModalOpen,
    seasonalTheme,
  } = useStore();

  const theme = SEASONAL_THEMES[seasonalTheme] || SEASONAL_THEMES['trendy-lavender'];

  // Form states
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 10);
  });

  const [selectedTime, setSelectedTime] = useState<string>('15:00');
  const [players, setPlayers] = useState<number>(selectedGameForBooking?.minPlayers || 2);
  const [customFormValues, setCustomFormValues] = useState<Record<string, string>>({
    userName: user?.name || '',
    userPhone: user?.phone || '',
    userEmail: user?.email || '',
    userAddress: '',
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isBookingModalOpen || !selectedGameForBooking) return null;

  const activeFields = bookingFields
    .filter((f) => f.enabled)
    .sort((a, b) => a.order - b.order);

  const availableTimeSlots = [
    '11:00', '12:30', '14:00', '15:30', '17:00', '18:30', '20:00', '21:30'
  ];

  const handleCustomFieldChange = (key: string, val: string) => {
    setCustomFormValues((prev) => ({ ...prev, [key]: val }));
  };

  const calculateTotal = () => {
    return selectedGameForBooking.pricePerPerson * players;
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Guard: Auth check
    if (!user) {
      setIsBookingModalOpen(false);
      setIsAuthModalOpen(true);
      return;
    }

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

    // Prepare booking record
    const userName = customFormValues['userName'] || user.name;
    const userPhone = customFormValues['userPhone'] || user.phone;
    const userEmail = customFormValues['userEmail'] || user.email;
    const userAddress = customFormValues['userAddress'] || '';

    // Create Booking
    addBooking({
      userName,
      userPhone,
      userEmail,
      userAddress,
      gameId: selectedGameForBooking.id,
      gameTitle: selectedGameForBooking.title,
      date: selectedDate,
      time: selectedTime,
      players,
      totalPrice: calculateTotal(),
      customData: customFormValues,
    });

    // Fire Celebration Confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      // ignore
    }

    setIsBookingModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto space-y-6">
        
        {/* Close button */}
        <button
          onClick={() => setIsBookingModalOpen(false)}
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
            1인 {selectedGameForBooking.pricePerPerson.toLocaleString()}원 · 권장 인원 {selectedGameForBooking.minPlayers}~{selectedGameForBooking.maxPlayers}인
          </p>
        </div>

        {/* Auth Notice if guest */}
        {!user && (
          <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-600 dark:text-purple-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserIcon className="w-4 h-4" />
              <span>로그인 후 예약을 완료하실 수 있습니다.</span>
            </div>
            <button
              onClick={() => {
                setIsBookingModalOpen(false);
                setIsAuthModalOpen(true);
              }}
              className="px-3 py-1 rounded-lg bg-purple-600 text-white font-bold text-[11px]"
            >
              간편 로그인
            </button>
          </div>
        )}

        {/* Error banner */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-500 font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Booking Form */}
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
                  {Array.from({ length: selectedGameForBooking.maxPlayers - selectedGameForBooking.minPlayers + 1 }).map((_, idx) => {
                    const count = selectedGameForBooking.minPlayers + idx;
                    return (
                      <option key={count} value={count}>
                        {count}명 (총 {(selectedGameForBooking.pricePerPerson * count).toLocaleString()}원)
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Time slot grid */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-1.5">시간 타임</span>
              <div className="grid grid-cols-4 gap-2">
                {availableTimeSlots.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedTime === slot
                        ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                        : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-purple-400'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
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
            className={`w-full py-4 rounded-2xl font-black text-sm ${theme.buttonBg} ${theme.buttonHover} shadow-xl transition-all`}
          >
            예약 완료 및 접수하기 🎯
          </button>

        </form>

      </div>
    </div>
  );
};

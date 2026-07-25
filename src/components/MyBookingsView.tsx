import React from 'react';
import { useStore } from '../context/StoreContext';
import { SEASONAL_THEMES } from '../utils/themeUtils';
import { 
  CalendarCheck, 
  Clock, 
  Users, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Gamepad2, 
  DollarSign 
} from 'lucide-react';

export const MyBookingsView: React.FC = () => {
  const { bookings, user, seasonalTheme, games, deleteBooking } = useStore();
  const theme = SEASONAL_THEMES[seasonalTheme] || SEASONAL_THEMES['trendy-lavender'];

  const userBookings = bookings.filter(
    (b) => b.userId === user?.id || b.userName === user?.name
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>예약 확정</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 rounded-full bg-red-500/15 text-red-500 font-extrabold text-xs flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            <span>예약 취소</span>
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300 font-extrabold text-xs flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>승인 대기중</span>
          </span>
        );
    }
  };

  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 text-xs font-black">
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>MY RESERVATION DASHBOARD</span>
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">
          {user?.name}님의 <span className={`bg-gradient-to-r ${theme.gradientText} bg-clip-text text-transparent`}>예약 내역</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          신청하신 게임 예약 정보 및 방문 일정을 확인하실 수 있습니다.
        </p>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {userBookings.map((b) => {
          const game = games.find((g) => g.id === b.gameId);
          return (
            <div
              key={b.id}
              className={`p-6 rounded-3xl border transition-all ${theme.cardBg} border-slate-200 dark:border-slate-800 shadow-xl space-y-4`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-400">
                    <Gamepad2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">
                      예약번호: {b.id} ({b.createdAt})
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {b.gameTitle}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(b.status)}
                </div>
              </div>

              {/* Grid detail */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950">
                  <span className="text-[10px] text-slate-400 block mb-0.5">방문 날짜</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{b.date}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950">
                  <span className="text-[10px] text-slate-400 block mb-0.5">방문 시간</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{b.time}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950">
                  <span className="text-[10px] text-slate-400 block mb-0.5">예약 인원</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{b.players}인</span>
                </div>

                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-300 font-extrabold">
                  <span className="text-[10px] text-purple-400 block mb-0.5">결제 금액</span>
                  <span>{b.totalPrice.toLocaleString()}원</span>
                </div>
              </div>

              {/* Additional Customer Data */}
              {b.customData && (
                <div className="p-3 rounded-xl bg-slate-100/50 dark:bg-slate-950/50 text-xs text-slate-500 space-y-1">
                  <div className="font-bold text-[11px] text-slate-400">📋 입력 정보:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div>연락처: {b.userPhone}</div>
                    {b.userEmail && <div>이메일: {b.userEmail}</div>}
                    {b.userAddress && <div>주소: {b.userAddress}</div>}
                    {Object.entries(b.customData).map(([k, v]) => {
                      if (['userName', 'userPhone', 'userEmail', 'userAddress'].includes(k)) return null;
                      return (
                        <div key={k}>
                          {k}: {v}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => deleteBooking(b.id)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  예약 내역 취소 / 삭제
                </button>
              </div>

            </div>
          );
        })}

        {userBookings.length === 0 && (
          <div className="text-center py-16 bg-slate-100 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <CalendarCheck className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-lg">
              아직 신청하신 예약 내역이 없습니다.
            </h3>
            <p className="text-xs text-slate-400">
              '게임 스토어 & 예약' 메뉴에서 원하시는 테마와 타임을 예약해보세요!
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

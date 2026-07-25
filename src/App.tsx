import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { GameSection } from './components/GameSection';
import { ReviewsSection } from './components/ReviewsSection';
import { NoticesBoard } from './components/NoticesBoard';
import { CompanyInfoSection } from './components/CompanyInfoSection';
import { AdminDashboard } from './components/AdminDashboard';
import { MyBookingsView } from './components/MyBookingsView';
import { BookingModal } from './components/BookingModal';
import { AuthModal } from './components/AuthModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { PopupModal } from './components/PopupModal';
import { InteractiveCubeCanvas } from './components/InteractiveCubeCanvas';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { SEASONAL_THEMES } from './utils/themeUtils';

const MainContent: React.FC = () => {
  const { activeTab, seasonalTheme } = useStore();
  const theme = SEASONAL_THEMES[seasonalTheme] || SEASONAL_THEMES['trendy-lavender'];

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-500 bg-gradient-to-b ${theme.primaryBg} relative selection:bg-purple-500 selection:text-white`}>
      {/* Interactive Floating Puzzle Cube Particle Canvas */}
      <InteractiveCubeCanvas />

      {/* Pop-up modal overlay */}
      <PopupModal />

      {/* Main Header Navigation */}
      <Header />

      {/* Main View Router */}
      <main className="relative z-10">
        {activeTab === 'home' && (
          <>
            <HeroSection />
            <GameSection />
            <ReviewsSection />
            <NoticesBoard />
            <CompanyInfoSection />
          </>
        )}

        {activeTab === 'games' && (
          <div className="pt-6">
            <GameSection />
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="pt-6">
            <ReviewsSection />
          </div>
        )}

        {activeTab === 'notices' && (
          <div className="pt-6">
            <NoticesBoard />
          </div>
        )}

        {activeTab === 'about' && (
          <div className="pt-6">
            <CompanyInfoSection />
          </div>
        )}

        {activeTab === 'my-bookings' && (
          <div className="pt-6">
            <MyBookingsView />
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="pt-6">
            <AdminDashboard />
          </div>
        )}
      </main>

      {/* Booking Form Modal */}
      <BookingModal />

      {/* Auth Modal */}
      <AuthModal />

      {/* Admin Auth Modal */}
      <AdminAuthModal />

      {/* Toast Messages */}
      <Toast />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}

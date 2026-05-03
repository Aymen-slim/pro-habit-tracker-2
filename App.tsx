import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Navbar } from './components/Navbar';
import { WeeklyPlanner } from './components/WeeklyPlanner';
import { WeeklyReview } from './components/WeeklyReview';
import { Notes } from './components/Notes';
import { DataSettings } from './components/DataSettings';
import { ResetPasswordScreen } from './components/ResetPasswordScreen';
import { LandingPage } from './LandingPage';
import { PricingSection } from './components/PricingSection';
import { TermsPage } from './components/TermsPage';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { RefundPolicy } from './components/RefundPolicy';
import { SupportPage } from './components/SupportPage';
import { ViewType } from './types';
import { StorageProvider, useStorage } from './context/StorageContext';
import { Sun, Moon, LayoutGrid, LogOut, User as UserIcon, Sparkles, Check, ArrowLeft } from 'lucide-react';
import { supabase } from './supabase';
import { ToastProvider } from './components/Toast';

const TopBar = ({
  isDarkMode,
  toggleTheme,
  user,
  onNavigateToPricing,
  isPremium
}: {
  isDarkMode: boolean,
  toggleTheme: () => void,
  user: any,
  onNavigateToPricing: () => void,
  isPremium: boolean
}) => {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-30 border-b border-slate-200/50 dark:border-slate-800/50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
          <Check size={18} strokeWidth={3} />
        </div>
        <span className="font-bold text-lg tracking-tight text-slate-800 dark:text-slate-100 hidden sm:block">Bloom Habit</span>
      </div>

      <div className="flex items-center gap-3">
        {isPremium ? (
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 border border-yellow-400/50 shadow-sm shadow-yellow-500/20 mr-2 cursor-default animate-in zoom-in spin-in-3 duration-500">
            <Sparkles size={12} fill="currentColor" />
            <span className="text-xs font-black uppercase tracking-wide">Premium</span>
          </div>
        ) : (
          <button
            onClick={onNavigateToPricing}
            className="group relative px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all cursor-pointer mr-2 overflow-hidden w-20"
          >
            <div className="relative h-4 w-full">
              <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">Basic</span>
              <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0 text-indigo-600 dark:text-indigo-400">Upgrade</span>
            </div>
          </button>
        )}

        <button
          onClick={toggleTheme}
          className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          onClick={handleSignOut}
          className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-200 dark:border-slate-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          title="Sign Out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
};

const AppContent = ({
  user,
  isResettingPassword,
  onPasswordResetComplete,
  isDarkMode,
  toggleTheme
}: {
  user: any,
  isResettingPassword: boolean,
  onPasswordResetComplete: () => void,
  isDarkMode: boolean,
  toggleTheme: () => void
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<ViewType>('tracker');
  const { data, upgradeUserTier } = useStorage();

  // Update document title based on internal view
  useEffect(() => {
    let title = 'Dashboard | Bloom Habit';
    if (currentView === 'tracker') title = 'Habit Tracker | Bloom Habit';
    else if (currentView === 'planner') title = 'Weekly Planner | Bloom Habit';
    else if (currentView === 'review') title = 'Weekly Review | Bloom Habit';
    else if (currentView === 'notes') title = 'Notes | Bloom Habit';
    else if (currentView === 'settings') title = 'Settings | Bloom Habit';
    else if (currentView === 'pricing') title = 'Pricing | Bloom Habit';

    document.title = title;

    // Explicitly notify GA of page view for internal view changes
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_title: title,
        page_location: window.location.href,
        page_path: window.location.pathname + '#' + currentView
      });
    }
  }, [currentView]);

  const isPremium = data.userProfile?.tier === 'premium';

  useEffect(() => {
    // Check for Lemon Squeezy success return (via redirect URL)
    const query = new URLSearchParams(window.location.search);
    if (query.get('payment_success') === 'true') {
      upgradeUserTier();
      // Clean URL without refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Check for Lemon Squeezy success event (via overlay)
    const handlePaymentSuccess = () => {
      upgradeUserTier();
    };

    window.addEventListener('payment-success', handlePaymentSuccess);
    return () => window.removeEventListener('payment-success', handlePaymentSuccess);
  }, [upgradeUserTier]);

  const changeWeek = (weeks: number) => {
    setCurrentDate(prev => {
      const n = new Date(prev);
      n.setDate(n.getDate() + (weeks * 7));
      return n;
    });
  };

  const renderContent = () => {
    if (isResettingPassword) {
      return <ResetPasswordScreen onComplete={onPasswordResetComplete} />;
    }

    switch (currentView) {
      case 'planner':
        return (
          <WeeklyPlanner
            currentDate={currentDate}
            onPrevWeek={() => changeWeek(-1)}
            onNextWeek={() => changeWeek(1)}
            onNavigateToPricing={() => setCurrentView('pricing')}
          />
        );
      case 'tracker':
        return (
          <Dashboard
            currentDate={currentDate}
            onPrevMonth={() => setCurrentDate(prev => new Date(prev.setMonth(prev.getMonth() - 1)))}
            onNextMonth={() => setCurrentDate(prev => new Date(prev.setMonth(prev.getMonth() + 1)))}
            isDarkMode={isDarkMode}
            onToggleTheme={toggleTheme}
            onNavigateToPricing={() => setCurrentView('pricing')}
          />
        );
      case 'review':
        return (
          <WeeklyReview
            currentDate={currentDate}
            onPrevWeek={() => changeWeek(-1)}
            onNextWeek={() => changeWeek(1)}
            onSelectDate={setCurrentDate}
            onNavigateToPricing={() => setCurrentView('pricing')}
          />
        );
      case 'notes':
        return <Notes onNavigateToPricing={() => setCurrentView('pricing')} />;
      case 'settings':
        return <DataSettings />;
      case 'pricing':
        return <PricingSection userEmail={user.email} userId={user.id} />;
      default:
        return null;
    }
  };

  const isFullWidth = currentView === 'tracker' || currentView === 'planner';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200 pb-20">
      {!isResettingPassword && (
        <TopBar
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          user={user}
          onNavigateToPricing={() => setCurrentView('pricing')}
          isPremium={isPremium}
        />
      )}

      {!isResettingPassword && <Navbar currentView={currentView} onChangeView={setCurrentView} />}

      <main className={`mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 ${isFullWidth && !isResettingPassword ? 'w-full px-4 md:px-8' : 'max-w-7xl px-4 sm:px-6'}`}>
        {renderContent()}
      </main>
    </div>
  );
};

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Update document title for SEO and Analytics
  useEffect(() => {
    let title = 'Bloom Habit';
    
    if (currentPath === '/pricing') {
      title = 'Pricing | Bloom Habit';
    } else if (currentPath === '/terms-and-conditions') {
      title = 'Terms & Conditions | Bloom Habit';
    } else if (currentPath === '/Privacy-Policy') {
      title = 'Privacy Policy | Bloom Habit';
    } else if (currentPath === '/Refund-Policy') {
      title = 'Refund Policy | Bloom Habit';
    } else if (currentPath === '/support') {
      title = 'Support | Bloom Habit';
    } else if (!session) {
      title = 'Bloom Habit - Build habits that actually stick';
    } else {
      title = 'Dashboard | Bloom Habit';
    }

    document.title = title;
    
    // Explicitly notify GA of page view for SPA navigation if gtag is available
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_title: title,
        page_location: window.location.href,
        page_path: currentPath
      });
    }
  }, [currentPath, session]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Theme state managed at root to support LandingPage toggling
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (event === 'PASSWORD_RECOVERY') {
        setIsResettingPassword(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Synchronizing Bloom Habit...</span>
        </div>
      </div>
    );
  }

  // Handle routing for Terms of Service
  if (currentPath === '/terms-and-conditions') {
    return (
      <TermsPage
        isDarkMode={isDarkMode}
        onBack={() => {
          window.history.pushState({}, '', '/');
          setCurrentPath('/');
        }}
      />
    );
  }

  if (currentPath === '/Privacy-Policy') {
    return (
      <PrivacyPolicy
        isDarkMode={isDarkMode}
        onBack={() => {
          window.history.pushState({}, '', '/');
          setCurrentPath('/');
        }}
      />
    );
  }

  if (currentPath === '/Refund-Policy') {
    return (
      <RefundPolicy
        isDarkMode={isDarkMode}
        onBack={() => {
          window.history.pushState({}, '', '/');
          setCurrentPath('/');
        }}
      />
    );
  }

  if (currentPath === '/support') {
    return (
      <SupportPage
        isDarkMode={isDarkMode}
        onBack={() => {
          window.history.pushState({}, '', '/');
          setCurrentPath('/');
        }}
      />
    );
  }

  if (currentPath === '/pricing') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-950/60 backdrop-blur-md sticky top-0 z-50">
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => {
              window.history.pushState({}, '', '/');
              setCurrentPath('/');
            }}
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Check size={18} strokeWidth={3} />
            </div>
            <span className="font-bold text-xl tracking-tighter dark:text-white">Bloom Habit</span>
          </div>
          <button
            onClick={() => {
              window.history.pushState({}, '', '/');
              setCurrentPath('/');
            }}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Home
          </button>
        </nav>
        <PricingSection userEmail={session?.user?.email} userId={session?.user?.id} />
        <footer className="py-12 text-center bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900">
          <div className="mt-8 text-center text-slate-500 dark:text-slate-400 text-sm">
            <p>&copy; 2026 Bloom Habit Inc. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
  }

  if (!session) {
    return <LandingPage isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
  }

  return (
    <ToastProvider>
      <StorageProvider>
        <AppContent
          user={session.user}
          isResettingPassword={isResettingPassword}
          onPasswordResetComplete={() => setIsResettingPassword(false)}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />
      </StorageProvider>
    </ToastProvider>
  );
}
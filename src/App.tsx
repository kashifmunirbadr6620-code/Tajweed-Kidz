import React, { useState, useEffect } from 'react';
import { Home, BookOpen, Mic, Gamepad2, Shield, Heart, Edit3 } from 'lucide-react';
import { Language, ChildProfile, BadgeItem } from './types';
import { INITIAL_PROFILE, INITIAL_BADGES } from './data/tajweedData';
import { UI_TRANSLATIONS } from './data/translations';
import { Header } from './components/Header';
import { HomeView } from './components/views/HomeView';
import { LessonsView } from './components/views/LessonsView';
import { PracticeView } from './components/views/PracticeView';
import { GamesView } from './components/views/GamesView';
import { ParentDashboard } from './components/views/ParentDashboard';
import { EditorView } from './components/views/EditorView';
import { InstallAppModal } from './components/InstallAppModal';
import { playClickSound, playStarSound } from './utils/audio';

export default function App() {
  // App states with localStorage persistence
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('tajweed_kids_lang');
    return saved === 'ur' || saved === 'en' ? (saved as Language) : 'ur'; // default to Urdu as requested
  });

  const [profile, setProfile] = useState<ChildProfile>(() => {
    const saved = localStorage.getItem('tajweed_kids_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_PROFILE;
  });

  const [badges, setBadges] = useState<BadgeItem[]>(() => {
    const saved = localStorage.getItem('tajweed_kids_badges');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_BADGES;
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isParentGateOpen, setIsParentGateOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('tajweed_kids_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('tajweed_kids_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('tajweed_kids_badges', JSON.stringify(badges));
  }, [badges]);

  // Handle Stars Increment & Badge Unlocking
  const handleAddStars = (starsToAdd: number) => {
    playStarSound();
    setProfile((prev) => {
      const newStars = prev.stars + starsToAdd;

      // Check badges to unlock
      setBadges((prevBadges) =>
        prevBadges.map((badge) => {
          if (!badge.unlocked && newStars >= badge.requiredStars) {
            return { ...badge, unlocked: true, unlockedDate: 'Today' };
          }
          return badge;
        })
      );

      return {
        ...prev,
        stars: newStars,
      };
    });
  };

  const handleCompleteLesson = (lessonId: string, starsEarned: number) => {
    setProfile((prev) => {
      const alreadyCompleted = prev.completedLessons.includes(lessonId);
      const updatedList = alreadyCompleted ? prev.completedLessons : [...prev.completedLessons, lessonId];
      return {
        ...prev,
        completedLessons: updatedList,
        stars: prev.stars + (alreadyCompleted ? 5 : starsEarned),
        tajweedScore: Math.min(100, prev.tajweedScore + 2),
      };
    });
    handleAddStars(starsEarned);
  };

  const handleRecordPractice = (letter: string, wasCorrect: boolean) => {
    setProfile((prev) => {
      const updatedWeak = prev.weakLetters.map((wl) => {
        if (wl.letter === letter) {
          const newAccuracy = wasCorrect ? Math.min(100, wl.accuracy + 5) : Math.max(40, wl.accuracy - 3);
          return {
            ...wl,
            practiceCount: wl.practiceCount + 1,
            accuracy: newAccuracy,
          };
        }
        return wl;
      });

      return {
        ...prev,
        totalPracticeCount: prev.totalPracticeCount + 1,
        weakLetters: updatedWeak,
      };
    });
  };

  const handleUpdateProfile = (updated: Partial<ChildProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  const handleOpenLessonFromHome = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setActiveTab('learn');
  };

  const t = UI_TRANSLATIONS[language];

  return (
    <div
      dir={language === 'ur' ? 'rtl' : 'ltr'}
      className={`min-h-screen bg-gradient-to-b from-amber-50/70 via-emerald-50/30 to-amber-50/50 flex flex-col font-sans text-slate-800 ${
        language === 'ur' ? 'font-urdu' : ''
      }`}
    >
      {/* Top App Header with Profile, Streak, Golden Stars, Language Switcher */}
      <Header
        profile={profile}
        language={language}
        onLanguageChange={setLanguage}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
        onOpenParentGate={() => setIsParentGateOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onOpenEditor={() => {
          setIsParentGateOpen(false);
          setActiveTab('editor');
        }}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 transition-all">
        {/* If Parent Gate is requested */}
        {isParentGateOpen || activeTab === 'parents' ? (
          <ParentDashboard
            profile={profile}
            language={language}
            onUpdateProfile={handleUpdateProfile}
            onClose={() => {
              setIsParentGateOpen(false);
              if (activeTab === 'parents') setActiveTab('home');
            }}
            onNavigateToPractice={() => {
              setIsParentGateOpen(false);
              setActiveTab('practice');
            }}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeView
                profile={profile}
                language={language}
                badges={badges}
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  setSelectedLessonId(null);
                }}
                onOpenLesson={handleOpenLessonFromHome}
                onOpenInstallModal={() => setIsInstallModalOpen(true)}
              />
            )}

            {activeTab === 'learn' && (
              <LessonsView
                language={language}
                completedLessons={profile.completedLessons}
                onCompleteLesson={handleCompleteLesson}
                initialLessonId={selectedLessonId}
                onBackToHome={() => setActiveTab('home')}
              />
            )}

            {activeTab === 'practice' && (
              <PracticeView
                language={language}
                profile={profile}
                onAddStars={handleAddStars}
                onRecordPractice={handleRecordPractice}
              />
            )}

            {activeTab === 'games' && (
              <GamesView
                language={language}
                onAddStars={handleAddStars}
                badges={badges}
              />
            )}

            {activeTab === 'editor' && (
              <EditorView
                language={language}
                onClose={() => setActiveTab('home')}
                onNavigateToTab={setActiveTab}
              />
            )}
          </>
        )}
      </main>

      {/* Mobile-First Playful Chunky Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-emerald-100 shadow-2xl px-2 py-2">
        <div className="max-w-md mx-auto flex items-center justify-around gap-1">
          {/* Home */}
          <button
            onClick={() => {
              playClickSound();
              setIsParentGateOpen(false);
              setActiveTab('home');
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all active:scale-95 ${
              activeTab === 'home' && !isParentGateOpen
                ? 'bg-emerald-500 text-white shadow-md -translate-y-1'
                : 'text-slate-500 hover:text-emerald-700'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] font-black">{t.home}</span>
          </button>

          {/* Learn */}
          <button
            onClick={() => {
              playClickSound();
              setIsParentGateOpen(false);
              setActiveTab('learn');
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all active:scale-95 ${
              activeTab === 'learn' && !isParentGateOpen
                ? 'bg-emerald-500 text-white shadow-md -translate-y-1'
                : 'text-slate-500 hover:text-emerald-700'
            }`}
          >
            <BookOpen className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] font-black">{t.learn}</span>
          </button>

          {/* Practice */}
          <button
            onClick={() => {
              playClickSound();
              setIsParentGateOpen(false);
              setActiveTab('practice');
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all active:scale-95 ${
              activeTab === 'practice' && !isParentGateOpen
                ? 'bg-sky-500 text-white shadow-md -translate-y-1'
                : 'text-slate-500 hover:text-sky-700'
            }`}
          >
            <Mic className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] font-black">{t.practice}</span>
          </button>

          {/* Games */}
          <button
            onClick={() => {
              playClickSound();
              setIsParentGateOpen(false);
              setActiveTab('games');
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all active:scale-95 ${
              activeTab === 'games' && !isParentGateOpen
                ? 'bg-amber-500 text-white shadow-md -translate-y-1'
                : 'text-slate-500 hover:text-amber-700'
            }`}
          >
            <Gamepad2 className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] font-black">{t.games}</span>
          </button>

          {/* Editor */}
          <button
            onClick={() => {
              playClickSound();
              setIsParentGateOpen(false);
              setActiveTab('editor');
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-2.5 rounded-2xl transition-all active:scale-95 ${
              activeTab === 'editor' && !isParentGateOpen
                ? 'bg-purple-600 text-white shadow-md -translate-y-1'
                : 'text-slate-500 hover:text-purple-700'
            }`}
          >
            <Edit3 className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] font-black">{language === 'ur' ? 'ایڈیٹر' : 'Editor'}</span>
          </button>

          {/* Parents */}
          <button
            onClick={() => {
              playClickSound();
              setIsParentGateOpen(true);
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-2.5 rounded-2xl transition-all active:scale-95 ${
              isParentGateOpen
                ? 'bg-indigo-600 text-white shadow-md -translate-y-1'
                : 'text-slate-500 hover:text-indigo-700'
            }`}
          >
            <Shield className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] font-black">{t.parents}</span>
          </button>
        </div>
      </nav>

      {/* APK & App Installation Guide Modal */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        language={language}
      />
    </div>
  );
}

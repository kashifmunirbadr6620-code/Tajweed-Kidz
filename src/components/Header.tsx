import React from 'react';
import { Flame, Star, Volume2, VolumeX, Shield, Globe } from 'lucide-react';
import { ChildProfile, Language } from '../types';
import { UI_TRANSLATIONS } from '../data/translations';
import { playClickSound, playStarSound } from '../utils/audio';

interface HeaderProps {
  profile: ChildProfile;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenParentGate: () => void;
  onOpenInstallModal: () => void;
  onOpenEditor: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  language,
  onLanguageChange,
  isMuted,
  onToggleMute,
  onOpenParentGate,
  onOpenInstallModal,
  onOpenEditor,
  activeTab,
  onSelectTab,
}) => {
  const t = UI_TRANSLATIONS[language];

  const handleLanguageToggle = () => {
    playClickSound();
    onLanguageChange(language === 'en' ? 'ur' : 'en');
  };

  const handleStarClick = () => {
    playStarSound();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-emerald-100 shadow-sm px-3 py-2.5 sm:px-5">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Left: App Logo & Child Avatar */}
        <div 
          onClick={() => {
            playClickSound();
            onSelectTab('home');
          }}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md flex items-center justify-center transform group-hover:rotate-6 transition-transform">
            <span className="text-xl">🕌</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base md:text-lg text-emerald-900 tracking-tight leading-none">
                {language === 'ur' ? 'تجوید کڈز' : 'Tajweed Kids'}
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-300">
                PRO
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <span>{profile.name}</span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">Lvl 2</span>
            </div>
          </div>
        </div>

        {/* Center / Stats: Streak & Stars */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Streak Counter */}
          <div 
            className="flex items-center gap-1 bg-orange-50 border border-orange-200 text-orange-700 px-2.5 py-1 rounded-full text-xs font-bold shadow-xs"
            title={`${profile.streakDays} ${t.dailyStreak}`}
          >
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
            <span>{profile.streakDays}</span>
            <span className="hidden sm:inline text-[10px] font-semibold text-orange-600">
              {language === 'ur' ? 'دن' : 'd'}
            </span>
          </div>

          {/* Golden Stars Bank */}
          <button
            onClick={handleStarClick}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-300 text-amber-900 px-3 py-1 rounded-full text-xs font-black shadow-xs hover:scale-105 active:scale-95 transition-transform"
            title={`${profile.stars} ${t.stars}`}
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-400 animate-spin-slow" />
            <span>{profile.stars}</span>
          </button>
        </div>

        {/* Right Actions: APK Button, Urdu Switcher, Audio & Parent Gate */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* APK / App Install Button */}
          <button
            onClick={() => {
              playClickSound();
              onOpenInstallModal();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-xs border border-emerald-700 transition-all active:scale-95 animate-pulse"
            title="Install APK / ایپ انسٹال کریں"
          >
            <span>📱</span>
            <span className="font-extrabold">APK</span>
          </button>

          {/* Language Toggle Button */}
          <button
            onClick={handleLanguageToggle}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold shadow-sm border transition-all active:scale-95 ${
              language === 'ur'
                ? 'bg-emerald-600 text-white border-emerald-700 font-urdu'
                : 'bg-amber-100 text-amber-900 border-amber-300'
            }`}
            title="Switch Language / زبان تبدیل کریں"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'اردو' : 'English'}</span>
          </button>

          {/* Mute/Sound Toggle */}
          <button
            onClick={() => {
              playClickSound();
              onToggleMute();
            }}
            className="p-1.5 rounded-full text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 active:scale-95 transition-all"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          </button>

          {/* Editor Button */}
          <button
            onClick={() => {
              playClickSound();
              onOpenEditor();
            }}
            className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-black transition-all active:scale-95"
            title="Tajweed Content Editor / ایڈیٹر"
          >
            <span>✏️</span>
            <span className="hidden sm:inline">{language === 'ur' ? 'ایڈیٹر' : 'Editor'}</span>
          </button>

          {/* Parent Gate Button */}
          <button
            onClick={() => {
              playClickSound();
              onOpenParentGate();
            }}
            className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold transition-all active:scale-95"
            title={t.parentGate}
          >
            <Shield className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden md:inline">{t.parents}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

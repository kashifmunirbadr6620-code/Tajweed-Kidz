import React from 'react';
import { BookOpen, Mic, Gamepad2, Sparkles, Trophy, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { ChildProfile, Language, BadgeItem } from '../../types';
import { UI_TRANSLATIONS } from '../../data/translations';
import { QariAvatar } from '../QariAvatar';
import { playClickSound, playStarSound } from '../../utils/audio';

interface HomeViewProps {
  profile: ChildProfile;
  language: Language;
  badges: BadgeItem[];
  onNavigate: (tab: string) => void;
  onOpenLesson: (lessonId: string) => void;
  onOpenInstallModal?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  profile,
  language,
  badges,
  onNavigate,
  onOpenLesson,
  onOpenInstallModal,
}) => {
  const t = UI_TRANSLATIONS[language];

  return (
    <div className={`space-y-6 pb-20 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
      {/* Hero Welcome Card with Qari Zayd Guide */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 rounded-3xl p-5 md:p-6 text-white shadow-lg border-4 border-emerald-400/40">
        {/* Decorative background Islamic geometry patterns */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 rounded-full bg-amber-400/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
          {/* Greeting text */}
          <div className="flex-1 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-amber-950 font-black text-xs rounded-full shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'ur' ? 'آج کا دن مبارک ہو!' : 'Welcome back, Champion!'}</span>
            </div>

            <h1 className={`text-2xl md:text-3xl font-black tracking-tight leading-tight ${language === 'ur' ? 'font-urdu text-3xl md:text-4xl leading-normal' : ''}`}>
              {t.greeting}, <span className="text-amber-300 underline decoration-wavy decoration-amber-400">{profile.name}</span>!
            </h1>

            <p className={`text-emerald-100 text-sm md:text-base font-medium max-w-md ${language === 'ur' ? 'font-urdu text-base' : ''}`}>
              {language === 'ur'
                ? 'ماشاءاللہ! آپ نے مسلسل ۴ دن تجوید کی مشق کی۔ آج کا نیا سبق سیکھنے کے لیے تیار ہیں؟'
                : 'MashaAllah! You have recited 4 days in a row! Ready to unlock today\'s golden stars with Qari Zayd?'}
            </p>

            {/* Quick 5-Min Goal Progress Bar */}
            <div className="pt-2">
              <div className="bg-emerald-950/40 border border-emerald-400/30 rounded-2xl p-3 max-w-sm backdrop-blur-xs">
                <div className="flex items-center justify-between text-xs font-bold mb-1.5 text-emerald-200">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    {t.dailyGoal}
                  </span>
                  <span className="text-amber-300">{t.minutesToday}</span>
                </div>
                <div className="w-full h-2.5 bg-emerald-900/60 rounded-full overflow-hidden p-0.5">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full w-3/5 transition-all duration-500 shadow-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Qari Avatar Guide */}
          <div className="flex-shrink-0">
            <QariAvatar
              mood="talking"
              size="lg"
              speechText="Click on Learn, Practice, or Games below to start our fun Tajweed adventure!"
              speechTextUr="نیچے دیے گئے ۳ بڑے بٹنوں میں سے کوئی بٹن دبائیں اور تجوید کا سفر شروع کریں!"
              language={language}
              showSpeech={true}
            />
          </div>
        </div>
      </div>

      {/* ANDROID APK & INSTALL BANNER */}
      {onOpenInstallModal && (
        <div 
          onClick={() => {
            playClickSound();
            onOpenInstallModal();
          }}
          className="bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700 text-white p-3.5 px-4 rounded-2xl shadow-md border-2 border-emerald-300 flex items-center justify-between cursor-pointer hover:shadow-lg transition-transform active:scale-[0.99] group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              📱
            </div>
            <div>
              <h4 className={`text-sm font-black text-white leading-tight ${language === 'ur' ? 'font-urdu text-base' : ''}`}>
                {language === 'ur' ? 'اینڈرائیڈ موبائل میں انسٹال / APK حاصل کریں' : 'Install on Android Phone / APK'}
              </h4>
              <p className={`text-xs text-emerald-100 font-medium ${language === 'ur' ? 'font-urdu' : ''}`}>
                {language === 'ur' ? '۱ کلک میں بغیر اشتہارات کے آف لائن ایپ کے طور پر محفوظ کریں' : '1-click install as a full standalone app on your phone'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 text-amber-950 font-black text-xs rounded-xl shadow-xs group-hover:bg-amber-300">
            <span>{language === 'ur' ? 'انسٹال کریں' : 'Install'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      )}

      {/* 3 BIG CHILD-FRIENDLY ACTION BUTTONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. LEARN TAJWEED BUTTON (Emerald Green) */}
        <button
          onClick={() => {
            playClickSound();
            onNavigate('learn');
          }}
          className="group relative overflow-hidden bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 active:scale-[0.98] text-white p-6 rounded-3xl shadow-lg border-b-6 border-emerald-700 transition-all text-left flex flex-col justify-between min-h-[170px]"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-transform">
              📖
            </div>
            <span className="bg-emerald-400/40 text-emerald-100 text-xs font-black px-2.5 py-1 rounded-full border border-emerald-300/40 uppercase tracking-wider">
              {language === 'ur' ? '۴ اسباق' : '4 Lessons'}
            </span>
          </div>

          <div className={`mt-3 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
            <h2 className={`text-2xl font-black text-white leading-tight ${language === 'ur' ? 'font-urdu text-3xl' : ''}`}>
              {t.bigBtnLearnTitle}
            </h2>
            <p className={`text-emerald-100 text-xs md:text-sm font-medium mt-1 leading-snug ${language === 'ur' ? 'font-urdu text-sm' : ''}`}>
              {t.bigBtnLearnSub}
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between w-full pt-2 border-t border-emerald-400/30 text-xs font-bold text-amber-300">
            <span>{language === 'ur' ? 'ابھی شروع کریں' : 'Start Lesson 1'}</span>
            <div className="w-6 h-6 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </button>

        {/* 2. PRACTICE MODE (Sky Blue) */}
        <button
          onClick={() => {
            playClickSound();
            onNavigate('practice');
          }}
          className="group relative overflow-hidden bg-gradient-to-b from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 active:scale-[0.98] text-white p-6 rounded-3xl shadow-lg border-b-6 border-sky-800 transition-all text-left flex flex-col justify-between min-h-[170px]"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 group-hover:-rotate-6 transition-transform">
              🎙️
            </div>
            <span className="bg-sky-400/40 text-sky-100 text-xs font-black px-2.5 py-1 rounded-full border border-sky-300/40 uppercase tracking-wider">
              {language === 'ur' ? 'مائیکروفون' : 'Voice Lab'}
            </span>
          </div>

          <div className={`mt-3 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
            <h2 className={`text-2xl font-black text-white leading-tight ${language === 'ur' ? 'font-urdu text-3xl' : ''}`}>
              {t.bigBtnPracticeTitle}
            </h2>
            <p className={`text-sky-100 text-xs md:text-sm font-medium mt-1 leading-snug ${language === 'ur' ? 'font-urdu text-sm' : ''}`}>
              {t.bigBtnPracticeSub}
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between w-full pt-2 border-t border-sky-400/30 text-xs font-bold text-yellow-300">
            <span>{language === 'ur' ? 'آواز چیک کریں' : 'Listen & Repeat'}</span>
            <div className="w-6 h-6 rounded-full bg-yellow-300 text-yellow-950 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </button>

        {/* 3. PLAY GAMES (Gold / Amber) */}
        <button
          onClick={() => {
            playClickSound();
            onNavigate('games');
          }}
          className="group relative overflow-hidden bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-[0.98] text-white p-6 rounded-3xl shadow-lg border-b-6 border-amber-800 transition-all text-left flex flex-col justify-between min-h-[170px]"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 group-hover:rotate-12 transition-transform">
              🎮
            </div>
            <span className="bg-amber-400/40 text-amber-100 text-xs font-black px-2.5 py-1 rounded-full border border-amber-300/40 uppercase tracking-wider">
              {language === 'ur' ? 'ستارے کمائیں' : 'Earn Stars'}
            </span>
          </div>

          <div className={`mt-3 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
            <h2 className={`text-2xl font-black text-white leading-tight ${language === 'ur' ? 'font-urdu text-3xl' : ''}`}>
              {t.bigBtnGamesTitle}
            </h2>
            <p className={`text-amber-100 text-xs md:text-sm font-medium mt-1 leading-snug ${language === 'ur' ? 'font-urdu text-sm' : ''}`}>
              {t.bigBtnGamesSub}
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between w-full pt-2 border-t border-amber-400/30 text-xs font-bold text-emerald-900">
            <span className="text-white">{language === 'ur' ? 'کوئز اور لیٹر کیچ' : 'Play & Win'}</span>
            <div className="w-6 h-6 rounded-full bg-white text-amber-900 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </button>
      </div>

      {/* Featured Lesson 1 Card: Makharij Special */}
      <div className="bg-white rounded-3xl p-5 border-2 border-emerald-100 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🗣️</span>
            <div>
              <h3 className={`text-lg font-black text-slate-800 ${language === 'ur' ? 'font-urdu text-xl' : ''}`}>
                {language === 'ur' ? 'سبق ۱: مخارج الحروف (حروف کے گھر)' : 'Lesson 1: Makharij (Letter Homes)'}
              </h3>
              <p className={`text-xs text-slate-500 ${language === 'ur' ? 'font-urdu' : ''}`}>
                {language === 'ur' ? 'منہ اور گلے کے ۵ جادوئی مقامات دریافت کریں' : 'Interactive animated mouth diagram & audio recitation'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onOpenLesson('lesson_1_makharij');
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-md transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{t.startLearning}</span>
          </button>
        </div>

        {/* Quick sample letters row */}
        <div className="bg-amber-50/60 rounded-2xl p-3 border border-amber-200/60 flex items-center justify-between flex-wrap gap-2">
          <span className={`text-xs font-bold text-amber-900 ${language === 'ur' ? 'font-urdu text-sm' : ''}`}>
            {language === 'ur' ? 'آج کے خاص حروف:' : 'Featured letters today:'}
          </span>
          <div className="flex items-center gap-2">
            {['ء', 'ع', 'ح', 'ق', 'ف'].map((ltr, i) => (
              <span
                key={i}
                className="w-9 h-9 rounded-xl bg-white border border-emerald-300 text-emerald-800 font-arabic text-xl font-bold flex items-center justify-center shadow-xs"
              >
                {ltr}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Badges & Achievements Row */}
      <div className="bg-white rounded-3xl p-5 border-2 border-amber-100 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className={`text-lg font-black text-slate-800 ${language === 'ur' ? 'font-urdu text-xl' : ''}`}>
              {t.recentBadges}
            </h3>
          </div>
          <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
            {badges.filter((b) => b.unlocked).length} / {badges.length} {language === 'ur' ? 'حاصل کیے' : 'Unlocked'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              onClick={() => {
                if (badge.unlocked) playStarSound();
              }}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                badge.unlocked
                  ? 'bg-amber-50/80 border-amber-300 hover:scale-105 shadow-xs'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div className="text-3xl mb-1">{badge.icon}</div>
              <h4 className={`text-xs font-bold text-slate-800 truncate ${language === 'ur' ? 'font-urdu' : ''}`}>
                {language === 'ur' ? badge.titleUr : badge.titleEn}
              </h4>
              <span className="text-[10px] text-amber-600 font-semibold block mt-0.5">
                {badge.unlocked ? (language === 'ur' ? 'ملا ہوا ہے ⭐' : 'Unlocked ⭐') : `${badge.requiredStars} ⭐`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

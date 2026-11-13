import React, { useState } from 'react';
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  FileText,
  Calendar,
  Award,
  Sparkles,
  Lock,
  Unlock,
  Printer,
  ChevronRight,
  TrendingUp,
  X,
} from 'lucide-react';
import { ChildProfile, Language } from '../../types';
import { UI_TRANSLATIONS } from '../../data/translations';
import { playClickSound, playSuccessFanfare } from '../../utils/audio';

interface ParentDashboardProps {
  profile: ChildProfile;
  language: Language;
  onUpdateProfile: (updated: Partial<ChildProfile>) => void;
  onClose: () => void;
  onNavigateToPractice: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  profile,
  language,
  onUpdateProfile,
  onClose,
  onNavigateToPractice,
}) => {
  const t = UI_TRANSLATIONS[language];

  // Parent security PIN gate (math challenge)
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [mathAnswer, setMathAnswer] = useState('');
  const [mathError, setMathError] = useState(false);

  // Settings edit mode
  const [tempName, setTempName] = useState(profile.name);
  const [tempAge, setTempAge] = useState(profile.age);
  const [showCertificate, setShowCertificate] = useState(false);

  // Math question: 8 + 6 = 14
  const num1 = 8;
  const num2 = 6;
  const correctAnswer = num1 + num2;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(mathAnswer.trim(), 10) === correctAnswer) {
      setIsUnlocked(true);
      setMathError(false);
      playSuccessFanfare();
    } else {
      setMathError(true);
      playClickSound();
    }
  };

  const handleSaveSettings = () => {
    playClickSound();
    onUpdateProfile({
      name: tempName,
      age: tempAge,
    });
    alert(language === 'ur' ? 'تبدیلیاں محفوظ ہو گئیں!' : 'Profile updated successfully!');
  };

  return (
    <div className={`space-y-6 pb-20 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
      {/* Top Bar with Close button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-indigo-600" />
          <h2 className={`text-xl md:text-2xl font-black text-slate-800 ${language === 'ur' ? 'font-urdu text-2xl md:text-3xl' : ''}`}>
            {t.parentTitle}
          </h2>
        </div>

        <button
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all active:scale-95"
          title="Close Parent Zone"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* SECURITY GATE MODAL IF NOT UNLOCKED */}
      {!isUnlocked ? (
        <div className="bg-white rounded-3xl p-8 border-2 border-indigo-200 shadow-xl max-w-md mx-auto text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-indigo-50 border-2 border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h3 className={`text-xl font-black text-slate-800 ${language === 'ur' ? 'font-urdu text-2xl' : ''}`}>
              {language === 'ur' ? 'صرف والدین کے لیے حفاظتی گیٹ' : 'Parent Security Gate'}
            </h3>
            <p className={`text-xs text-slate-500 mt-1 ${language === 'ur' ? 'font-urdu text-sm' : ''}`}>
              {language === 'ur'
                ? `والدین تصدیق کریں: ${num1} + ${num2} کتنے ہوتے ہیں؟`
                : `Please verify you are a parent: What is ${num1} + ${num2}?`}
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-3">
            <input
              type="number"
              value={mathAnswer}
              onChange={(e) => {
                setMathAnswer(e.target.value);
                setMathError(false);
              }}
              placeholder="?"
              className="w-28 text-center text-2xl font-black p-2 border-2 border-slate-300 rounded-2xl focus:border-indigo-500 outline-none mx-auto block"
              autoFocus
            />

            {mathError && (
              <p className="text-xs text-rose-600 font-bold">
                {language === 'ur' ? 'غلط جواب! دوبارہ کوشش کریں۔' : 'Incorrect answer, please try again.'}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-2xl shadow-md transition-transform active:scale-95"
            >
              {t.submitGate}
            </button>
          </form>
        </div>
      ) : (
        /* PARENT DASHBOARD MAIN CONTENT */
        <div className="space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Score */}
            <div className="bg-white p-4 rounded-3xl border-2 border-emerald-100 shadow-sm flex flex-col justify-between">
              <span className={`text-xs font-bold text-slate-400 ${language === 'ur' ? 'font-urdu' : ''}`}>
                {t.tajweedScoreLabel}
              </span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-black text-emerald-700">{profile.tajweedScore}%</span>
                <span className="text-xs font-bold text-emerald-600">
                  {language === 'ur' ? 'ممتاز' : 'A+'}
                </span>
              </div>
              <div className="w-full h-2 bg-emerald-100 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${profile.tajweedScore}%` }} />
              </div>
            </div>

            {/* Lessons */}
            <div className="bg-white p-4 rounded-3xl border-2 border-sky-100 shadow-sm flex flex-col justify-between">
              <span className={`text-xs font-bold text-slate-400 ${language === 'ur' ? 'font-urdu' : ''}`}>
                {t.completedLessonsLabel}
              </span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-black text-sky-700">{profile.completedLessons.length}</span>
                <span className="text-xs font-bold text-slate-400">/ 4</span>
              </div>
              <div className="w-full h-2 bg-sky-100 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: `${(profile.completedLessons.length / 4) * 100}%` }} />
              </div>
            </div>

            {/* Streak */}
            <div className="bg-white p-4 rounded-3xl border-2 border-amber-100 shadow-sm flex flex-col justify-between">
              <span className={`text-xs font-bold text-slate-400 ${language === 'ur' ? 'font-urdu' : ''}`}>
                {t.dailyStreak}
              </span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-black text-amber-600">{profile.streakDays}</span>
                <span className="text-xs font-bold text-amber-700">{language === 'ur' ? 'دن' : 'Days'}</span>
              </div>
              <span className="text-[11px] text-emerald-700 font-bold mt-1">
                {language === 'ur' ? 'فعال حاضری 🚀' : 'Active learner 🚀'}
              </span>
            </div>

            {/* Practice Count */}
            <div className="bg-white p-4 rounded-3xl border-2 border-purple-100 shadow-sm flex flex-col justify-between">
              <span className={`text-xs font-bold text-slate-400 ${language === 'ur' ? 'font-urdu' : ''}`}>
                {language === 'ur' ? 'تلفظ ٹیسٹ کی تعداد' : 'Pronunciation Tests'}
              </span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-black text-purple-700">{profile.totalPracticeCount}</span>
                <span className="text-xs font-bold text-slate-400">{language === 'ur' ? 'بار' : 'tests'}</span>
              </div>
              <span className="text-[11px] text-purple-700 font-bold mt-1">
                {language === 'ur' ? 'بہترین مستقل مزاجی' : 'Great consistency!'}
              </span>
            </div>
          </div>

          {/* Weekly Attendance 7-Day Chart */}
          <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <h4 className={`text-sm font-black text-slate-800 ${language === 'ur' ? 'font-urdu text-base' : ''}`}>
                  {t.weeklyAttendance}
                </h4>
              </div>
              <span className="text-xs text-slate-500 font-bold">
                {language === 'ur' ? 'ہفتہ وار ریکارڈ' : 'Current Week'}
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2 pt-2">
              {profile.weeklyActivity.map((day, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    day.active
                      ? 'bg-emerald-50 border-emerald-300 shadow-xs'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <span className={`block text-xs font-bold text-slate-600 ${language === 'ur' ? 'font-urdu' : ''}`}>
                    {language === 'ur' ? day.dayUr : day.day}
                  </span>
                  <div className="my-1.5 flex justify-center">
                    {day.active ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold block">
                    {day.minutes}m
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Weak Letters & Areas Needing Practice */}
          <div className="bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <div>
                  <h4 className={`text-sm font-black text-slate-800 ${language === 'ur' ? 'font-urdu text-base' : ''}`}>
                    {t.weakLettersTitle}
                  </h4>
                  <p className={`text-xs text-slate-500 ${language === 'ur' ? 'font-urdu' : ''}`}>
                    {t.weakLettersSub}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  playClickSound();
                  onNavigateToPractice();
                }}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black rounded-xl text-xs shadow-xs flex items-center gap-1"
              >
                <span>{language === 'ur' ? 'مشق کریں' : 'Practice Now'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {profile.weakLetters.map((wl, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-white border border-amber-300 text-amber-950 font-arabic text-2xl font-bold flex items-center justify-center shadow-xs">
                      {wl.letter}
                    </span>
                    <div>
                      <h5 className={`text-xs font-bold text-slate-800 ${language === 'ur' ? 'font-urdu text-sm' : ''}`}>
                        {language === 'ur' ? wl.nameUr : wl.nameEn}
                      </h5>
                      <span className="text-[10px] text-slate-500">
                        {wl.practiceCount} {language === 'ur' ? 'بار مشق کی' : 'sessions'}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-black text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                    {wl.accuracy}% {language === 'ur' ? 'درستی' : 'Acc'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Report Card Button & Settings */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                playClickSound();
                setShowCertificate(true);
              }}
              className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs md:text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>{t.printReport}</span>
            </button>
          </div>

          {/* Child Profile Settings Card */}
          <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200 space-y-3">
            <h4 className={`text-sm font-black text-slate-800 ${language === 'ur' ? 'font-urdu text-base' : ''}`}>
              {t.childSettings}
            </h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className={`block text-xs font-bold text-slate-600 mb-1 ${language === 'ur' ? 'font-urdu' : ''}`}>
                  {t.childName}
                </label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="w-full sm:w-32">
                <label className={`block text-xs font-bold text-slate-600 mb-1 ${language === 'ur' ? 'font-urdu' : ''}`}>
                  {language === 'ur' ? 'عمر:' : 'Age:'}
                </label>
                <input
                  type="number"
                  value={tempAge}
                  onChange={(e) => setTempAge(parseInt(e.target.value, 10) || 8)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-transform active:scale-95"
            >
              {t.saveSettings}
            </button>
          </div>
        </div>
      )}

      {/* OFFICIAL REPORT CARD MODAL */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border-4 border-amber-400 shadow-2xl relative text-center space-y-4">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-300 mx-auto flex items-center justify-center text-3xl">
              📜
            </div>

            <div>
              <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 uppercase tracking-widest">
                Official Report Card
              </span>
              <h3 className={`text-xl md:text-2xl font-black text-slate-800 mt-2 ${language === 'ur' ? 'font-urdu text-2xl' : ''}`}>
                {t.officialCertificateTitle}
              </h3>
            </div>

            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 text-center space-y-2">
              <span className={`text-xs text-slate-500 block ${language === 'ur' ? 'font-urdu' : ''}`}>
                {t.issuedTo}
              </span>
              <h4 className="text-2xl font-extrabold text-emerald-900 underline decoration-wavy decoration-amber-400">
                {profile.name} ({profile.age} yrs)
              </h4>
              <p className={`text-xs font-bold text-amber-900 ${language === 'ur' ? 'font-urdu text-sm' : ''}`}>
                {t.grade}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-50 p-2 rounded-xl border">
                <span className="text-slate-400 block">Lessons</span>
                <span className="font-black text-emerald-700 text-sm">{profile.completedLessons.length} / 4</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border">
                <span className="text-slate-400 block">Score</span>
                <span className="font-black text-emerald-700 text-sm">{profile.tajweedScore}%</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border">
                <span className="text-slate-400 block">Streak</span>
                <span className="font-black text-amber-600 text-sm">{profile.streakDays} Days</span>
              </div>
            </div>

            <p className={`text-xs text-slate-500 italic ${language === 'ur' ? 'font-urdu' : ''}`}>
              {language === 'ur'
                ? 'قاری زید اور تجوید کڈز کی طرف سے شاندار کارکردگی کی سند۔ بارک اللہ فیکم!'
                : 'Commended for diligent Quranic pronunciation & Makharij perfection by Qari Zayd.'}
            </p>

            <button
              onClick={() => window.print()}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'ur' ? 'رپورٹ پرنٹ / ڈاؤنلوڈ کریں' : 'Print / Save Report'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

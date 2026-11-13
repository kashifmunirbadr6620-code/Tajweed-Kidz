import React, { useState } from 'react';
import {
  Edit3,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Volume2,
  Download,
  Upload,
  CheckCircle,
  ExternalLink,
  Copy,
  Check,
  FileText,
  Image,
  Layers,
  Sparkles,
  BookOpen,
  Mic,
  HelpCircle,
  Shield,
  Smartphone,
  Package,
  X,
} from 'lucide-react';
import { Language, PracticeWord, LessonData, QuizQuestion } from '../../types';
import { PRACTICE_WORDS, TAJWEED_LESSONS, QUIZ_QUESTIONS } from '../../data/tajweedData';
import { UI_TRANSLATIONS } from '../../data/translations';
import { playClickSound, playSuccessFanfare, speakTajweedLetter } from '../../utils/audio';

interface EditorViewProps {
  language: Language;
  onClose?: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const EditorView: React.FC<EditorViewProps> = ({
  language,
  onClose,
  onNavigateToTab,
}) => {
  const t = UI_TRANSLATIONS[language];
  const [activeEditorTab, setActiveEditorTab] = useState<'words' | 'lessons' | 'quiz' | 'playstore'>('words');

  // Local storage backed state for practice words
  const [words, setWords] = useState<PracticeWord[]>(() => {
    const saved = localStorage.getItem('tajweed_custom_words');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return PRACTICE_WORDS;
  });

  // Local storage backed state for quizzes
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>(() => {
    const saved = localStorage.getItem('tajweed_custom_quizzes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return QUIZ_QUESTIONS;
  });

  // State for adding a new practice word
  const [newWordArabic, setNewWordArabic] = useState('');
  const [newWordTranslit, setNewWordTranslit] = useState('');
  const [newWordRuleEn, setNewWordRuleEn] = useState('Qalqalah');
  const [newWordRuleUr, setNewWordRuleUr] = useState('قلقلہ');
  const [newWordCategory, setNewWordCategory] = useState('qualqalah');
  const [newWordTipEn, setNewWordTipEn] = useState('');
  const [newWordTipUr, setNewWordTipUr] = useState('');
  const [showAddWordModal, setShowAddWordModal] = useState(false);

  // State for Play Store bundle copies
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleSaveWords = (updatedWords: PracticeWord[]) => {
    setWords(updatedWords);
    localStorage.setItem('tajweed_custom_words', JSON.stringify(updatedWords));
    playSuccessFanfare();
  };

  const handleAddNewWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWordArabic.trim()) return;

    const newWord: PracticeWord = {
      id: `custom_${Date.now()}`,
      arabic: newWordArabic.trim(),
      letter: newWordArabic.trim().slice(-2),
      ruleTag: newWordRuleEn,
      ruleTagUr: newWordRuleUr,
      tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      transliteration: newWordTranslit || newWordArabic,
      category: newWordCategory,
      tipEn: newWordTipEn || 'Practice reciting clearly with proper Tajweed.',
      tipUr: newWordTipUr || 'تجوید کے اصول کے مطابق واضح پڑھیں۔',
      difficulty: 'easy',
    };

    const updated = [newWord, ...words];
    handleSaveWords(updated);

    // Reset form
    setNewWordArabic('');
    setNewWordTranslit('');
    setNewWordTipEn('');
    setNewWordTipUr('');
    setShowAddWordModal(false);
  };

  const handleDeleteWord = (id: string) => {
    playClickSound();
    if (confirm(language === 'ur' ? 'کیا آپ اس لفظ کو حذف کرنا چاہتے ہیں؟' : 'Are you sure you want to delete this word?')) {
      const updated = words.filter((w) => w.id !== id);
      handleSaveWords(updated);
    }
  };

  const handleResetDefaults = () => {
    playClickSound();
    if (confirm(language === 'ur' ? 'کیا آپ بنیادی اسباق اور الفاظ کو بحال کرنا چاہتے ہیں؟' : 'Reset all content to original defaults?')) {
      localStorage.removeItem('tajweed_custom_words');
      localStorage.removeItem('tajweed_custom_quizzes');
      setWords(PRACTICE_WORDS);
      setQuizzes(QUIZ_QUESTIONS);
      playSuccessFanfare();
    }
  };

  const handleExportJSON = () => {
    playClickSound();
    const data = {
      words,
      quizzes,
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tajweed-kids-custom-curriculum.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = (text: string, id: string) => {
    playClickSound();
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const appOrigin = window.location.origin;
  const privacyPolicyUrl = `${appOrigin}/privacy.html`;

  // Play Store Listing Texts
  const playStoreTitle = "Tajweed Kids - بچوں کے لیے تجوید";
  const playStoreShortDesc = "Fun, colorful Tajweed & Quran learning app for kids with animated Makharij & games.";
  const playStoreShortDescUr = "بچوں کے لیے تجوید القرآن اور مخارج سکھانے والی دلچسپ کارٹون اور گیمز والی ایپ۔";
  const playStoreFullDesc = `Tajweed Kids is an interactive, colorful, and fun educational app designed for Muslim children (ages 5-12) to learn Tajweed-ul-Quran and Makharij easily and joyfully!

★ KEY FEATURES:
• 100% Ad-Free & Child Safe: Designed under Google Play Families policy.
• Animated Makharij Map: Interactive anatomical mouth and throat diagram showing where each Arabic letter originates (Throat, Tongue, Lips, Nose, Empty Mouth).
• 4 Fun Structured Lessons: Makharij, Harakat, Sukoon, Tanween, Qalqalah bouncing balls, Ghunna humming bee, Madd stretch, and Noon Sakin rules (Izhar, Ikhfa, Idgham, Iqlab).
• Voice Practice & Pronunciation Checker: Children listen to Qari Zayd, record their voice with the built-in microphone, compare recordings, and get instant celebratory green tick feedback!
• Fun Mini-Games: Makharij Detective Quiz & Catch the Tajweed Letter arcade game.
• Family Leaderboard & Badges: Earn golden stars, unlock trophy badges, and track family progress.
• Parent Dashboard: Monitor attendance, weak letters, and print official weekly progress report cards.
• Urdu + English Bilingual: Switch between authentic Urdu (Nastaliq) and English anytime.

Make Quran recitation a daily adventure your child will love!`;

  return (
    <div className={`space-y-6 pb-24 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 text-white rounded-3xl p-5 sm:p-6 shadow-md border-2 border-purple-400">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-amber-950 font-black text-xs rounded-full mb-2 shadow-xs">
              <Edit3 className="w-3.5 h-3.5" />
              <span>{language === 'ur' ? 'تجوید اسٹوڈیو ایڈیٹر' : 'Tajweed Studio & Content Editor'}</span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-black ${language === 'ur' ? 'font-urdu text-3xl sm:text-4xl' : ''}`}>
              {language === 'ur' ? 'اسباق، الفاظ اور پلے اسٹور ایڈیٹر' : 'Curriculum & Play Store Editor'}
            </h1>
            <p className={`text-purple-100 text-xs sm:text-sm mt-1 max-w-xl ${language === 'ur' ? 'font-urdu text-base' : ''}`}>
              {language === 'ur'
                ? 'یہاں سے آپ قرآنی الفاظ، تجوید کے قواعد، کوئز، اور گوگل پلے اسٹور اپلوڈ پیکیج کا انتظام کر سکتے ہیں۔'
                : 'Manage Quranic words, Tajweed rules, quizzes, and Google Play Store publishing assets.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="px-3.5 py-2 bg-white/20 hover:bg-white/30 border border-white/40 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{language === 'ur' ? 'ایکسپورٹ JSON' : 'Export JSON'}</span>
            </button>

            <button
              onClick={handleResetDefaults}
              className="px-3.5 py-2 bg-rose-500/80 hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
              title="Reset Defaults"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'ur' ? 'ری سیٹ' : 'Reset'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor Tabs Navigation */}
      <div className={`flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto scrollbar-none ${language === 'ur' ? 'flex-row-reverse' : ''}`}>
        <button
          onClick={() => {
            playClickSound();
            setActiveEditorTab('words');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeEditorTab === 'words' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          } ${language === 'ur' ? 'font-urdu text-sm' : ''}`}
        >
          <Mic className="w-4 h-4" />
          <span>{language === 'ur' ? 'الفاظ و حروف ایڈیٹر' : 'Words Editor'}</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveEditorTab('lessons');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeEditorTab === 'lessons' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          } ${language === 'ur' ? 'font-urdu text-sm' : ''}`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{language === 'ur' ? 'اسباق کی تفصیلات' : 'Lessons Info'}</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveEditorTab('quiz');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeEditorTab === 'quiz' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          } ${language === 'ur' ? 'font-urdu text-sm' : ''}`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>{language === 'ur' ? 'کوئز سوالات' : 'Quiz Questions'}</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveEditorTab('playstore');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeEditorTab === 'playstore' ? 'bg-emerald-600 text-white shadow-md animate-pulse' : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
          } ${language === 'ur' ? 'font-urdu text-sm' : ''}`}
        >
          <Smartphone className="w-4 h-4" />
          <span>{language === 'ur' ? 'پلے اسٹور پبلشنگ کٹ' : 'Play Store Kit'}</span>
        </button>
      </div>

      {/* TAB 1: PRACTICE WORDS & VOCABULARY EDITOR */}
      {activeEditorTab === 'words' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-black text-slate-800 ${language === 'ur' ? 'font-urdu text-xl' : ''}`}>
                {language === 'ur' ? 'مشق کے الفاظ اور حروف' : 'Practice Words Catalog'}
              </h3>
              <p className={`text-xs text-slate-500 ${language === 'ur' ? 'font-urdu' : ''}`}>
                {language === 'ur' ? `کل ${words.length} الفاظ شامل ہیں جنہیں بچے بول کر چیک کر سکتے ہیں` : `Total ${words.length} words available for microphone voice testing`}
              </p>
            </div>

            <button
              onClick={() => {
                playClickSound();
                setShowAddWordModal(true);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ur' ? 'نیا لفظ شامل کریں' : 'Add New Word'}</span>
            </button>
          </div>

          {/* Words Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {words.map((w) => (
              <div
                key={w.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:border-indigo-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${w.tagColor} ${language === 'ur' ? 'font-urdu' : ''}`}>
                      {language === 'ur' ? w.ruleTagUr : w.ruleTag}
                    </span>

                    <button
                      onClick={() => handleDeleteWord(w.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                      title="Delete Word"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-center py-3">
                    <div className="text-4xl font-arabic font-extrabold text-slate-900 select-none">
                      {w.arabic}
                    </div>
                    <span className="text-xs font-bold text-indigo-700 block mt-1">
                      {w.transliteration}
                    </span>
                  </div>

                  <p className={`text-xs text-slate-600 bg-slate-50 p-2 rounded-xl line-clamp-2 ${language === 'ur' ? 'font-urdu text-sm' : ''}`}>
                    💡 {language === 'ur' ? w.tipUr : w.tipEn}
                  </p>
                </div>

                <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    {w.category}
                  </span>

                  <button
                    onClick={() => {
                      playClickSound();
                      speakTajweedLetter(w.arabic, w.transliteration, w.category);
                    }}
                    className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                    title="Test Audio"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{language === 'ur' ? 'آواز سنیں' : 'Play'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: LESSONS OVERVIEW & STRUCTURE */}
      {activeEditorTab === 'lessons' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-black text-slate-800 ${language === 'ur' ? 'font-urdu text-xl' : ''}`}>
              {language === 'ur' ? 'تجوید کے ۴ اساسی اسباق' : 'Core Tajweed Curriculum Levels'}
            </h3>
            <span className="text-xs text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full font-bold">
              {TAJWEED_LESSONS.length} {language === 'ur' ? 'اسباق' : 'Lessons'}
            </span>
          </div>

          <div className="space-y-3">
            {TAJWEED_LESSONS.map((l) => (
              <div
                key={l.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-4xl p-2 rounded-2xl bg-amber-50 border border-amber-200 shadow-xs">
                    {l.icon}
                  </span>
                  <div>
                    <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">
                      Level {l.number}
                    </span>
                    <h4 className={`text-base font-black text-slate-800 ${language === 'ur' ? 'font-urdu text-lg' : ''}`}>
                      {language === 'ur' ? l.titleUr : l.titleEn}
                    </h4>
                    <span className="text-xs font-arabic text-amber-700 font-bold block">
                      {l.arabicTitle}
                    </span>
                    <p className={`text-xs text-slate-500 mt-1 max-w-md ${language === 'ur' ? 'font-urdu' : ''}`}>
                      {language === 'ur' ? l.subtitleUr : l.subtitleEn}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
                    ⏱️ {l.estimatedMinutes} {t.duration}
                  </span>
                  <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
                    {l.steps.length} {language === 'ur' ? 'مراحل' : 'steps'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: QUIZ QUESTIONS */}
      {activeEditorTab === 'quiz' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-black text-slate-800 ${language === 'ur' ? 'font-urdu text-xl' : ''}`}>
              {language === 'ur' ? 'مخارج ڈیٹیکٹو کوئز کے سوالات' : 'Makharij Quiz Bank'}
            </h3>
            <span className="text-xs text-amber-800 bg-amber-100 px-3 py-1 rounded-full font-bold">
              {quizzes.length} {language === 'ur' ? 'سوالات' : 'Questions'}
            </span>
          </div>

          <div className="space-y-3">
            {quizzes.map((q, qIdx) => (
              <div key={q.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-400">
                    #{qIdx + 1}
                  </span>
                  {q.arabicLetter && (
                    <span className="w-9 h-9 rounded-xl bg-amber-100 text-amber-950 font-arabic text-2xl font-bold flex items-center justify-center border border-amber-300">
                      {q.arabicLetter}
                    </span>
                  )}
                </div>

                <h4 className={`text-sm font-bold text-slate-800 ${language === 'ur' ? 'font-urdu text-base' : ''}`}>
                  {language === 'ur' ? q.questionUr : q.questionEn}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.options.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between ${
                        opt.isCorrect
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className={language === 'ur' ? 'font-urdu' : ''}>
                        {language === 'ur' ? opt.textUr : opt.textEn}
                      </span>
                      {opt.isCorrect && <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 ml-1" />}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: GOOGLE PLAY STORE LAUNCH KIT (پلے اسٹور پبلشنگ کٹ) */}
      {activeEditorTab === 'playstore' && (
        <div className="space-y-5">
          {/* Play Store Readiness Checklist */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <h3 className={`text-lg font-black text-emerald-950 ${language === 'ur' ? 'font-urdu text-xl' : ''}`}>
                  {language === 'ur' ? 'گوگل پلے اسٹور پبلشنگ کٹ (۱۰۰٪ مکمل)' : 'Google Play Store Publishing Bundle (100% Ready)'}
                </h3>
                <p className={`text-xs text-emerald-900 ${language === 'ur' ? 'font-urdu text-sm' : ''}`}>
                  {language === 'ur'
                    ? 'پلے اسٹور پر اپلوڈ کرنے کے لیے درکار تمام فائلیں، گرافکس، اور تفصیلات تیار ہیں:'
                    : 'All required Android App Bundle files, 1024x500 Feature Graphic, 512x512 Icon, and COPPA Privacy Policy are prepared:'}
                </p>
              </div>
            </div>

            {/* Downloads Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <a
                href="/tajweed-kids-android-project.zip"
                download="tajweed-kids-android-project.zip"
                onClick={() => playClickSound()}
                className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-sm flex flex-col items-center justify-center text-center transition-transform active:scale-95"
              >
                <Package className="w-5 h-5 mb-1" />
                <span className="text-xs font-black">
                  {language === 'ur' ? 'مکمل اینڈرائیڈ پروجیکٹ (.zip)' : 'Android Studio Project (.zip)'}
                </span>
                <span className="text-[10px] text-emerald-100 mt-0.5">
                  Generate .AAB &amp; .APK
                </span>
              </a>

              <a
                href="/playstore-feature-graphic.png"
                download="playstore-feature-graphic.png"
                onClick={() => playClickSound()}
                className="p-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl shadow-sm flex flex-col items-center justify-center text-center transition-transform active:scale-95"
              >
                <Image className="w-5 h-5 mb-1" />
                <span className="text-xs font-black">
                  {language === 'ur' ? 'فیچر گرافک (1024x500)' : 'Feature Graphic (1024x500)'}
                </span>
                <span className="text-[10px] text-amber-100 mt-0.5">
                  Play Store Banner PNG
                </span>
              </a>

              <a
                href="/playstore-icon-512.png"
                download="playstore-icon-512.png"
                onClick={() => playClickSound()}
                className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-sm flex flex-col items-center justify-center text-center transition-transform active:scale-95"
              >
                <Smartphone className="w-5 h-5 mb-1" />
                <span className="text-xs font-black">
                  {language === 'ur' ? 'ہائی ریزولوشن آئیکون (512x512)' : 'High-Res Icon (512x512)'}
                </span>
                <span className="text-[10px] text-indigo-100 mt-0.5">
                  Play Store App Icon
                </span>
              </a>
            </div>
          </div>

          {/* Privacy Policy URL Card */}
          <div className="bg-white rounded-3xl p-5 border-2 border-indigo-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" />
                <h4 className={`text-sm font-black text-slate-800 ${language === 'ur' ? 'font-urdu text-base' : ''}`}>
                  {language === 'ur' ? 'رازداری کی پالیسی (Privacy Policy URL - لازمی)' : 'Live Privacy Policy URL (Required by Play Console)'}
                </h4>
              </div>

              <a
                href={privacyPolicyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-bold"
              >
                <span>{language === 'ur' ? 'صفحہ دیکھیں' : 'View Page'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <p className={`text-xs text-slate-500 ${language === 'ur' ? 'font-urdu' : ''}`}>
              {language === 'ur'
                ? 'گوگل پلے کنسول میں بچوں کی ایپس (Families Policy) کے لیے پرائیویسی پالیسی کا لائیو لنک درج کرنا لازمی ہوتا ہے۔ آپ کا یہ لنک مکمل تیار ہے:'
                : 'Google Play strictly requires a live Privacy Policy URL for all apps targeting children. Use this direct URL in Play Console:'}
            </p>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
              <span className="text-xs font-mono text-indigo-900 truncate flex-1 dir-ltr">
                {privacyPolicyUrl}
              </span>
              <button
                onClick={() => handleCopy(privacyPolicyUrl, 'privacy')}
                className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs"
              >
                {copiedText === 'privacy' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedText === 'privacy' ? 'کاپی ہو گیا' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Play Store Listing Copy-Paste Text */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h4 className={`text-base font-black text-slate-800 ${language === 'ur' ? 'font-urdu text-lg' : ''}`}>
              {language === 'ur' ? 'پلے اسٹور ٹائٹل اور تفصیلات (Copy-Paste Text)' : 'Play Store Listing Descriptions (Copy-Paste Ready)'}
            </h4>

            {/* App Title */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-600">
                  App Name (≤ 30 characters)
                </label>
                <button
                  onClick={() => handleCopy(playStoreTitle, 'title')}
                  className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
                >
                  {copiedText === 'title' ? 'Copied!' : 'Copy Title'}
                </button>
              </div>
              <input
                type="text"
                readOnly
                value={playStoreTitle}
                className="w-full p-2.5 bg-slate-50 border rounded-xl text-sm font-bold text-slate-800"
              />
            </div>

            {/* Short Description */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-600">
                  Short Description (≤ 80 characters)
                </label>
                <button
                  onClick={() => handleCopy(playStoreShortDesc, 'short')}
                  className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
                >
                  {copiedText === 'short' ? 'Copied!' : 'Copy Short Desc'}
                </button>
              </div>
              <textarea
                readOnly
                rows={2}
                value={playStoreShortDesc}
                className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs font-medium text-slate-800"
              />
            </div>

            {/* Full Description */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-600">
                  Full Description (Google Play Listing)
                </label>
                <button
                  onClick={() => handleCopy(playStoreFullDesc, 'full')}
                  className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
                >
                  {copiedText === 'full' ? 'Copied!' : 'Copy Full Desc'}
                </button>
              </div>
              <textarea
                readOnly
                rows={8}
                value={playStoreFullDesc}
                className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs font-mono text-slate-800"
              />
            </div>

            {/* Target Audience & Questionnaire Answers */}
            <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 text-xs text-slate-700 space-y-1.5">
              <span className={`font-bold block text-amber-950 ${language === 'ur' ? 'font-urdu text-sm' : ''}`}>
                {language === 'ur' ? 'پلے کنسول کے سوالنامے (Target Audience Answers):' : 'Google Play Console Policy Settings:'}
              </span>
              <ul className={`list-disc list-inside space-y-1 ${language === 'ur' ? 'font-urdu text-sm' : ''}`}>
                <li><strong>Target Age:</strong> Ages 5–12 (Select 5 &amp; under, 6–8, 9–12).</li>
                <li><strong>Category:</strong> Education (تعلیم).</li>
                <li><strong>Contains Ads:</strong> No (کوئی اشتہار نہیں ہے).</li>
                <li><strong>Families Policy:</strong> Compliant (Designed for Families).</li>
                <li><strong>Permissions:</strong> Microphone (used solely on-device for recitation audio comparison).</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW PRACTICE WORD MODAL */}
      {showAddWordModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            dir={language === 'ur' ? 'rtl' : 'ltr'}
            className="bg-white rounded-3xl max-w-md w-full p-6 border-4 border-indigo-400 shadow-2xl relative space-y-4"
          >
            <button
              onClick={() => setShowAddWordModal(false)}
              className={`absolute top-4 ${language === 'ur' ? 'left-4' : 'right-4'} p-1.5 rounded-full bg-slate-100 hover:bg-slate-200`}
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className={`text-xl font-black text-slate-800 ${language === 'ur' ? 'font-urdu text-2xl' : ''}`}>
              {language === 'ur' ? 'نیا قرآنی لفظ شامل کریں' : 'Add Quranic Practice Word'}
            </h3>

            <form onSubmit={handleAddNewWord} className="space-y-3">
              <div>
                <label className={`block text-xs font-bold text-slate-600 mb-1 ${language === 'ur' ? 'font-urdu' : ''}`}>
                  {language === 'ur' ? 'عربی لفظ (اعراب کے ساتھ):' : 'Arabic Word (with Harakat):'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="جیسے: قُلْ أَعُوذُ"
                  value={newWordArabic}
                  onChange={(e) => setNewWordArabic(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl text-xl font-arabic font-bold text-center focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className={`block text-xs font-bold text-slate-600 mb-1 ${language === 'ur' ? 'font-urdu' : ''}`}>
                  {language === 'ur' ? 'تلفظ (English Transliteration):' : 'Transliteration:'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Qul A'oodhu"
                  value={newWordTranslit}
                  onChange={(e) => setNewWordTranslit(e.target.value)}
                  className="w-full p-2 bg-slate-50 border rounded-xl text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={`block text-xs font-bold text-slate-600 mb-1 ${language === 'ur' ? 'font-urdu' : ''}`}>
                    {language === 'ur' ? 'قاعدہ (اردو):' : 'Rule Tag (Urdu):'}
                  </label>
                  <input
                    type="text"
                    value={newWordRuleUr}
                    onChange={(e) => setNewWordRuleUr(e.target.value)}
                    className="w-full p-2 bg-slate-50 border rounded-xl text-xs font-bold font-urdu"
                  />
                </div>
                <div>
                  <label className={`block text-xs font-bold text-slate-600 mb-1 ${language === 'ur' ? 'font-urdu' : ''}`}>
                    {language === 'ur' ? 'قاعدہ (English):' : 'Rule Tag (English):'}
                  </label>
                  <input
                    type="text"
                    value={newWordRuleEn}
                    onChange={(e) => setNewWordRuleEn(e.target.value)}
                    className="w-full p-2 bg-slate-50 border rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold text-slate-600 mb-1 ${language === 'ur' ? 'font-urdu' : ''}`}>
                  {language === 'ur' ? 'پڑھنے کی ٹپ (اردو):' : 'Recitation Tip (Urdu):'}
                </label>
                <input
                  type="text"
                  placeholder="حرف کو نرمی سے ادا کریں..."
                  value={newWordTipUr}
                  onChange={(e) => setNewWordTipUr(e.target.value)}
                  className="w-full p-2 bg-slate-50 border rounded-xl text-xs font-urdu"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition-transform active:scale-95"
              >
                {language === 'ur' ? 'لفظ محفوظ کریں' : 'Save Word'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

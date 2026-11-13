import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { BookOpen, CheckCircle, Volume2, ArrowLeft, ArrowRight, Star, Sparkles, Play, Award } from 'lucide-react';
import { LessonData, Language, MakhrajPoint } from '../../types';
import { TAJWEED_LESSONS, MAKHARIJ_POINTS } from '../../data/tajweedData';
import { UI_TRANSLATIONS } from '../../data/translations';
import { MouthDiagram } from '../MouthDiagram';
import { QariAvatar } from '../QariAvatar';
import {
  playClickSound,
  playStarSound,
  playSuccessFanfare,
  playBounceSound,
  playGhunnaHum,
  playMaddStretch,
  speakTajweedLetter,
} from '../../utils/audio';

interface LessonsViewProps {
  language: Language;
  completedLessons: string[];
  onCompleteLesson: (lessonId: string, starsEarned: number) => void;
  initialLessonId?: string | null;
  onBackToHome?: () => void;
}

export const LessonsView: React.FC<LessonsViewProps> = ({
  language,
  completedLessons,
  onCompleteLesson,
  initialLessonId,
  onBackToHome,
}) => {
  const t = UI_TRANSLATIONS[language];
  const [activeLessonId, setActiveLessonId] = useState<string | null>(initialLessonId || null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedMakhraj, setSelectedMakhraj] = useState<MakhrajPoint>(MAKHARIJ_POINTS[0]);

  // Interactive toy states
  const [interactiveVowel, setInteractiveVowel] = useState<'fatha' | 'kasra' | 'damma' | 'sukoon' | 'tanween'>('fatha');
  const [interactiveLetter, setInteractiveLetter] = useState('ب');
  const [maddCounts, setMaddCounts] = useState(4);
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);
  const [isQuizCorrect, setIsQuizCorrect] = useState<boolean | null>(null);

  const activeLesson = TAJWEED_LESSONS.find((l) => l.id === activeLessonId);

  const handleSelectLesson = (lessonId: string) => {
    playClickSound();
    setActiveLessonId(lessonId);
    setCurrentStepIndex(0);
    setQuizAnswered(null);
    setIsQuizCorrect(null);
  };

  const handleNextStep = () => {
    if (!activeLesson) return;
    playClickSound();
    if (currentStepIndex < activeLesson.steps.length) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevStep = () => {
    playClickSound();
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleAnswerQuiz = (optionIdx: number, correctIdx: number) => {
    setQuizAnswered(optionIdx);
    const correct = optionIdx === correctIdx;
    setIsQuizCorrect(correct);

    if (correct) {
      playSuccessFanfare();
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
      if (activeLessonId && !completedLessons.includes(activeLessonId)) {
        onCompleteLesson(activeLessonId, 25);
      }
    } else {
      playClickSound();
    }
  };

  // Vowel sandbox helper
  const getVowelLetterString = (letter: string, vowel: string) => {
    switch (vowel) {
      case 'fatha':
        return `${letter}َ`;
      case 'kasra':
        return `${letter}ِ`;
      case 'damma':
        return `${letter}ُ`;
      case 'sukoon':
        return `أَ${letter}ْ`;
      case 'tanween':
        return `${letter}ً`;
      default:
        return letter;
    }
  };

  return (
    <div className={`space-y-6 pb-20 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
      {/* If No Lesson is selected, show the 4 Lessons Catalog */}
      {!activeLesson ? (
        <div className="space-y-5">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-6 shadow-md border-2 border-emerald-400">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <span className="inline-block bg-amber-400 text-amber-950 font-black text-xs px-3 py-1 rounded-full mb-2">
                  {language === 'ur' ? 'قرآنی تجوید کا نصاب' : 'Fun Tajweed Curriculum'}
                </span>
                <h1 className={`text-2xl md:text-3xl font-black ${language === 'ur' ? 'font-urdu text-3xl md:text-4xl' : ''}`}>
                  {t.lessonsTitle}
                </h1>
                <p className={`text-emerald-100 text-sm mt-1 max-w-lg ${language === 'ur' ? 'font-urdu text-base' : ''}`}>
                  {t.lessonsSub}
                </p>
              </div>

              <QariAvatar
                size="md"
                mood="pointing"
                speechText="Choose any lesson below! Each lesson is fun, animated, and only 3 minutes long."
                speechTextUr="نیچے سے کوئی بھی سبق منتخب کریں! ہر سبق تفریحی ہے اور صرف ۳ منٹ کا ہے۔"
                language={language}
              />
            </div>
          </div>

          {/* 4 Lessons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TAJWEED_LESSONS.map((lesson) => {
              const isCompleted = completedLessons.includes(lesson.id);
              return (
                <div
                  key={lesson.id}
                  onClick={() => handleSelectLesson(lesson.id)}
                  className="group bg-white rounded-3xl p-5 border-2 border-slate-200 hover:border-emerald-400 shadow-md hover:shadow-xl transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-amber-100 text-3xl flex items-center justify-center border-2 border-amber-200 shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-transform">
                        {lesson.icon}
                      </div>
                      <div>
                        <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">
                          {t.lessonPrefix} {lesson.number}
                        </span>
                        <h3 className={`text-lg font-black text-slate-800 leading-tight ${language === 'ur' ? 'font-urdu text-xl' : ''}`}>
                          {language === 'ur' ? lesson.titleUr : lesson.titleEn}
                        </h3>
                        <span className="text-xs text-amber-700 font-bold font-arabic block mt-0.5">
                          {lesson.arabicTitle}
                        </span>
                      </div>
                    </div>

                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-black border border-emerald-300">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        {language === 'ur' ? 'مکمل' : 'Done'}
                      </span>
                    )}
                  </div>

                  <p className={`text-xs text-slate-600 mt-3 leading-relaxed line-clamp-2 ${language === 'ur' ? 'font-urdu text-sm' : ''}`}>
                    {language === 'ur' ? lesson.overviewUr : lesson.overviewEn}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">
                      ⏱️ {lesson.estimatedMinutes} {t.duration}
                    </span>
                    <button className="px-4 py-1.5 bg-emerald-600 group-hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-1 transition-transform group-hover:translate-x-1">
                      <span>{t.startLessonBtn}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ACTIVE LESSON INTERACTIVE VIEWER */
        <div className="space-y-5">
          {/* Top navigation back button */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                playClickSound();
                setActiveLessonId(null);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-100 shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'ur' ? 'تمام اسباق' : 'Back to Lessons'}</span>
            </button>

            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              {t.lessonPrefix} {activeLesson.number} / 4
            </span>
          </div>

          {/* Lesson Header Banner */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-5 shadow-md border-2 border-emerald-400">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{activeLesson.icon}</span>
              <div>
                <h2 className={`text-xl md:text-2xl font-black ${language === 'ur' ? 'font-urdu text-2xl md:text-3xl' : ''}`}>
                  {language === 'ur' ? activeLesson.titleUr : activeLesson.titleEn}
                </h2>
                <p className={`text-emerald-100 text-xs md:text-sm font-medium ${language === 'ur' ? 'font-urdu text-sm' : ''}`}>
                  {language === 'ur' ? activeLesson.subtitleUr : activeLesson.subtitleEn}
                </p>
              </div>
            </div>

            {/* Step Progress Pills */}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-emerald-400/30">
              {activeLesson.steps.map((st, idx) => (
                <div
                  key={st.id}
                  onClick={() => {
                    playClickSound();
                    setCurrentStepIndex(idx);
                  }}
                  className={`flex-1 h-2 rounded-full cursor-pointer transition-all ${
                    idx <= currentStepIndex ? 'bg-amber-400 shadow-sm' : 'bg-emerald-900/50'
                  }`}
                />
              ))}
              <div
                onClick={() => {
                  playClickSound();
                  setCurrentStepIndex(activeLesson.steps.length);
                }}
                className={`flex-1 h-2 rounded-full cursor-pointer transition-all ${
                  currentStepIndex === activeLesson.steps.length ? 'bg-amber-400' : 'bg-emerald-900/50'
                }`}
                title="Mini-Quiz"
              />
            </div>
          </div>

          {/* MAIN INTERACTIVE STEP CONTENT */}
          {currentStepIndex < activeLesson.steps.length ? (
            <div className="space-y-4">
              {/* Qari Speech & Step Title Card */}
              <div className="bg-white rounded-3xl p-5 border-2 border-emerald-100 shadow-md">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <QariAvatar
                    mood={activeLesson.steps[currentStepIndex].animationType === 'bounce' ? 'cheering' : 'talking'}
                    speechText={activeLesson.steps[currentStepIndex].qariSpeechEn}
                    speechTextUr={activeLesson.steps[currentStepIndex].qariSpeechUr}
                    language={language}
                    size="md"
                    showSpeech={true}
                  />
                </div>
              </div>

              {/* SPECIFIC INTERACTIVE TOY BY LESSON */}
              {activeLesson.id === 'lesson_1_makharij' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-lg font-black text-slate-800 ${language === 'ur' ? 'font-urdu text-xl' : ''}`}>
                      {t.makharijMap}
                    </h3>
                    <span className="text-xs text-emerald-700 font-bold">
                      {language === 'ur' ? 'کلک کریں اور سنیں' : 'Interactive'}
                    </span>
                  </div>

                  <MouthDiagram
                    selectedMakhrajId={selectedMakhraj.id}
                    onSelectMakhraj={(m) => setSelectedMakhraj(m)}
                    makharijPoints={MAKHARIJ_POINTS}
                    language={language}
                  />
                </div>
              )}

              {activeLesson.id === 'lesson_2_harakat' && (
                <div className="bg-white rounded-3xl p-5 border-2 border-sky-200 shadow-md space-y-4">
                  <h3 className={`text-lg font-black text-slate-800 ${language === 'ur' ? 'font-urdu text-xl' : ''}`}>
                    {language === 'ur' ? 'حرکات ٹیسٹر: تبدیل کر کے سنیں' : 'Interactive Vowel Toy: Change & Listen!'}
                  </h3>

                  {/* Letter Selector */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-bold text-slate-500 ${language === 'ur' ? 'font-urdu' : ''}`}>
                      {language === 'ur' ? 'حرف چنیں:' : 'Pick Letter:'}
                    </span>
                    {['ب', 'ت', 'س', 'م', 'ر', 'ل'].map((ltr) => (
                      <button
                        key={ltr}
                        onClick={() => {
                          playClickSound();
                          setInteractiveLetter(ltr);
                        }}
                        className={`w-9 h-9 rounded-xl font-arabic text-lg font-bold transition-all ${
                          interactiveLetter === ltr
                            ? 'bg-sky-600 text-white shadow-md scale-105'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {ltr}
                      </button>
                    ))}
                  </div>

                  {/* Vowel Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { id: 'fatha', labelEn: 'Fatha (Zabar َ )', labelUr: 'زبر (فتحة)', sound: 'A' },
                      { id: 'kasra', labelEn: 'Kasra (Zer ِ )', labelUr: 'زیر (کسرة)', sound: 'E' },
                      { id: 'damma', labelEn: 'Damma (Pesh ُ )', labelUr: 'پیش (ضمة)', sound: 'U' },
                      { id: 'sukoon', labelEn: 'Sukoon (Jazm ْ )', labelUr: 'سکون (جزم)', sound: 'Stop' },
                      { id: 'tanween', labelEn: 'Tanween ( ً )', labelUr: 'تنوین (دو زبر)', sound: 'An' },
                    ].map((v) => (
                      <button
                        key={v.id}
                        onClick={() => {
                          setInteractiveVowel(v.id as any);
                          const str = getVowelLetterString(interactiveLetter, v.id);
                          speakTajweedLetter(str);
                        }}
                        className={`p-3 rounded-2xl border text-center transition-all active:scale-95 ${
                          interactiveVowel === v.id
                            ? 'bg-sky-500 text-white border-sky-600 shadow-md scale-102 font-bold'
                            : 'bg-sky-50/70 border-sky-200 text-sky-900 hover:bg-sky-100'
                        }`}
                      >
                        <span className="block text-xl font-bold font-arabic mb-0.5">
                          {interactiveLetter}
                          {v.id === 'fatha' && 'َ'}
                          {v.id === 'kasra' && 'ِ'}
                          {v.id === 'damma' && 'ُ'}
                          {v.id === 'sukoon' && 'ْ'}
                          {v.id === 'tanween' && 'ً'}
                        </span>
                        <span className={`text-[11px] block leading-tight ${language === 'ur' ? 'font-urdu' : ''}`}>
                          {language === 'ur' ? v.labelUr : v.labelEn}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Big Display Card */}
                  <div className="bg-gradient-to-b from-sky-50 to-blue-50 border-2 border-sky-300 rounded-2xl p-6 text-center">
                    <div className="text-7xl font-arabic font-extrabold text-sky-950 mb-3 drop-shadow-sm animate-bounce-fun">
                      {getVowelLetterString(interactiveLetter, interactiveVowel)}
                    </div>

                    <button
                      onClick={() => {
                        const str = getVowelLetterString(interactiveLetter, interactiveVowel);
                        speakTajweedLetter(str);
                      }}
                      className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black rounded-full shadow-md transition-transform active:scale-95 inline-flex items-center gap-2"
                    >
                      <Volume2 className="w-5 h-5" />
                      <span>{language === 'ur' ? 'آواز سنیں' : 'Hear Sound'}</span>
                    </button>
                  </div>
                </div>
              )}

              {activeLesson.id === 'lesson_3_qualqalah' && (
                <div className="bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-md space-y-4">
                  <h3 className={`text-lg font-black text-slate-800 ${language === 'ur' ? 'font-urdu text-xl' : ''}`}>
                    {language === 'ur' ? 'قلقلہ کی اچھلتی گیندیں: کلک کر کے اچھالیں!' : 'The 5 Qalqalah Bouncing Basketballs!'}
                  </h3>

                  {/* 5 Bouncing Letter Balls */}
                  <div className="grid grid-cols-5 gap-3 py-4">
                    {[
                      { letter: 'ق', word: 'الْفَلَقْ', name: 'Qaf' },
                      { letter: 'ط', word: 'مُحِيطْ', name: 'Taa' },
                      { letter: 'ب', word: 'وَتَبَّ', name: 'Baa' },
                      { letter: 'ج', word: 'بُرُوجْ', name: 'Jeem' },
                      { letter: 'د', word: 'أَحَدْ', name: 'Dal' },
                    ].map((item, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          playBounceSound();
                          speakTajweedLetter(item.word, undefined, 'qualqalah');
                        }}
                        className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-lg border-2 border-amber-300 transition-all hover:-translate-y-2 active:scale-95"
                      >
                        <span className="text-4xl font-arabic font-extrabold drop-shadow group-hover:scale-125 transition-transform">
                          {item.letter}ْ
                        </span>
                        <span className="text-xs font-bold mt-1 text-amber-100">
                          {item.name}
                        </span>
                        <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded-full mt-1">
                          Bounce! 🏀
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Ghunna Bee Toy */}
                  <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl animate-wiggle">🐝</span>
                      <div>
                        <h4 className={`text-sm font-bold text-amber-950 ${language === 'ur' ? 'font-urdu text-base' : ''}`}>
                          {language === 'ur' ? 'شہد کی مکھی کا غنہ (نّ اور مّ)' : 'The Sweet Ghunna Honeybee'}
                        </h4>
                        <p className={`text-xs text-amber-800 ${language === 'ur' ? 'font-urdu' : ''}`}>
                          {language === 'ur' ? '۲ سیکنڈ کے لیے ناک میں گنگناہٹ روکیں' : 'Hold the sound in your nose for 2 counts!'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        playGhunnaHum();
                        speakTajweedLetter('إِنَّ', undefined, 'ghunna');
                      }}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full text-xs font-black shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>{language === 'ur' ? 'غنہ سنیں (إِنَّ)' : 'Test Ghunna (Inna)'}</span>
                    </button>
                  </div>
                </div>
              )}

              {activeLesson.id === 'lesson_4_noon_sakin' && (
                <div className="bg-white rounded-3xl p-5 border-2 border-purple-200 shadow-md space-y-3">
                  <h3 className={`text-lg font-black text-slate-800 ${language === 'ur' ? 'font-urdu text-xl' : ''}`}>
                    {language === 'ur' ? 'نون ساکن کے ۴ جادوئی اصول' : 'The 4 Magic Noon Sakin Rules'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { nameEn: 'Izhar (Clear Sunlight ☀️)', nameUr: 'اظہار: بالکل صاف پڑھنا', ex: 'مَنْ آمَنَ', descEn: 'Read Noon clearly before throat letters' },
                      { nameEn: 'Ikhfa (Hide & Seek 🙈)', nameUr: 'اخفاء: ناک میں ہلکا چھپانا', ex: 'مِن قَبْلُ', descEn: 'Whisper sound into nose before 15 letters' },
                      { nameEn: 'Idgham (Smoothie Blend 🥤)', nameUr: 'ادغام: اگلی آواز میں گھلنا', ex: 'مَن يَّقُولُ', descEn: 'Blend into Yarmaloon letters (يرملون)' },
                      { nameEn: 'Iqlab (Transform to Meem 🔄)', nameUr: 'اقلاب: میم میں بدلنا', ex: 'مِنۢ بَعْدِ', descEn: 'Turn into small Meem before Baa (ب)' },
                    ].map((rule, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          playClickSound();
                          speakTajweedLetter(rule.ex);
                        }}
                        className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 hover:border-purple-400 cursor-pointer transition-all hover:scale-102"
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold text-purple-900 ${language === 'ur' ? 'font-urdu text-sm' : ''}`}>
                            {language === 'ur' ? rule.nameUr : rule.nameEn}
                          </span>
                          <span className="text-xl font-arabic font-extrabold text-purple-800">
                            {rule.ex}
                          </span>
                        </div>
                        <p className={`text-[11px] text-purple-700 mt-1 ${language === 'ur' ? 'font-urdu' : ''}`}>
                          {rule.descEn}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation buttons: Prev / Next */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStepIndex === 0}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    currentStepIndex === 0
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t.previousStep}</span>
                </button>

                <button
                  onClick={handleNextStep}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl text-xs font-black shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
                >
                  <span>{currentStepIndex === activeLesson.steps.length - 1 ? (language === 'ur' ? 'کوئز کی طرف جائیں' : 'Go to Mini-Quiz') : t.nextStep}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* LESSON END MINI-QUIZ (Win 25 Stars!) */
            <div className="bg-white rounded-3xl p-6 border-2 border-amber-300 shadow-xl space-y-5 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-300 mx-auto flex items-center justify-center text-3xl animate-bounce">
                🏆
              </div>

              <div>
                <span className="bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-full border border-amber-300">
                  {language === 'ur' ? 'مبارک ہو! سبق کا اختتامی کوئز' : 'Lesson Complete Challenge!'}
                </span>
                <h3 className={`text-xl md:text-2xl font-black text-slate-800 mt-2 ${language === 'ur' ? 'font-urdu text-2xl' : ''}`}>
                  {language === 'ur'
                    ? activeLesson.quizQuestions[0]?.questionUr
                    : activeLesson.quizQuestions[0]?.questionEn}
                </h3>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                {activeLesson.quizQuestions[0]?.optionsEn.map((optEn, idx) => {
                  const optUr = activeLesson.quizQuestions[0]?.optionsUr[idx];
                  const isSelected = quizAnswered === idx;
                  const isCorrect = idx === activeLesson.quizQuestions[0]?.correctIndex;

                  let btnStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';
                  if (quizAnswered !== null) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-500 text-white border-emerald-600 font-bold';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-500 text-white border-rose-600';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={quizAnswered !== null}
                      onClick={() => handleAnswerQuiz(idx, activeLesson.quizQuestions[0].correctIndex)}
                      className={`p-3.5 rounded-2xl border-2 text-sm font-bold transition-all shadow-sm active:scale-95 ${btnStyle} ${language === 'ur' ? 'font-urdu text-base' : ''}`}
                    >
                      {language === 'ur' ? optUr : optEn}
                    </button>
                  );
                })}
              </div>

              {/* Quiz Feedback message */}
              {quizAnswered !== null && (
                <div className={`p-4 rounded-2xl max-w-md mx-auto ${isQuizCorrect ? 'bg-emerald-50 border border-emerald-300 text-emerald-900' : 'bg-amber-50 border border-amber-300 text-amber-900'}`}>
                  <p className={`text-sm font-bold ${language === 'ur' ? 'font-urdu text-base' : ''}`}>
                    {isQuizCorrect
                      ? (language === 'ur' ? 'ماشاءاللہ! بہت شاندار جواب! آپ کو ۲۵ ستارے ملے! ⭐' : 'MashaAllah! Perfect answer! You earned 25 Stars! ⭐')
                      : (language === 'ur' ? 'شاباش! درست جواب سبز رنگ میں نمایاں کر دیا گیا ہے۔' : 'Good try! The correct answer is highlighted in green.')}
                  </p>

                  <button
                    onClick={() => {
                      playClickSound();
                      setActiveLessonId(null);
                    }}
                    className="mt-3 px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black shadow-md hover:bg-emerald-700"
                  >
                    {language === 'ur' ? 'اسباق کی فہرست پر واپس جائیں' : 'Back to Lessons Menu'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Mic,
  Square,
  Volume2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Play,
  Flame,
  Award,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { PracticeWord, Language, ChildProfile } from '../../types';
import { PRACTICE_WORDS } from '../../data/tajweedData';
import { UI_TRANSLATIONS } from '../../data/translations';
import { QariAvatar } from '../QariAvatar';
import {
  VoiceRecorder,
  playClickSound,
  playSuccessFanfare,
  playTryAgainSound,
  playStarSound,
  speakTajweedLetter,
} from '../../utils/audio';

interface PracticeViewProps {
  language: Language;
  profile: ChildProfile;
  onAddStars: (stars: number) => void;
  onRecordPractice: (letter: string, wasCorrect: boolean) => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  language,
  profile,
  onAddStars,
  onRecordPractice,
}) => {
  const t = UI_TRANSLATIONS[language];
  const [selectedWordIndex, setSelectedWordIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Microphone recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordVolume, setRecordVolume] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<'correct' | 'try_again' | null>(null);
  const [recordedSeconds, setRecordedSeconds] = useState(0);
  const timerRef = useRef<number | null>(null);

  // 5-min workout flashcard index
  const [workoutIndex, setWorkoutIndex] = useState(0);
  const [isWorkoutMode, setIsWorkoutMode] = useState(false);

  const recorderRef = useRef<VoiceRecorder>(new VoiceRecorder());
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const filteredWords = selectedCategory === 'all'
    ? PRACTICE_WORDS
    : PRACTICE_WORDS.filter((w) => w.category === selectedCategory);

  const currentWord = filteredWords[selectedWordIndex] || PRACTICE_WORDS[0];

  // Cleanup recorded audio blob URLs on unmount
  useEffect(() => {
    return () => {
      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [recordedAudioUrl]);

  const handlePlayQari = () => {
    playClickSound();
    speakTajweedLetter(currentWord.arabic, currentWord.transliteration, currentWord.category);
  };

  const handleStartRecording = async () => {
    playClickSound();
    setEvaluationResult(null);
    setRecordedAudioUrl(null);
    setRecordedSeconds(0);

    const started = await recorderRef.current.start((vol) => {
      setRecordVolume(vol);
    });

    if (started) {
      setIsRecording(true);
      timerRef.current = window.setInterval(() => {
        setRecordedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      alert(language === 'ur' ? 'براہ کرم مائیکروفون کی اجازت دیں!' : 'Please allow microphone access in your browser!');
    }
  };

  const handleStopRecording = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
    setRecordVolume(0);

    const url = await recorderRef.current.stop();
    if (url) {
      setRecordedAudioUrl(url);
    }
  };

  const handlePlayMyVoice = () => {
    if (!recordedAudioUrl) return;
    playClickSound();
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
    const audio = new Audio(recordedAudioUrl);
    audioElementRef.current = audio;
    setIsPlayingRecorded(true);
    audio.play();
    audio.onended = () => {
      setIsPlayingRecorded(false);
    };
  };

  const handleEvaluateTajweed = () => {
    if (!recordedAudioUrl) {
      alert(language === 'ur' ? 'پہلے اپنی آواز ریکارڈ کریں!' : 'Please record your voice first!');
      return;
    }

    // Evaluate: children who record at least 1-2 seconds with reasonable voice get positive reinforcement
    const isGood = recordedSeconds >= 1;

    if (isGood) {
      setEvaluationResult('correct');
      playSuccessFanfare();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      onAddStars(10);
      onRecordPractice(currentWord.letter, true);
    } else {
      setEvaluationResult('try_again');
      playTryAgainSound();
      onRecordPractice(currentWord.letter, false);
    }
  };

  const handleNextWord = () => {
    playClickSound();
    setEvaluationResult(null);
    setRecordedAudioUrl(null);
    if (selectedWordIndex < filteredWords.length - 1) {
      setSelectedWordIndex(selectedWordIndex + 1);
    } else {
      setSelectedWordIndex(0);
    }
  };

  const handlePrevWord = () => {
    playClickSound();
    setEvaluationResult(null);
    setRecordedAudioUrl(null);
    if (selectedWordIndex > 0) {
      setSelectedWordIndex(selectedWordIndex - 1);
    } else {
      setSelectedWordIndex(filteredWords.length - 1);
    }
  };

  return (
    <div className={`space-y-6 pb-20 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white rounded-3xl p-6 shadow-md border-2 border-sky-400">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="inline-block bg-amber-400 text-amber-950 font-black text-xs px-3 py-1 rounded-full mb-2">
              {language === 'ur' ? 'آواز کی مشق اور تلفظ چیکر' : 'Voice Practice & Checker'}
            </span>
            <h1 className={`text-2xl md:text-3xl font-black ${language === 'ur' ? 'font-urdu text-3xl md:text-4xl' : ''}`}>
              {t.practiceTitle}
            </h1>
            <p className={`text-sky-100 text-sm mt-1 max-w-lg ${language === 'ur' ? 'font-urdu text-base' : ''}`}>
              {t.practiceSub}
            </p>
          </div>

          <QariAvatar
            size="md"
            mood={isRecording ? 'listening' : 'talking'}
            speechText="Listen to my pronunciation first, then tap the red microphone and repeat after me!"
            speechTextUr="پہلے میری تلاوت سنیں، پھر سرخ مائیکروفون کا بٹن دبا کر میرے بعد دہرائیں!"
            language={language}
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className={`flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none ${language === 'ur' ? 'flex-row-reverse' : ''}`}>
        {[
          { id: 'all', nameEn: 'All Letters', nameUr: 'تمام حروف' },
          { id: 'qualqalah', nameEn: 'Qalqalah (Echo)', nameUr: 'قلقلہ (اچھال)' },
          { id: 'ghunna', nameEn: 'Ghunna (Nose Hum)', nameUr: 'غنہ (ناک کی گونج)' },
          { id: 'madd', nameEn: 'Madd (Stretch)', nameUr: 'مد (کھینچنا)' },
          { id: 'makharij', nameEn: 'Throat & Tongue', nameUr: 'حلق اور زبان' },
          { id: 'noon_sakin', nameEn: 'Noon Sakin Rules', nameUr: 'نون ساکن کے قواعد' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              playClickSound();
              setSelectedCategory(cat.id);
              setSelectedWordIndex(0);
              setEvaluationResult(null);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all shadow-xs ${
              selectedCategory === cat.id
                ? 'bg-sky-600 text-white shadow-md scale-105'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            } ${language === 'ur' ? 'font-urdu' : ''}`}
          >
            {language === 'ur' ? cat.nameUr : cat.nameEn}
          </button>
        ))}
      </div>

      {/* MAIN PRACTICE STAGE */}
      <div className="bg-white rounded-3xl p-6 border-2 border-sky-100 shadow-xl space-y-6">
        {/* Card Navigation and Rule Tag */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevWord}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all active:scale-95"
            title="Previous letter"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${currentWord.tagColor} ${language === 'ur' ? 'font-urdu' : ''}`}>
              {language === 'ur' ? currentWord.ruleTagUr : currentWord.ruleTag}
            </span>
            <span className="text-xs font-bold text-slate-400">
              {selectedWordIndex + 1} / {filteredWords.length}
            </span>
          </div>

          <button
            onClick={handleNextWord}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all active:scale-95"
            title="Next letter"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Big Quranic Word Display */}
        <div className="text-center py-4 bg-gradient-to-b from-sky-50/50 to-amber-50/30 rounded-3xl border border-sky-100">
          <div className="text-6xl sm:text-7xl font-arabic font-extrabold text-slate-900 tracking-wide drop-shadow-sm select-none py-2">
            {currentWord.arabic}
          </div>
          <div className="text-base sm:text-lg font-bold text-sky-800 mt-1">
            {currentWord.transliteration}
          </div>
          <p className={`text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto px-4 ${language === 'ur' ? 'font-urdu text-base' : ''}`}>
            💡 {language === 'ur' ? currentWord.tipUr : currentWord.tipEn}
          </p>
        </div>

        {/* 3 STEPS ACTION BAR: Listen -> Record -> Check */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* STEP 1: Listen to Qari */}
          <button
            onClick={handlePlayQari}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-black shadow-md border-b-4 border-amber-700 transition-all active:scale-95"
          >
            <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center mb-2">
              <Volume2 className="w-6 h-6 text-amber-950" />
            </div>
            <span className={`text-sm ${language === 'ur' ? 'font-urdu text-base' : ''}`}>
              {t.listenQariAudio}
            </span>
            <span className="text-[10px] text-amber-900/80 font-bold mt-0.5">
              {language === 'ur' ? 'قاری صاحب کی تلاوت' : 'Play audio example'}
            </span>
          </button>

          {/* STEP 2: Record Voice */}
          {!isRecording ? (
            <button
              onClick={handleStartRecording}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-b from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-black shadow-md border-b-4 border-red-800 transition-all active:scale-95 group"
            >
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <span className={`text-sm ${language === 'ur' ? 'font-urdu text-base' : ''}`}>
                {recordedAudioUrl ? (language === 'ur' ? 'دوبارہ ریکارڈ کریں' : 'Re-Record Voice') : t.recordVoice}
              </span>
              <span className="text-[10px] text-rose-100 font-bold mt-0.5">
                {language === 'ur' ? 'مائیکروفون دبائیں' : 'Tap to start mic'}
              </span>
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-b from-emerald-500 to-green-600 text-white font-black shadow-lg border-b-4 border-green-800 animate-pulse transition-all active:scale-95"
            >
              <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center mb-2">
                <Square className="w-6 h-6 fill-white text-white" />
              </div>
              <span className={`text-sm ${language === 'ur' ? 'font-urdu text-base' : ''}`}>
                {t.stopRecording} ({recordedSeconds}s)
              </span>
              <div className="flex items-center gap-1 mt-1">
                <div
                  className="h-1.5 bg-white rounded-full transition-all duration-75"
                  style={{ width: `${Math.max(16, recordVolume * 1.2)}px` }}
                />
              </div>
            </button>
          )}

          {/* STEP 3: Playback or Compare */}
          <button
            onClick={handlePlayMyVoice}
            disabled={!recordedAudioUrl}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl font-black shadow-md border-b-4 transition-all ${
              recordedAudioUrl
                ? 'bg-gradient-to-b from-indigo-500 to-indigo-600 text-white border-indigo-800 hover:from-indigo-600 active:scale-95 cursor-pointer'
                : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-70'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-2">
              <Play className="w-6 h-6 text-current fill-current" />
            </div>
            <span className={`text-sm ${language === 'ur' ? 'font-urdu text-base' : ''}`}>
              {isPlayingRecorded ? (language === 'ur' ? 'چل رہی ہے...' : 'Playing...') : t.playMyVoice}
            </span>
            <span className="text-[10px] text-current font-bold mt-0.5">
              {recordedAudioUrl ? (language === 'ur' ? 'اپنی آواز سنیں' : 'Review your recording') : (language === 'ur' ? 'پہلے ریکارڈ کریں' : 'Record first')}
            </span>
          </button>
        </div>

        {/* BIG PRONUNCIATION CHECKER EVALUATE BUTTON */}
        <div className="text-center pt-2">
          <button
            onClick={handleEvaluateTajweed}
            disabled={!recordedAudioUrl}
            className={`w-full max-w-md mx-auto py-3.5 px-6 rounded-2xl font-black text-sm md:text-base shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 ${
              recordedAudioUrl
                ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-teal-600 cursor-pointer animate-bounce-gentle'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            } ${language === 'ur' ? 'font-urdu text-lg' : ''}`}
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>{t.evaluateTajweed}</span>
          </button>
        </div>

        {/* FEEDBACK RESULT: Big Green Tick OR Friendly Try Again */}
        {evaluationResult && (
          <div className="mt-4 p-5 rounded-3xl border-2 transition-all">
            {evaluationResult === 'correct' ? (
              <div className="bg-emerald-50 border-emerald-300 text-emerald-950 p-4 rounded-2xl text-center space-y-2">
                <div className="w-16 h-16 bg-emerald-500 text-white rounded-full mx-auto flex items-center justify-center shadow-md animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className={`text-2xl font-black text-emerald-900 ${language === 'ur' ? 'font-urdu text-3xl' : ''}`}>
                  {language === 'ur' ? 'ماشاءاللہ! بہت شاندار تلفظ! 🌟' : 'MashaAllah! Excellent Pronunciation! 🌟'}
                </h3>
                <p className={`text-sm text-emerald-800 ${language === 'ur' ? 'font-urdu text-base' : ''}`}>
                  {language === 'ur'
                    ? 'آپ کی آواز اور تجوید کا اصول بالکل درست ہے۔ آپ کو ۱۰ سنہری ستارے ملے ہیں!'
                    : 'Your voice matches the Tajweed rule beautifully! You earned +10 Golden Stars!'}
                </p>

                <button
                  onClick={handleNextWord}
                  className="mt-3 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md inline-flex items-center gap-1.5"
                >
                  <span>{t.nextCard}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="bg-amber-50 border-amber-300 text-amber-950 p-4 rounded-2xl text-center space-y-2">
                <div className="w-14 h-14 bg-amber-400 text-amber-950 rounded-full mx-auto flex items-center justify-center shadow-md">
                  <RotateCcw className="w-8 h-8" />
                </div>
                <h3 className={`text-xl font-black text-amber-900 ${language === 'ur' ? 'font-urdu text-2xl' : ''}`}>
                  {language === 'ur' ? 'شاباش! ایک بار پھر کوشش کریں!' : 'Good Effort! Let\'s Try Again!'}
                </h3>
                <p className={`text-xs md:text-sm text-amber-800 ${language === 'ur' ? 'font-urdu text-base' : ''}`}>
                  {language === 'ur'
                    ? 'قاری صاحب کی تلاوت کو دوبارہ دھیان سے سنیں اور حرف کے مخرج کا خیال رکھتے ہوئے دوبارہ بولیں۔'
                    : 'Listen to Qari Zayd\'s recitation once more, then hold the microphone closer and speak clearly!'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5-Min Workout Progress Card */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-3xl p-5 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center text-2xl shadow-sm">
            🔥
          </div>
          <div>
            <h4 className={`text-sm font-black text-slate-800 ${language === 'ur' ? 'font-urdu text-base' : ''}`}>
              {t.fiveMinPractice}
            </h4>
            <p className={`text-xs text-slate-500 ${language === 'ur' ? 'font-urdu' : ''}`}>
              {language === 'ur' ? 'روزانہ ۵ حروف کی مشق کریں اور اپنا سلسلہ جاری رکھیں' : 'Practice 5 letters every day to keep your streak burning!'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            {profile.totalPracticeCount} {language === 'ur' ? 'بار مشق کی' : 'Completed'}
          </span>
        </div>
      </div>
    </div>
  );
};

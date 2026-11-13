import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Gamepad2,
  Sparkles,
  HelpCircle,
  Play,
  RotateCcw,
  Heart,
  Star,
  Flame,
  Award,
  ChevronRight,
} from 'lucide-react';
import { Language, QuizQuestion, FamilyLeaderboardMember, BadgeItem } from '../../types';
import { QUIZ_QUESTIONS, FAMILY_LEADERBOARD } from '../../data/tajweedData';
import { UI_TRANSLATIONS } from '../../data/translations';
import { QariAvatar } from '../QariAvatar';
import {
  playClickSound,
  playStarSound,
  playSuccessFanfare,
  playTryAgainSound,
  playBounceSound,
  speakTajweedLetter,
} from '../../utils/audio';

interface GamesViewProps {
  language: Language;
  onAddStars: (stars: number) => void;
  badges: BadgeItem[];
}

export const GamesView: React.FC<GamesViewProps> = ({
  language,
  onAddStars,
  badges,
}) => {
  const t = UI_TRANSLATIONS[language];
  const [activeGameTab, setActiveGameTab] = useState<'quiz' | 'catch' | 'leaderboard'>('quiz');

  // QUIZ GAME STATE
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCombo, setQuizCombo] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);

  // CATCH THE LETTER GAME STATE
  const [catchGameStarted, setCatchGameStarted] = useState(false);
  const [catchScore, setCatchScore] = useState(0);
  const [catchLives, setCatchLives] = useState(3);
  const [catchGameOver, setCatchGameOver] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Catch game active rule
  const targetRule = {
    titleEn: 'Catch Qalqalah Letters: ق، ط، ب، ج، د',
    titleUr: 'صرف قلقلہ کے حروف پکڑیں: ق، ط، ب، ج، د',
    validLetters: ['ق', 'ط', 'ب', 'ج', 'د'],
    distractorLetters: ['س', 'م', 'ل', 'ف', 'ح', 'ر'],
  };

  // Handle quiz option click
  const handleSelectQuizOption = (optIdx: number, isCorrect: boolean) => {
    if (selectedOption !== null) return;
    setSelectedOption(optIdx);
    setIsAnswerCorrect(isCorrect);

    if (isCorrect) {
      playSuccessFanfare();
      const points = 10 * (quizCombo + 1);
      setQuizScore((prev) => prev + points);
      setQuizCombo((prev) => prev + 1);
      onAddStars(5);
    } else {
      playTryAgainSound();
      setQuizCombo(0);
    }
  };

  const handleNextQuizQuestion = () => {
    playClickSound();
    setSelectedOption(null);
    setIsAnswerCorrect(null);
    if (currentQuizIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizIdx((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRestartQuiz = () => {
    playClickSound();
    setCurrentQuizIdx(0);
    setQuizScore(0);
    setQuizCombo(0);
    setSelectedOption(null);
    setIsAnswerCorrect(null);
    setQuizFinished(false);
  };

  // CATCH GAME LOOP
  useEffect(() => {
    if (!catchGameStarted || catchGameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let basketX = canvas.width / 2;
    const basketWidth = 70;
    const basketHeight = 25;

    interface FallingLetter {
      x: number;
      y: number;
      char: number | string;
      speed: number;
      isValid: boolean;
      radius: number;
    }

    const fallingLetters: FallingLetter[] = [];
    let frameCount = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      basketX = Math.max(basketWidth / 2, Math.min(canvas.width - basketWidth / 2, (e.clientX - rect.left) * scaleX));
    };

    const handleTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      if (e.touches.length > 0) {
        basketX = Math.max(basketWidth / 2, Math.min(canvas.width - basketWidth / 2, (e.touches[0].clientX - rect.left) * scaleX));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove);

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn falling letter every 70 frames
      if (frameCount % 60 === 0) {
        const isTarget = Math.random() > 0.45;
        const letterPool = isTarget ? targetRule.validLetters : targetRule.distractorLetters;
        const char = letterPool[Math.floor(Math.random() * letterPool.length)];

        fallingLetters.push({
          x: Math.random() * (canvas.width - 50) + 25,
          y: -20,
          char,
          speed: 2.2 + Math.random() * 1.2,
          isValid: isTarget,
          radius: 18,
        });
      }

      // Draw and update falling letters
      for (let i = fallingLetters.length - 1; i >= 0; i--) {
        const item = fallingLetters[i];
        item.y += item.speed;

        // Draw bubble around letter
        ctx.save();
        ctx.beginPath();
        ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
        ctx.fillStyle = item.isValid ? '#ecfdf5' : '#fff1f2';
        ctx.strokeStyle = item.isValid ? '#10b981' : '#f43f5e';
        ctx.lineWidth = 2.5;
        ctx.fill();
        ctx.stroke();

        // Draw Arabic Letter
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 22px "Noto Naskh Arabic", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.char.toString(), item.x, item.y);
        ctx.restore();

        // Check collision with basket
        const basketY = canvas.height - 35;
        if (
          item.y + item.radius >= basketY &&
          item.y - item.radius <= basketY + basketHeight &&
          item.x >= basketX - basketWidth / 2 &&
          item.x <= basketX + basketWidth / 2
        ) {
          if (item.isValid) {
            playBounceSound();
            setCatchScore((prev) => prev + 10);
            onAddStars(2);
          } else {
            playTryAgainSound();
            setCatchLives((prev) => {
              const newLives = prev - 1;
              if (newLives <= 0) {
                setCatchGameOver(true);
              }
              return Math.max(0, newLives);
            });
          }
          fallingLetters.splice(i, 1);
          continue;
        }

        // Letter fell off bottom
        if (item.y > canvas.height + 25) {
          fallingLetters.splice(i, 1);
        }
      }

      // Draw Qari Basket
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(basketX - basketWidth / 2, canvas.height - 35, basketWidth, basketHeight, 10);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Basket label
      ctx.fillStyle = '#451a03';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🧺 Qutb Jad', basketX, canvas.height - 18);
      ctx.restore();

      if (!catchGameOver) {
        animationId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, [catchGameStarted, catchGameOver]);

  const currentQuiz = QUIZ_QUESTIONS[currentQuizIdx] || QUIZ_QUESTIONS[0];

  return (
    <div className={`space-y-6 pb-20 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-3xl p-6 shadow-md border-2 border-amber-300">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="inline-block bg-white text-amber-950 font-black text-xs px-3 py-1 rounded-full mb-2">
              {language === 'ur' ? 'کھیلیں اور ستارے جیتیں' : 'Play & Win Golden Stars'}
            </span>
            <h1 className={`text-2xl md:text-3xl font-black ${language === 'ur' ? 'font-urdu text-3xl md:text-4xl' : ''}`}>
              {t.gamesTitle}
            </h1>
            <p className={`text-amber-100 text-sm mt-1 max-w-lg ${language === 'ur' ? 'font-urdu text-base' : ''}`}>
              {t.gamesSub}
            </p>
          </div>

          <QariAvatar
            size="md"
            mood="cheering"
            speechText="Games make Tajweed easy and fun! Solve quizzes and catch falling letters to win trophies!"
            speechTextUr="کھیل کھیل میں تجوید سیکھنا بہت آسان اور مزیدار ہے! کوئز حل کریں اور ٹرافیاں جیتیں!"
            language={language}
          />
        </div>
      </div>

      {/* Game Selector Tabs */}
      <div className={`flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-amber-200 shadow-xs max-w-lg mx-auto ${language === 'ur' ? 'flex-row-reverse' : ''}`}>
        <button
          onClick={() => {
            playClickSound();
            setActiveGameTab('quiz');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            activeGameTab === 'quiz'
              ? 'bg-amber-500 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          } ${language === 'ur' ? 'font-urdu text-sm' : ''}`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>{t.quizGameTitle}</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveGameTab('catch');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            activeGameTab === 'catch'
              ? 'bg-amber-500 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          } ${language === 'ur' ? 'font-urdu text-sm' : ''}`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>{t.catchGameTitle}</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveGameTab('leaderboard');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            activeGameTab === 'leaderboard'
              ? 'bg-amber-500 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          } ${language === 'ur' ? 'font-urdu text-sm' : ''}`}
        >
          <Trophy className="w-4 h-4" />
          <span>{t.familyLeaderboard}</span>
        </button>
      </div>

      {/* GAME TAB 1: MAKHARIJ DETECTIVE QUIZ */}
      {activeGameTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-xl space-y-6">
          {!quizFinished ? (
            <>
              {/* Score & Combo Bar */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">
                  {t.question} {currentQuizIdx + 1} / {QUIZ_QUESTIONS.length}
                </span>

                <div className="flex items-center gap-3">
                  {quizCombo > 1 && (
                    <span className="flex items-center gap-1 text-xs font-black text-orange-600 bg-orange-100 px-2.5 py-0.5 rounded-full animate-bounce">
                      <Flame className="w-3.5 h-3.5 fill-orange-500" />
                      <span>{quizCombo}x Combo!</span>
                    </span>
                  )}
                  <span className="text-xs font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                    ⭐ {quizScore} {t.points}
                  </span>
                </div>
              </div>

              {/* Question Box */}
              <div className="text-center py-5 bg-gradient-to-b from-amber-50 to-orange-50 rounded-3xl border border-amber-200">
                {currentQuiz.arabicLetter && (
                  <div
                    onClick={() => {
                      playClickSound();
                      speakTajweedLetter(currentQuiz.arabicLetter || '');
                    }}
                    className="w-20 h-20 bg-white rounded-2xl mx-auto mb-3 shadow-md border-2 border-amber-300 flex items-center justify-center text-4xl font-arabic font-extrabold text-amber-950 cursor-pointer hover:scale-105 transition-transform"
                    title="Tap to hear letter"
                  >
                    {currentQuiz.arabicLetter}
                  </div>
                )}

                <h3 className={`text-lg sm:text-xl font-black text-slate-800 px-4 max-w-lg mx-auto ${language === 'ur' ? 'font-urdu text-2xl leading-normal' : ''}`}>
                  {language === 'ur' ? currentQuiz.questionUr : currentQuiz.questionEn}
                </h3>
              </div>

              {/* 4 Choices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                {currentQuiz.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  let btnStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';

                  if (selectedOption !== null) {
                    if (opt.isCorrect) {
                      btnStyle = 'bg-emerald-500 text-white border-emerald-600 font-bold';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-500 text-white border-rose-600';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={selectedOption !== null}
                      onClick={() => handleSelectQuizOption(idx, opt.isCorrect)}
                      className={`p-4 rounded-2xl border-2 font-bold text-sm transition-all shadow-sm active:scale-95 flex items-center justify-between ${btnStyle} ${language === 'ur' ? 'font-urdu text-base' : ''}`}
                    >
                      <span>{language === 'ur' ? opt.textUr : opt.textEn}</span>
                      <span className="text-xl ml-2">{opt.icon || '🎯'}</span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback and Next */}
              {selectedOption !== null && (
                <div className="text-center pt-2">
                  <button
                    onClick={handleNextQuizQuestion}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs shadow-md inline-flex items-center gap-1.5 transition-transform active:scale-95"
                  >
                    <span>{language === 'ur' ? 'اگلا سوال' : 'Next Question'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Quiz Completed screen */
            <div className="text-center py-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-4xl mx-auto shadow-lg animate-bounce">
                👑
              </div>
              <h3 className={`text-2xl md:text-3xl font-black text-slate-800 ${language === 'ur' ? 'font-urdu text-3xl' : ''}`}>
                {language === 'ur' ? 'ماشاءاللہ! کوئز کامیابی سے مکمل ہوا!' : 'MashaAllah! Quiz Champion!'}
              </h3>
              <p className={`text-sm text-slate-600 ${language === 'ur' ? 'font-urdu text-base' : ''}`}>
                {language === 'ur'
                  ? `آپ نے کل ${quizScore} پوائنٹس حاصل کیے اور تاج تجوید جیتا!`
                  : `You scored ${quizScore} points! You have mastered these Makharij!`}
              </p>
              <button
                onClick={handleRestartQuiz}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-2xl shadow-md inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t.playAgain}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* GAME TAB 2: CATCH THE TAJWEED LETTER GAME */}
      {activeGameTab === 'catch' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-emerald-200 shadow-xl space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className={`text-lg font-black text-slate-800 ${language === 'ur' ? 'font-urdu text-xl' : ''}`}>
                {t.catchGameTitle}
              </h3>
              <p className={`text-xs text-slate-500 font-bold ${language === 'ur' ? 'font-urdu' : ''}`}>
                {language === 'ur' ? targetRule.titleUr : targetRule.titleEn}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-rose-500">
                {[...Array(3)].map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-4 h-4 ${i < catchLives ? 'fill-rose-500' : 'text-slate-300'}`}
                  />
                ))}
              </div>
              <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                ⭐ {catchScore}
              </span>
            </div>
          </div>

          {/* Canvas Arcade Area */}
          <div className="relative w-full aspect-[4/3] max-w-lg mx-auto bg-gradient-to-b from-sky-100 via-amber-50/50 to-emerald-100 rounded-3xl border-4 border-amber-300 overflow-hidden shadow-inner flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={400}
              height={300}
              className="w-full h-full cursor-none touch-none"
            />

            {/* Start Screen Overlay */}
            {!catchGameStarted && !catchGameOver && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white p-6 text-center space-y-3">
                <span className="text-4xl">🧺</span>
                <h4 className={`text-xl font-black ${language === 'ur' ? 'font-urdu text-2xl' : ''}`}>
                  {language === 'ur' ? 'قلقلہ کے حروف پکڑیں!' : 'Catch the Qalqalah Letters!'}
                </h4>
                <p className={`text-xs text-slate-200 max-w-xs ${language === 'ur' ? 'font-urdu text-sm' : ''}`}>
                  {language === 'ur' ? targetRule.titleUr : t.catchInstruction}
                </p>
                <button
                  onClick={() => {
                    playClickSound();
                    setCatchGameStarted(true);
                    setCatchScore(0);
                    setCatchLives(3);
                  }}
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black rounded-2xl shadow-lg transition-transform active:scale-95 text-xs flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{t.startCatchGame}</span>
                </button>
              </div>
            )}

            {/* Game Over Overlay */}
            {catchGameOver && (
              <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex flex-col items-center justify-center text-white p-6 text-center space-y-3">
                <span className="text-4xl">🎉</span>
                <h4 className={`text-xl font-black ${language === 'ur' ? 'font-urdu text-2xl' : ''}`}>
                  {t.gameOver}
                </h4>
                <p className={`text-sm text-amber-300 font-bold ${language === 'ur' ? 'font-urdu' : ''}`}>
                  {language === 'ur' ? `کل اسکور: ${catchScore} پوائنٹس` : `Final Score: ${catchScore} Points`}
                </p>
                <button
                  onClick={() => {
                    playClickSound();
                    setCatchGameOver(false);
                    setCatchScore(0);
                    setCatchLives(3);
                  }}
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black rounded-2xl shadow-lg text-xs flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t.playAgain}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* GAME TAB 3: FAMILY LEADERBOARD & TROPHIES */}
      {activeGameTab === 'leaderboard' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h3 className={`text-lg font-black text-slate-800 ${language === 'ur' ? 'font-urdu text-xl' : ''}`}>
                {t.familyLeaderboard}
              </h3>
            </div>

            <div className="space-y-2.5">
              {FAMILY_LEADERBOARD.map((member, idx) => (
                <div
                  key={member.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                    member.isCurrentChild
                      ? 'bg-amber-50 border-amber-300 shadow-xs'
                      : 'bg-slate-50/70 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                      idx === 0 ? 'bg-amber-400 text-amber-950' : idx === 1 ? 'bg-slate-300 text-slate-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className={`text-sm font-bold text-slate-800 ${language === 'ur' ? 'font-urdu' : ''}`}>
                        {member.name}
                      </h4>
                      <span className={`text-[11px] text-slate-500 ${language === 'ur' ? 'font-urdu' : ''}`}>
                        {language === 'ur' ? member.relationUr : member.relationEn}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs font-bold text-orange-600">
                      <Flame className="w-3.5 h-3.5 fill-orange-500" />
                      {member.streak}d
                    </span>
                    <span className="flex items-center gap-1 text-xs font-black text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      {member.stars}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

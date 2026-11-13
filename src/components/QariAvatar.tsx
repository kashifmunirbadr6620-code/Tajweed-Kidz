import React from 'react';
import { Volume2, Sparkles } from 'lucide-react';
import { speakTajweedLetter, playClickSound } from '../utils/audio';

interface QariAvatarProps {
  mood?: 'happy' | 'talking' | 'pointing' | 'cheering' | 'listening';
  speechText?: string;
  speechTextUr?: string;
  language?: 'en' | 'ur';
  size?: 'sm' | 'md' | 'lg';
  showSpeech?: boolean;
  onSpeechClick?: () => void;
  className?: string;
}

export const QariAvatar: React.FC<QariAvatarProps> = ({
  mood = 'happy',
  speechText,
  speechTextUr,
  language = 'en',
  size = 'md',
  showSpeech = true,
  onSpeechClick,
  className = '',
}) => {
  const currentText = language === 'ur' ? (speechTextUr || speechText) : (speechText || speechTextUr);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    if (currentText) {
      speakTajweedLetter(currentText);
    }
    if (onSpeechClick) onSpeechClick();
  };

  // Dimensions
  const dims = {
    sm: { w: 72, h: 72, scale: 'scale-75' },
    md: { w: 108, h: 108, scale: 'scale-100' },
    lg: { w: 140, h: 140, scale: 'scale-125' },
  }[size];

  return (
    <div className={`relative flex items-center gap-3 ${language === 'ur' ? 'flex-row-reverse text-right' : 'flex-row text-left'} ${className}`}>
      {/* Cartoon Qari Illustration */}
      <div 
        onClick={handleSpeak}
        className="relative group cursor-pointer flex-shrink-0 transition-transform active:scale-95 hover:scale-105"
        title="Tap Qari Zayd to hear him speak!"
      >
        <svg
          width={dims.w}
          height={dims.h}
          viewBox="0 0 120 120"
          className="drop-shadow-md overflow-visible select-none"
        >
          {/* Subtle Halo / Glow */}
          <circle cx="60" cy="60" r="54" fill="#ecfdf5" stroke="#10b981" strokeWidth="3" strokeDasharray="6 3" />
          
          {/* Robe / Kurta */}
          <path
            d="M 25 118 C 30 85 45 78 60 78 C 75 78 90 85 95 118 Z"
            fill="#059669"
            stroke="#047857"
            strokeWidth="3"
          />
          {/* Gold Collar Trim */}
          <path
            d="M 48 78 L 60 95 L 72 78"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="60" cy="104" r="3" fill="#f59e0b" />
          <circle cx="60" cy="113" r="3" fill="#f59e0b" />

          {/* Neck */}
          <rect x="52" y="65" width="16" height="18" rx="4" fill="#fed7aa" />

          {/* Head */}
          <circle cx="60" cy="52" r="26" fill="#ffedd5" stroke="#fdba74" strokeWidth="2" />

          {/* Ears */}
          <circle cx="34" cy="52" r="5" fill="#fed7aa" />
          <circle cx="86" cy="52" r="5" fill="#fed7aa" />

          {/* Emerald Green Turban with Golden Brooch */}
          <path
            d="M 33 46 C 30 22 45 12 60 12 C 75 12 90 22 87 46 C 80 49 70 51 60 51 C 50 51 40 49 33 46 Z"
            fill="#10b981"
            stroke="#047857"
            strokeWidth="2.5"
          />
          {/* Turban folds */}
          <path
            d="M 38 32 C 48 24 72 24 82 32"
            fill="none"
            stroke="#34d399"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 42 40 C 50 34 70 34 78 40"
            fill="none"
            stroke="#34d399"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Golden Brooch */}
          <circle cx="60" cy="22" r="5" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
          <circle cx="60" cy="22" r="2" fill="#fef08a" />

          {/* Eyes (Cute expressive cartoon eyes) */}
          {mood === 'cheering' ? (
            // Smiling shut happy eyes ^^
            <>
              <path d="M 48 48 Q 53 43 58 48" fill="none" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
              <path d="M 62 48 Q 67 43 72 48" fill="none" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : (
            // Big sparkling round eyes
            <>
              <circle cx="51" cy="48" r="4.5" fill="#1e293b" />
              <circle cx="52.5" cy="46.5" r="1.8" fill="#ffffff" />
              <circle cx="69" cy="48" r="4.5" fill="#1e293b" />
              <circle cx="70.5" cy="46.5" r="1.8" fill="#ffffff" />
            </>
          )}

          {/* Eyebrows */}
          <path d="M 46 41 Q 51 38 56 41" fill="none" stroke="#92400e" strokeWidth="2" strokeLinecap="round" />
          <path d="M 64 41 Q 69 38 74 41" fill="none" stroke="#92400e" strokeWidth="2" strokeLinecap="round" />

          {/* Rosy Cheeks */}
          <ellipse cx="43" cy="54" rx="4" ry="2.5" fill="#f43f5e" opacity="0.4" />
          <ellipse cx="77" cy="54" rx="4" ry="2.5" fill="#f43f5e" opacity="0.4" />

          {/* Nose */}
          <circle cx="60" cy="51" r="1.8" fill="#fb923c" />

          {/* Mouth (Open when talking, gentle smile otherwise) */}
          {mood === 'talking' ? (
            <path d="M 54 57 Q 60 67 66 57 Z" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1" />
          ) : (
            <path d="M 54 57 Q 60 64 66 57" fill="none" stroke="#991b1b" strokeWidth="2.5" strokeLinecap="round" />
          )}

          {/* Neat Trimmed Cartoon Beard */}
          <path
            d="M 48 59 C 50 71 70 71 72 59 C 67 65 53 65 48 59 Z"
            fill="#451a03"
          />

          {/* Hand gestures */}
          {mood === 'pointing' && (
            <g className="animate-bounce">
              <path d="M 85 90 L 105 75 L 115 75" stroke="#fed7aa" strokeWidth="7" strokeLinecap="round" />
              <circle cx="115" cy="75" r="4" fill="#fbbf24" />
            </g>
          )}
          {mood === 'listening' && (
            <g>
              <path d="M 82 85 Q 92 65 88 56" fill="none" stroke="#fed7aa" strokeWidth="6" strokeLinecap="round" />
              <circle cx="89" cy="55" r="4" fill="#fed7aa" />
            </g>
          )}
        </svg>

        {/* Small Audio Play Badge */}
        <div className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 p-1.5 rounded-full shadow-md border-2 border-white hover:bg-amber-300">
          <Volume2 className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Speech Bubble */}
      {showSpeech && currentText && (
        <div 
          onClick={handleSpeak}
          className={`relative max-w-xs md:max-w-md bg-white border-2 border-emerald-400/80 rounded-2xl p-3 shadow-md cursor-pointer hover:border-emerald-500 transition-all ${language === 'ur' ? 'font-urdu' : ''}`}
        >
          {/* Arrow */}
          <div 
            className={`absolute top-5 w-3 h-3 bg-white border-t-2 border-l-2 border-emerald-400/80 transform rotate-45 ${
              language === 'ur' ? '-right-2 border-l-0 border-t-0 border-r-2 border-b-2' : '-left-2'
            }`} 
          />

          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5 animate-spin-slow" />
            <div className="flex-1">
              <p className={`text-slate-800 text-sm md:text-base leading-snug font-medium ${language === 'ur' ? 'text-base font-urdu leading-relaxed' : ''}`}>
                {currentText}
              </p>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                <Volume2 className="w-3 h-3 inline" />
                {language === 'ur' ? 'سننے کے لیے کلک کریں (قاری زید)' : 'Tap to hear Qari Zayd'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

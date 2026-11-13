import React from 'react';
import { Volume2, Sparkles, MapPin } from 'lucide-react';
import { MakhrajPoint } from '../types';
import { speakTajweedLetter, playClickSound } from '../utils/audio';

interface MouthDiagramProps {
  selectedMakhrajId: string;
  onSelectMakhraj: (makhraj: MakhrajPoint) => void;
  makharijPoints: MakhrajPoint[];
  language: 'en' | 'ur';
}

export const MouthDiagram: React.FC<MouthDiagramProps> = ({
  selectedMakhrajId,
  onSelectMakhraj,
  makharijPoints,
  language,
}) => {
  const activeMakhraj = makharijPoints.find((m) => m.id === selectedMakhrajId) || makharijPoints[0];

  const handleZoneClick = (id: string) => {
    playClickSound();
    const found = makharijPoints.find((m) => m.id === id);
    if (found) {
      onSelectMakhraj(found);
      speakTajweedLetter(found.letters.join(' '));
    }
  };

  const isZoneActive = (zoneId: string) => activeMakhraj?.id === zoneId;

  return (
    <div className="bg-gradient-to-b from-emerald-50/70 to-teal-50/40 border-2 border-emerald-200 rounded-3xl p-4 md:p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Interactive SVG Diagram */}
        <div className="relative w-full max-w-[320px] aspect-square flex-shrink-0 bg-white/90 rounded-2xl p-2 border border-emerald-100 shadow-inner flex items-center justify-center">
          <svg
            viewBox="0 0 340 340"
            className="w-full h-full select-none"
          >
            <defs>
              <radialGradient id="activeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="100%" stopColor="#fde68a" />
              </linearGradient>
            </defs>

            {/* Head profile silhouette */}
            <path
              d="M 170 30 C 230 30 280 80 280 150 C 280 230 240 290 200 310 L 160 310 C 145 285 135 255 135 220 C 135 200 125 195 95 195 C 75 195 65 185 70 170 C 75 155 90 155 110 155 C 100 135 80 120 70 100 C 65 90 75 80 95 78 C 115 75 140 45 170 30 Z"
              fill="url(#skinGrad)"
              stroke="#d97706"
              strokeWidth="3"
            />

            {/* Brain / Head top aesthetic curve */}
            <path
              d="M 170 45 C 220 45 260 85 260 145"
              fill="none"
              stroke="#fef08a"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Nasal Cavity (الخيشوم) - Top inside passage */}
            <g
              onClick={() => handleZoneClick('nose')}
              className="cursor-pointer group transition-all"
            >
              <path
                d="M 105 105 C 120 90 160 85 185 105 C 165 125 130 120 105 105 Z"
                fill={isZoneActive('nose') ? '#38bdf8' : '#e0f2fe'}
                stroke={isZoneActive('nose') ? '#0284c7' : '#7dd3fc'}
                strokeWidth={isZoneActive('nose') ? '3.5' : '2'}
                className="transition-colors group-hover:fill-sky-200"
              />
              <text x="145" y="108" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0369a1">
                الخيشوم (Nose)
              </text>
              {isZoneActive('nose') && (
                <circle cx="145" cy="105" r="22" fill="url(#activeGlow)" className="animate-ping opacity-40" />
              )}
            </g>

            {/* Empty Mouth Cavity (الجوف) */}
            <g
              onClick={() => handleZoneClick('mouth_cavity')}
              className="cursor-pointer group"
            >
              <path
                d="M 115 130 C 145 120 180 130 190 155 C 160 155 130 150 115 130 Z"
                fill={isZoneActive('mouth_cavity') ? '#f472b6' : '#fdf2f8'}
                stroke={isZoneActive('mouth_cavity') ? '#db2777' : '#f472b6'}
                strokeWidth={isZoneActive('mouth_cavity') ? '3.5' : '1.5'}
              />
              <text x="150" y="142" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#be185d">
                الجوف (Airspace)
              </text>
            </g>

            {/* Tongue Body (اللسان) */}
            {/* Tongue Back (أقصى اللسان) */}
            <g onClick={() => handleZoneClick('tongue_back')} className="cursor-pointer group">
              <path
                d="M 175 160 C 185 170 185 190 170 200 C 165 185 165 170 175 160 Z"
                fill={isZoneActive('tongue_back') ? '#10b981' : '#bbf7d0'}
                stroke={isZoneActive('tongue_back') ? '#047857' : '#22c55e'}
                strokeWidth={isZoneActive('tongue_back') ? '3' : '1.5'}
              />
              <circle cx="175" cy="180" r="5" fill="#047857" />
            </g>

            {/* Tongue Center (وسط اللسان) */}
            <g onClick={() => handleZoneClick('tongue_mid')} className="cursor-pointer group">
              <path
                d="M 150 165 C 165 160 175 165 170 185 C 155 185 145 175 150 165 Z"
                fill={isZoneActive('tongue_mid') ? '#10b981' : '#dcfce7'}
                stroke={isZoneActive('tongue_mid') ? '#047857' : '#22c55e'}
                strokeWidth={isZoneActive('tongue_mid') ? '3' : '1.5'}
              />
            </g>

            {/* Tongue Tip (طرف اللسان) */}
            <g onClick={() => handleZoneClick('tongue_tip')} className="cursor-pointer group">
              <path
                d="M 115 170 C 135 165 150 170 145 190 C 125 190 115 180 115 170 Z"
                fill={isZoneActive('tongue_tip') ? '#10b981' : '#86efac'}
                stroke={isZoneActive('tongue_tip') ? '#047857' : '#15803d'}
                strokeWidth={isZoneActive('tongue_tip') ? '3' : '1.5'}
              />
              <circle cx="125" cy="176" r="4" fill="#047857" />
            </g>

            {/* Lips (الشفتان) */}
            <g onClick={() => handleZoneClick('lips')} className="cursor-pointer group">
              {/* Upper lip */}
              <path
                d="M 80 155 C 95 153 105 158 105 163 C 95 165 85 162 80 155 Z"
                fill={isZoneActive('lips') ? '#f43f5e' : '#fecdd3'}
                stroke={isZoneActive('lips') ? '#be123c' : '#fb7185'}
                strokeWidth={isZoneActive('lips') ? '3' : '1.5'}
              />
              {/* Lower lip */}
              <path
                d="M 80 173 C 95 168 105 170 105 178 C 95 183 85 180 80 173 Z"
                fill={isZoneActive('lips') ? '#f43f5e' : '#fecdd3'}
                stroke={isZoneActive('lips') ? '#be123c' : '#fb7185'}
                strokeWidth={isZoneActive('lips') ? '3' : '1.5'}
              />
              <circle cx="92" cy="168" r="4" fill="#be123c" />
            </g>

            {/* Upper Teeth */}
            <rect x="105" y="157" width="8" height="10" rx="2" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
            {/* Lower Teeth */}
            <rect x="105" y="172" width="8" height="9" rx="2" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />

            {/* Throat Sections (الحلق) */}
            {/* Throat Top (أدنى الحلق) - غ خ */}
            <g onClick={() => handleZoneClick('throat_top')} className="cursor-pointer group">
              <rect
                x="180"
                y="205"
                width="28"
                height="22"
                rx="6"
                fill={isZoneActive('throat_top') ? '#f59e0b' : '#fef3c7'}
                stroke={isZoneActive('throat_top') ? '#b45309' : '#f59e0b'}
                strokeWidth={isZoneActive('throat_top') ? '3' : '1.5'}
              />
              <text x="194" y="220" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#78350f">
                غ خ
              </text>
            </g>

            {/* Throat Mid (وسط الحلق) - ع ح */}
            <g onClick={() => handleZoneClick('throat_mid')} className="cursor-pointer group">
              <rect
                x="180"
                y="235"
                width="28"
                height="22"
                rx="6"
                fill={isZoneActive('throat_mid') ? '#f59e0b' : '#fef3c7'}
                stroke={isZoneActive('throat_mid') ? '#b45309' : '#f59e0b'}
                strokeWidth={isZoneActive('throat_mid') ? '3' : '1.5'}
              />
              <text x="194" y="250" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#78350f">
                ع ح
              </text>
            </g>

            {/* Throat Deep (أقصى الحلق) - ء ه */}
            <g onClick={() => handleZoneClick('throat_deep')} className="cursor-pointer group">
              <rect
                x="180"
                y="265"
                width="28"
                height="22"
                rx="6"
                fill={isZoneActive('throat_deep') ? '#f59e0b' : '#fef3c7'}
                stroke={isZoneActive('throat_deep') ? '#b45309' : '#f59e0b'}
                strokeWidth={isZoneActive('throat_deep') ? '3' : '1.5'}
              />
              <text x="194" y="280" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#78350f">
                ء ه
              </text>
            </g>

            {/* Pointer Pin to currently active section */}
            <g className="animate-bounce">
              {activeMakhraj.id === 'lips' && (
                <polygon points="68,168 52,163 52,173" fill="#e11d48" />
              )}
              {activeMakhraj.id === 'tongue_tip' && (
                <polygon points="120,152 110,140 130,140" fill="#059669" />
              )}
              {activeMakhraj.id === 'throat_mid' && (
                <polygon points="215,245 230,238 230,252" fill="#d97706" />
              )}
            </g>
          </svg>

          {/* Quick instructions indicator */}
          <div className="absolute bottom-2 text-center text-[10px] text-emerald-800 bg-white/90 px-2 py-0.5 rounded-full border border-emerald-200">
            {language === 'ur' ? '👆 کسی بھی مقام پر کلک کریں' : '👆 Tap any place to explore'}
          </div>
        </div>

        {/* Articulation Point Detail Card */}
        <div className={`flex-1 w-full space-y-3 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold border border-emerald-300">
              <MapPin className="w-3.5 h-3.5" />
              {language === 'ur' ? activeMakhraj.categoryNameUr : activeMakhraj.categoryNameEn}
            </span>

            <button
              onClick={() => {
                playClickSound();
                speakTajweedLetter(activeMakhraj.letters.join(' '));
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-amber-950 rounded-full text-xs font-bold shadow-sm transition-transform active:scale-95"
            >
              <Volume2 className="w-3.5 h-3.5" />
              {language === 'ur' ? 'آواز سنیں' : 'Listen Sound'}
            </button>
          </div>

          <div>
            <h3 className={`text-xl font-bold text-slate-800 ${language === 'ur' ? 'font-urdu text-2xl' : ''}`}>
              {language === 'ur' ? activeMakhraj.nameUr : activeMakhraj.nameEn}
            </h3>
            <p className={`text-sm text-slate-600 mt-1 leading-relaxed ${language === 'ur' ? 'font-urdu text-base' : ''}`}>
              {language === 'ur' ? activeMakhraj.descriptionUr : activeMakhraj.descriptionEn}
            </p>
          </div>

          {/* Letters living here */}
          <div className="bg-white rounded-2xl p-3 border border-emerald-100 shadow-sm">
            <span className={`block text-xs font-semibold text-slate-500 mb-2 ${language === 'ur' ? 'font-urdu text-sm' : ''}`}>
              {language === 'ur' ? 'یہاں سے نکلنے والے حروف (کلک کر کے سنیں):' : 'Letters that originate here (tap to listen):'}
            </span>

            <div className={`flex flex-wrap gap-2.5 ${language === 'ur' ? 'justify-end' : 'justify-start'}`}>
              {activeMakhraj.letters.map((ltr, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    playClickSound();
                    speakTajweedLetter(ltr);
                  }}
                  className="w-12 h-12 bg-gradient-to-b from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-2xl font-bold font-arabic rounded-2xl shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 border-2 border-emerald-300"
                >
                  {ltr}
                </button>
              ))}
            </div>
          </div>

          {/* Qari Tip */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className={`block text-xs font-bold text-amber-900 ${language === 'ur' ? 'font-urdu text-sm' : ''}`}>
                {language === 'ur' ? 'قاری زید کا خاص مشورہ:' : 'Qari Zayd\'s Secret Tip:'}
              </span>
              <p className={`text-xs text-amber-950 mt-0.5 ${language === 'ur' ? 'font-urdu text-sm' : ''}`}>
                {language === 'ur' ? activeMakhraj.tipUr : activeMakhraj.tipEn}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

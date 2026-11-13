import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  CheckCircle,
  ExternalLink,
  X,
  Shield,
  FileCode,
  Package,
  Layers,
  HelpCircle,
  Copy,
  Check,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Language } from '../types';
import { playClickSound, playSuccessFanfare } from '../utils/audio';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [activeTab, setActiveTab] = useState<'direct' | 'project' | 'online'>('project');

  if (!isOpen) return null;

  const appUrl = window.location.origin;

  const handleCopyUrl = () => {
    playClickSound();
    navigator.clipboard.writeText(appUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleInstallClick = async () => {
    playClickSound();
    if (isInstallable) {
      const ok = await install();
      if (ok) {
        playSuccessFanfare();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        dir={language === 'ur' ? 'rtl' : 'ltr'}
        className={`bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 border-4 border-emerald-400 shadow-2xl relative text-slate-800 space-y-4 max-h-[92vh] overflow-y-auto ${
          language === 'ur' ? 'font-urdu text-right' : 'text-left'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className={`absolute top-4 ${
            language === 'ur' ? 'left-4' : 'right-4'
          } p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center text-3xl mx-auto shadow-md">
            📱
          </div>

          <h3 className={`text-xl sm:text-2xl font-black text-slate-900 ${language === 'ur' ? 'font-urdu text-2xl sm:text-3xl' : ''}`}>
            {language === 'ur' ? 'اینڈرائیڈ APK حاصل کرنے کے طریقے' : 'Android APK & Installation Center'}
          </h3>

          <p className={`text-xs text-slate-500 font-medium ${language === 'ur' ? 'font-urdu text-sm' : ''}`}>
            {language === 'ur'
              ? 'تجوید کڈز کو اپنے موبائل پر مکمل اصلی اینڈرائیڈ ایپ (APK) بنانے کے ۳ آسان طریقے'
              : '3 verified ways to get Tajweed Kids running as a native Android APK'}
          </p>
        </div>

        {/* Method Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => {
              playClickSound();
              setActiveTab('direct');
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'direct' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-emerald-800'
            } ${language === 'ur' ? 'font-urdu' : ''}`}
          >
            {language === 'ur' ? '۱۔ فون میں انسٹال' : '1. Phone Install'}
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveTab('project');
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'project' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-emerald-800'
            } ${language === 'ur' ? 'font-urdu' : ''}`}
          >
            {language === 'ur' ? '۲۔ اینڈرائیڈ پروجیکٹ' : '2. Studio ZIP'}
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveTab('online');
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'online' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-emerald-800'
            } ${language === 'ur' ? 'font-urdu' : ''}`}
          >
            {language === 'ur' ? '۳۔ آن لائن کنورٹر' : '3. Online Maker'}
          </button>
        </div>

        {/* TAB 1: Direct Android Chrome Install (WebAPK) */}
        {activeTab === 'direct' && (
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center">
                ✓
              </span>
              <h4 className={`text-sm font-black text-emerald-950 ${language === 'ur' ? 'font-urdu text-base' : ''}`}>
                {language === 'ur' ? 'موبائل میں براہ راست اصلی ایپ کی طرح چلائیں' : 'Direct Android Install (WebAPK)'}
              </h4>
            </div>

            <p className={`text-xs text-emerald-900 leading-relaxed ${language === 'ur' ? 'font-urdu text-sm' : ''}`}>
              {language === 'ur'
                ? 'گوگل اینڈرائیڈ کا اپنا سسٹم اس ایپ کو بغیر کسی بیرونی فائل کے فوری طور پر موبائل کی ہوم اسکرین پر انسٹال کر دیتا ہے، جو آف لائن بھی چلتی ہے۔'
                : 'Android Chrome installs the app automatically to your home screen with its own icon, splash screen, and full offline caching.'}
            </p>

            {isInstallable ? (
              <button
                onClick={handleInstallClick}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs md:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>{language === 'ur' ? 'موبائل میں ابھی انسٹال کریں' : 'Install App on Phone Now'}</span>
              </button>
            ) : (
              <div className="bg-white/90 p-3.5 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-2">
                <span className={`font-bold block text-emerald-900 ${language === 'ur' ? 'font-urdu text-sm' : ''}`}>
                  {language === 'ur' ? 'موبائل کروم میں ۲ سیکنڈ کا طریقہ:' : 'How to install on Android phone:'}
                </span>
                <ol className={`list-decimal list-inside space-y-1 text-slate-700 ${language === 'ur' ? 'font-urdu text-sm' : ''}`}>
                  <li>
                    {language === 'ur' ? 'اپنے اینڈرائیڈ فون کے کروم براؤزر میں اوپر ۳ نقطوں (⋮) پر کلک کریں۔' : 'Tap the 3 dots (⋮) in Chrome on your Android phone.'}
                  </li>
                  <li>
                    {language === 'ur' ? 'مینو میں "Install app" یا "Add to Home screen" پر کلک کریں۔' : 'Tap "Install app" or "Add to Home screen".'}
                  </li>
                  <li>
                    {language === 'ur' ? 'ایپ کا آئیکون آپ کے موبائل میں APK کی طرح آ جائے گا!' : 'The app icon will appear on your phone screen!'}
                  </li>
                </ol>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Ready Android Studio Project (.ZIP) */}
        {activeTab === 'project' && (
          <div className="bg-gradient-to-br from-sky-50 to-blue-50 border-2 border-sky-300 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs font-black flex items-center justify-center">
                📁
              </span>
              <h4 className={`text-sm font-black text-sky-950 ${language === 'ur' ? 'font-urdu text-base' : ''}`}>
                {language === 'ur' ? 'اینڈرائیڈ اسٹوڈیو پروجیکٹ (.zip)' : 'Android Studio Project (.zip)'}
              </h4>
            </div>

            <p className={`text-xs text-sky-900 leading-relaxed ${language === 'ur' ? 'font-urdu text-sm' : ''}`}>
              {language === 'ur'
                ? 'ہم نے اس ایپ کا مکمل اینڈرائیڈ اسٹوڈیو پروجیکٹ تیار کر دیا ہے۔ اسے ڈاؤنلوڈ کریں اور اینڈرائیڈ اسٹوڈیو میں کھول کر Build APK دبائیں، باقاعدہ .apk فائل فوری بن جائے گی۔'
                : 'Complete native Android Studio project with Java WebView, microphone permissions (RECORD_AUDIO), and bundled offline assets.'}
            </p>

            {/* Download Buttons */}
            <div className="space-y-2 pt-1">
              <a
                href="/tajweed-kids-android-project.zip"
                download="tajweed-kids-android-project.zip"
                onClick={() => playClickSound()}
                className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-black text-xs md:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <Package className="w-4 h-4" />
                <span>
                  {language === 'ur'
                    ? 'اینڈرائیڈ اسٹوڈیو پروجیکٹ ڈاؤنلوڈ کریں (.zip)'
                    : 'Download Android Studio Project (.zip)'}
                </span>
              </a>

              <a
                href="/tajweed-kids-offline-app.zip"
                download="tajweed-kids-offline-app.zip"
                onClick={() => playClickSound()}
                className="w-full py-2.5 px-4 bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <FileCode className="w-4 h-4" />
                <span>
                  {language === 'ur'
                    ? 'آف لائن ویب زپ پیکیج ڈاؤنلوڈ کریں'
                    : 'Download Standalone Web Package (.zip)'}
                </span>
              </a>
            </div>

            <div className="bg-white/80 p-3 rounded-xl border border-sky-200 text-xs text-slate-700 space-y-1.5">
              <span className={`font-bold block text-sky-900 ${language === 'ur' ? 'font-urdu text-sm' : ''}`}>
                {language === 'ur' ? 'APK بنانے کے ۲ آسان طریقے:' : '2 Ways to Compile the .APK:'}
              </span>
              <p className={`text-[11px] leading-relaxed ${language === 'ur' ? 'font-urdu text-xs' : ''}`}>
                {language === 'ur'
                  ? 'الف) Android Studio: زپ ایکسٹریکٹ کر کے کھولیں اور Build → Build APK(s) پر کلک کریں۔ ب) بغیر Android Studio کے (مفت GitHub Cloud): زپ فائلز GitHub ریپوزٹری میں اپلوڈ کریں، Actions ٹیب سے خودکار طور پر app-debug.apk اور app-release.aab ڈاؤنلوڈ کریں!'
                  : 'A) Android Studio: Extract ZIP, open folder, click Build → Build Bundle(s) / APK(s) → Build APK(s). B) Cloud Build (No Android Studio needed): Upload ZIP contents to GitHub and run the included "Build Android APK & AAB" GitHub Action to download app-debug.apk!'}
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: Online Free APK Builders (AppCreator24 / Website2APK) */}
        {activeTab === 'online' && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-amber-950 text-xs font-black flex items-center justify-center">
                ⚡
              </span>
              <h4 className={`text-sm font-black text-amber-950 ${language === 'ur' ? 'font-urdu text-base' : ''}`}>
                {language === 'ur' ? 'مفت آن لائن APK جنریٹرز' : 'Free Online APK Creators'}
              </h4>
            </div>

            <p className={`text-xs text-amber-900 leading-relaxed ${language === 'ur' ? 'font-urdu text-sm' : ''}`}>
              {language === 'ur'
                ? 'اگر آپ کے پاس کمپیوٹر یا اینڈرائیڈ اسٹوڈیو نہیں ہے تو آپ فری ویب سائٹس سے براہ راست APK بنا سکتے ہیں:'
                : 'Use online builders to generate an installable .apk in 1 minute:'}
            </p>

            {/* App URL copy box */}
            <div className="bg-white p-2.5 rounded-xl border border-amber-200 flex items-center justify-between gap-2">
              <span className="text-[11px] font-mono text-slate-600 truncate flex-1 dir-ltr">
                {appUrl}
              </span>
              <button
                onClick={handleCopyUrl}
                className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-xs rounded-lg flex items-center gap-1 shadow-xs"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUrl ? (language === 'ur' ? 'کاپی ہو گیا' : 'Copied') : (language === 'ur' ? 'لنک کاپی' : 'Copy')}</span>
              </button>
            </div>

            {/* Converter Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <a
                href="https://www.appcreator24.com/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playClickSound()}
                className="p-3 bg-white hover:bg-amber-100/60 border border-amber-300 rounded-xl text-center shadow-xs flex flex-col items-center justify-center transition-all"
              >
                <span className="text-sm font-black text-amber-950 block">AppCreator24</span>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  {language === 'ur' ? 'مفت میں فوری APK بنائیں' : 'Free 1-Minute APK Creator'}
                </span>
              </a>

              <a
                href={`https://www.pwabuilder.com/?url=${encodeURIComponent(appUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playClickSound()}
                className="p-3 bg-white hover:bg-amber-100/60 border border-amber-300 rounded-xl text-center shadow-xs flex flex-col items-center justify-center transition-all"
              >
                <span className="text-sm font-black text-amber-950 block">PWABuilder</span>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  {language === 'ur' ? 'گوگل پلے اور اینڈرائیڈ پیکج' : 'Package for Google Play'}
                </span>
              </a>
            </div>

            <p className={`text-[11px] text-amber-900 ${language === 'ur' ? 'font-urdu' : ''}`}>
              💡 {language === 'ur'
                ? 'AppCreator24 میں ویب ویو سیکشن میں اوپر والا لنک یا آف لائن زپ فائل اپلوڈ کر کے ڈاؤنلوڈ APK حاصل کریں۔'
                : 'In AppCreator24, select "Web Section", paste your app link, and tap download APK.'}
            </p>
          </div>
        )}

        {/* Footer info */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-semibold pt-1">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            {language === 'ur'
              ? 'مائیکروفون کی مکمل اجازت، آواز کی مشق، اور ۱۰۰٪ آف لائن سپورٹ شامل ہے'
              : 'Includes full microphone permissions, audio recorder, and offline support'}
          </span>
        </div>
      </div>
    </div>
  );
};

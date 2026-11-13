export type Language = 'en' | 'ur';

export type MakhrajCategory = 'throat' | 'tongue' | 'lips' | 'nose' | 'mouth_cavity';

export interface MakhrajPoint {
  id: string;
  nameEn: string;
  nameUr: string;
  category: MakhrajCategory;
  categoryNameEn: string;
  categoryNameUr: string;
  descriptionEn: string;
  descriptionUr: string;
  letters: string[];
  mouthZone: 'throat_deep' | 'throat_mid' | 'throat_top' | 'tongue_back' | 'tongue_mid' | 'tongue_edge' | 'tongue_tip' | 'lips' | 'nose' | 'cavity';
  tipEn: string;
  tipUr: string;
  soundExample: string;
}

export interface TajweedRuleItem {
  id: string;
  titleEn: string;
  titleUr: string;
  arabicTitle: string;
  category: 'makharij' | 'harakat' | 'qualqalah' | 'ghunna' | 'madd' | 'noon_sakin';
  badgeColor: string;
  descriptionEn: string;
  descriptionUr: string;
  letters: string[];
  lettersArabic: string;
  howToReciteEn: string;
  howToReciteUr: string;
  examples: {
    arabic: string;
    transliteration: string;
    meaningUr: string;
    meaningEn: string;
    highlightLetter: string;
    ruleNoteEn: string;
    ruleNoteUr: string;
  }[];
  funFactEn: string;
  funFactUr: string;
}

export interface LessonStep {
  id: string;
  titleEn: string;
  titleUr: string;
  qariSpeechEn: string;
  qariSpeechUr: string;
  animationType: 'mouth' | 'vowel' | 'bounce' | 'buzz' | 'stretch' | 'blend';
  interactiveData?: any;
}

export interface LessonData {
  id: string;
  number: number;
  titleEn: string;
  titleUr: string;
  arabicTitle: string;
  subtitleEn: string;
  subtitleUr: string;
  icon: string;
  color: string;
  bgGradient: string;
  estimatedMinutes: number;
  overviewEn: string;
  overviewUr: string;
  steps: LessonStep[];
  quizQuestions: {
    questionEn: string;
    questionUr: string;
    optionsEn: string[];
    optionsUr: string[];
    correctIndex: number;
    explanationEn: string;
    explanationUr: string;
  }[];
}

export interface PracticeWord {
  id: string;
  arabic: string;
  letter: string;
  ruleTag: string;
  ruleTagUr: string;
  tagColor: string;
  transliteration: string;
  category: string;
  tipEn: string;
  tipUr: string;
  difficulty: 'easy' | 'medium' | 'star';
}

export interface QuizQuestion {
  id: string;
  questionEn: string;
  questionUr: string;
  arabicLetter?: string;
  options: {
    textEn: string;
    textUr: string;
    isCorrect: boolean;
    icon?: string;
  }[];
  hintEn: string;
  hintUr: string;
}

export interface BadgeItem {
  id: string;
  titleEn: string;
  titleUr: string;
  descriptionEn: string;
  descriptionUr: string;
  icon: string;
  unlocked: boolean;
  requiredStars: number;
  unlockedDate?: string;
}

export interface ChildProfile {
  name: string;
  age: number;
  avatar: string; // avatar id
  stars: number;
  streakDays: number;
  lastActiveDate: string;
  completedLessons: string[];
  totalPracticeCount: number;
  tajweedScore: number;
  weakLetters: { letter: string; nameEn: string; nameUr: string; practiceCount: number; accuracy: number }[];
  weeklyActivity: { day: string; dayUr: string; active: boolean; minutes: number }[];
}

export interface FamilyLeaderboardMember {
  id: string;
  name: string;
  relationEn: string;
  relationUr: string;
  avatar: string;
  stars: number;
  streak: number;
  isCurrentChild?: boolean;
}

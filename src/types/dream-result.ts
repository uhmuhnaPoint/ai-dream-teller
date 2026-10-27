import { PerspectiveType } from './dream-teller';

export interface CalendarDreamEntry {
  day: number;
  dateStr: string;
  orderId: string;
  perspective: PerspectiveType;
  title: string;
  summary: string;
  hasImage: boolean;
}

export interface DreamAnalysisReport {
  title: string;
  perspectiveBadge: string;
  unconsciousCore: string;
  symbolBreakdown: {
    symbol: string;
    meaning: string;
  }[];
  psychologicalDiagnosis: string;
  actionablePrescription: string;
  growthPrompt: string;
  keywords: string[];
}

export interface DreamResultData {
  orderId: string;
  createdAt: string;
  perspective: PerspectiveType;
  dreamStory: string;
  hasImage: boolean;
  aiImageUrl?: string;
  aiImageAlt?: string;
  report: DreamAnalysisReport;
  isPublic: boolean;
  authorNickname: string;
  isMemberOwner: boolean; // 회원가입 후 로그인하여 구매한 소유자 여부
  calendarEntries?: CalendarDreamEntry[]; // 회원용 무의식 캘린더 기록
}

import { PerspectiveType } from '@/types/dream-teller';

export interface ParsedDreamReport {
  title: string;
  symbolSummary: string;
  unconsciousInsight: string;
  psychologicalState: string;
  advice: string;
  rawMarkdown: string;
}

export interface PublicDreamItem {
  id: string; // dream_results.id
  orderId: string; // orders.id or orders.order_number
  orderNumber: string;
  fieldId: PerspectiveType;
  title: string;
  dreamFullStory: string;
  analysisFullReport: {
    symbolSummary: string;
    unconsciousInsight: string;
    psychologicalState: string;
    advice: string;
    rawText: string;
  };
  schoolBadge: string;
  schoolColor: string;
  imageSrc: string;
  imageAlt: string;
  createdTime: string;
  views: number;
}

/**
 * 학파별 뱃지 및 색상 매핑
 */
export const PERSPECTIVE_BADGES: Record<
  PerspectiveType,
  { label: string; badge: string; color: string }
> = {
  freud: {
    label: '프로이트 (욕망/은유)',
    badge: '프로이트 심층 분석',
    color: 'bg-[#D53F8C]/10 text-[#D53F8C] border-[#D53F8C]/20',
  },
  jung: {
    label: '칼 융 (원형/상징)',
    badge: '칼 융 원형 분석',
    color: 'bg-[#6B46C1]/10 text-[#6B46C1] border-[#6B46C1]/20',
  },
  neuroscience: {
    label: '신경과학 (뇌기억/정화)',
    badge: '신경과학 분석',
    color: 'bg-[#2B6CB0]/10 text-[#2B6CB0] border-[#2B6CB0]/20',
  },
  gestalt: {
    label: '게슈탈트 (자아통합)',
    badge: '게슈탈트 분석',
    color: 'bg-[#38A169]/10 text-[#276749] border-[#38A169]/20',
  },
};

/**
 * Gemini가 작성한 해몽 분석 마크다운 텍스트를 구조화된 데이터로 추출합니다.
 */
export const parseDreamAnalysisMarkdown = (
  markdown: string | null | undefined,
  fallbackDreamContent: string = ''
): ParsedDreamReport => {
  if (!markdown || typeof markdown !== 'string') {
    return {
      title: fallbackDreamContent ? fallbackDreamContent.slice(0, 30) + '...' : '해독된 꿈 리포트',
      symbolSummary: '무의식 상징 해독 분석 중',
      unconsciousInsight: '수면 중 뇌와 자아가 형성한 심층 무의식의 메시지입니다.',
      psychologicalState: '심리적 균형 및 회복 진행 중',
      advice: '내면의 감정을 온전히 수용하고 건강한 휴식을 취해보세요.',
      rawMarkdown: '',
    };
  }

  // 1. 무의식 핵심 메시지 섹션 추출 (## 1. ... 부터 ## 2. 전까지)
  const insightMatch = markdown.match(/##\s*1\.[^\n]*\n([\s\S]*?)(?=##\s*2\.|$)/);
  let unconsciousInsight = '';
  if (insightMatch && insightMatch[1]) {
    // 마크다운 서식 다듬기
    unconsciousInsight = insightMatch[1]
      .replace(/[*_#`>-]/g, '')
      .replace(/\n+/g, ' ')
      .trim();
  }

  // 2. 상징물 섹션 추출 (## 2. ... 부터 ## 3. 전까지)
  const symbolSectionMatch = markdown.match(/##\s*2\.[^\n]*\n([\s\S]*?)(?=##\s*3\.|$)/);
  const symbols: string[] = [];
  if (symbolSectionMatch && symbolSectionMatch[1]) {
    // ### ① 이름 — *의미* 패턴 매칭
    const symbolMatches = symbolSectionMatch[1].matchAll(/###\s*[①②③④⑤\d\.\s]*([^(—\n]+)/g);
    for (const match of symbolMatches) {
      if (match[1]?.trim()) {
        symbols.push(match[1].trim());
      }
    }
  }

  const symbolSummary =
    symbols.length > 0
      ? `핵심 상징: ${symbols.slice(0, 3).join(', ')}`
      : '무의식의 은유와 상징적 원형 분해';

  // 3. 현실 처방 및 조언 섹션 추출 (## 4. ... 이후 또는 마지막 섹션)
  const adviceMatch = markdown.match(/##\s*4\.[^\n]*\n([\s\S]*?)$/);
  let advice = '';
  let psychologicalState = '정서적 무의식 회복 및 통찰 진행 중';

  if (adviceMatch && adviceMatch[1]) {
    const rawAdvice = adviceMatch[1].replace(/[*_#`>-]/g, '').trim();
    const sentences = rawAdvice.split('\n').filter((s) => s.trim().length > 10);
    if (sentences.length > 0) {
      advice = sentences[0].trim();
      if (sentences.length > 1) {
        psychologicalState = sentences[1].trim();
      }
    }
  }

  if (!advice) {
    advice = '현재의 감정 상태를 솔직하게 마주하고 일상에서 통제 가능한 일에 집중하세요.';
  }

  // 4. 타이틀 생성
  let title = '';
  // 따옴표나 강조 구문에서 핵심 어구 찾기
  const quoteMatch = unconsciousInsight.match(/[‘'“]([^'”’]+)[’'”]/);
  if (quoteMatch && quoteMatch[1]) {
    title = quoteMatch[1].trim();
  } else if (symbols.length > 0) {
    title = `${symbols.join(', ')}의 무의식 신호`;
  } else if (fallbackDreamContent) {
    title = fallbackDreamContent.slice(0, 28) + (fallbackDreamContent.length > 28 ? '...' : '');
  } else {
    title = '미지의 무의식에서 피어난 해몽 서사';
  }

  return {
    title,
    symbolSummary,
    unconsciousInsight: unconsciousInsight || '무의식이 보낸 심층 메시지를 해석한 결과입니다.',
    psychologicalState,
    advice,
    rawMarkdown: markdown,
  };
};

/**
 * 경과 시간 텍스트 포맷터 (예: '방금 전', '12분 전', '1시간 전', '어제')
 */
export const formatTimeAgo = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) return '방금 전 해독 완료';
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}분 전 해독 완료`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}시간 전 해독 완료`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}일 전 해독 완료`;
  } catch {
    return '최근 해독 완료';
  }
};

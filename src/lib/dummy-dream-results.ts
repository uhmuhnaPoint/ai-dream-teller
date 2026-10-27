import { DreamResultData, CalendarDreamEntry } from '@/types/dream-result';
import { PerspectiveType } from '@/types/dream-teller';

/**
 * 로그인 회원의 이번 달 꿈 캘린더 기록 더미데이터
 */
export const DUMMY_CALENDAR_ENTRIES: CalendarDreamEntry[] = [
  {
    day: 5,
    dateStr: '2026-10-05',
    orderId: 'DREAM_1005',
    perspective: 'jung',
    title: '황금 열쇠를 쥔 심해 고래',
    summary: '안개 낀 바다에서 거대한 고래를 만나고 잊고 있던 열망을 되찾은 꿈',
    hasImage: true,
  },
  {
    day: 14,
    dateStr: '2026-10-14',
    orderId: 'DREAM_1014',
    perspective: 'neuroscience',
    title: '기울어진 사무실 복도와 시계탑',
    summary: '끝없는 복도를 달리며 업무 마감 스트레스를 뇌가 정화한 꿈',
    hasImage: false,
  },
  {
    day: 21,
    dateStr: '2026-10-21',
    orderId: 'DREAM_1021',
    perspective: 'gestalt',
    title: '거울 속 우는 그림자와의 포옹',
    summary: '소외되었던 내면아이를 발견하고 깊은 눈물과 화해를 나눈 꿈',
    hasImage: true,
  },
  {
    day: 27,
    dateStr: '2026-10-27',
    orderId: 'DREAM_CURRENT',
    perspective: 'jung',
    title: '보랏빛 도서관과 황금빛 부엉이',
    summary: '오로라 하늘을 날아 고대 지혜의 상징인 부엉이를 만난 꿈 (오늘)',
    hasImage: true,
  },
];

/**
 * 특정 orderId에 대응하는 사실감 넘치는 꿈 해석 결과 데이터를 반환합니다.
 */
export const getDreamResultByOrderId = (orderId: string): DreamResultData => {
  return {
    orderId,
    createdAt: '2026년 10월 27일 14:30',
    perspective: 'jung',
    authorNickname: '달빛서재_77a9',
    isMemberOwner: true, // 기본값: 회원 본인 소유 (컨테이너에서 뷰 모드 토글 가능)
    isPublic: false,
    hasImage: true,
    aiImageUrl: '/images/pensieve-library.jpg',
    aiImageAlt: '보랏빛 마법 서재와 황금빛 오로라가 일렁이는 꿈 시각화 AI 아트워크',
    dreamStory:
      '어젯밤 끝이 보이지 않는 거대한 원형 도서관 한가운데에 서 있었습니다. 서가에 꽂힌 수천 권의 책들이 은은한 보랏빛 빛을 내뿜고 있었고, 공중에는 별자리들이 천천히 회전하고 있었습니다. 탑 꼭대기의 창문을 열자 거대한 황금빛 부엉이가 날아와 제 어깨에 앉았습니다. 부엉이는 제 눈을 응시하더니 발톱 사이에 쥐고 있던 낡은 양피지 두루마리를 건네주었습니다. 두루마리를 펼치자 제 어릴 적 꿈꾸었던 미래의 지도가 선명하게 그려져 있었습니다.',
    report: {
      title: '고대 서재의 현자 원형과 내면의 비밀 지도',
      perspectiveBadge: '칼 융 · 분석심리학 (Analytical Psychology)',
      unconsciousCore:
        '“의식의 나침반이 흔들릴 때, 집단 무의식의 거대한 도서관이 문을 열고 영혼의 지도를 건네었습니다.”',
      symbolBreakdown: [
        {
          symbol: '거대한 원형 도서관 (The Infinite Archive)',
          meaning:
            '원형(Circle)은 융 심리학에서 완전함과 전체성(Wholeness)을 상징하는 만다라(Mandala)의 형태입니다. 무한한 도서관은 인류의 지혜가 농축된 ‘집단 무의식(Collective Unconscious)’을 뜻하며, 현재 혼란스러운 일상 속에서 진정한 본질을 찾고자 하는 깊은 갈망을 나타냅니다.',
        },
        {
          symbol: '황금빛 부엉이 (The Golden Owl)',
          meaning:
            '어둠 속을 꿰뚫어 보는 부엉이는 지혜와 직관의 화신이자 ‘현명한 노인(Wise Old Man)’ 원형의 전형입니다. 황금빛은 연금술에서 가장 순수하고 고귀한 자기실현(Self)의 성취를 상징합니다.',
        },
        {
          symbol: '양피지 두루마리와 미래의 지도 (The Unrolled Scroll)',
          meaning:
            '억압되었던 잠재력이 마침내 의식의 수면 위로 떠올랐음을 뜻합니다. 타인의 시선이나 사회적 기준이 아닌, 본인만의 고유한 인생 여정을 개척할 준비가 완료되었음을 암시합니다.',
        },
      ],
      psychologicalDiagnosis:
        '현재 당신의 자아(Ego)는 현실의 자잘한 선택들 사이에서 피로감을 느끼고 있을 수 있습니다. 하지만 당신의 깊은 내면은 이미 자신이 나아가야 할 올바른 방향을 직관적으로 명확하게 파악하고 있습니다. 이번 꿈은 자아가 의식적 불안을 내려놓고 무의식의 지혜를 신뢰하도록 보내온 강력한 확신의 신호입니다.',
      actionablePrescription:
        '이번 주말에는 스마트폰과 일상 소음을 완전히 차단한 채, 혼자만의 30분 명상이나 일기 쓰기를 진행해보세요. 꿈속 부엉이가 건넨 지도처럼, 가장 직관적으로 떠오르는 1가지 핵심 목표를 공책에 적고 그것을 위해 첫 발걸음을 떼보세요.',
      growthPrompt:
        '“내가 어린 시절 가슴 뛰게 동경했으나, 현실의 무게에 눌려 서랍 속에 넣어두었던 꿈은 무엇인가요?”',
      keywords: ['#원형도서관', '#현자원형', '#황금부엉이', '#개성화과정', '#직관의지도'],
    },
    calendarEntries: DUMMY_CALENDAR_ENTRIES,
  };
};

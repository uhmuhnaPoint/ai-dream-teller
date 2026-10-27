import { fakerKO as faker } from '@faker-js/faker';
import { FeedPost } from '@/types/feed';
import { PerspectiveType } from '@/types/dream-teller';

/**
 * 현실감 넘치고 심도 있는 실제 꿈 시나리오 풀 (4대 학파별 고증)
 */
const REALISTIC_DREAM_TEMPLATES: {
  perspective: PerspectiveType;
  dreamContent: string;
  analysisSummary: string;
  keywords: string[];
  realLifeAdvice: string;
}[] = [
  {
    perspective: 'jung',
    dreamContent:
      '끝없는 안개 낀 바다 위를 나룻배 한 척을 타고 표류하고 있었습니다. 갑자기 물속에서 은빛으로 빛나는 거대한 혹등고래가 솟구치더니 제 배 주위를 천천히 돌며 입에서 오래된 황금 열쇠 하나를 뱉어 배 위에 올려두었습니다. 그 열쇠를 쥐는 순간 가슴속에서 잊고 있던 어릴 적 꿈이 떠올랐습니다.',
    analysisSummary:
      '칼 융 심리학에서 심해와 고래는 인간의 ‘위대한 모성 원형(Great Mother)’이자 광대한 무의식의 지혜를 상징합니다. 황금 열쇠는 자아(Ego)가 억압해왔던 진정한 자기(Self)로 향하는 개성화(Individuation) 과정의 상징적 초대장입니다.',
    keywords: ['#심해의원형', '#황금열쇠', '#자기실현', '#무의식의지혜'],
    realLifeAdvice:
      '현재 일상에서 논리와 효율에만 얽매여 잊고 지냈던 내면의 창조적 열망을 재발견할 시기입니다. 마음 깊은 곳의 목소리에 귀를 기울여보세요.',
  },
  {
    perspective: 'freud',
    dreamContent:
      '고등학교 교실이었는데, 오늘이 수능이나 졸업시험 날이라는 사실을 시험 시작 종이 치고 나서야 깨달았습니다. 당황해서 필통을 열었더니 연필들이 모두 고무처럼 흐물거리며 부러졌고, 답안지에는 글씨가 전혀 써지지 않았습니다. 주변 친구들은 기계처럼 차갑게 저를 쳐다보고 있었습니다.',
    analysisSummary:
      '프로이트 정신분석에서 전형적인 ‘시험 불안 꿈(Examination Dream)’은 초자아(Superego)의 가혹한 검열과 현실에서의 평가에 대한 무의식적 공포를 대변합니다. 흐물거리는 필구류는 주체적인 통제력 상실과 내면의 깊은 무력감의 상징적 투사입니다.',
    keywords: ['#초자아의검열', '#시험불안', '#통제감상실', '#억압된공포'],
    realLifeAdvice:
      '최근 직장이나 사회적 관계에서 지나치게 완벽주의를 강요받고 있지는 않은가요? 스스로에게 기준을 조금 낮추고 온전한 쉼을 허락해야 합니다.',
  },
  {
    perspective: 'neuroscience',
    dreamContent:
      '익숙한 사무실 복도를 걷고 있었는데 갑자기 바닥이 기울어지며 지하철 환승 통로로 변했습니다. 수많은 사람들이 얼굴 없이 빠르게 지나쳐갔고, 스마트폰에서는 처리해야 할 메시지가 폭포처럼 쏟아져 내렸습니다. 아무리 뛰쳐나가려 해도 같은 역 승강장으로 계속 되돌아왔습니다.',
    analysisSummary:
      '신경과학적 관점에서 이는 REM 수면 중 전두엽의 논리 회로가 억제되고, 편도체와 해마가 일상 속 과부하된 정보와 멀티태스킹 스트레스를 압축·정리하는 과정에서 발생한 ‘인지적 루프 현상’입니다.',
    keywords: ['#REM수면', '#정보과부하', '#편도체활성', '#스트레스재정돈'],
    realLifeAdvice:
      '디지털 번아웃 신호입니다. 잠들기 1시간 전 스마트폰 화면을 멀리하고 수면 환경의 암막과 온도를 조절해 깊은 서파 수면(Slow-wave sleep)을 유도하세요.',
  },
  {
    perspective: 'gestalt',
    dreamContent:
      '밤중에 낡은 고택의 방에서 거울을 들여다보고 있었습니다. 그런데 거울 속 제 모습은 제 얼굴이 아니라 몹시 지치고 슬픈 표정을 한 낯선 그림자 인물이었습니다. 그 그림자가 제게 “너는 왜 나를 한 번도 안아주지 않니?”라고 울먹이며 말했고, 저는 알 수 없는 눈물을 흘리며 잠에서 깼습니다.',
    analysisSummary:
      '게슈탈트 치료에서 꿈속 거울과 그림자는 외부의 타인이 아닌, 의식이 거부하고 버려두었던 ‘소외된 내면아이(Disowned Self)’의 투사입니다. 그 슬픈 인물과의 대화는 분열되었던 자아의 조각들이 화해를 갈망하고 있음을 시사합니다.',
    keywords: ['#소외된자아', '#내면아이와의대화', '#게슈탈트통합', '#자기수용'],
    realLifeAdvice:
      '타인의 기대에 맞추느라 내팽개쳐 두었던 자신의 서운함과 슬픔을 있는 그대로 인정해주세요. 스스로를 안아주는 자비로운 태도가 필요한 때입니다.',
  },
  {
    perspective: 'jung',
    dreamContent:
      '보랏빛 오로라가 일렁이는 밤하늘을 맨몸으로 날고 있었습니다. 아래를 내려다보니 거대한 고대 도서관이 미로처럼 펼쳐져 있었고, 탑 꼭대기에서 황금빛 부엉이가 날아올라 제 어깨에 내려앉았습니다. 부엉이가 제 귀에 바람 소리 같은 고대 언어로 무언가를 속삭였습니다.',
    analysisSummary:
      '비행 꿈은 영적 해방과 관점의 확장을 의미하며, 고대 도서관과 황금빛 부엉이는 인류의 집단 무의식(Collective Unconscious)에 축적된 ‘현명한 노인(Wise Old Man)’ 원형의 전형적 메타포입니다.',
    keywords: ['#비행원형', '#지혜의상징', '#집단무의식', '#통찰의순간'],
    realLifeAdvice:
      '중대한 결정을 앞두고 있다면 단기적인 득실보다는 장기적인 직관과 통찰을 신뢰해 보세요. 해결의 실마리는 이미 당신 내면에 있습니다.',
  },
  {
    perspective: 'freud',
    dreamContent:
      '어린 시절 살던 골목길에서 알 수 없는 맹수에게 쫓기며 도망치고 있었습니다. 다리가 무거워져서 앞으로 나아가지 못하고 비명을 지르려 해도 목소리가 전혀 나오지 않았습니다. 궁지에 몰려 뒤를 돌아본 순간 맹수가 아닌 제가 가장 존경하던 은사님의 얼굴로 바뀌어 있었습니다.',
    analysisSummary:
      '추격 꿈은 외부의 적이 아닌, 내부에서 억압된 본능적 충동(Id)과 권위적 인물에 대한 양가감정(Ambivalence)의 갈등을 나타냅니다. 권위 대상에 대한 존경심 이면에 숨겨진 인정 투쟁과 무의식적 저항이 은유되어 있습니다.',
    keywords: ['#양가감정', '#억압된충동', '#권위와의갈등', '#무의식적추격'],
    realLifeAdvice:
      '주변의 권위자나 기대치에 맞추느라 억누르고 있는 솔직한 욕망이나 분노가 무엇인지 마주해보세요. 감정을 건강하게 언어화할 때 불안이 잦아듭니다.',
  },
];

const AVATAR_COLORS = [
  'bg-amber-100 text-amber-800 border-amber-300',
  'bg-purple-100 text-purple-800 border-purple-300',
  'bg-indigo-100 text-indigo-800 border-indigo-300',
  'bg-rose-100 text-rose-800 border-rose-300',
  'bg-sky-100 text-sky-800 border-sky-300',
  'bg-emerald-100 text-emerald-800 border-emerald-300',
];

const NICKNAME_PREFIXES = [
  '새벽별',
  '달빛서재',
  '루시드',
  '펜시브',
  '은하수',
  '꿈꾸는고래',
  '심야산책자',
  '황금열쇠',
  '밤의도서관',
  '오로라',
  '모래시계',
  '바람개비',
];

const TIME_AGO_LIST = [
  '방금 전',
  '12분 전',
  '45분 전',
  '2시간 전',
  '5시간 전',
  '어제',
  '2일 전',
  '3일 전',
  '5일 전',
];

/**
 * 실감나는 피드 더미 데이터를 생성합니다.
 * 사용자 요구사항: 이미지가 들어간 카드라면 faker.image.urlPicsumPhotos 라이브러리를 사용합니다.
 */
export const generateDummyFeeds = (count: number = 6, startIndex: number = 0): FeedPost[] => {
  return Array.from({ length: count }).map((_, i) => {
    const overallIndex = startIndex + i;
    const template = REALISTIC_DREAM_TEMPLATES[overallIndex % REALISTIC_DREAM_TEMPLATES.length];
    
    // 약 75%의 확률로 AI 아트워크 이미지를 포함 (PRD 기본 활성화 옵션 반영)
    const hasImage = (overallIndex % 4) !== 3;

    // faker.js의 urlPicsumPhotos를 사용하여 고화질 이미지 URL 생성
    const imageUrl = hasImage
      ? faker.image.urlPicsumPhotos({
          width: 800,
          height: 600,
          grayscale: false,
          blur: 0,
        })
      : undefined;

    const nickname = `${faker.helpers.arrayElement(NICKNAME_PREFIXES)}_${faker.string.alphanumeric({ length: 4 })}`;
    const avatarColor = faker.helpers.arrayElement(AVATAR_COLORS);
    const createdAt = TIME_AGO_LIST[overallIndex % TIME_AGO_LIST.length];

    return {
      id: `post_${overallIndex + 1}_${faker.string.nanoid(6)}`,
      orderId: `DREAM_${1000 + overallIndex}`,
      authorNickname: nickname,
      authorAvatarColor: avatarColor,
      createdAt,
      perspective: template.perspective,
      dreamContent: template.dreamContent,
      hasImage,
      imageUrl,
      imageAlt: `${nickname}님의 꿈 시각화 AI 아트워크`,
      analysisSummary: template.analysisSummary,
      keywords: template.keywords,
      realLifeAdvice: template.realLifeAdvice,
      likes: {
        mystic: faker.number.int({ min: 12, max: 84 }),
        comfort: faker.number.int({ min: 8, max: 48 }),
        insight: faker.number.int({ min: 15, max: 96 }),
        sameHere: faker.number.int({ min: 5, max: 32 }),
      },
      userReaction: null,
      commentsCount: faker.number.int({ min: 2, max: 14 }),
      comments: [
        {
          id: `comment_${overallIndex}_1`,
          author: `${faker.helpers.arrayElement(NICKNAME_PREFIXES)}_${faker.string.alphanumeric(3)}`,
          content: '저도 얼마 전에 비슷한 꿈을 꿨었는데 소름 돋네요... 해석 읽고 나니 마음이 정리되는 느낌입니다.',
          createdAt: '1시간 전',
          likesCount: faker.number.int({ min: 1, max: 12 }),
        },
        {
          id: `comment_${overallIndex}_2`,
          author: `${faker.helpers.arrayElement(NICKNAME_PREFIXES)}_${faker.string.alphanumeric(3)}`,
          content: 'AI 아트워크 색감이 진짜 꿈속 분위기 그대로네요! 저도 오늘 해몽 맡겨봐야겠어요.',
          createdAt: '30분 전',
          likesCount: faker.number.int({ min: 2, max: 8 }),
        },
      ],
    };
  });
};

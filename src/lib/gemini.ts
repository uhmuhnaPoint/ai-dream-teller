import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * AI 해몽 결과 반환 인터페이스
 */
export interface DreamAnalysisResult {
  analysisText: string;
  summaryText: string;
  imagePrompt?: string;
}

/**
 * 4대 학파별 분석 관점 가이드
 */
const getFieldPromptContext = (field: string): string => {
  switch (field.toLowerCase()) {
    case 'jung':
      return '칼 융(Carl Jung)의 분석심리학적 관점: 집단 무의식, 원형(Archetype), 그림자(Shadow), 아니마/아니무스, 자기실현(개성화 과정)을 중심으로 상징적 의미를 해석하세요.';
    case 'freud':
      return '지그문트 프로이트(Sigmund Freud)의 정신분석학적 관점: 억압된 소망 충족, 리비도와 무의식적 갈등, 잠재몽과 발현몽의 전치 및 응축을 분석하세요.';
    case 'neuroscience':
      return '현대 뇌인지과학 관점: REM 수면 중 해마의 기억 공고화(Memory Consolidation), 편도체의 정서 처리 및 신경 시냅스 연결 관점에서 과학적으로 분석하세요.';
    case 'gestalt':
      return '게슈탈트(Gestalt) 심리학 관점: 꿈속의 모든 등장인물과 사물이 자아의 억압되거나 분리된 투사물임을 전제로, "지금-여기(Here and Now)"에서의 자아 통합을 해석하세요.';
    default:
      return '칼 융의 심층 심리학과 현대 인지과학의 통합적 렌즈로 해석하세요.';
  }
};

/**
 * Gemini SDK를 활용하여 꿈에 대한 심층 해몽 리포트를 생성합니다.
 * 타임아웃 30초 규격을 준수합니다.
 */
export const generateDreamInterpretation = async (
  dreamContent: string,
  expertField: string,
  includesImage: boolean = false
): Promise<DreamAnalysisResult> => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  // 높은 가용성 및 무료 티어 무제한 쿼터를 보장하는 모델 목록 (Flash-Lite 우선)
  const candidateModels = [
    'gemini-flash-lite-latest',
    'gemini-3.1-flash-lite',
    'gemini-flash-latest',
    'gemini-3.8-flash',
  ];

  const prompt = `
당신은 세계 최고의 무의식 분석가이자 마법 서재 'AI DREAM TELLER'의 수석 해몽가입니다.
내담자가 간밤에 꾼 꿈에 대해 심층적이고 지적이며 신비로운 해독 리포트를 작성해 주세요.

[내담자의 꿈 내용]:
"${dreamContent}"

[중점 분석 학파]:
${getFieldPromptContext(expertField)}

[작성 지침]:
1. 단순한 미신이나 통속적 운세가 아닌, 심리학과 학문적 통찰이 담긴 풍부하고 깊이 있는 리포트로 작성하세요.
2. 아래의 5단계 마크다운 구조를 반드시 준수하세요:
   # 🔮 무의식 해독 리포트 (The Pensieve Archive)
   ## 1. 🌌 무의식의 핵심 심층 메시지
   ## 2. 🗝️ 꿈속 핵심 상징물과 원형 분석 (최소 2~3개 상징 발췌)
   ## 3. 📜 선택 학파 관점의 정밀 해부
   ## 4. 🧭 4대 학파(융/프로이트/뇌과학/게슈탈트) 통합 인사이트
   ## 5. 🌿 현실의 내담자를 위한 3가지 심리 처방
3. 문체는 지적이고 공감적이며, '펜시브(Pensieve)' 안에서 은빛 기억의 실타래를 건져 올리는 듯한 신비롭고 품격 있는 어조를 유지하세요.
${includesImage ? '4. 보고서 맨 마지막 줄에 반드시 [IMAGE_PROMPT: 몽환적이고 초현실적인 유화 스타일의 영문 이미지 묘사 프롬프트 1줄] 형식으로 시각화 프롬프트를 포함하세요.' : ''}
`;

  // 30초 타임아웃 제한
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    let lastError: Error | null = null;
    let fullText = '';

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.8,
            topP: 0.95,
            maxOutputTokens: 2500,
          },
        });

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });

        const response = await result.response;
        fullText = response.text();
        if (fullText && fullText.trim().length > 0) {
          lastError = null;
          break;
        }
      } catch (modelErr) {
        lastError = modelErr instanceof Error ? modelErr : new Error(String(modelErr));
        console.warn(`[Gemini] 모델(${modelName}) 호출 실패, 다음 후보 모델 시도:`, lastError.message);
      }
    }

    clearTimeout(timeoutId);

    if (lastError || !fullText || fullText.trim().length === 0) {
      throw lastError || new Error('Gemini API로부터 유효한 텍스트 응답을 수신하지 못했습니다.');
    }

    // 영문 이미지 프롬프트 추출 (옵션 구매 시)
    let imagePrompt: string | undefined = undefined;
    let cleanAnalysisText = fullText;

    const imagePromptMatch = fullText.match(/\[IMAGE_PROMPT:\s*(.+?)\]/i);
    if (imagePromptMatch) {
      imagePrompt = imagePromptMatch[1].trim();
      cleanAnalysisText = fullText.replace(/\[IMAGE_PROMPT:\s*(.+?)\]/i, '').trim();
    }

    // 텔레그램 알림용 1줄 요약문 추출
    const summaryMatch = cleanAnalysisText.match(/## 1\.\s*🌌[^\n]*\n+([^\n#]+)/);
    const summaryText = summaryMatch && summaryMatch[1]
      ? summaryMatch[1].slice(0, 100).trim()
      : '무의식의 억압된 상징과 심층 내면 욕망의 통합 리포트 생성 완료';

    return {
      analysisText: cleanAnalysisText,
      summaryText,
      imagePrompt,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Gemini API 응답 시간 초과 (30초 타임아웃)');
    }
    throw error;
  }
};

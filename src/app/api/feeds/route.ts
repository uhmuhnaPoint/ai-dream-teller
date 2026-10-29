import { NextRequest, NextResponse } from 'next/server';
import { getPublicDreams } from '@/lib/feeds-service';

/**
 * GET /api/feeds:
 * 사용자가 열람할 수 있는 공개 해몽 피드 목록을 반환합니다.
 * 
 * 보안 및 정책:
 * - 오직 `is_public === true`이고 `analysis_status === 'completed'`인 안전한 결과물만 필터링합니다.
 * - 사용자의 민감한 개인정보는 철저히 은닉하고, 꿈 본문과 해몽 통찰만 추출합니다.
 */
export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = request.nextUrl;
    const fieldParam = searchParams.get('field') || searchParams.get('perspective') || 'all';
    const limit = Math.min(Math.max(Number(searchParams.get('limit')) || 20, 1), 50);

    const allPublicFeeds = await getPublicDreams(limit);

    // 학파 필터링 적용 (all이 아닌 경우)
    const filteredFeeds =
      fieldParam === 'all'
        ? allPublicFeeds
        : allPublicFeeds.filter((feed) => feed.fieldId === fieldParam);

    return NextResponse.json({
      success: true,
      totalCount: filteredFeeds.length,
      feeds: filteredFeeds,
    });
  } catch (err: unknown) {
    // Next.js 16 정적 프리렌더링 바이패스 제어 흐름 예외는 빌더로 재전파
    if (err && typeof err === 'object' && 'digest' in err) {
      throw err;
    }

    console.error('[API Feeds] 예외 발생:', err);
    return NextResponse.json(
      { error: '공개 피드를 불러오는 도중 예기치 못한 에러가 발생했습니다.' },
      { status: 500 }
    );
  }
};

import { createAdminClient } from '@/lib/supabase/admin';
import { 
  parseDreamAnalysisMarkdown, 
  PERSPECTIVE_BADGES, 
  formatTimeAgo, 
  PublicDreamItem 
} from '@/lib/dream-parser';
import { PerspectiveType } from '@/types/dream-teller';

interface OrderRelation {
  id: string;
  order_number: string;
  dream_content: string;
  expert_field: PerspectiveType;
  created_at: string;
}

interface DreamResultRow {
  id: string;
  analysis_status: string;
  analysis_text: string | null;
  image_url: string | null;
  is_public: boolean;
  created_at: string;
  orders: OrderRelation | OrderRelation[] | null;
}

/**
 * getPublicDreams:
 * Supabase DB에서 `is_public === true`이고 `analysis_status === 'completed'`인
 * 실제 유저들의 공개 꿈 목록을 안전하게 조회하고 파싱합니다.
 */
export const getPublicDreams = async (limit: number = 20): Promise<PublicDreamItem[]> => {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('dream_results')
      .select(`
        id,
        analysis_status,
        analysis_text,
        image_url,
        is_public,
        created_at,
        orders (
          id,
          order_number,
          dream_content,
          expert_field,
          created_at
        )
      `)
      .eq('is_public', true)
      .eq('analysis_status', 'completed')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error || !data) {
      console.error('[getPublicDreams] DB 쿼리 실패:', error);
      return [];
    }

    const rows = (data as unknown as DreamResultRow[]) || [];

    const publicItems: PublicDreamItem[] = rows
      .map((row) => {
        const order = Array.isArray(row.orders) ? row.orders[0] : row.orders;
        if (!order) return null;

        const fieldId = (order.expert_field as PerspectiveType) || 'neuroscience';
        const parsed = parseDreamAnalysisMarkdown(row.analysis_text, order.dream_content);
        const badgeInfo = PERSPECTIVE_BADGES[fieldId] || PERSPECTIVE_BADGES.neuroscience;

        // 고유 해시 기반 임의 뷰 카운트 생성 (조회수)
        const mockViews = 1200 + ((row.id.charCodeAt(0) * 17) % 800);

        return {
          id: row.id,
          orderId: order.id,
          orderNumber: order.order_number,
          fieldId,
          title: parsed.title,
          dreamFullStory: order.dream_content,
          analysisFullReport: {
            symbolSummary: parsed.symbolSummary,
            unconsciousInsight: parsed.unconsciousInsight,
            psychologicalState: parsed.psychologicalState,
            advice: parsed.advice,
            rawText: parsed.rawMarkdown,
          },
          schoolBadge: badgeInfo.badge,
          schoolColor: badgeInfo.color,
          imageSrc: row.image_url || '/images/pensieve-library.jpg',
          imageAlt: `${order.order_number} 해몽 시각화 아트워크`,
          createdTime: formatTimeAgo(row.created_at),
          views: mockViews,
        };
      })
      .filter((item): item is PublicDreamItem => item !== null);

    return publicItems;
  } catch (err) {
    console.error('[getPublicDreams] 조회 중 예외 발생:', err);
    return [];
  }
};

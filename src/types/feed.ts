import { PerspectiveType } from './dream-teller';

export interface FeedComment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  likesCount: number;
}

export interface FeedPost {
  id: string;
  orderId: string;
  authorNickname: string;
  authorAvatarColor: string;
  createdAt: string;
  perspective: PerspectiveType;
  dreamContent: string;
  hasImage: boolean;
  imageUrl?: string;
  imageAlt?: string;
  analysisSummary: string;
  keywords: string[];
  realLifeAdvice: string;
  likes: {
    mystic: number;   // 신비로워요 🔮
    comfort: number;  // 위로돼요 🫂
    insight: number;  // 통찰을얻었어요 💡
    sameHere: number; // 저도비슷해요 🌙
  };
  userReaction?: 'mystic' | 'comfort' | 'insight' | 'sameHere' | null;
  commentsCount: number;
  comments: FeedComment[];
}

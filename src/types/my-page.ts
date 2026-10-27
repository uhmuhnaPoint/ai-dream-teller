import { PerspectiveType } from './dream-teller';

export interface UserProfile {
  id: string;
  email: string;
  nickname: string;
  avatarUrl?: string;
  provider: 'kakao' | 'google' | 'email';
  createdAt: string;
  stats: {
    totalDreams: number;
    artworkCount: number;
    favoritePerspective: string;
  };
}

export interface DreamPurchaseOrder {
  orderId: string;
  orderNumber: string;
  createdAt: string;
  perspective: PerspectiveType;
  title: string;
  summary: string;
  dreamStory: string;
  hasImage: boolean;
  imageUrl?: string;
  price: number;
  status: 'COMPLETED' | 'PROCESSING';
}

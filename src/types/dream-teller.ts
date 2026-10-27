/**
 * Dream Teller의 도메인 타입 정의
 * 4대 학문적 관점, 결제 옵션, 주문 초안에 대한 인터페이스를 명확하게 지정합니다.
 */

export type PerspectiveType = 'freud' | 'jung' | 'neuroscience' | 'gestalt';

export interface PerspectiveOption {
  id: PerspectiveType;
  name: string;
  enName: string;
  badge: string;
  coreQuestion: string;
  description: string;
  recommendedFor: string;
  bgGradient: string;
  borderColor: string;
}

export interface DreamTellerState {
  perspective: PerspectiveType | null;
  dreamContent: string;
  includeImage: boolean;
  totalAmount: number;
}

export interface OrderDraftData {
  perspective: PerspectiveType;
  dreamContent: string;
  includeImage: boolean;
  totalAmount: number;
  createdAt: string;
}

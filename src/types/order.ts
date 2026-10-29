import { PerspectiveType } from './dream-teller';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'canceled';

export interface DbOrder {
  id: string;
  order_number: string;
  user_id: string;
  total_amount: number;
  payment_status: PaymentStatus;
  payment_key: string | null;
  approved_at: string | null;
  error_message: string | null;
  dream_content: string;
  expert_field: PerspectiveType;
  includes_image: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbDreamResult {
  id: string;
  order_id: string;
  analysis_status: 'processing' | 'completed' | 'failed';
  analysis_text: string | null;
  image_url: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderRequest {
  dreamContent: string;
  expertField: PerspectiveType;
  includesImage: boolean;
  totalAmount: number;
  guestInfo?: {
    phone: string;
    password: string;
  };
}

export interface CreateOrderResponse {
  success: boolean;
  data: {
    orderId: string;
    orderNumber: string;
    totalAmount: number;
    orderName: string;
  };
}

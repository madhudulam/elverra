export interface PaymentGateway {
  id: string;
  name: string;
  type: 'mobile_money' | 'bank_transfer' | 'card' | 'crypto';
  isActive: boolean;
  config: {
    apiKey?: string;
    merchantId?: string;
    merchantCode?: string;
    merchantName?: string;
    userId?: string;
    publicKey?: string;
    transactionKey?: string;
    baseUrl?: string;
    environment?: 'test' | 'production';
    supportedCurrencies: string[];
  };
  fees: {
    percentage: number;
    fixed: number;
  };
  icon: string;
  description: string;
}

export interface PaymentService {
  id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  category: 'membership' | 'job_posting' | 'product_listing' | 'tokens' | 'other';
}

export interface PaymentRequest {
  serviceId: string;
  gatewayId: string;
  amount: number;
  currency: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  paymentUrl?: string;
  error?: string;
  gatewayResponse?: any;
}
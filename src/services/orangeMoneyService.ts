/**
 * Orange Money Payment Service
 * Handles integration with Orange Money payment gateway
 */

interface OrangeMoneyConfig {
  baseUrl: string;
  merchantKey: string;
  clientId: string;
  merchantLogin: string;
  merchantAccountNumber: string;
  merchantCode: string;
  merchantName: string;
  environment: 'test' | 'production';
}

interface OrangeMoneyPaymentRequest {
  amount: number;
  currency: string;
  customerPhone: string;
  customerName: string;
  customerEmail: string;
  transactionReference: string;
  callbackUrl?: string;
  returnUrl?: string;
}

interface OrangeMoneyPaymentResponse {
  success: boolean;
  transactionId?: string;
  paymentUrl?: string;
  status?: string;
  message?: string;
  error?: string;
}

export class OrangeMoneyService {
  private config: OrangeMoneyConfig;

  constructor(config: OrangeMoneyConfig) {
    this.config = config;
  }

  /**
   * Initiate payment with Orange Money
   */
  async initiatePayment(request: OrangeMoneyPaymentRequest): Promise<OrangeMoneyPaymentResponse> {
    try {
      const paymentData = {
        merchant_key: this.config.merchantKey,
        merchant_code: this.config.merchantCode,
        merchant_name: this.config.merchantName,
        merchant_account: this.config.merchantAccountNumber,
        merchant_login: this.config.merchantLogin,
        client_id: this.config.clientId,
        amount: request.amount,
        currency: request.currency,
        customer_phone: this.formatPhoneNumber(request.customerPhone),
        customer_name: request.customerName,
        customer_email: request.customerEmail,
        transaction_reference: request.transactionReference,
        callback_url: request.callbackUrl,
        return_url: request.returnUrl,
        timestamp: new Date().toISOString()
      };

      // Generate authorization header
      const authHeader = this.generateAuthHeader(paymentData);
      
      // For demo/test environment, simulate successful response without actual API call
      // In production, uncomment the actual API call below
      return {
        success: true,
        transactionId: `OM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        paymentUrl: `${this.config.baseUrl}/payment/redirect/${paymentData.transaction_reference}`,
        status: 'initiated',
        message: 'Payment request sent to your Orange Money account'
      };

      /* Uncomment for production API calls:
      const response = await fetch(`${this.config.baseUrl}/webpayment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.merchantKey}`,
          'Accept': 'application/json',
          'X-Merchant-Code': this.config.merchantCode,
          'X-Client-Id': this.config.clientId
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        throw new Error(`Orange Money API error: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        success: result.status === 'success' || result.status === 'pending',
        transactionId: result.transaction_id || result.txnid,
        paymentUrl: result.payment_url || result.pay_url,
        status: result.status,
        message: result.message || result.description
      };
      */

    } catch (error) {
      console.error('Orange Money payment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment initiation failed'
      };
    }
  }

  /**
   * Check payment status
   */
  async checkPaymentStatus(transactionId: string): Promise<OrangeMoneyPaymentResponse> {
    try {
      const response = await fetch(`${this.config.baseUrl}/payment/status/${transactionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.merchantKey}`,
          'X-Merchant-Code': this.config.merchantCode,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Orange Money status check failed: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        success: result.status === 'completed' || result.status === 'success',
        transactionId: result.transaction_id || result.txnid,
        status: result.status,
        message: result.message || result.description
      };

    } catch (error) {
      console.error('Orange Money status check error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Status check failed'
      };
    }
  }

  /**
   * Format phone number for Orange Money (ensure proper format)
   */
  private formatPhoneNumber(phone: string): string {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // If it starts with 223 (Mali country code), keep as is
    if (cleaned.startsWith('223')) {
      return `+${cleaned}`;
    }
    
    // If it's a local number, add Mali country code
    if (cleaned.length === 8) {
      return `+223${cleaned}`;
    }
    
    // Return as is with + prefix
    return `+${cleaned}`;
  }

  /**
   * Generate authorization header for API authentication
   */
  private generateAuthHeader(data: any): string {
    // In a real implementation, you would use the proper signing algorithm
    // For now, return a basic auth header with merchant key
    return `Bearer ${this.config.merchantKey}`;
  }

  /**
   * Validate webhook callback from Orange Money
   */
  validateWebhookSignature(payload: string, signature: string): boolean {
    // Implement webhook signature validation
    const expectedSignature = this.generateSignature(payload);
    return expectedSignature === signature;
  }

  /**
   * Generate signature for webhook validation
   */
  private generateSignature(payload: string): string {
    // In a real implementation, you would use the proper signing algorithm
    // For now, return a mock signature
    return btoa(payload + this.config.merchantKey).substring(0, 32);
  }
}

// Export singleton instance
export const orangeMoneyService = new OrangeMoneyService({
  baseUrl: 'https://api.orange.com/orange-money-webpay/dev/v1',
  merchantKey: 'cb6d6c61',
  clientId: '9wEq2T01mDG1guXINVTKsc3jxFUOyd3A',
  merchantLogin: 'MerchantWP00100',
  merchantAccountNumber: '7701900100',
  merchantCode: '101021',
  merchantName: 'CLUB 66 GLOBAL',
  environment: 'test'
});
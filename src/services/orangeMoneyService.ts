/**
 * Orange Money Payment Service
 * Handles integration with Orange Money payment gateway
 */

interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

interface OrangeMoneyConfig {
  baseUrl: string;
  oauthUrl: string;
  clientId: string;
  clientSecret: string;
  merchantLogin: string;
  merchantAccountNumber: string;
  merchantCode: string;
  merchantName: string;
  environment: 'production';
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
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor(config: OrangeMoneyConfig) {
    this.config = config;
  }

  /**
   * Get OAuth2 access token
   */
  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const tokenUrl = this.config.oauthUrl;

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'Authorization': `Basic ${btoa(`${this.config.clientId}:${this.config.clientSecret}`)}`
        },
        body: 'grant_type=client_credentials'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OAuth token request failed: ${response.status} - ${errorText}`);
      }

      const tokenData: OAuthTokenResponse = await response.json();

      this.accessToken = tokenData.access_token;
      // Set expiry to 90% of actual expiry to ensure refresh before expiration
      this.tokenExpiry = Date.now() + (tokenData.expires_in * 1000 * 0.9);

      return this.accessToken;
    } catch (error) {
      console.error('Error getting OAuth token:', error);
      throw new Error(`Failed to get access token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Initiate payment with Orange Money
   */
  async initiatePayment(request: OrangeMoneyPaymentRequest): Promise<OrangeMoneyPaymentResponse> {
    try {
      // Validate input parameters
      if (!request.amount || request.amount <= 0) {
        throw new Error('Invalid payment amount');
      }

      if (!request.customerPhone || !request.transactionReference) {
        throw new Error('Missing required payment parameters');
      }

      // Production flow - get access token first
      const accessToken = await this.getAccessToken();

      const paymentData = {
        merchant_code: this.config.merchantCode,
        merchant_name: this.config.merchantName,
        merchant_account: this.config.merchantAccountNumber,
        merchant_login: this.config.merchantLogin,
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

      // Production API call
      const response = await fetch(`${this.config.baseUrl}/webpayment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'X-Merchant-Code': this.config.merchantCode,
          'X-User-Id': this.config.merchantLogin
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Orange Money API error response:', errorText);
        throw new Error(`Orange Money API error: ${response.status} - ${errorText.substring(0, 200)}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.error('Non-JSON response from Orange Money:', responseText.substring(0, 500));
        throw new Error(`Invalid response format - expected JSON but got ${contentType}. Response: ${responseText.substring(0, 100)}...`);
      }

      const result = await response.json();

      return {
        success: result.status === 'success' || result.status === 'pending',
        transactionId: result.transaction_id || result.txnid,
        paymentUrl: result.payment_url || result.pay_url,
        status: result.status,
        message: result.message || result.description
      };

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
      const accessToken = await this.getAccessToken();

      const response = await fetch(`${this.config.baseUrl}/payment/status/${transactionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
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
   * Clear stored token (for testing or logout)
   */
  clearToken(): void {
    this.accessToken = null;
    this.tokenExpiry = null;
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
    return btoa(payload + this.config.clientSecret).substring(0, 32);
  }
}

// Export singleton instance with PRODUCTION placeholders
export const orangeMoneyService = new OrangeMoneyService({
  // !!! IMPORTANT: REPLACE THESE WITH YOUR ACTUAL PRODUCTION CREDENTIALS !!!
  baseUrl: 'https://api.orange.com/orange-money-webpay/v1', // Placeholder for production URL
  oauthUrl: 'https://api.orange.com/oauth/v3/token', // Placeholder for OAuth token URL
  baseUrl: 'https://api.orange.com/orange-money-webpay/dev/v1',
  oauthUrl: 'https://api.orange.com/oauth/v3/token',
  clientId: '9wEq2T01mDG1guXINVTKsc3jxFUOyd3A',
  clientSecret: '9bIBLY9vEZxFBW7wzDYSxBoiN3UFGLGRAUCSOoDeyWGw',
  merchantLogin: 'MerchantWP00100',
  merchantAccountNumber: '7701900100',
  merchantCode: '101021',
  merchantName: 'ELVERRA GLOBAL',
  environment: 'production' // This is now set to 'production'
});
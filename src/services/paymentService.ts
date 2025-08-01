import { PaymentGateway, PaymentRequest, PaymentResponse } from '@/types/payment';
import { samaMoneyService } from './samaMoneyService';
import { orangeMoneyService } from './orangeMoneyService';

class PaymentService {
  async processPayment(gateway: PaymentGateway, request: PaymentRequest): Promise<PaymentResponse> {
    try {
      switch (gateway.id) {
        case 'orange_money':
          return await this.processOrangeMoneyPayment(gateway, request);
        case 'sama_money':
          return await this.processSamaMoneyPayment(gateway, request);
        case 'wave_money':
          return await this.processWavePayment(gateway, request);
        case 'moov_money':
          return await this.processMoovPayment(gateway, request);
        case 'stripe':
          return await this.processStripePayment(gateway, request);
        case 'bank_transfer':
          return await this.processBankTransfer(gateway, request);
        default:
          throw new Error(`Unsupported payment gateway: ${gateway.id}`);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment processing failed'
      };
    }
  }

  private async processOrangeMoneyPayment(gateway: PaymentGateway, request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Prepare Orange Money API request
      const orangeConfig = gateway.config;
      
      const paymentData = {
        amount: request.amount,
        currency: request.currency,
        customerPhone: request.customerInfo.phone,
        customerName: request.customerInfo.name,
        customerEmail: request.customerInfo.email,
        transactionReference: `OM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        callbackUrl: `${window.location.origin}/payment/callback/orange`,
        returnUrl: `${window.location.origin}/payment/success`
      };

      const response = await orangeMoneyService.initiatePayment(paymentData);
      
      if (!response.success) {
        throw new Error(response.error || 'Orange Money payment failed. Please check your balance and try again.');
      }

      return {
        success: true,
        transactionId: response.transactionId,
        paymentUrl: response.paymentUrl,
        gatewayResponse: {
          status: response.status || 'initiated',
          reference: response.transactionId,
          amount: request.amount,
          currency: request.currency,
          merchantCode: orangeConfig.merchantCode
        }
      };
    } catch (error) {
      console.error('Orange Money payment error:', error);
      throw new Error('Orange Money payment failed. Please try again.');
    }
  }

  private async processSamaMoneyPayment(gateway: PaymentGateway, request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Prepare SAMA Money API request
      const samaConfig = gateway.config;
      const apiUrl = `${samaConfig.baseUrl}payment/initiate`;
      
      const paymentData = {
        merchant_code: samaConfig.merchantCode,
        user_id: samaConfig.userId,
        amount: request.amount,
        currency: request.currency,
        customer_phone: request.customerInfo.phone,
        customer_name: request.customerInfo.name,
        customer_email: request.customerInfo.email,
        transaction_reference: `SAMA_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        callback_url: `${window.location.origin}/payment/callback/sama`,
        return_url: `${window.location.origin}/payment/success`,
        public_key: samaConfig.publicKey
      };

      // In a real implementation, you would make the actual API call here
      // For now, we'll simulate the response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate API response
      const mockResponse = {
        success: Math.random() > 0.1,
        transactionId: `SAMA_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        paymentUrl: `${samaConfig.baseUrl}payment/redirect/${paymentData.transaction_reference}`,
        gatewayResponse: {
          status: 'initiated',
          reference: paymentData.transaction_reference,
          amount: request.amount,
          currency: request.currency,
          merchant_code: samaConfig.merchantCode
        }
      };

      if (!mockResponse.success) {
        throw new Error('SAMA Money payment initiation failed. Please verify your account details.');
      }

      return mockResponse;
    } catch (error) {
      console.error('SAMA Money payment error:', error);
      throw new Error('SAMA Money payment failed. Please try again.');
    }
  }

  private async processSamaMoneyPaymentLegacy(gateway: PaymentGateway, request: PaymentRequest): Promise<PaymentResponse> {
    // Simulate Sama Money API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockResponse = {
      success: Math.random() > 0.1,
      transactionId: `SM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      gatewayResponse: {
        status: 'completed',
        reference: `SM${Date.now()}`,
        amount: request.amount,
        currency: request.currency
      }
    };

    if (!mockResponse.success) {
      throw new Error('Sama Money payment failed. Please verify your account details.');
    }

    return mockResponse;
  }

  private async processWavePayment(gateway: PaymentGateway, request: PaymentRequest): Promise<PaymentResponse> {
    // Simulate Wave API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockResponse = {
      success: Math.random() > 0.1,
      transactionId: `WV_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      gatewayResponse: {
        status: 'completed',
        reference: `WV${Date.now()}`,
        amount: request.amount,
        currency: request.currency
      }
    };

    if (!mockResponse.success) {
      throw new Error('Wave payment failed. Please try again.');
    }

    return mockResponse;
  }

  private async processMoovPayment(gateway: PaymentGateway, request: PaymentRequest): Promise<PaymentResponse> {
    // Simulate Moov Money API call
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const mockResponse = {
      success: Math.random() > 0.1,
      transactionId: `MV_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      gatewayResponse: {
        status: 'completed',
        reference: `MV${Date.now()}`,
        amount: request.amount,
        currency: request.currency
      }
    };

    if (!mockResponse.success) {
      throw new Error('Moov Money payment failed. Please check your PIN and balance.');
    }

    return mockResponse;
  }

  private async processStripePayment(gateway: PaymentGateway, request: PaymentRequest): Promise<PaymentResponse> {
    // Simulate Stripe API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockResponse = {
      success: Math.random() > 0.1,
      transactionId: `ST_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      gatewayResponse: {
        status: 'completed',
        reference: `ST${Date.now()}`,
        amount: request.amount,
        currency: request.currency
      }
    };

    if (!mockResponse.success) {
      throw new Error('Card payment failed. Please check your card details.');
    }

    return mockResponse;
  }

  private async processBankTransfer(gateway: PaymentGateway, request: PaymentRequest): Promise<PaymentResponse> {
    // Bank transfers are typically manual, so we return instructions
    return {
      success: true,
      transactionId: `BT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      gatewayResponse: {
        status: 'pending',
        instructions: 'Please transfer the amount to the provided bank account details.',
        bankDetails: {
          accountName: 'Elverra Global',
          accountNumber: '1234567890',
          bankName: 'Bank of Africa',
          swiftCode: 'BMAFMLBA'
        }
      }
    };
  }

  calculateFees(gateway: PaymentGateway, amount: number): number {
    const percentageFee = (amount * gateway.fees.percentage) / 100;
    return percentageFee + gateway.fees.fixed;
  }

  getTotalAmount(gateway: PaymentGateway, amount: number): number {
    return amount + this.calculateFees(gateway, amount);
  }
}

export const paymentService = new PaymentService();
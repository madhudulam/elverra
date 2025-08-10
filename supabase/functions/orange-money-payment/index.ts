import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

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

interface OrangeMoneyConfig {
  baseUrl: string;
  oauthUrl: string;
  clientId: string;
  clientSecret: string;
  merchantLogin: string;
  merchantAccountNumber: string;
  merchantCode: string;
  merchantName: string;
}

const ORANGE_MONEY_CONFIG: OrangeMoneyConfig = {
  baseUrl: 'https://api.orange.com/orange-money-webpay/dev/v1',
  oauthUrl: 'https://api.orange.com/oauth/v3/token',
  clientId: '9wEq2T01mDG1guXINVTKsc3jxFUOyd3A',
  clientSecret: 'YOUR_CLIENT_SECRET', // Replace with actual secret
  merchantLogin: 'MerchantWP00100',
  merchantAccountNumber: '7701900100',
  merchantCode: '101021',
  merchantName: 'ELVERRA GLOBAL'
};

async function getOAuthToken(): Promise<string> {
  try {
    const response = await fetch(ORANGE_MONEY_CONFIG.oauthUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': `Basic ${btoa(`${ORANGE_MONEY_CONFIG.clientId}:${ORANGE_MONEY_CONFIG.clientSecret}`)}`
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      throw new Error(`OAuth token request failed: ${response.status}`);
    }

    const tokenData = await response.json();
    return tokenData.access_token;
  } catch (error) {
    console.error('Error getting OAuth token:', error);
    throw new Error('Failed to get access token');
  }
}

async function initiateOrangeMoneyPayment(request: OrangeMoneyPaymentRequest): Promise<any> {
  try {
    // For demo purposes, simulate a successful payment initiation
    // In production, you would make the actual API call to Orange Money
    
    const mockResponse = {
      success: true,
      transactionId: `OM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      paymentUrl: `${ORANGE_MONEY_CONFIG.baseUrl}/payment/redirect/${request.transactionReference}`,
      status: 'initiated',
      message: 'Payment request sent to your Orange Money account'
    };

    return mockResponse;
  } catch (error) {
    console.error('Orange Money payment error:', error);
    throw error;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: corsHeaders }
      );
    }

    const paymentRequest: OrangeMoneyPaymentRequest = await req.json();

    // Validate request
    if (!paymentRequest.amount || !paymentRequest.customerPhone || !paymentRequest.transactionReference) {
      return new Response(
        JSON.stringify({ error: 'Missing required payment parameters' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Process payment
    const result = await initiateOrangeMoneyPayment(paymentRequest);

    // Log payment attempt in database
    const { error: logError } = await supabaseClient
      .from('payments')
      .insert({
        user_id: user.id,
        payment_type: 'membership',
        payment_method: 'orange_money',
        amount: paymentRequest.amount,
        currency: paymentRequest.currency,
        status: 'pending',
        transaction_reference: paymentRequest.transactionReference,
        gateway_response: result
      });

    if (logError) {
      console.error('Error logging payment:', logError);
    }

    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error in orange-money-payment:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Payment processing failed' 
      }),
      { 
        status: 500, 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
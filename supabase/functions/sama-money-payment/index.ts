import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface SamaMoneyPaymentRequest {
  amount: number;
  currency: string;
  customerPhone: string;
  customerName: string;
  customerEmail: string;
  transactionReference: string;
  callbackUrl?: string;
  returnUrl?: string;
}

interface SamaMoneyConfig {
  baseUrl: string;
  merchantCode: string;
  merchantName: string;
  userId: string;
  publicKey: string;
  transactionKey: string;
}

const SAMA_MONEY_CONFIG: SamaMoneyConfig = {
  baseUrl: 'https://smarchandamatest.sama.money/V1/',
  merchantCode: 'b109',
  merchantName: 'ELVERRA GLOBAL',
  userId: '-486247242941374572',
  publicKey: '@Ub1#2HVZjQIKYOMP4t@yFAez5X9AhCz9',
  transactionKey: 'cU+ZJ69Si8wkW2x59:VktuDM7@k~PaJ;d{S]F!R5gd4,5G(7%a2_785K#}kC3*[e'
};

function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('223')) {
    return `+${cleaned}`;
  }
  
  if (cleaned.length === 8) {
    return `+223${cleaned}`;
  }
  
  return `+${cleaned}`;
}

async function initiateSamaMoneyPayment(request: SamaMoneyPaymentRequest): Promise<any> {
  try {
    // For demo purposes, simulate a successful payment initiation
    // In production, you would make the actual API call to SAMA Money
    
    const mockResponse = {
      success: true,
      transactionId: `SAMA_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      paymentUrl: `${SAMA_MONEY_CONFIG.baseUrl}payment/redirect/${request.transactionReference}`,
      status: 'initiated',
      message: 'Payment request sent to your SAMA Money account'
    };

    return mockResponse;
  } catch (error) {
    console.error('SAMA Money payment error:', error);
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

    const paymentRequest: SamaMoneyPaymentRequest = await req.json();

    // Validate request
    if (!paymentRequest.amount || !paymentRequest.customerPhone || !paymentRequest.transactionReference) {
      return new Response(
        JSON.stringify({ error: 'Missing required payment parameters' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Format phone number
    paymentRequest.customerPhone = formatPhoneNumber(paymentRequest.customerPhone);

    // Process payment
    const result = await initiateSamaMoneyPayment(paymentRequest);

    // Log payment attempt in database
    const { error: logError } = await supabaseClient
      .from('payments')
      .insert({
        user_id: user.id,
        payment_type: 'membership',
        payment_method: 'sama_money',
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
    console.error('Error in sama-money-payment:', error);
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
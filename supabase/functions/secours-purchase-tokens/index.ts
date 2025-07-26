import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface PurchaseRequest {
  subscription_id: string
  token_amount: number
  payment_method: string
  transaction_reference?: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
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
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: corsHeaders }
      )
    }

    const body: PurchaseRequest = await req.json()
    const { subscription_id, token_amount, payment_method, transaction_reference } = body

    // Verify subscription belongs to user
    const { data: subscription } = await supabaseClient
      .from('secours_subscriptions')
      .select('*')
      .eq('id', subscription_id)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    if (!subscription) {
      return new Response(
        JSON.stringify({ error: 'Subscription not found or inactive' }),
        { status: 404, headers: corsHeaders }
      )
    }

    // Get token value based on subscription type
    const { data: tokenValueData } = await supabaseClient
      .rpc('get_token_value', { sub_type: subscription.subscription_type })

    if (!tokenValueData) {
      return new Response(
        JSON.stringify({ error: 'Invalid subscription type' }),
        { status: 400, headers: corsHeaders }
      )
    }

    const token_value_fcfa = tokenValueData * token_amount

    // Validate token amount limits
    const { data: limitsData } = await supabaseClient
      .rpc('get_min_max_tokens', { sub_type: subscription.subscription_type })

    if (!limitsData || limitsData.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Could not get token limits' }),
        { status: 400, headers: corsHeaders }
      )
    }

    const limits = limitsData[0]
    if (token_amount < limits.min_tokens || token_amount > limits.max_tokens) {
      return new Response(
        JSON.stringify({ 
          error: `Token amount must be between ${limits.min_tokens} and ${limits.max_tokens}` 
        }),
        { status: 400, headers: corsHeaders }
      )
    }

    // Create token transaction - this will trigger the update_token_balance function
    const { data: transaction, error } = await supabaseClient
      .from('token_transactions')
      .insert({
        subscription_id,
        transaction_type: 'purchase',
        token_amount,
        token_value_fcfa,
        payment_method,
        transaction_reference
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating transaction:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to process token purchase' }),
        { status: 500, headers: corsHeaders }
      )
    }

    return new Response(
      JSON.stringify({ transaction, token_value_fcfa }),
      { status: 200, headers: corsHeaders }
    )

  } catch (error) {
    console.error('Error in secours-purchase-tokens:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: corsHeaders }
    )
  }
})
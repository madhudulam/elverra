import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface RescueRequest {
  subscription_id: string
  request_description: string
  rescue_value_fcfa: number
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

    const body: RescueRequest = await req.json()
    const { subscription_id, request_description, rescue_value_fcfa } = body

    // Verify subscription belongs to user and get current token balance
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

    // Get token value for this subscription type
    const { data: tokenValue } = await supabaseClient
      .rpc('get_token_value', { sub_type: subscription.subscription_type })

    if (!tokenValue) {
      return new Response(
        JSON.stringify({ error: 'Invalid subscription type' }),
        { status: 400, headers: corsHeaders }
      )
    }

    // Calculate required tokens
    const required_tokens = Math.ceil(rescue_value_fcfa / tokenValue)

    // Check if user has sufficient tokens
    if (subscription.token_balance < required_tokens) {
      return new Response(
        JSON.stringify({ 
          error: 'Insufficient tokens',
          required_tokens,
          current_balance: subscription.token_balance
        }),
        { status: 400, headers: corsHeaders }
      )
    }

    // Create rescue request
    const { data: rescueRequest, error } = await supabaseClient
      .from('rescue_requests')
      .insert({
        subscription_id,
        request_description,
        rescue_value_fcfa,
        token_balance_at_request: subscription.token_balance,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating rescue request:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to create rescue request' }),
        { status: 500, headers: corsHeaders }
      )
    }

    return new Response(
      JSON.stringify({ 
        rescue_request: rescueRequest,
        required_tokens,
        current_balance: subscription.token_balance
      }),
      { status: 200, headers: corsHeaders }
    )

  } catch (error) {
    console.error('Error in secours-rescue-request:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: corsHeaders }
    )
  }
})
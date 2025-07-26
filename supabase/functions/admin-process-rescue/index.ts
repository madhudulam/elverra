import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface ProcessRequest {
  rescue_request_id: string
  action: 'approve' | 'reject'
  admin_notes?: string
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

    // Note: In production, you should verify admin role here
    // For now, assuming any authenticated user can process (adjust as needed)

    const body: ProcessRequest = await req.json()
    const { rescue_request_id, action, admin_notes } = body

    // Get rescue request details
    const { data: rescueRequest } = await supabaseClient
      .from('rescue_requests')
      .select(`
        *,
        secours_subscriptions!inner(*)
      `)
      .eq('id', rescue_request_id)
      .eq('status', 'pending')
      .single()

    if (!rescueRequest) {
      return new Response(
        JSON.stringify({ error: 'Rescue request not found or already processed' }),
        { status: 404, headers: corsHeaders }
      )
    }

    const subscription = rescueRequest.secours_subscriptions

    // If approving, create token transaction to deduct tokens
    if (action === 'approve') {
      // Get token value for this subscription type
      const { data: tokenValue } = await supabaseClient
        .rpc('get_token_value', { sub_type: subscription.subscription_type })

      if (!tokenValue) {
        return new Response(
          JSON.stringify({ error: 'Invalid subscription type' }),
          { status: 400, headers: corsHeaders }
        )
      }

      const required_tokens = Math.ceil(rescueRequest.rescue_value_fcfa / tokenValue)

      // Check if still has sufficient tokens
      if (subscription.token_balance < required_tokens) {
        return new Response(
          JSON.stringify({ error: 'Insufficient tokens in subscription' }),
          { status: 400, headers: corsHeaders }
        )
      }

      // Create token transaction for rescue claim
      const { error: transactionError } = await supabaseClient
        .from('token_transactions')
        .insert({
          subscription_id: subscription.id,
          transaction_type: 'rescue_claim',
          token_amount: required_tokens,
          token_value_fcfa: rescueRequest.rescue_value_fcfa,
          transaction_reference: `rescue_${rescue_request_id}`
        })

      if (transactionError) {
        console.error('Error creating token transaction:', transactionError)
        return new Response(
          JSON.stringify({ error: 'Failed to process token deduction' }),
          { status: 500, headers: corsHeaders }
        )
      }
    }

    // Update rescue request status
    const { data: updatedRequest, error } = await supabaseClient
      .from('rescue_requests')
      .update({
        status: action === 'approve' ? 'approved' : 'rejected',
        processed_date: new Date().toISOString(),
        admin_notes
      })
      .eq('id', rescue_request_id)
      .select()
      .single()

    if (error) {
      console.error('Error updating rescue request:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to update rescue request' }),
        { status: 500, headers: corsHeaders }
      )
    }

    return new Response(
      JSON.stringify({ rescue_request: updatedRequest }),
      { status: 200, headers: corsHeaders }
    )

  } catch (error) {
    console.error('Error in admin-process-rescue:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: corsHeaders }
    )
  }
})
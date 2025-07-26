import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface SubscribeRequest {
  subscription_type: 'motors' | 'cata_catanis' | 'auto' | 'telephone' | 'school_fees'
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

    const body: SubscribeRequest = await req.json()
    const { subscription_type } = body

    // Check if user already has active subscription for this type
    const { data: existingSubscription } = await supabaseClient
      .from('secours_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('subscription_type', subscription_type)
      .eq('is_active', true)
      .single()

    if (existingSubscription) {
      return new Response(
        JSON.stringify({ error: 'Already have active subscription for this service' }),
        { status: 400, headers: corsHeaders }
      )
    }

    // Create new subscription
    const { data: subscription, error } = await supabaseClient
      .from('secours_subscriptions')
      .insert({
        user_id: user.id,
        subscription_type,
        token_balance: 0,
        is_active: true
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating subscription:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to create subscription' }),
        { status: 500, headers: corsHeaders }
      )
    }

    return new Response(
      JSON.stringify({ subscription }),
      { status: 200, headers: corsHeaders }
    )

  } catch (error) {
    console.error('Error in secours-subscribe:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: corsHeaders }
    )
  }
})
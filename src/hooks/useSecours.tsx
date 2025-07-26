import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'
import { toast } from 'sonner'

export const useSecours = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Get user's secours subscriptions
  const { data: subscriptions, isLoading: subscriptionsLoading } = useQuery({
    queryKey: ['secours-subscriptions', user?.id],
    queryFn: async () => {
      if (!user) return []
      
      const { data, error } = await supabase
        .from('secours_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    },
    enabled: !!user
  })

  // Get user's rescue requests
  const { data: rescueRequests, isLoading: rescueRequestsLoading } = useQuery({
    queryKey: ['rescue-requests', user?.id],
    queryFn: async () => {
      if (!user) return []
      
      const { data, error } = await supabase
        .from('rescue_requests')
        .select(`
          *,
          secours_subscriptions(subscription_type)
        `)
        .eq('secours_subscriptions.user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    },
    enabled: !!user
  })

  // Get user's token transactions
  const { data: tokenTransactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['token-transactions', user?.id],
    queryFn: async () => {
      if (!user) return []
      
      const { data, error } = await supabase
        .from('token_transactions')
        .select(`
          *,
          secours_subscriptions(subscription_type)
        `)
        .eq('secours_subscriptions.user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    },
    enabled: !!user
  })

  // Subscribe to a secours service
  const subscribeMutation = useMutation({
    mutationFn: async (subscription_type: 'motors' | 'cata_catanis' | 'auto' | 'telephone' | 'school_fees') => {
      const { data, error } = await supabase.functions.invoke('secours-subscribe', {
        body: { subscription_type }
      })
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secours-subscriptions'] })
      toast.success('Successfully subscribed to Ô Secours service!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to subscribe to service')
    }
  })

  // Purchase tokens
  const purchaseTokensMutation = useMutation({
    mutationFn: async ({ 
      subscription_id, 
      token_amount, 
      payment_method 
    }: {
      subscription_id: string
      token_amount: number
      payment_method: string
    }) => {
      const { data, error } = await supabase.functions.invoke('secours-purchase-tokens', {
        body: { subscription_id, token_amount, payment_method }
      })
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secours-subscriptions'] })
      queryClient.invalidateQueries({ queryKey: ['token-transactions'] })
      toast.success('Tokens purchased successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to purchase tokens')
    }
  })

  // Request rescue
  const rescueRequestMutation = useMutation({
    mutationFn: async ({
      subscription_id,
      request_description,
      rescue_value_fcfa
    }: {
      subscription_id: string
      request_description: string
      rescue_value_fcfa: number
    }) => {
      const { data, error } = await supabase.functions.invoke('secours-rescue-request', {
        body: { subscription_id, request_description, rescue_value_fcfa }
      })
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rescue-requests'] })
      toast.success('Rescue request submitted successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit rescue request')
    }
  })

  // Get token limits and values
  const getTokenInfo = async (subscription_type: 'motors' | 'cata_catanis' | 'auto' | 'telephone' | 'school_fees') => {
    const { data: valueData } = await supabase.rpc('get_token_value', { 
      sub_type: subscription_type 
    })
    
    const { data: limitsData } = await supabase.rpc('get_min_max_tokens', { 
      sub_type: subscription_type 
    })
    
    return {
      token_value: valueData,
      limits: limitsData?.[0]
    }
  }

  return {
    subscriptions,
    rescueRequests,
    tokenTransactions,
    subscriptionsLoading,
    rescueRequestsLoading,
    transactionsLoading,
    subscribe: subscribeMutation.mutate,
    subscribing: subscribeMutation.isPending,
    purchaseTokens: purchaseTokensMutation.mutate,
    purchasingTokens: purchaseTokensMutation.isPending,
    requestRescue: rescueRequestMutation.mutate,
    requestingRescue: rescueRequestMutation.isPending,
    getTokenInfo
  }
}
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ReferralData {
  id: string;
  name: string;
  date: string;
  status: 'Active' | 'Pending';
  earnings: number;
}

interface AffiliateStats {
  referralCode: string;
  totalReferrals: number;
  pendingReferrals: number;
  referralTarget: number;
  totalEarnings: number;
  pendingEarnings: number;
  referralHistory: ReferralData[];
  progress: number;
}

export const useAffiliateData = () => {
  const { user } = useAuth();
  const [affiliateData, setAffiliateData] = useState<AffiliateStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchAffiliateData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch agent data
        const { data: agentData, error: agentError } = await supabase
          .from('agents')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (agentError) {
          // Handle case where user doesn't have an agent profile yet
          if (agentError.code === 'PGRST116') {
            setAffiliateData(null);
            return;
          }
          throw new Error('Failed to fetch agent data');
        }

        // Fetch referrals data with user profiles
        const { data: referralsData, error: referralsError } = await supabase
          .from('referrals')
          .select('*')
          .eq('agent_id', agentData.id)
          .order('created_at', { ascending: false });


        // Fetch user profiles for referrals
        let userProfiles: any[] = [];
        if (referralsData && referralsData.length > 0) {
          const userIds = referralsData.map(ref => ref.referred_user_id);
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, full_name')
            .in('id', userIds);
          
          userProfiles = profilesData || [];
        }

        if (referralsError) {
          throw new Error('Failed to fetch referrals data');
        }

        // Calculate statistics
        const totalReferrals = referralsData?.length || 0;
        const pendingReferrals = referralsData?.filter(ref => !ref.commission_paid).length || 0;
        const totalEarnings = agentData.total_commissions || 0;
        const pendingEarnings = agentData.commissions_pending || 0;
        const referralTarget = 5; // Default target
        const progress = Math.min((totalReferrals / referralTarget) * 100, 100);

        // Format referral history
        const referralHistory: ReferralData[] = referralsData?.map(ref => {
          const profile = userProfiles.find(p => p.id === ref.referred_user_id);
          return {
            id: ref.id,
            name: profile?.full_name || 'Anonymous User',
            date: new Date(ref.created_at || '').toLocaleDateString(),
            status: ref.commission_paid ? 'Active' : 'Pending',
            earnings: ref.commission_amount
          };
        }) || [];

        const stats: AffiliateStats = {
          referralCode: agentData.referral_code,
          totalReferrals,
          pendingReferrals,
          referralTarget,
          totalEarnings,
          pendingEarnings,
          referralHistory,
          progress
        };

        setAffiliateData(stats);
      } catch (err) {
        console.error('Error fetching affiliate data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAffiliateData();
  }, [user]);

  const refreshData = async () => {
    if (user) {
      setLoading(true);
      // Re-run the fetch logic
      const fetchAffiliateData = async () => {
        try {
          setError(null);

          const { data: agentData, error: agentError } = await supabase
            .from('agents')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (agentError) {
            // Handle case where user doesn't have an agent profile yet
            if (agentError.code === 'PGRST116') {
              setAffiliateData(null);
              return;
            }
            throw new Error('Failed to fetch agent data');
          }

          const { data: referralsData, error: referralsError } = await supabase
            .from('referrals')
            .select('*')
            .eq('agent_id', agentData.id)
            .order('created_at', { ascending: false });

          if (referralsError) throw new Error('Failed to fetch referrals data');

          // Fetch user profiles for referrals
          let userProfiles: any[] = [];
          if (referralsData && referralsData.length > 0) {
            const userIds = referralsData.map(ref => ref.referred_user_id);
            const { data: profilesData } = await supabase
              .from('profiles')
              .select('id, full_name')
              .in('id', userIds);
            
            userProfiles = profilesData || [];
          }

          const totalReferrals = referralsData?.length || 0;
          const pendingReferrals = referralsData?.filter(ref => !ref.commission_paid).length || 0;
          const totalEarnings = agentData.total_commissions || 0;
          const pendingEarnings = agentData.commissions_pending || 0;
          const referralTarget = 5;
          const progress = Math.min((totalReferrals / referralTarget) * 100, 100);

          const referralHistory: ReferralData[] = referralsData?.map(ref => {
            const profile = userProfiles.find(p => p.id === ref.referred_user_id);
            return {
              id: ref.id,
              name: profile?.full_name || 'Anonymous User',
              date: new Date(ref.created_at || '').toLocaleDateString(),
              status: ref.commission_paid ? 'Active' : 'Pending',
              earnings: ref.commission_amount
            };
          }) || [];

          const stats: AffiliateStats = {
            referralCode: agentData.referral_code,
            totalReferrals,
            pendingReferrals,
            referralTarget,
            totalEarnings,
            pendingEarnings,
            referralHistory,
            progress
          };

          setAffiliateData(stats);
        } catch (err) {
          console.error('Error refreshing affiliate data:', err);
          setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
          setLoading(false);
        }
      };

      await fetchAffiliateData();
    }
  };

  return {
    affiliateData,
    loading,
    error,
    refreshData
  };
};
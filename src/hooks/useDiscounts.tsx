import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface Merchant {
  id: string;
  name: string;
  sector: string;
  location: string;
  discount_percentage: number;
  description?: string;
  image_url?: string;
  rating?: number;
  website?: string;
  contact_phone?: string;
  contact_email?: string;
  featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DiscountUsage {
  id: string;
  user_id: string;
  merchant_id: string;
  amount_saved?: number;
  discount_percentage?: number;
  used_at: string;
}

export const useDiscounts = () => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [sectors, setSectors] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMerchants = async (filters?: {
    search?: string;
    sector?: string;
    location?: string;
    featured?: boolean;
  }) => {
    try {
      setLoading(true);
      let query = supabase
        .from('merchants')
        .select('*')
        .eq('is_active', true)
        .order('featured', { ascending: false })
        .order('rating', { ascending: false });

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,sector.ilike.%${filters.search}%`);
      }

      if (filters?.sector && filters.sector !== 'all') {
        query = query.eq('sector', filters.sector);
      }

      if (filters?.location && filters.location !== 'all') {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters?.featured) {
        query = query.eq('featured', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMerchants(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch merchants');
      console.error('Error fetching merchants:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFeaturedMerchants = async () => {
    await fetchMerchants({ featured: true });
  };

  const fetchSectors = async () => {
    try {
      const { data, error } = await supabase
        .from('sectors')
        .select('id, name')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setSectors(data || []);
    } catch (err) {
      console.error('Error fetching sectors:', err);
    }
  };

  const getSectors = () => {
    return sectors;
  };

  const getLocations = () => {
    const uniqueLocations = [...new Set(merchants.map(m => m.location))];
    return uniqueLocations.sort();
  };

  useEffect(() => {
    fetchMerchants();
    fetchSectors();
  }, []);

  return { 
    merchants,
    sectors,
    loading, 
    error, 
    fetchMerchants,
    fetchSectors,
    getFeaturedMerchants,
    getSectors,
    getLocations
  };
};

export const useDiscountUsage = () => {
  const { user } = useAuth();
  const [usageHistory, setUsageHistory] = useState<DiscountUsage[]>([]);
  const [loading, setLoading] = useState(false);

  const recordDiscountUsage = async (merchantId: string, discountPercentage: number, amountSaved?: number) => {
    if (!user) {
      toast.error('Please login to claim discounts');
      return;
    }

    try {
      const { error } = await supabase
        .from('discount_usage')
        .insert({
          user_id: user.id,
          merchant_id: merchantId,
          discount_percentage: discountPercentage,
          amount_saved: amountSaved,
        });

      if (error) throw error;
      
      toast.success('Discount claimed successfully!');
      await fetchUsageHistory();
    } catch (error) {
      console.error('Error recording discount usage:', error);
      toast.error('Failed to claim discount');
    }
  };

  const fetchUsageHistory = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('discount_usage')
        .select(`
          *,
          merchants (
            name,
            sector,
            location,
            image_url
          )
        `)
        .eq('user_id', user.id)
        .order('used_at', { ascending: false });

      if (error) throw error;
      setUsageHistory(data || []);
    } catch (error) {
      console.error('Error fetching usage history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalSavings = () => {
    return usageHistory.reduce((total, usage) => total + (usage.amount_saved || 0), 0);
  };

  useEffect(() => {
    if (user) {
      fetchUsageHistory();
    }
  }, [user]);

  return {
    usageHistory,
    loading,
    recordDiscountUsage,
    fetchUsageHistory,
    getTotalSavings
  };
};
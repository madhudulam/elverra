import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Sector {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Merchant {
  id: string;
  name: string;
  sector: string;
  sector_id: string;
  discount_percentage: number;
  location: string;
  contact_phone: string;
  contact_email: string;
  description: string;
  website: string;
  is_active: boolean;
  featured: boolean;
  sectors?: { name: string };
}

export const useDiscountAdmin = () => {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchSectors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sectors')
        .select('*')
        .order('name');

      if (error) throw error;
      setSectors(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch sectors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMerchants = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('merchants')
        .select(`
          *,
          sectors:sector_id(name)
        `)
        .order('name');

      if (error) throw error;
      setMerchants(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch merchants",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createSector = async (sectorData: Omit<Sector, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('sectors')
        .insert([sectorData])
        .select()
        .single();

      if (error) throw error;
      
      setSectors(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Sector created successfully",
      });
      return data;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create sector",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateSector = async (id: string, sectorData: Partial<Sector>) => {
    try {
      const { data, error } = await supabase
        .from('sectors')
        .update(sectorData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setSectors(prev => prev.map(s => s.id === id ? data : s));
      toast({
        title: "Success",
        description: "Sector updated successfully",
      });
      return data;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update sector",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteSector = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sectors')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setSectors(prev => prev.filter(s => s.id !== id));
      toast({
        title: "Success",
        description: "Sector deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete sector",
        variant: "destructive",
      });
      throw error;
    }
  };

  const createMerchant = async (merchantData: Omit<Merchant, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const sectorName = sectors.find(s => s.id === merchantData.sector_id)?.name || '';
      
      const { data, error } = await supabase
        .from('merchants')
        .insert([{
          ...merchantData,
          sector: sectorName
        }])
        .select()
        .single();

      if (error) throw error;
      
      await fetchMerchants(); // Refresh to get updated data with relations
      toast({
        title: "Success",
        description: "Merchant created successfully",
      });
      return data;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create merchant",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateMerchant = async (id: string, merchantData: Partial<Merchant>) => {
    try {
      const updateData = { ...merchantData };
      if (merchantData.sector_id) {
        updateData.sector = sectors.find(s => s.id === merchantData.sector_id)?.name || '';
      }

      const { data, error } = await supabase
        .from('merchants')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchMerchants(); // Refresh to get updated data with relations
      toast({
        title: "Success",
        description: "Merchant updated successfully",
      });
      return data;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update merchant",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteMerchant = async (id: string) => {
    try {
      const { error } = await supabase
        .from('merchants')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setMerchants(prev => prev.filter(m => m.id !== id));
      toast({
        title: "Success",
        description: "Merchant deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete merchant",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchSectors();
    fetchMerchants();
  }, []);

  return {
    sectors,
    merchants,
    loading,
    fetchSectors,
    fetchMerchants,
    createSector,
    updateSector,
    deleteSector,
    createMerchant,
    updateMerchant,
    deleteMerchant,
  };
};
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PaymentGateway } from '@/types/payment';
import { toast } from 'sonner';

export const usePaymentGateways = () => {
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [loading, setLoading] = useState(true);

  // Default payment gateways
  const defaultGateways: PaymentGateway[] = [
    {
      id: 'orange_money',
      name: 'Orange Money',
      type: 'mobile_money',
      isActive: true,
      config: {
        baseUrl: 'https://api.orange.com/orange-money-webpay/dev/v1',
        supportedCurrencies: ['XOF', 'CFA'],
        merchantId: process.env.VITE_ORANGE_MERCHANT_ID || ''
      },
      fees: { percentage: 1.5, fixed: 0 },
      icon: '📱',
      description: 'Pay with Orange Money mobile wallet'
    },
    {
      id: 'sama_money',
      name: 'Sama Money',
      type: 'mobile_money',
      isActive: true,
      config: {
        baseUrl: 'https://api.sama.money/v1',
        supportedCurrencies: ['XOF', 'CFA'],
        merchantId: process.env.VITE_SAMA_MERCHANT_ID || ''
      },
      fees: { percentage: 1.2, fixed: 0 },
      icon: '💰',
      description: 'Pay with Sama Money digital wallet'
    },
    {
      id: 'wave_money',
      name: 'Wave Money',
      type: 'mobile_money',
      isActive: true,
      config: {
        baseUrl: 'https://api.wave.com/v1',
        supportedCurrencies: ['XOF', 'CFA'],
        merchantId: process.env.VITE_WAVE_MERCHANT_ID || ''
      },
      fees: { percentage: 1.0, fixed: 0 },
      icon: '🌊',
      description: 'Pay with Wave mobile money'
    },
    {
      id: 'moov_money',
      name: 'Moov Money',
      type: 'mobile_money',
      isActive: true,
      config: {
        baseUrl: 'https://api.moov-africa.com/v1',
        supportedCurrencies: ['XOF', 'CFA'],
        merchantId: process.env.VITE_MOOV_MERCHANT_ID || ''
      },
      fees: { percentage: 1.8, fixed: 0 },
      icon: '📲',
      description: 'Pay with Moov Money'
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      type: 'bank_transfer',
      isActive: true,
      config: {
        supportedCurrencies: ['XOF', 'CFA', 'USD', 'EUR']
      },
      fees: { percentage: 0.5, fixed: 500 },
      icon: '🏦',
      description: 'Direct bank transfer'
    },
    {
      id: 'stripe',
      name: 'Credit/Debit Card',
      type: 'card',
      isActive: true,
      config: {
        baseUrl: 'https://api.stripe.com/v1',
        supportedCurrencies: ['USD', 'EUR', 'XOF'],
        apiKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
      },
      fees: { percentage: 2.9, fixed: 30 },
      icon: '💳',
      description: 'Pay with credit or debit card'
    }
  ];

  useEffect(() => {
    fetchGateways();
  }, []);

  const fetchGateways = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from database first
      const { data, error } = await supabase
        .from('payment_gateways')
        .select('*')
        .order('name');

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching payment gateways:', error);
        // Fall back to default gateways
        setGateways(defaultGateways);
      } else if (data && data.length > 0) {
        setGateways(data);
      } else {
        // Use default gateways if none in database
        setGateways(defaultGateways);
      }
    } catch (error) {
      console.error('Error fetching payment gateways:', error);
      setGateways(defaultGateways);
    } finally {
      setLoading(false);
    }
  };

  const updateGateway = async (gatewayId: string, updates: Partial<PaymentGateway>) => {
    try {
      const updatedGateways = gateways.map(gateway =>
        gateway.id === gatewayId ? { ...gateway, ...updates } : gateway
      );
      setGateways(updatedGateways);
      
      // Try to update in database
      const { error } = await supabase
        .from('payment_gateways')
        .upsert({
          id: gatewayId,
          ...updates
        });

      if (error) {
        console.error('Error updating payment gateway:', error);
        toast.error('Failed to save gateway settings');
        // Revert changes
        fetchGateways();
      } else {
        toast.success('Payment gateway updated successfully');
      }
    } catch (error) {
      console.error('Error updating payment gateway:', error);
      toast.error('Failed to update payment gateway');
    }
  };

  const getActiveGateways = () => {
    return gateways.filter(gateway => gateway.isActive);
  };

  const getGatewayById = (id: string) => {
    return gateways.find(gateway => gateway.id === id);
  };

  return {
    gateways,
    loading,
    updateGateway,
    getActiveGateways,
    getGatewayById,
    refetch: fetchGateways
  };
};
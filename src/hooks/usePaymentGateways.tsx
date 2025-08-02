import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PaymentGateway } from '@/types/payment';
import { toast } from 'sonner';

// Default payment gateways when database table doesn't exist
const DEFAULT_GATEWAYS: PaymentGateway[] = [
  {
    id: 'sama_money',
    name: 'SAMA Money',
    type: 'mobile_money',
    is_active: true,
    config: {
      baseUrl: 'https://smarchandamatest.sama.money/V1/',
      merchantCode: 'b109',
      merchantName: 'CLUB 66 GLOBAL',
      userId: '-486247242941374572',
      publicKey: '@Ub1#2HVZjQIKYOMP4t@yFAez5X9AhCz9',
      transactionKey: 'cU+ZJ69Si8wkW2x59:VktuDM7@k~PaJ;d{S]F!R5gd4,5G(7%a2_785K#}kC3*[e',
      environment: 'test',
      supportedCurrencies: ['XOF', 'CFA']
    },
    fees: { percentage: 1.2, fixed: 0 },
    icon: '💰',
    description: 'Pay with SAMA Money digital wallet'
  },
  {
    id: 'orange_money',
    name: 'Orange Money',
    type: 'mobile_money',
    is_active: true,
    config: {
      baseUrl: 'https://api.orange.com/orange-money-webpay/dev/v1',
      merchantKey: 'cb6d6c61',
      clientId: '9wEq2T01mDG1guXINVTKsc3jxFUOyd3A',
      merchantLogin: 'MerchantWP00100',
      merchantAccountNumber: '7701900100',
      merchantCode: '101021',
      merchantName: 'CLUB 66 GLOBAL',
      environment: 'test',
      supportedCurrencies: ['XOF', 'CFA']
    },
    fees: { percentage: 1.5, fixed: 0 },
    icon: '📱',
    description: 'Pay with Orange Money mobile wallet'
  }
];

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
        merchantKey: 'cb6d6c61',
        clientId: '9wEq2T01mDG1guXINVTKsc3jxFUOyd3A',
        merchantLogin: 'MerchantWP00100',
        merchantAccountNumber: '7701900100',
        merchantCode: '101021',
        merchantName: 'CLUB 66 GLOBAL',
        environment: 'test',
        supportedCurrencies: ['XOF', 'CFA'],
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
        baseUrl: 'https://smarchandamatest.sama.money/V1/',
        merchantCode: 'b109',
        merchantName: 'ELVERRA GLOBAL',
        userId: '-486247242941374572',
        publicKey: '@Ub1#2HVZjQIKYOMP4t@yFAez5X9AhCz9',
        transactionKey: 'cU+ZJ69Si8wkW2x59:VktuDM7@k~PaJ;d{S]F!R5gd4,5G(7%a2_785K#}kC3*[e',
        supportedCurrencies: ['XOF', 'CFA'],
        environment: 'test'
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
        merchantId: import.meta.env.VITE_WAVE_MERCHANT_ID || ''
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
        merchantId: import.meta.env.VITE_MOOV_MERCHANT_ID || ''
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
        apiKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
      },
      fees: { percentage: 2.9, fixed: 30 },
      icon: '💳',
      description: 'Pay with credit or debit card'
    }
  ];

  useEffect(() => {
    // Use default gateways immediately without checking database
    // This prevents Supabase errors when table doesn't exist
    setGateways(DEFAULT_GATEWAYS);
    setLoading(false);
  }, []);

  const fetchGateways = async () => {
    // Always use default gateways to avoid database errors
    setGateways(DEFAULT_GATEWAYS);
    setLoading(false);
      toast.error('Failed to update payment gateway');
    }
  };

  const getActiveGateways = () => {
    return gateways.filter(gateway => gateway.isActive);
  };

  const getGatewayById = (id: string) => {
    return gateways.find(gateway => gateway.id === id);
  };

  const updateGateway = async (id: string, updates: Partial<PaymentGateway>) => {
    try {
      // Check if table exists first
      const { error: tableCheckError } = await supabase
        .from('payment_gateways')
        .select('id')
        .limit(1);

      if (tableCheckError && tableCheckError.code === '42P01') {
        // Table doesn't exist, update local state only
        setGateways(prev => prev.map(gateway => 
          gateway.id === id ? { ...gateway, ...updates } : gateway
        ));
        return;
      }

      // Table exists, update in database
      const { error } = await supabase
        .from('payment_gateways')
        .update(updates)
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setGateways(prev => prev.map(gateway => 
        gateway.id === id ? { ...gateway, ...updates } : gateway
      ));
    } catch (error) {
      console.error('Error updating payment gateway:', error);
      throw error;
    }
  };

  return {
    gateways,
    loading,
    updateGateway,
    updateGateway,
    getActiveGateways,
    getGatewayById,
    refetch: fetchGateways
  };
};
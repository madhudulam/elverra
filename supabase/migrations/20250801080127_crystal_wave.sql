/*
  # Update SAMA Money Payment Gateway Configuration

  1. Updates
    - Update SAMA Money gateway configuration with proper API details
    - Set correct base URL and merchant information
    - Configure authentication keys and merchant details

  2. Configuration
    - Base URL: https://smarchandamatest.sama.money/V1/
    - Merchant Code: b109
    - Merchant Name: ELVERRA GLOBAL
    - User ID: -486247242941374572
    - Public Key and Transaction Key configured
*/

-- Update SAMA Money payment gateway configuration
UPDATE public.payment_gateways 
SET 
  name = 'SAMA Money',
  config = jsonb_build_object(
    'baseUrl', 'https://smarchandamatest.sama.money/V1/',
    'merchantCode', 'b109',
    'merchantName', 'ELVERRA GLOBAL',
    'userId', '-486247242941374572',
    'publicKey', '@Ub1#2HVZjQIKYOMP4t@yFAez5X9AhCz9',
    'transactionKey', 'cU+ZJ69Si8wkW2x59:VktuDM7@k~PaJ;d{S]F!R5gd4,5G(7%a2_785K#}kC3*[e',
    'environment', 'test',
    'supportedCurrencies', '["XOF", "CFA"]'
  ),
  fees = jsonb_build_object(
    'percentage', 1.2,
    'fixed', 0
  ),
  description = 'Pay with SAMA Money digital wallet - Secure mobile payments',
  is_active = true,
  updated_at = now()
WHERE id = 'sama_money';

-- If SAMA Money gateway doesn't exist, insert it
INSERT INTO public.payment_gateways (
  id, 
  name, 
  type, 
  is_active, 
  config, 
  fees, 
  icon, 
  description
) 
SELECT 
  'sama_money',
  'SAMA Money',
  'mobile_money',
  true,
  jsonb_build_object(
    'baseUrl', 'https://smarchandamatest.sama.money/V1/',
    'merchantCode', 'b109',
    'merchantName', 'ELVERRA GLOBAL',
    'userId', '-486247242941374572',
    'publicKey', '@Ub1#2HVZjQIKYOMP4t@yFAez5X9AhCz9',
    'transactionKey', 'cU+ZJ69Si8wkW2x59:VktuDM7@k~PaJ;d{S]F!R5gd4,5G(7%a2_785K#}kC3*[e',
    'environment', 'test',
    'supportedCurrencies', '["XOF", "CFA"]'
  ),
  jsonb_build_object(
    'percentage', 1.2,
    'fixed', 0
  ),
  '💰',
  'Pay with SAMA Money digital wallet - Secure mobile payments'
WHERE NOT EXISTS (
  SELECT 1 FROM public.payment_gateways WHERE id = 'sama_money'
);
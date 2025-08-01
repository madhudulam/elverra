/*
  # Update Orange Money Payment Gateway Configuration

  1. Updates
    - Update Orange Money gateway configuration with proper API details
    - Set correct merchant information and authentication keys
    - Configure proper fee structure and environment settings

  2. Configuration
    - Merchant Key: cb6d6c61
    - Client ID: 9wEq2T01mDG1guXINVTKsc3jxFUOyd3A
    - Merchant Login: MerchantWP00100
    - Merchant Account Number: 7701900100
    - Merchant Code: 101021
*/

-- Update Orange Money payment gateway configuration
UPDATE public.payment_gateways 
SET 
  name = 'Orange Money',
  config = jsonb_build_object(
    'baseUrl', 'https://api.orange.com/orange-money-webpay/dev/v1',
    'merchantKey', 'cb6d6c61',
    'clientId', '9wEq2T01mDG1guXINVTKsc3jxFUOyd3A',
    'merchantLogin', 'MerchantWP00100',
    'merchantAccountNumber', '7701900100',
    'merchantCode', '101021',
    'merchantName', 'CLUB 66 GLOBAL',
    'environment', 'test',
    'supportedCurrencies', '["XOF", "CFA"]'
  ),
  fees = jsonb_build_object(
    'percentage', 1.5,
    'fixed', 0
  ),
  description = 'Pay with Orange Money mobile wallet - Secure mobile payments',
  is_active = true,
  updated_at = now()
WHERE id = 'orange_money';

-- If Orange Money gateway doesn't exist, insert it
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
  'orange_money',
  'Orange Money',
  'mobile_money',
  true,
  jsonb_build_object(
    'baseUrl', 'https://api.orange.com/orange-money-webpay/dev/v1',
    'merchantKey', 'cb6d6c61',
    'clientId', '9wEq2T01mDG1guXINVTKsc3jxFUOyd3A',
    'merchantLogin', 'MerchantWP00100',
    'merchantAccountNumber', '7701900100',
    'merchantCode', '101021',
    'merchantName', 'CLUB 66 GLOBAL',
    'environment', 'test',
    'supportedCurrencies', '["XOF", "CFA"]'
  ),
  jsonb_build_object(
    'percentage', 1.5,
    'fixed', 0
  ),
  '📱',
  'Pay with Orange Money mobile wallet - Secure mobile payments'
WHERE NOT EXISTS (
  SELECT 1 FROM public.payment_gateways WHERE id = 'orange_money'
);
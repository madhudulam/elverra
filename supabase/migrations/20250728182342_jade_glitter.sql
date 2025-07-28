/*
  # Create Payment Gateways Table

  1. New Tables
    - `payment_gateways`
      - `id` (text, primary key)
      - `name` (text, not null)
      - `type` (text, not null) - mobile_money, card, bank_transfer, crypto
      - `is_active` (boolean, default true)
      - `config` (jsonb) - gateway configuration including API keys, merchant IDs, etc.
      - `fees` (jsonb) - fee structure with percentage and fixed amounts
      - `icon` (text) - emoji or icon representation
      - `description` (text) - user-friendly description
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `payment_gateways` table
    - Add policy for service roles to manage all gateways
    - Add policy for public users to view active gateways

  3. Data
    - Insert default payment gateway configurations
*/

-- Create payment_gateways table
CREATE TABLE IF NOT EXISTS public.payment_gateways (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('mobile_money', 'card', 'bank_transfer', 'crypto')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  fees JSONB NOT NULL DEFAULT '{"percentage": 0, "fixed": 0}'::jsonb,
  icon TEXT NOT NULL DEFAULT '💳',
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.payment_gateways ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view active payment gateways" ON public.payment_gateways
  FOR SELECT USING (is_active = true);

CREATE POLICY "Service role can manage all payment gateways" ON public.payment_gateways
  FOR ALL USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_payment_gateways_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_payment_gateways_updated_at
  BEFORE UPDATE ON public.payment_gateways
  FOR EACH ROW
  EXECUTE FUNCTION public.update_payment_gateways_updated_at();

-- Insert default payment gateways
INSERT INTO public.payment_gateways (id, name, type, is_active, config, fees, icon, description) VALUES
(
  'orange_money',
  'Orange Money',
  'mobile_money',
  true,
  '{"baseUrl": "https://api.orange.com/orange-money-webpay/dev/v1", "supportedCurrencies": ["XOF", "CFA"], "merchantId": ""}'::jsonb,
  '{"percentage": 1.5, "fixed": 0}'::jsonb,
  '📱',
  'Pay with Orange Money mobile wallet'
),
(
  'sama_money',
  'Sama Money',
  'mobile_money',
  true,
  '{"baseUrl": "https://api.sama.money/v1", "supportedCurrencies": ["XOF", "CFA"], "merchantId": ""}'::jsonb,
  '{"percentage": 1.2, "fixed": 0}'::jsonb,
  '💰',
  'Pay with Sama Money digital wallet'
),
(
  'wave_money',
  'Wave Money',
  'mobile_money',
  true,
  '{"baseUrl": "https://api.wave.com/v1", "supportedCurrencies": ["XOF", "CFA"], "merchantId": ""}'::jsonb,
  '{"percentage": 1.0, "fixed": 0}'::jsonb,
  '🌊',
  'Pay with Wave mobile money'
),
(
  'moov_money',
  'Moov Money',
  'mobile_money',
  true,
  '{"baseUrl": "https://api.moov-africa.com/v1", "supportedCurrencies": ["XOF", "CFA"], "merchantId": ""}'::jsonb,
  '{"percentage": 1.8, "fixed": 0}'::jsonb,
  '📲',
  'Pay with Moov Money'
),
(
  'bank_transfer',
  'Bank Transfer',
  'bank_transfer',
  true,
  '{"supportedCurrencies": ["XOF", "CFA", "USD", "EUR"]}'::jsonb,
  '{"percentage": 0.5, "fixed": 500}'::jsonb,
  '🏦',
  'Direct bank transfer'
),
(
  'stripe',
  'Credit/Debit Card',
  'card',
  true,
  '{"baseUrl": "https://api.stripe.com/v1", "supportedCurrencies": ["USD", "EUR", "XOF"], "apiKey": ""}'::jsonb,
  '{"percentage": 2.9, "fixed": 30}'::jsonb,
  '💳',
  'Pay with credit or debit card'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  is_active = EXCLUDED.is_active,
  config = EXCLUDED.config,
  fees = EXCLUDED.fees,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  updated_at = now();
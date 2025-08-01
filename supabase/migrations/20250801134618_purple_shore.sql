/*
  # Create payment_gateways table

  1. New Tables
    - `payment_gateways`
      - `id` (text, primary key) - Gateway identifier
      - `name` (text) - Display name of the gateway
      - `type` (text) - Type of payment gateway (mobile_money, card, bank_transfer)
      - `is_active` (boolean) - Whether the gateway is active
      - `config` (jsonb) - Gateway configuration data
      - `fees` (jsonb) - Fee structure
      - `icon` (text) - Icon representation
      - `description` (text) - Gateway description
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `payment_gateways` table
    - Add policy for authenticated users to read gateways
    - Add policy for admin users to manage gateways

  3. Initial Data
    - Insert default payment gateways (SAMA Money, Orange Money, Wave, etc.)
*/

-- Create payment_gateways table
CREATE TABLE IF NOT EXISTS payment_gateways (
  id text PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('mobile_money', 'card', 'bank_transfer')),
  is_active boolean DEFAULT true,
  config jsonb DEFAULT '{}',
  fees jsonb DEFAULT '{"percentage": 0, "fixed": 0}',
  icon text DEFAULT '💳',
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE payment_gateways ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read payment gateways"
  ON payment_gateways
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can manage payment gateways"
  ON payment_gateways
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type = 'admin'
    )
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_payment_gateways_updated_at
    BEFORE UPDATE ON payment_gateways
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default payment gateways
INSERT INTO payment_gateways (id, name, type, is_active, config, fees, icon, description) VALUES
(
  'sama_money',
  'Sama Money',
  'mobile_money',
  true,
  '{
    "baseUrl": "https://smarchandamatest.sama.money/V1/",
    "merchantCode": "b109",
    "merchantName": "CLUB 66 GLOBAL",
    "userId": "-486247242941374572",
    "publicKey": "@Ub1#2HVZjQIKYOMP4t@yFAez5X9AhCz9",
    "transactionKey": "cU+ZJ69Si8wkW2x59:VktuDM7@k~PaJ;d{S]F!R5gd4,5G(7%a2_785K#}kC3*[e",
    "supportedCurrencies": ["XOF", "CFA"],
    "environment": "test"
  }',
  '{"percentage": 1.2, "fixed": 0}',
  '💰',
  'Pay with Sama Money digital wallet'
),
(
  'orange_money',
  'Orange Money',
  'mobile_money',
  true,
  '{
    "baseUrl": "https://api.orange.com/orange-money-webpay/dev/v1",
    "supportedCurrencies": ["XOF", "CFA"],
    "merchantId": ""
  }',
  '{"percentage": 1.5, "fixed": 0}',
  '📱',
  'Pay with Orange Money mobile wallet'
),
(
  'wave_money',
  'Wave Money',
  'mobile_money',
  true,
  '{
    "baseUrl": "https://api.wave.com/v1",
    "supportedCurrencies": ["XOF", "CFA"],
    "merchantId": ""
  }',
  '{"percentage": 1.0, "fixed": 0}',
  '🌊',
  'Pay with Wave mobile money'
),
(
  'moov_money',
  'Moov Money',
  'mobile_money',
  true,
  '{
    "baseUrl": "https://api.moov-africa.com/v1",
    "supportedCurrencies": ["XOF", "CFA"],
    "merchantId": ""
  }',
  '{"percentage": 1.8, "fixed": 0}',
  '📲',
  'Pay with Moov Money'
),
(
  'bank_transfer',
  'Bank Transfer',
  'bank_transfer',
  true,
  '{
    "supportedCurrencies": ["XOF", "CFA", "USD", "EUR"]
  }',
  '{"percentage": 0.5, "fixed": 500}',
  '🏦',
  'Direct bank transfer'
),
(
  'stripe',
  'Credit/Debit Card',
  'card',
  true,
  '{
    "baseUrl": "https://api.stripe.com/v1",
    "supportedCurrencies": ["USD", "EUR", "XOF"],
    "apiKey": ""
  }',
  '{"percentage": 2.9, "fixed": 30}',
  '💳',
  'Pay with credit or debit card'
);
/*
  # Create payment_gateways table

  1. New Tables
    - `payment_gateways`
      - `id` (text, primary key) - Gateway identifier
      - `name` (text) - Display name
      - `type` (text) - Gateway type (mobile_money, bank_transfer, etc.)
      - `is_active` (boolean) - Whether gateway is active
      - `config` (jsonb) - Gateway configuration
      - `fees` (jsonb) - Fee structure
      - `icon` (text) - Icon identifier
      - `description` (text) - Gateway description
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `payment_gateways` table
    - Add policy for public users to read active gateways
    - Add policy for service role to manage all gateways

  3. Default Data
    - Insert default payment gateways (Orange Money, Sama Money, Wave, etc.)
*/

CREATE TABLE IF NOT EXISTS payment_gateways (
  id text PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL,
  is_active boolean DEFAULT true,
  config jsonb DEFAULT '{}',
  fees jsonb DEFAULT '{}',
  icon text,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payment_gateways ENABLE ROW LEVEL SECURITY;

-- Policy for public users to read active gateways
CREATE POLICY "Public users can view active payment gateways"
  ON payment_gateways
  FOR SELECT
  TO public
  USING (is_active = true);

-- Policy for service role to manage all gateways
CREATE POLICY "Service role can manage all payment gateways"
  ON payment_gateways
  FOR ALL
  TO service_role
  USING (true);

-- Insert default payment gateways
INSERT INTO payment_gateways (id, name, type, is_active, config, fees, icon, description) VALUES
  ('orange_money', 'Orange Money', 'mobile_money', true, '{"provider": "orange", "currency": "XOF"}', '{"fixed": 0, "percentage": 2.5}', 'smartphone', 'Mobile money service by Orange'),
  ('sama_money', 'Sama Money', 'mobile_money', true, '{"provider": "sama", "currency": "XOF"}', '{"fixed": 0, "percentage": 2.0}', 'smartphone', 'Mobile money service by Sama Money'),
  ('wave', 'Wave', 'mobile_money', true, '{"provider": "wave", "currency": "XOF"}', '{"fixed": 0, "percentage": 1.5}', 'smartphone', 'Digital wallet by Wave'),
  ('moov', 'Moov Money', 'mobile_money', true, '{"provider": "moov", "currency": "XOF"}', '{"fixed": 0, "percentage": 2.5}', 'smartphone', 'Mobile money service by Moov'),
  ('bank_transfer', 'Bank Transfer', 'bank_transfer', true, '{"currencies": ["XOF", "EUR", "USD"]}', '{"fixed": 500, "percentage": 0}', 'building-2', 'Direct bank transfer'),
  ('stripe', 'Stripe', 'card', false, '{"publishable_key": "", "secret_key": ""}', '{"fixed": 0, "percentage": 2.9}', 'credit-card', 'International card payments via Stripe')
ON CONFLICT (id) DO NOTHING;
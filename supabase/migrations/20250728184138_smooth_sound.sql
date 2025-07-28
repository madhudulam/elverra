/*
  # Create payment_gateways table

  1. New Tables
    - `payment_gateways`
      - `id` (text, primary key) - Gateway identifier
      - `name` (text) - Display name of the gateway
      - `is_active` (boolean) - Whether the gateway is active
      - `config` (jsonb) - Gateway configuration
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `payment_gateways` table
    - Add policy for authenticated users to read payment gateways
    - Add policy for admin users to manage payment gateways

  3. Initial Data
    - Insert default payment gateway configurations
*/

-- Create payment_gateways table
CREATE TABLE IF NOT EXISTS payment_gateways (
  id text PRIMARY KEY,
  name text NOT NULL,
  is_active boolean DEFAULT true,
  config jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE payment_gateways ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read payment gateways"
  ON payment_gateways
  FOR SELECT
  TO authenticated
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

-- Insert default payment gateways
INSERT INTO payment_gateways (id, name, is_active, config) VALUES
  ('sama_money', 'Sama Money', true, '{"api_key": "", "secret_key": "", "environment": "sandbox"}'),
  ('orange_money', 'Orange Money', true, '{"merchant_id": "", "api_key": "", "environment": "sandbox"}'),
  ('mtn_money', 'MTN Money', true, '{"api_key": "", "secret_key": "", "environment": "sandbox"}'),
  ('paypal', 'PayPal', false, '{"client_id": "", "client_secret": "", "environment": "sandbox"}'),
  ('stripe', 'Stripe', false, '{"publishable_key": "", "secret_key": "", "environment": "test"}')
ON CONFLICT (id) DO NOTHING;

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
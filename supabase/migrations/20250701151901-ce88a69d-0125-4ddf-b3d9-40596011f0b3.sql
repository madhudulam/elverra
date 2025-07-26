
-- Create enum for subscription types
CREATE TYPE public.secours_type AS ENUM (
  'motors',
  'cata_catanis', 
  'auto',
  'telephone',
  'school_fees'
);

-- Create enum for transaction types
CREATE TYPE public.token_transaction_type AS ENUM (
  'purchase',
  'rescue_claim',
  'refund'
);

-- Create enum for rescue request status
CREATE TYPE public.rescue_status AS ENUM (
  'pending',
  'approved',
  'rejected',
  'completed'
);

-- Create table for Ô Secours subscriptions
CREATE TABLE public.secours_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subscription_type secours_type NOT NULL,
  token_balance INTEGER NOT NULL DEFAULT 0,
  subscription_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_token_purchase_date TIMESTAMP WITH TIME ZONE,
  last_rescue_claim_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, subscription_type)
);

-- Create table for token transactions
CREATE TABLE public.token_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES public.secours_subscriptions(id) ON DELETE CASCADE NOT NULL,
  transaction_type token_transaction_type NOT NULL,
  token_amount INTEGER NOT NULL,
  token_value_fcfa INTEGER NOT NULL,
  payment_method TEXT,
  transaction_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for rescue requests
CREATE TABLE public.rescue_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES public.secours_subscriptions(id) ON DELETE CASCADE NOT NULL,
  request_description TEXT NOT NULL,
  rescue_value_fcfa INTEGER NOT NULL,
  token_balance_at_request INTEGER NOT NULL,
  status rescue_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  request_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.secours_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rescue_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for secours_subscriptions
CREATE POLICY "Users can view their own subscriptions" ON public.secours_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subscriptions" ON public.secours_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON public.secours_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for token_transactions
CREATE POLICY "Users can view their own token transactions" ON public.token_transactions
  FOR SELECT USING (
    auth.uid() = (
      SELECT user_id FROM public.secours_subscriptions 
      WHERE id = token_transactions.subscription_id
    )
  );

CREATE POLICY "Service can manage token transactions" ON public.token_transactions
  FOR ALL USING (true);

-- Create RLS policies for rescue_requests
CREATE POLICY "Users can view their own rescue requests" ON public.rescue_requests
  FOR SELECT USING (
    auth.uid() = (
      SELECT user_id FROM public.secours_subscriptions 
      WHERE id = rescue_requests.subscription_id
    )
  );

CREATE POLICY "Users can create their own rescue requests" ON public.rescue_requests
  FOR INSERT WITH CHECK (
    auth.uid() = (
      SELECT user_id FROM public.secours_subscriptions 
      WHERE id = rescue_requests.subscription_id
    )
  );

CREATE POLICY "Service can manage rescue requests" ON public.rescue_requests
  FOR ALL USING (true);

-- Create function to update token balance after transaction
CREATE OR REPLACE FUNCTION public.update_token_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.transaction_type = 'purchase' THEN
    UPDATE public.secours_subscriptions 
    SET 
      token_balance = token_balance + NEW.token_amount,
      last_token_purchase_date = now(),
      updated_at = now()
    WHERE id = NEW.subscription_id;
  ELSIF NEW.transaction_type = 'rescue_claim' THEN
    UPDATE public.secours_subscriptions 
    SET 
      token_balance = token_balance - NEW.token_amount,
      last_rescue_claim_date = now(),
      updated_at = now()
    WHERE id = NEW.subscription_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for token balance updates
CREATE TRIGGER update_token_balance_trigger
  AFTER INSERT ON public.token_transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_token_balance();

-- Create function to get token value per subscription type
CREATE OR REPLACE FUNCTION public.get_token_value(sub_type secours_type)
RETURNS INTEGER AS $$
BEGIN
  CASE sub_type
    WHEN 'motors', 'telephone' THEN RETURN 250;
    WHEN 'auto' THEN RETURN 750;
    WHEN 'cata_catanis', 'school_fees' THEN RETURN 500;
    ELSE RETURN 0;
  END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create function to get minimum token requirements
CREATE OR REPLACE FUNCTION public.get_min_max_tokens(sub_type secours_type)
RETURNS TABLE(min_tokens INTEGER, max_tokens INTEGER, min_value_fcfa INTEGER, max_value_fcfa INTEGER) AS $$
BEGIN
  CASE sub_type
    WHEN 'motors', 'telephone' THEN 
      RETURN QUERY SELECT 30, 60, 7500, 15000;
    WHEN 'auto' THEN 
      RETURN QUERY SELECT 30, 60, 22500, 45000;
    WHEN 'cata_catanis', 'school_fees' THEN 
      RETURN QUERY SELECT 30, 60, 15000, 30000;
  END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

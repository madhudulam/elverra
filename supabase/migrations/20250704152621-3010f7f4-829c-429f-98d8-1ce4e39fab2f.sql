-- Create enum for secours subscription types
CREATE TYPE secours_type AS ENUM ('motors', 'cata_catanis', 'auto', 'telephone', 'school_fees');

-- Create enum for transaction types
CREATE TYPE transaction_type AS ENUM ('purchase', 'rescue_claim');

-- Create enum for rescue request status
CREATE TYPE rescue_status AS ENUM ('pending', 'approved', 'rejected', 'completed');

-- Update secours_subscriptions table to match requirements
ALTER TABLE public.secours_subscriptions 
ALTER COLUMN subscription_type TYPE secours_type USING subscription_type::secours_type;

-- Update token_transactions table to match requirements
ALTER TABLE public.token_transactions
ALTER COLUMN transaction_type TYPE transaction_type USING transaction_type::transaction_type;

-- Update rescue_requests table to match requirements  
ALTER TABLE public.rescue_requests
ALTER COLUMN status TYPE rescue_status USING status::rescue_status;

-- Create function to get token value based on subscription type
CREATE OR REPLACE FUNCTION get_token_value(sub_type secours_type)
RETURNS INTEGER
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  CASE sub_type
    WHEN 'motors', 'telephone' THEN RETURN 250;
    WHEN 'auto' THEN RETURN 750;
    WHEN 'cata_catanis', 'school_fees' THEN RETURN 500;
    ELSE RETURN 0;
  END CASE;
END;
$$;

-- Create function to get min/max token limits
CREATE OR REPLACE FUNCTION get_min_max_tokens(sub_type secours_type)
RETURNS TABLE(min_tokens INTEGER, max_tokens INTEGER, min_value_fcfa INTEGER, max_value_fcfa INTEGER)
LANGUAGE plpgsql
IMMUTABLE
AS $$
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
$$;

-- Create trigger function to update token balance on transactions
CREATE OR REPLACE FUNCTION update_token_balance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Create trigger to update token balance after transactions
DROP TRIGGER IF EXISTS update_token_balance_trigger ON public.token_transactions;
CREATE TRIGGER update_token_balance_trigger
  AFTER INSERT ON public.token_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_token_balance();

-- Create RLS policies for token_transactions
ALTER TABLE public.token_transactions ENABLE ROW LEVEL SECURITY;

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
ALTER TABLE public.rescue_requests ENABLE ROW LEVEL SECURITY;

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
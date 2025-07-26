-- Create trigger function to update token balance on transactions (if not exists)
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
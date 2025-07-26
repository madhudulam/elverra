-- Add approval workflow fields to agents table
ALTER TABLE public.agents 
ADD COLUMN approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
ADD COLUMN approved_by UUID REFERENCES auth.users(id),
ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN rejection_reason TEXT,
ADD COLUMN application_notes TEXT;

-- Add withdrawal request table for affiliate earnings
CREATE TABLE public.affiliate_withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  withdrawal_amount INTEGER NOT NULL,
  withdrawal_method TEXT NOT NULL,
  account_details JSONB,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'processed')),
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  processed_by UUID REFERENCES auth.users(id),
  processing_notes TEXT,
  transaction_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on affiliate_withdrawals
ALTER TABLE public.affiliate_withdrawals ENABLE ROW LEVEL SECURITY;

-- Policies for affiliate_withdrawals
CREATE POLICY "Agents can view their own withdrawals" 
ON public.affiliate_withdrawals 
FOR SELECT 
USING (auth.uid() = (SELECT user_id FROM agents WHERE agents.id = affiliate_withdrawals.agent_id));

CREATE POLICY "Agents can create withdrawal requests" 
ON public.affiliate_withdrawals 
FOR INSERT 
WITH CHECK (auth.uid() = (SELECT user_id FROM agents WHERE agents.id = affiliate_withdrawals.agent_id));

CREATE POLICY "Service can manage withdrawals" 
ON public.affiliate_withdrawals 
FOR ALL 
USING (true);

-- Update agents RLS to include approval status checks
DROP POLICY IF EXISTS "Users can view their own agent profile" ON public.agents;
CREATE POLICY "Users can view their own agent profile" 
ON public.agents 
FOR SELECT 
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_affiliate_withdrawals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_affiliate_withdrawals_updated_at_trigger
  BEFORE UPDATE ON public.affiliate_withdrawals
  FOR EACH ROW
  EXECUTE FUNCTION update_affiliate_withdrawals_updated_at();
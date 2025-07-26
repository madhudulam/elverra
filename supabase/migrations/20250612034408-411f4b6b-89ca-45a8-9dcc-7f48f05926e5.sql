
-- Create table for project funding
CREATE TABLE public.project_funding (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_name TEXT NOT NULL,
  description TEXT NOT NULL,
  goal_amount INTEGER NOT NULL,
  current_amount INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'CFA',
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  category TEXT NOT NULL,
  location TEXT,
  image_url TEXT,
  created_by UUID REFERENCES auth.users,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for individual contributions
CREATE TABLE public.project_contributions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.project_funding(id) ON DELETE CASCADE,
  contributor_id UUID REFERENCES auth.users,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'CFA',
  contributor_name TEXT,
  contributor_email TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  message TEXT,
  payment_method TEXT NOT NULL,
  transaction_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.project_funding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_contributions ENABLE ROW LEVEL SECURITY;

-- RLS policies for project_funding (public read, authenticated write)
CREATE POLICY "Anyone can view active projects" 
  ON public.project_funding 
  FOR SELECT 
  USING (status = 'active');

CREATE POLICY "Authenticated users can create projects" 
  ON public.project_funding 
  FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Project creators can update their projects" 
  ON public.project_funding 
  FOR UPDATE 
  USING (auth.uid() = created_by);

-- RLS policies for project_contributions (public read for non-anonymous, authenticated write)
CREATE POLICY "Anyone can view non-anonymous contributions" 
  ON public.project_contributions 
  FOR SELECT 
  USING (is_anonymous = false);

CREATE POLICY "Contributors can view their own contributions" 
  ON public.project_contributions 
  FOR SELECT 
  USING (auth.uid() = contributor_id);

CREATE POLICY "Anyone can create contributions" 
  ON public.project_contributions 
  FOR INSERT 
  WITH CHECK (true);

-- Create function to update project current_amount when contributions are added
CREATE OR REPLACE FUNCTION public.update_project_funding_amount()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    UPDATE public.project_funding 
    SET current_amount = current_amount + NEW.amount,
        updated_at = now()
    WHERE id = NEW.project_id;
  ELSIF OLD.status = 'completed' AND NEW.status != 'completed' THEN
    UPDATE public.project_funding 
    SET current_amount = current_amount - OLD.amount,
        updated_at = now()
    WHERE id = NEW.project_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating project funding amount
CREATE TRIGGER update_project_funding_amount_trigger
  AFTER INSERT OR UPDATE ON public.project_contributions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_project_funding_amount();

-- Create trigger for updated_at timestamp
CREATE TRIGGER update_project_funding_updated_at
  BEFORE UPDATE ON public.project_funding
  FOR EACH ROW
  EXECUTE FUNCTION public.update_modified_column();

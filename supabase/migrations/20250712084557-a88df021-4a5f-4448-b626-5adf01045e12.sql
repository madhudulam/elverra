-- Create sectors table for better data management
CREATE TABLE public.sectors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on sectors table
ALTER TABLE public.sectors ENABLE ROW LEVEL SECURITY;

-- Create policies for sectors table
CREATE POLICY "Anyone can view active sectors" 
ON public.sectors 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Service can manage sectors" 
ON public.sectors 
FOR ALL 
USING (true);

-- Insert default sectors from existing merchants
INSERT INTO public.sectors (name, description) 
SELECT DISTINCT sector, 'Auto-generated from merchants' 
FROM public.merchants 
WHERE sector IS NOT NULL AND sector != ''
ON CONFLICT (name) DO NOTHING;

-- Add sector_id column to merchants table
ALTER TABLE public.merchants ADD COLUMN sector_id UUID REFERENCES public.sectors(id);

-- Update merchants to reference sectors table
UPDATE public.merchants 
SET sector_id = (
  SELECT s.id 
  FROM public.sectors s 
  WHERE s.name = public.merchants.sector
  LIMIT 1
);

-- Create trigger for updated_at on sectors
CREATE TRIGGER update_sectors_updated_at
BEFORE UPDATE ON public.sectors
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();
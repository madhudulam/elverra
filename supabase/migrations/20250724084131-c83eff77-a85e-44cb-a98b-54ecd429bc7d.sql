-- Create offers table for shop discounts and promotions
CREATE TABLE public.shop_offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  discount_percentage INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  premium_only BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.shop_offers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view active offers" 
ON public.shop_offers 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Service can manage offers" 
ON public.shop_offers 
FOR ALL 
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_shop_offers_updated_at
  BEFORE UPDATE ON public.shop_offers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_modified_column();

-- Add discount_percentage column to products for premium member discounts
ALTER TABLE public.products 
ADD COLUMN discount_percentage INTEGER DEFAULT 0,
ADD COLUMN original_price INTEGER;
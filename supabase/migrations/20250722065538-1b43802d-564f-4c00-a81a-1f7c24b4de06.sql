-- Create products table for user-posted products
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL, -- Price in CFA francs
  currency TEXT NOT NULL DEFAULT 'CFA',
  category TEXT NOT NULL,
  condition TEXT NOT NULL DEFAULT 'new', -- new, used, refurbished
  location TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  images JSONB DEFAULT '[]'::jsonb, -- Array of image URLs
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_sold BOOLEAN NOT NULL DEFAULT false,
  posting_fee_paid BOOLEAN NOT NULL DEFAULT false,
  posting_fee_amount INTEGER NOT NULL DEFAULT 500,
  posting_fee_payment_id UUID,
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active products" 
ON public.products 
FOR SELECT 
USING (is_active = true AND posting_fee_paid = true);

CREATE POLICY "Users can create their own products" 
ON public.products 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products" 
ON public.products 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own products" 
ON public.products 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_products_updated_at();

-- Create function to increment product views
CREATE OR REPLACE FUNCTION public.increment_product_views(product_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.products 
  SET views = views + 1 
  WHERE id = product_id;
END;
$$;

-- Create product categories table
CREATE TABLE public.product_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for categories
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active categories" 
ON public.product_categories 
FOR SELECT 
USING (is_active = true);

-- Insert default categories
INSERT INTO public.product_categories (name, description) VALUES
('Electronics', 'Phones, computers, gadgets, and electronic devices'),
('Fashion', 'Clothing, shoes, accessories, and fashion items'),
('Home & Garden', 'Furniture, appliances, home decor, and garden items'),
('Vehicles', 'Cars, motorcycles, bicycles, and vehicle parts'),
('Books & Education', 'Books, educational materials, and learning resources'),
('Sports & Recreation', 'Sports equipment, games, and recreational items'),
('Health & Beauty', 'Cosmetics, health products, and beauty items'),
('Food & Beverages', 'Food products, beverages, and culinary items'),
('Services', 'Professional services, repairs, and consultations'),
('Other', 'Items that don\'t fit into other categories');
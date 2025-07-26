-- Enhanced merchants table for better discount management
ALTER TABLE public.merchants ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.merchants ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.merchants ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 4.5;
ALTER TABLE public.merchants ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.merchants ADD COLUMN IF NOT EXISTS social_media JSONB;
ALTER TABLE public.merchants ADD COLUMN IF NOT EXISTS business_hours JSONB;
ALTER TABLE public.merchants ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Update RLS policies for merchants
DROP POLICY IF EXISTS "Service can manage merchants" ON public.merchants;
CREATE POLICY "Service can manage merchants" ON public.merchants FOR ALL USING (true);

-- Insert some sample merchant data if table is empty or has minimal data
INSERT INTO public.merchants (name, sector, location, discount_percentage, description, image_url, rating, featured, is_active) VALUES
('African Fashion House', 'Clothing', 'Dakar, Senegal', 20, 'Premium African fashion and traditional wear', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 4.8, true, true),
('TechHub Electronics', 'Electronic Equipment', 'Lagos, Nigeria', 15, 'Latest electronics and gadgets', 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 4.6, true, true),
('Sahara Beauty Spa', 'Cosmetics and Beauty Spots', 'Accra, Ghana', 25, 'Premium beauty treatments and cosmetics', 'https://images.unsplash.com/photo-1552693673-1bf958298935?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 4.9, true, true),
('Luxury Hotels Africa', 'Hotels and Accommodation', 'Nairobi, Kenya', 30, 'Premium accommodation across Africa', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 4.7, true, true),
('African Motors', 'Cars', 'Abidjan, Ivory Coast', 12, 'Quality vehicles and automotive services', 'https://images.unsplash.com/photo-1493238792000-8113da705763?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 4.5, false, true),
('Continental Furniture', 'Furniture', 'Bamako, Mali', 18, 'Modern and traditional African furniture', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 4.4, false, true)
ON CONFLICT (name) DO NOTHING;
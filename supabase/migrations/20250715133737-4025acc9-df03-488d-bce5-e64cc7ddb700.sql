-- Add expanded discount sectors
INSERT INTO public.sectors (name, description, is_active) VALUES
('Real Estate Services', 'Property sales, rentals, and real estate services', true),
('Financial Services', 'Banking, insurance, and financial consultation services', true),
('Travel Agencies', 'Travel booking, tour packages, and travel services', true),
('Hotels and Accommodation', 'Hotels, guesthouses, and accommodation services', true),
('Textiles', 'Fabrics, clothing materials, and textile products', true),
('Clothing', 'Fashion, apparel, and clothing accessories', true),
('Cosmetics and Beauty Spots', 'Beauty products, salons, and cosmetic services', true),
('Cars', 'Automotive sales, services, and car accessories', true),
('Footwears', 'Shoes, sandals, and footwear accessories', true),
('Motorbikes', 'Motorcycle sales, services, and accessories', true),
('Mobile Phones', 'Smartphones, accessories, and mobile services', true),
('Electronic Equipment', 'Electronics, gadgets, and technology products', true),
('Furniture', 'Home and office furniture and furnishing', true),
('Other Services', 'Miscellaneous services and products', true)
ON CONFLICT (name) DO NOTHING;
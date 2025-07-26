-- Add new sectors for discount system
INSERT INTO public.sectors (name, description, is_active) VALUES 
('Real Estate Services', 'Real estate agencies and property services', true),
('Financial Services', 'Banking, insurance, and financial institutions', true),
('Travel Agencies', 'Travel planning and booking services', true),
('Hotels and Accommodation', 'Hotels, lodges, and accommodation services', true),
('Textiles', 'Textile manufacturing and fabric suppliers', true),
('Clothing', 'Fashion, apparel, and clothing retailers', true),
('Cosmetics and Beauty', 'Beauty products, cosmetics, and personal care', true),
('Cars', 'Automotive sales and car dealerships', true),
('Footwears', 'Shoe stores and footwear retailers', true),
('Motorbikes', 'Motorcycle sales and accessories', true),
('Mobile Phones', 'Mobile phone stores and telecommunications', true),
('Electronic Equipment', 'Electronics, appliances, and tech gadgets', true),
('Furniture', 'Furniture stores and home furnishing', true),
('Other Services', 'Miscellaneous services and businesses', true)
ON CONFLICT (name) DO NOTHING;
-- Insert home page sections into CMS
INSERT INTO public.cms_pages (
  title,
  slug,
  content,
  meta_description,
  meta_keywords,
  status,
  page_type,
  is_featured
) 
VALUES
-- Hero Section
('Home Hero Section', 'home-hero', 
'<h1>Welcome to Club66 Global</h1><p>Your gateway to exclusive benefits and opportunities across Africa</p>', 
'Club66 Global hero section content', 'Club66, membership, benefits, Africa', 'published', 'section', true),

-- About Section (already created but updating)
('Home About Section', 'home-about', 
'<h2>About Club66 Global</h2><p>Club 66 Global is a company that offers a diverse range of services and platforms through our unique all-in-one astonishing product called ZENIKA. Our Zenika Card enables our clients to access discounts and special privileges on purchases of goods and services across our network of partners. Our service basket includes a Job Centre, Payday Loans, an Online Store with low hosting fees, a Free Online Library, and our most passionate "Ô Secours" services. Our mission is to provide valuable resources and opportunities for our clients. Through our TikTok campaign, "What saving lives really means to me," we are gathering feedback and stories to improve our services and better serve our community. With exciting initiatives and benefits, Club 66 Global aims to make a positive impact and support the growth and well-being of our clients worldwide.</p>', 
'About Club66 Global section content', 'Club66, about, services, ZENIKA', 'published', 'section', true),

-- Benefits Section
('Home Benefits Section', 'home-benefits', 
'<h2>Membership Benefits</h2><p>Unlock exclusive discounts, financial services, and opportunities designed for your success</p>', 
'Club66 Global benefits section content', 'benefits, discounts, financial services', 'published', 'section', true),

-- Membership Plans Section
('Home Membership Plans', 'home-membership-plans', 
'<h2>Choose Your Plan</h2><p>Select the perfect membership tier that suits your needs and lifestyle</p>', 
'Club66 Global membership plans section', 'membership, plans, tiers', 'published', 'section', true),

-- Digital Card Section
('Home Digital Card', 'home-digital-card', 
'<h2>Your Digital Membership Card</h2><p>Access all benefits with your convenient digital membership card</p>', 
'Club66 Global digital card section', 'digital card, membership card', 'published', 'section', true),

-- Affiliate Program Section
('Home Affiliate Program', 'home-affiliate', 
'<h2>Affiliate Program</h2><p>Earn commissions by referring new members to Club66 Global</p>', 
'Club66 Global affiliate program section', 'affiliate, commissions, referrals', 'published', 'section', true),

-- Social Benefits Section
('Home Social Benefits', 'home-social-benefits', 
'<h2>Community Benefits</h2><p>Connect with a community of like-minded individuals and access social benefits</p>', 
'Club66 Global social benefits section', 'social benefits, community', 'published', 'section', true),

-- CTA Section
('Home Call to Action', 'home-cta', 
'<h2>Ready to Join?</h2><p>Start your journey with Club66 Global today and unlock exclusive benefits</p>', 
'Club66 Global call to action section', 'join, membership, call to action', 'published', 'section', true)

ON CONFLICT (slug) DO UPDATE SET
content = EXCLUDED.content,
meta_description = EXCLUDED.meta_description,
meta_keywords = EXCLUDED.meta_keywords,
updated_at = now();
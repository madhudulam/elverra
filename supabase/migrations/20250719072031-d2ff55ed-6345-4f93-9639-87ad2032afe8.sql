-- Insert the About Us page content into CMS if it doesn't exist
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
SELECT 
  'About Club66 Global',
  'about',
  '<h2>About Club66 Global</h2><p>Club 66 Global is a company that offers a diverse range of services and platforms through our unique all-in-one astonishing product called ZENIKA. Our Zenika Card enables our clients to access discounts and special privileges on purchases of goods and services across our network of partners. Our service basket includes a Job Centre, Payday Loans, an Online Store with low hosting fees, a Free Online Library, and our most passionate "Ô Secours" services. Our mission is to provide valuable resources and opportunities for our clients. Through our TikTok campaign, "What saving lives really means to me," we&rsquo;re gathering feedback and stories to improve our services and better serve our community. With exciting initiatives and benefits, Club 66 Global aims to make a positive impact and support the growth and well-being of our clients worldwide.</p>',
  'Learn about Club66 Global - offering diverse services through our ZENIKA product including job centre, payday loans, online store and O Secours services',
  'Club66 Global, ZENIKA, job centre, payday loans, online store, O Secours, client benefits',
  'published',
  'page',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.cms_pages WHERE slug = 'about'
);
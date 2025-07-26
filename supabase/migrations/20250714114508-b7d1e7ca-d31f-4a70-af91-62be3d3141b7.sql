-- Create CMS pages table for content management
CREATE TABLE IF NOT EXISTS public.cms_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  meta_description TEXT,
  meta_keywords TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  page_type TEXT NOT NULL DEFAULT 'page',
  featured_image_url TEXT,
  author_id UUID,
  publish_date TIMESTAMP WITH TIME ZONE,
  last_modified_by UUID,
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;

-- Create policies for CMS pages
CREATE POLICY "Anyone can view published pages" 
ON public.cms_pages 
FOR SELECT 
USING (status = 'published');

CREATE POLICY "Authors can manage their own pages" 
ON public.cms_pages 
FOR ALL 
USING (auth.uid() = author_id);

CREATE POLICY "Service can manage all pages" 
ON public.cms_pages 
FOR ALL 
USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_cms_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cms_pages_updated_at
  BEFORE UPDATE ON public.cms_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_cms_pages_updated_at();

-- Insert some default pages
INSERT INTO public.cms_pages (title, slug, content, status, page_type, author_id) VALUES
('About Club66 Global', 'about-club66', 'Club66 Global is a membership-based organization dedicated to providing exceptional benefits and services to our members across Africa.', 'published', 'page', null),
('Terms and Conditions', 'terms-conditions', 'These terms and conditions outline the rules and regulations for the use of Club66 Global services.', 'published', 'page', null),
('Privacy Policy', 'privacy-policy', 'This privacy policy explains how Club66 Global collects, uses, and protects your personal information.', 'published', 'page', null),
('FAQ', 'faq', 'Frequently asked questions about Club66 Global membership and services.', 'published', 'page', null),
('Contact Us', 'contact-us', 'Get in touch with Club66 Global for any inquiries or support.', 'published', 'page', null),
('Membership Benefits', 'membership-benefits', 'Discover the exclusive benefits available to Club66 Global members.', 'published', 'page', null),
('Partner Network', 'partner-network', 'Learn about our extensive network of partners and merchants.', 'published', 'page', null),
('News & Updates', 'news-updates', 'Stay informed with the latest news and updates from Club66 Global.', 'published', 'page', null);
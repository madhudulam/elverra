-- Create distributors table
CREATE TABLE public.distributors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  distributor_type TEXT NOT NULL DEFAULT 'individual',
  business_name TEXT,
  business_registration_number TEXT,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'Mali',
  products_distributed TEXT[],
  territory_coverage TEXT,
  commission_rate DECIMAL(5,2) DEFAULT 0.00,
  total_sales INTEGER DEFAULT 0,
  total_commission_earned INTEGER DEFAULT 0,
  commission_pending INTEGER DEFAULT 0,
  commission_withdrawn INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create payday_advances table
CREATE TABLE public.payday_advances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  loan_amount INTEGER NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL DEFAULT 15.00,
  loan_term_days INTEGER NOT NULL DEFAULT 30,
  repayment_amount INTEGER NOT NULL,
  loan_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  repayment_date TIMESTAMP WITH TIME ZONE,
  collateral_type TEXT,
  collateral_description TEXT,
  approval_date TIMESTAMP WITH TIME ZONE,
  approved_by UUID,
  disbursement_method TEXT,
  repayment_method TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create cms_pages table
CREATE TABLE public.cms_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  meta_description TEXT,
  meta_keywords TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  author_id UUID,
  featured_image_url TEXT,
  page_type TEXT NOT NULL DEFAULT 'page',
  publish_date TIMESTAMP WITH TIME ZONE,
  last_modified_by UUID,
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.distributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payday_advances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for distributors
CREATE POLICY "Users can view their own distributor profile" 
ON public.distributors FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own distributor profile" 
ON public.distributors FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own distributor profile" 
ON public.distributors FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for payday_advances
CREATE POLICY "Users can view their own payday advances" 
ON public.payday_advances FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payday advance requests" 
ON public.payday_advances FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service can manage all payday advances" 
ON public.payday_advances FOR ALL 
USING (true);

-- Create RLS policies for cms_pages
CREATE POLICY "Anyone can view published pages" 
ON public.cms_pages FOR SELECT 
USING (status = 'published');

CREATE POLICY "Authors can manage their own pages" 
ON public.cms_pages FOR ALL 
USING (auth.uid() = author_id);

CREATE POLICY "Service can manage all pages" 
ON public.cms_pages FOR ALL 
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_distributors_user_id ON public.distributors(user_id);
CREATE INDEX idx_distributors_is_active ON public.distributors(is_active);
CREATE INDEX idx_payday_advances_user_id ON public.payday_advances(user_id);
CREATE INDEX idx_payday_advances_status ON public.payday_advances(status);
CREATE INDEX idx_cms_pages_slug ON public.cms_pages(slug);
CREATE INDEX idx_cms_pages_status ON public.cms_pages(status);
CREATE INDEX idx_cms_pages_page_type ON public.cms_pages(page_type);

-- Create triggers for updated_at columns
CREATE TRIGGER update_distributors_updated_at
BEFORE UPDATE ON public.distributors
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_payday_advances_updated_at
BEFORE UPDATE ON public.payday_advances
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_cms_pages_updated_at
BEFORE UPDATE ON public.cms_pages
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();
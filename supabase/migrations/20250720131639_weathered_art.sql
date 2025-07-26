/*
  # Create Home Page CMS Content

  1. New CMS Page
    - Creates a home page entry in cms_pages table
    - Sets up dynamic content for the home page
    - Includes meta information for SEO

  2. Content Structure
    - Hero section content
    - About section content
    - Features and benefits
    - Call-to-action content
*/

-- Insert home page content into CMS
INSERT INTO public.cms_pages (
  title,
  slug,
  content,
  meta_description,
  meta_keywords,
  status,
  page_type,
  is_featured,
  featured_image_url
) VALUES (
  'Club66 Global - Home Page',
  'home-page',
  '<div class="home-content">
    <section class="hero-section">
      <h1>Connect with Millions of African Professionals</h1>
      <p class="hero-subtitle">Club66 Global is a company that offers a diverse range of services and platforms through our unique all-in-one astonishing product called ZENIKA. Our Zenika Card enables our clients to access discounts and special privileges on purchases of goods and services across our network of partners.</p>
      <div class="hero-stats">
        <div class="stat">
          <span class="stat-number">2M+</span>
          <span class="stat-label">Active Clients</span>
        </div>
        <div class="stat">
          <span class="stat-number">15+</span>
          <span class="stat-label">African Countries</span>
        </div>
        <div class="stat">
          <span class="stat-number">500+</span>
          <span class="stat-label">Partner Merchants</span>
        </div>
        <div class="stat">
          <span class="stat-number">50%</span>
          <span class="stat-label">Max Discounts</span>
        </div>
      </div>
    </section>

    <section class="about-section">
      <h2>About Club66 Global</h2>
      <p>Our service basket includes a Job Centre, Payday Loans, an Online Store with low hosting fees, a Free Online Library, and our most passionate "Ô Secours" services. Our mission is to provide valuable resources and opportunities for our clients. Through our TikTok campaign, "What saving lives really means to me," we''re gathering feedback and stories to improve our services and better serve our community. With exciting initiatives and benefits, Club66 Global aims to make a positive impact and support the growth and well-being of our clients worldwide.</p>
    </section>

    <section class="features-section">
      <h2>Client Benefits</h2>
      <div class="features-grid">
        <div class="feature">
          <h3>Exclusive Discounts</h3>
          <p>Enjoy 5-20% discounts at thousands of partner businesses across West Africa.</p>
        </div>
        <div class="feature">
          <h3>Digital Value & Privilege Card</h3>
          <p>Access your client benefits with a secure Zenika Card featuring QR verification.</p>
        </div>
        <div class="feature">
          <h3>Professional Network</h3>
          <p>Connect with millions of clients and expand your professional network across West Africa.</p>
        </div>
        <div class="feature">
          <h3>Social Benefits</h3>
          <p>Choose from benefits like startup capital, payday loans, land plots, and more.</p>
        </div>
        <div class="feature">
          <h3>Job Opportunities</h3>
          <p>Get priority access to job opportunities through our dedicated job center portal.</p>
        </div>
        <div class="feature">
          <h3>Flexible Payment Options</h3>
          <p>Pay via mobile money, bank transfers, or credit cards with instant confirmation.</p>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <h2>Ready to Join Club66?</h2>
      <p>Become a member today and unlock a world of exclusive benefits, discounts, and opportunities.</p>
      <div class="cta-buttons">
        <a href="/register" class="btn-primary">Sign Up Now</a>
        <a href="/contact" class="btn-secondary">Contact Us</a>
      </div>
    </section>
  </div>',
  'Join Club66 Global - West Africa''s premier membership platform. Access exclusive discounts, career opportunities, and life-changing benefits with millions of members across 15+ African countries.',
  'Club66 Global, membership, Africa, discounts, benefits, ZENIKA card, job center, professional network, West Africa',
  'published',
  'page',
  true,
  'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
) ON CONFLICT (slug) DO UPDATE SET
  content = EXCLUDED.content,
  meta_description = EXCLUDED.meta_description,
  meta_keywords = EXCLUDED.meta_keywords,
  featured_image_url = EXCLUDED.featured_image_url,
  updated_at = now();
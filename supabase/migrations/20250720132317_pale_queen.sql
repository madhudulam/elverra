/*
  # Ensure Home Page CMS Content Exists

  1. Check and Insert Home Page Content
    - Ensures a home page record exists in cms_pages table
    - Sets up proper content structure with hero, about, features, and CTA sections
    - Uses UPSERT pattern to avoid conflicts

  2. Content Structure
    - Hero section with compelling headline and stats
    - About section explaining Club66 Global's mission
    - Features section highlighting member benefits
    - Call-to-action section encouraging membership

  3. SEO and Meta Data
    - Proper meta description and keywords
    - Featured image for social sharing
    - Optimized for search engines
*/

-- Insert or update the home page content
INSERT INTO cms_pages (
  title,
  slug,
  content,
  meta_description,
  meta_keywords,
  status,
  page_type,
  is_featured,
  featured_image_url,
  created_at,
  updated_at
) VALUES (
  'Club66 Global - Exclusive Membership Benefits',
  'home-page',
  '<div class="hero-section">
    <h1 class="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-purple-600 bg-clip-text text-transparent">
      Welcome to Club66 Global
    </h1>
    <p class="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
      Join the most exclusive membership club in West Africa. Unlock premium benefits, discounts, and opportunities across Mali, Nigeria, Ghana, and Senegal.
    </p>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
      <div class="text-center">
        <div class="text-3xl md:text-4xl font-bold text-yellow-400">50K+</div>
        <div class="text-sm text-gray-300">Active Members</div>
      </div>
      <div class="text-center">
        <div class="text-3xl md:text-4xl font-bold text-yellow-400">1000+</div>
        <div class="text-sm text-gray-300">Partner Merchants</div>
      </div>
      <div class="text-center">
        <div class="text-3xl md:text-4xl font-bold text-yellow-400">4</div>
        <div class="text-sm text-gray-300">Countries</div>
      </div>
      <div class="text-center">
        <div class="text-3xl md:text-4xl font-bold text-yellow-400">24/7</div>
        <div class="text-sm text-gray-300">Support</div>
      </div>
    </div>
  </div>
  
  <div class="about-section">
    <h2 class="text-4xl font-bold text-gray-900 mb-6 text-center">
      Transforming Lives Across West Africa
    </h2>
    <p class="text-lg text-gray-700 mb-6 leading-relaxed">
      Club66 Global is more than just a membership program – we''re a community dedicated to empowering individuals and businesses across West Africa. Our exclusive platform connects members with premium discounts, emergency services, job opportunities, and life-changing projects.
    </p>
    <p class="text-lg text-gray-700 mb-6 leading-relaxed">
      From our innovative Ô Secours emergency response system to our comprehensive job center and merchant discount network, we''re building the infrastructure for a more connected and prosperous West Africa.
    </p>
    <div class="grid md:grid-cols-3 gap-6 mt-8">
      <div class="text-center p-6 bg-gradient-to-br from-yellow-50 to-purple-50 rounded-lg">
        <div class="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-white text-2xl font-bold">💼</span>
        </div>
        <h3 class="font-semibold text-gray-900 mb-2">Career Opportunities</h3>
        <p class="text-gray-600 text-sm">Access exclusive job listings and career development programs</p>
      </div>
      <div class="text-center p-6 bg-gradient-to-br from-yellow-50 to-purple-50 rounded-lg">
        <div class="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-white text-2xl font-bold">🛡️</span>
        </div>
        <h3 class="font-semibold text-gray-900 mb-2">Emergency Support</h3>
        <p class="text-gray-600 text-sm">24/7 emergency assistance through our Ô Secours network</p>
      </div>
      <div class="text-center p-6 bg-gradient-to-br from-yellow-50 to-purple-50 rounded-lg">
        <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-white text-2xl font-bold">💰</span>
        </div>
        <h3 class="font-semibold text-gray-900 mb-2">Exclusive Discounts</h3>
        <p class="text-gray-600 text-sm">Save money at thousands of partner merchants across the region</p>
      </div>
    </div>
  </div>
  
  <div class="features-section">
    <h2 class="text-4xl font-bold text-gray-900 mb-12 text-center">
      Why Choose Club66 Global?
    </h2>
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div class="text-center">
        <div class="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-white text-3xl">🌟</span>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-3">Premium Benefits</h3>
        <p class="text-gray-600">Exclusive access to premium services and member-only benefits across our network</p>
      </div>
      <div class="text-center">
        <div class="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-white text-3xl">🤝</span>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-3">Community Network</h3>
        <p class="text-gray-600">Connect with like-minded individuals and businesses across West Africa</p>
      </div>
      <div class="text-center">
        <div class="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-white text-3xl">📱</span>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-3">Digital Innovation</h3>
        <p class="text-gray-600">Cutting-edge digital services including mobile payments and emergency response</p>
      </div>
      <div class="text-center">
        <div class="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-white text-3xl">🚀</span>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-3">Growth Opportunities</h3>
        <p class="text-gray-600">Access to funding, scholarships, and business development programs</p>
      </div>
    </div>
  </div>
  
  <div class="cta-section">
    <h2 class="text-4xl md:text-5xl font-bold mb-6">
      Ready to Transform Your Future?
    </h2>
    <p class="text-xl mb-8 text-purple-100 max-w-2xl mx-auto">
      Join thousands of members who are already benefiting from exclusive discounts, emergency support, and career opportunities across West Africa.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center mb-8">
      <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
        <div class="text-2xl font-bold text-yellow-400 mb-2">Basic Plan</div>
        <div class="text-sm text-purple-200">Starting from</div>
        <div class="text-3xl font-bold text-white">5,000 CFA</div>
        <div class="text-sm text-purple-200">per month</div>
      </div>
      <div class="bg-white/20 backdrop-blur-sm rounded-lg p-6 text-center border-2 border-yellow-400">
        <div class="text-2xl font-bold text-yellow-400 mb-2">Premium Plan</div>
        <div class="text-sm text-purple-200">Starting from</div>
        <div class="text-3xl font-bold text-white">15,000 CFA</div>
        <div class="text-sm text-purple-200">per month</div>
      </div>
    </div>
  </div>',
  'Join Club66 Global - West Africa''s premier membership club offering exclusive discounts, emergency services, job opportunities, and community benefits across Mali, Nigeria, Ghana, and Senegal.',
  'Club66 Global, West Africa membership, exclusive discounts, emergency services, job opportunities, Mali, Nigeria, Ghana, Senegal, Ô Secours, premium benefits',
  'published',
  'landing',
  true,
  'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
  now(),
  now()
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  meta_description = EXCLUDED.meta_description,
  meta_keywords = EXCLUDED.meta_keywords,
  status = EXCLUDED.status,
  page_type = EXCLUDED.page_type,
  is_featured = EXCLUDED.is_featured,
  featured_image_url = EXCLUDED.featured_image_url,
  updated_at = now();
/*
  # Create Dynamic Home Page Sections

  1. New CMS Pages for Each Section
    - Creates individual CMS entries for each home page section
    - Allows dynamic content management for all sections
    - Includes proper meta information and content structure

  2. Section Content
    - Hero slider content with multiple slides
    - About section with company information
    - Benefits section with feature highlights
    - Membership plans with pricing details
    - Digital card information
    - Social benefits overview
    - Affiliate program details
    - Call-to-action content
*/

-- Insert dynamic content for all home page sections
INSERT INTO public.cms_pages (
  title,
  slug,
  content,
  meta_description,
  meta_keywords,
  status,
  page_type,
  is_featured
) VALUES 
-- Hero Slider Section
(
  'Home Hero Slider',
  'home-hero-slider',
  '{
    "slides": [
      {
        "id": 1,
        "title": "ZENIKA Cards",
        "subtitle": "Votre Carte Membre Digitale",
        "description": "Profitez de votre carte membre numérique avec QR code pour un accès rapide aux services et réductions exclusives dans notre réseau.",
        "backgroundImage": "/lovable-uploads/c94bd4e1-3730-468c-8b9b-8b350b608a41.png",
        "primaryButton": {"text": "Obtenir Ma Carte", "link": "/register"},
        "secondaryButton": {"text": "Voir Avantages", "link": "/cards"}
      },
      {
        "id": 2,
        "title": "Solutions Professionnelles",
        "subtitle": "Services Business & Partenariats",
        "description": "Solutions financières innovantes, conseils stratégiques et opportunités de partenariat pour développer votre activité professionnelle.",
        "backgroundImage": "/lovable-uploads/a271f525-8c4f-49b3-9a86-3a96666d8730.png",
        "primaryButton": {"text": "Services Pro", "link": "/services"},
        "secondaryButton": {"text": "Devenir Partenaire", "link": "/affiliates"}
      },
      {
        "id": 3,
        "title": "Carrière & Emploi",
        "subtitle": "Opportunités Professionnelles",
        "description": "Trouvez l''emploi de vos rêves ou recrutez les meilleurs talents grâce à notre plateforme dédiée aux professionnels africains.",
        "backgroundImage": "/lovable-uploads/611d8d2c-d919-40e6-8768-c63118ad2867.png",
        "primaryButton": {"text": "Trouver un Emploi", "link": "/jobs"},
        "secondaryButton": {"text": "Recruter", "link": "/post-job"}
      },
      {
        "id": 4,
        "title": "Éducation & Bourses",
        "subtitle": "Projets Communautaires",
        "description": "Accédez à des bourses d''études, projets éducatifs et programmes de développement personnel pour la jeunesse africaine.",
        "backgroundImage": "/lovable-uploads/4c42bd0e-c389-4a41-881c-ca7ea44a1451.png",
        "primaryButton": {"text": "Voir Projets", "link": "/about/projects"},
        "secondaryButton": {"text": "Demander Bourse", "link": "/about/projects"}
      }
    ]
  }',
  'Dynamic hero slider content for Club66 Global home page',
  'hero, slider, ZENIKA, services, careers, education',
  'published',
  'section',
  true
),

-- About Section
(
  'Home About Section',
  'home-about-section',
  '<div class="about-content">
    <h2 class="text-3xl md:text-4xl font-bold mb-4">
      About <span class="text-club66-gold">Club</span><span class="text-club66-purple">66</span> Global
    </h2>
    <p class="text-lg leading-relaxed text-gray-700 text-justify mb-8">
      Club 66 Global is a company that offers a diverse range of services and platforms through our unique all-in-one astonishing product called ZENIKA. Our Zenika Card enables our clients to access discounts and special privileges on purchases of goods and services across our network of partners. Our service basket includes a Job Centre, Payday Loans, an Online Store with low hosting fees, a Free Online Library, and our most passionate "Ô Secours" services. Our mission is to provide valuable resources and opportunities for our clients. Through our TikTok campaign, "What saving lives really means to me," we''re gathering feedback and stories to improve our services and better serve our community. With exciting initiatives and benefits, Club 66 Global aims to make a positive impact and support the growth and well-being of our clients worldwide.
    </p>
  </div>',
  'About Club66 Global section content',
  'about, Club66, ZENIKA, services, mission',
  'published',
  'section',
  true
),

-- Benefits Section
(
  'Home Benefits Section',
  'home-benefits-section',
  '{
    "title": "Client Benefits",
    "description": "Discover the advantages of being a Club66 Global client and how our services can enhance your lifestyle, career, and financial wellbeing across West Africa.",
    "benefits": [
      {
        "icon": "Percent",
        "title": "Exclusive Discounts",
        "description": "Enjoy 5-20% discounts at thousands of partner businesses across West Africa."
      },
      {
        "icon": "CreditCard",
        "title": "Digital Value & Privilege Card",
        "description": "Access your client benefits with a secure Zenika Card featuring QR verification."
      },
      {
        "icon": "Users",
        "title": "Professional Network",
        "description": "Connect with millions of clients and expand your professional network across West Africa."
      },
      {
        "icon": "Gift",
        "title": "Social Benefits",
        "description": "Choose from benefits like startup capital, payday loans, land plots, and more."
      },
      {
        "icon": "Award",
        "title": "Job Opportunities",
        "description": "Get priority access to job opportunities through our dedicated job center portal."
      },
      {
        "icon": "Clock",
        "title": "Flexible Payment Options",
        "description": "Pay via mobile money, bank transfers, or credit cards with instant confirmation."
      }
    ]
  }',
  'Client benefits section for Club66 Global',
  'benefits, discounts, services, privileges',
  'published',
  'section',
  true
),

-- Membership Plans Section
(
  'Home Membership Plans',
  'home-membership-plans',
  '{
    "title": "Find the Perfect Client Plan",
    "description": "Choose a plan that fits your lifestyle and goals. All plans include access to our exclusive network of partner businesses and special client-only benefits.",
    "plans": [
      {
        "id": "essential",
        "name": "Essential",
        "price": "10,000",
        "monthly": "1,000",
        "discount": "5%",
        "color": "bg-gray-100",
        "textColor": "text-gray-900",
        "buttonVariant": "outline",
        "features": [
          "5% discount at Club66 businesses",
          "Digital Value & Privilege Card",
          "Access to partner discounts",
          "Client community access",
          "Access to job center",
          "Payday loans (8% flat interest)"
        ]
      },
      {
        "id": "premium",
        "name": "Premium",
        "price": "10,000",
        "monthly": "2,000",
        "discount": "10%",
        "color": "gold-gradient",
        "textColor": "text-gray-900",
        "buttonVariant": "secondary",
        "popular": true,
        "features": [
          "10% discount at Club66 businesses",
          "Digital Value & Privilege Card",
          "Access to partner discounts",
          "Client community access",
          "Access to job center",
          "Payday loans (8% flat interest)",
          "Priority customer support",
          "Exclusive event invitations"
        ]
      },
      {
        "id": "elite",
        "name": "Elite",
        "price": "10,000",
        "monthly": "5,000",
        "discount": "20%",
        "color": "card-gradient",
        "textColor": "text-white",
        "buttonVariant": "default",
        "features": [
          "20% discount at Club66 businesses",
          "Digital Value & Privilege Card",
          "Access to partner discounts",
          "Client community access",
          "Access to job center",
          "Payday loans (5% flat interest)",
          "Priority customer support",
          "Exclusive event invitations",
          "Free business training",
          "Investment opportunities"
        ]
      }
    ]
  }',
  'Membership plans section for Club66 Global',
  'membership, plans, pricing, benefits',
  'published',
  'section',
  true
),

-- Digital Card Section
(
  'Home Digital Card',
  'home-digital-card',
  '{
    "title": "Your Digital Membership Card",
    "description": "Access your Club66 membership benefits instantly with our digital card. Available right on your phone, ready whenever you need it.",
    "features": [
      {
        "step": 1,
        "title": "Instant Activation",
        "description": "Your digital card is activated immediately after registration and payment."
      },
      {
        "step": 2,
        "title": "Secure QR Verification",
        "description": "Partners scan your unique QR code to verify your membership and apply discounts."
      },
      {
        "step": 3,
        "title": "Request Physical Card",
        "description": "You can request a physical card through your member dashboard if desired."
      }
    ],
    "cta": {
      "text": "Get Your Digital Card",
      "link": "/register"
    }
  }',
  'Digital card section for Club66 Global',
  'digital card, membership, QR code, mobile',
  'published',
  'section',
  true
),

-- Social Benefits Section
(
  'Home Social Benefits',
  'home-social-benefits',
  '{
    "title": "Optional Social Benefits",
    "description": "As a Club66 member, you can choose from these additional social benefits to enhance your membership experience and achieve your personal goals. Each benefit comes with standard charges and eligibility requirements.",
    "benefits": [
      {
        "id": "startup",
        "name": "Startup Capital",
        "description": "Access to funds for starting or expanding your business ventures.",
        "features": [
          "Business plan assessment",
          "Mentor matching",
          "Growth-focused funding",
          "Business development training",
          "Network of entrepreneurs"
        ],
        "cta": "Apply for Startup Capital"
      },
      {
        "id": "land",
        "name": "Residential Land Plot",
        "description": "Opportunity to own land plots in developing areas with special member pricing.",
        "features": [
          "Discounted land purchases",
          "Legal documentation assistance",
          "Property verification",
          "Community development projects",
          "Construction guidance"
        ],
        "cta": "Explore Land Options"
      },
      {
        "id": "loans",
        "name": "Payday Loans",
        "description": "Quick access to short-term loans with favorable interest rates for members.",
        "features": [
          "8% flat interest for Essential/Premium",
          "5% flat interest for Elite members",
          "Fast approval process",
          "Flexible repayment options",
          "No hidden fees"
        ],
        "cta": "Apply for Payday Loan"
      },
      {
        "id": "education",
        "name": "Scholarship & Training",
        "description": "Educational opportunities through scholarships and professional training programs.",
        "features": [
          "Academic scholarships",
          "Vocational training",
          "Professional certification courses",
          "Educational workshops",
          "Career development resources"
        ],
        "cta": "View Education Opportunities"
      },
      {
        "id": "pilgrimage",
        "name": "Pilgrimage Package",
        "description": "Support for religious pilgrimage journeys for both Muslim and Christian members.",
        "features": [
          "Hajj/Umrah packages",
          "Christian pilgrimage support",
          "Travel arrangements",
          "Group pilgrimages",
          "Guidance and preparation"
        ],
        "cta": "Learn About Pilgrimage Support"
      }
    ]
  }',
  'Social benefits section for Club66 Global',
  'social benefits, startup capital, education, pilgrimage',
  'published',
  'section',
  true
),

-- Affiliate Program Section
(
  'Home Affiliate Program',
  'home-affiliate-program',
  '{
    "title": "Earn While You Share",
    "description": "Join our affiliate program and earn 10% commission on membership fees paid by members you refer to Club66. It''s simple, transparent, and rewarding.",
    "steps": [
      {
        "step": 1,
        "title": "Share your unique affiliate code with friends and family"
      },
      {
        "step": 2,
        "title": "When they sign up using your code, they become your referrals"
      },
      {
        "step": 3,
        "title": "Earn 10% of their membership fee as commission"
      }
    ],
    "example": {
      "title": "Affiliate Earnings Example",
      "tiers": [
        {
          "name": "Essential Membership",
          "price": "CFA 1,000/month",
          "commission": "CFA 100/month"
        },
        {
          "name": "Premium Membership",
          "price": "CFA 2,000/month",
          "commission": "CFA 200/month"
        },
        {
          "name": "Elite Membership",
          "price": "CFA 5,000/month",
          "commission": "CFA 500/month"
        }
      ],
      "note": "Commissions are paid monthly for as long as your referrals remain active members."
    },
    "cta": {
      "text": "Learn More",
      "link": "/affiliate-program"
    }
  }',
  'Affiliate program section for Club66 Global',
  'affiliate, commission, referral, earnings',
  'published',
  'section',
  true
),

-- Call to Action Section
(
  'Home CTA Section',
  'home-cta-section',
  '{
    "title": "Ready to Join Club66?",
    "description": "Become a member today and unlock a world of exclusive benefits, discounts, and opportunities.",
    "buttons": [
      {
        "text": "Sign Up Now",
        "link": "/register",
        "variant": "primary",
        "className": "bg-club66-gold hover:bg-club66-gold/90 text-gray-900"
      },
      {
        "text": "Contact Us",
        "link": "/contact",
        "variant": "outline",
        "className": "bg-transparent border-white text-white hover:bg-white/10"
      }
    ],
    "availability": {
      "title": "Available in",
      "countries": [
        {
          "name": "Mali",
          "status": "Active",
          "statusColor": "bg-green-500"
        },
        {
          "name": "Nigeria",
          "status": "Coming Soon",
          "statusColor": "bg-gray-500"
        },
        {
          "name": "Ghana",
          "status": "Coming Soon",
          "statusColor": "bg-gray-500"
        },
        {
          "name": "Senegal",
          "status": "Coming Soon",
          "statusColor": "bg-gray-500"
        }
      ]
    }
  }',
  'Call to action section for Club66 Global',
  'CTA, join, membership, countries, availability',
  'published',
  'section',
  true
)

ON CONFLICT (slug) DO UPDATE SET
  content = EXCLUDED.content,
  meta_description = EXCLUDED.meta_description,
  meta_keywords = EXCLUDED.meta_keywords,
  updated_at = now();
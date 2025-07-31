import { CreditCard, Gift, Users, Award, Percent, Clock } from 'lucide-react';

interface CMSPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  meta_description?: string;
  meta_keywords?: string;
  status: string;
  page_type: string;
  is_featured?: boolean;
}

interface BenefitsProps {
  cmsContent?: CMSPage;
}

const Benefits = ({ cmsContent }: BenefitsProps) => {
  const benefits = [
    {
      icon: <Percent className="h-10 w-10 text-elverra-purple" />,
      title: 'Exclusive Discounts',
      description: 'Enjoy 5-20% discounts at thousands of partner businesses across West Africa.'
    },
    {
      icon: <CreditCard className="h-10 w-10 text-elverra-purple" />,
      title: 'Digital Value Card',
      description: 'Access your client benefits with a secure Zenika Card featuring QR verification.'
    },
    {
      icon: <Users className="h-10 w-10 text-elverra-purple" />,
      title: 'Professional Network',
      description: 'Connect with millions of clients and expand your professional network across West Africa.'
    },
    {
      icon: <Gift className="h-10 w-10 text-elverra-purple" />,
      title: 'Social Benefits',
      description: 'Choose from benefits like startup capital, payday loans, land plots, and more.'
    },
    {
      icon: <Award className="h-10 w-10 text-elverra-purple" />,
      title: 'Job Opportunities',
      description: 'Get priority access to job opportunities through our dedicated job center portal.'
    },
    {
      icon: <Clock className="h-10 w-10 text-elverra-purple" />,
      title: 'Flexible Payment Options',
      description: 'Pay via mobile money, bank transfers, or credit cards with instant confirmation.'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Member Benefits</h2>
          <p className="text-gray-600">
            Discover the advantages of being an Elverra Global member and how our services
            can enhance your lifestyle, career, and financial wellbeing across West Africa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow animate-slide-up"
              style={{animationDelay: `${index * 100}ms`}}
            >
              <div className="mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
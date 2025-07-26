
import Layout from '@/components/layout/Layout';
import PremiumBanner from '@/components/layout/PremiumBanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, Users, Globe, Award } from 'lucide-react';

const Partners = () => {
  const partners = [
    {
      id: 1,
      name: "West African Development Bank",
      type: "Financial Partner",
      description: "Supporting our financial services and micro-lending initiatives across the region.",
      logo: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      partnership_since: "2023",
      services: ["Microloans", "Financial Advisory", "Business Development"]
    },
    {
      id: 2,
      name: "African Telecommunications Union",
      type: "Technology Partner",
      description: "Enabling digital transformation and telecommunications infrastructure development.",
      logo: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      partnership_since: "2024",
      services: ["Digital Solutions", "Mobile Services", "Internet Connectivity"]
    },
    {
      id: 3,
      name: "Mali Chamber of Commerce",
      type: "Business Partner",
      description: "Facilitating business connections and trade opportunities for our clients.",
      logo: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      partnership_since: "2023",
      services: ["Business Networking", "Trade Facilitation", "Client Discounts"]
    }
  ];

  const partnerStats = [
    { icon: Building, label: "Partner Organizations", value: "25+" },
    { icon: Globe, label: "Countries Covered", value: "8" },
    { icon: Users, label: "Combined Network", value: "100K+" },
    { icon: Award, label: "Years of Partnership", value: "5+" }
  ];

  return (
    <Layout>
      <PremiumBanner
        title="Our Partners"
        description="Meet the organizations and institutions that help us deliver exceptional value to our clients."
        backgroundImage="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        showBackButton
        backUrl="/about"
      />

      <div className="py-16 bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Partnership Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {partnerStats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6 text-center">
                    <stat.icon className="h-8 w-8 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-purple-600 mb-2">{stat.value}</h3>
                    <p className="text-gray-600">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Strategic Partners</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We collaborate with leading organizations across Africa to provide 
                comprehensive services and benefits to our clients.
              </p>
            </div>

            {/* Partners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {partners.map((partner) => (
                <Card key={partner.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Building className="h-8 w-8 text-gray-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{partner.name}</CardTitle>
                        <Badge className="bg-purple-100 text-purple-800">
                          {partner.type}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>{partner.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Services</h4>
                      <div className="flex flex-wrap gap-2">
                        {partner.services.map((service, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-50">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Partnership since {partner.partnership_since}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Partnership CTA */}
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Become a Partner</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Join our network of partners and help us create more value for our clients. 
                  We're always looking for organizations that share our vision of 
                  empowering communities across Africa.
                </p>
                <div className="space-x-4">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                    Partnership Inquiry
                  </Button>
                  <Button size="lg" variant="outline">
                    Download Partner Guide
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Partners;

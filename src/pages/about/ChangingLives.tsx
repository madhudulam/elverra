
import Layout from '@/components/layout/Layout';
import PremiumBanner from '@/components/layout/PremiumBanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Quote, MapPin, Calendar, Users } from 'lucide-react';

const ChangingLives = () => {
  const stories = [
    {
      id: 1,
      name: "Aisha Konate",
      location: "Bamako, Mali",
      membershipTier: "Premium",
      story: "Through Club66's micro-loan program, I was able to expand my textile business. The 10% discount at partner stores helped me save money on raw materials, and now I employ 5 people in my community.",
      impact: "Business Growth",
      date: "2024-02-15",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: 2,
      name: "Ousmane Diarra",
      location: "Dakar, Senegal",
      membershipTier: "Elite",
      story: "The educational scholarships provided through Club66 helped my daughter pursue her engineering degree. She's now working as a software developer and giving back to our community.",
      impact: "Education",
      date: "2024-01-20",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: 3,
      name: "Mariam Toure",
      location: "Abidjan, Ivory Coast",
      membershipTier: "Premium",
      story: "As a single mother, the healthcare benefits and discounts at partner pharmacies have been life-changing. I can now afford quality healthcare for my children without financial stress.",
      impact: "Healthcare",
      date: "2024-03-10",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    }
  ];

  const impactStats = [
    { label: "Lives Impacted", value: "10,000+", icon: Users },
    { label: "Businesses Supported", value: "2,500+", icon: Users },
    { label: "Scholarships Awarded", value: "500+", icon: Users },
    { label: "Jobs Created", value: "1,200+", icon: Users }
  ];

  return (
    <Layout>
      <PremiumBanner
        title="Changing Lives"
        description="Real stories from our members showing how Club66 Global is making a positive impact across African communities."
        backgroundImage="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        showBackButton
        backUrl="/about"
      />

      <div className="py-16 bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Impact Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {impactStats.map((stat, index) => (
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
              <h2 className="text-3xl font-bold mb-4">Member Success Stories</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                These are just a few examples of how Club66 Global membership 
                is creating real, positive change in communities across Africa.
              </p>
            </div>

            {/* Success Stories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {stories.map((story) => (
                <Card key={story.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden">
                        <img 
                          src={story.image} 
                          alt={story.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{story.name}</CardTitle>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge className="bg-purple-100 text-purple-800">
                            {story.membershipTier} Member
                          </Badge>
                          <Badge variant="outline">
                            {story.impact}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative">
                      <Quote className="h-8 w-8 text-purple-200 absolute -top-2 -left-2" />
                      <p className="text-gray-700 italic pl-6">{story.story}</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {story.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(story.date).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Call to Action */}
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Be Part of the Change</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Join thousands of members who are already benefiting from Club66 Global's 
                  comprehensive membership program. Your success story could be next.
                </p>
                <div className="space-x-4">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                    Join Club66 Today
                  </Button>
                  <Button size="lg" variant="outline">
                    Share Your Story
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

export default ChangingLives;

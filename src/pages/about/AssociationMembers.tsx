
import Layout from '@/components/layout/Layout';
import PremiumBanner from '@/components/layout/PremiumBanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin } from 'lucide-react';

const AssociationMembers = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Amadou Traore",
      position: "Founder & CEO",
      department: "Executive",
      bio: "Visionary leader with 15+ years in African business development and financial services.",
      email: "amadou@club66global.com",
      phone: "+223 XX XX XX XX",
      location: "Bamako, Mali",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: 2,
      name: "Fatima Diallo",
      position: "Chief Operating Officer",
      department: "Operations",
      bio: "Expert in operational excellence and business process optimization across multiple African markets.",
      email: "fatima@club66global.com",
      phone: "+223 XX XX XX XX",
      location: "Bamako, Mali",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: 3,
      name: "Ibrahim Kone",
      position: "Head of Technology",
      department: "Technology",
      bio: "Technology innovator specializing in fintech solutions and digital transformation for African markets.",
      email: "ibrahim@club66global.com",
      phone: "+223 XX XX XX XX",
      location: "Bamako, Mali",
      image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    }
  ];

  return (
    <Layout>
      <PremiumBanner
        title="Our Team"
        description="Meet the dedicated professionals driving Club66 Global's mission to empower African communities."
        backgroundImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        showBackButton
        backUrl="/about"
      />

      <div className="py-16 bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Leadership Team</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our experienced team combines deep knowledge of African markets with 
                global expertise in technology and financial services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <Card key={member.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardTitle className="text-xl">{member.name}</CardTitle>
                    <CardDescription className="text-lg font-medium text-purple-600">
                      {member.position}
                    </CardDescription>
                    <Badge className="bg-purple-100 text-purple-800 w-fit mx-auto">
                      {member.department}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-purple-600 mr-2" />
                        <span className="text-gray-600">{member.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-purple-600 mr-2" />
                        <span className="text-gray-600">{member.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-purple-600 mr-2" />
                        <span className="text-gray-600">{member.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AssociationMembers;

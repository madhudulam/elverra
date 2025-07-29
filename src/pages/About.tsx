
import Layout from '@/components/layout/Layout';
import PremiumBanner from '@/components/layout/PremiumBanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Target, Heart, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const About = () => {
  const { toast } = useToast();
  const [pageContent, setPageContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const { data, error } = await supabase
        .from('cms_pages')
        .select('*')
        .eq('slug', 'about')
        .eq('status', 'published')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching about content:', error);
        return;
      }

      if (data) {
        setPageContent(data);
      }
    } catch (error: any) {
      console.error('Error fetching about content:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PremiumBanner
        title="About Elverra Global"
        description="Learn about our mission, vision, and commitment to empowering African communities through innovative client benefits."
        backgroundImage="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      />

      <div className="py-16 bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Dynamic Content Section */}
            {pageContent && (
              <div className="text-center mb-16">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardContent className="p-8 md:p-12">
                    <div 
                      className="prose prose-lg max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ __html: pageContent.content }}
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Our Team</CardTitle>
                  <CardDescription>Meet the people behind Elverra</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/about/association-members">View Team</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Our Projects</CardTitle>
                  <CardDescription>Community impact initiatives</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/about/projects">View Projects</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <Globe className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Partners</CardTitle>
                  <CardDescription>Our trusted partners</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/about/partners">View Partners</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <Heart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Impact Stories</CardTitle>
                  <CardDescription>Lives we've changed</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/about/changing-lives">View Stories</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Contact Section */}
            <div className="text-center">
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Get in Touch</h3>
                  <p className="text-gray-600 mb-6">
                    Have questions about our services or want to learn more? 
                    We'd love to hear from you.
                  </p>
                  <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
                    <Link to="/about/contact">Contact Us</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;

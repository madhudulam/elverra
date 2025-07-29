
import Layout from '@/components/layout/Layout';
import PremiumBanner from '@/components/layout/PremiumBanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ProjectCard from '@/components/projects/ProjectCard';
import { useToast } from '@/hooks/use-toast';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('project_funding')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContribute = async (projectId: string) => {
    try {
      // Mock contribution process
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Success",
        description: "Thank you for your contribution!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process contribution",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <PremiumBanner
        title="Our Projects"
        description="Discover the impactful projects we're working on to create positive change across West Africa."
        backgroundImage="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        showBackButton
        backUrl="/about"
      />

      <div className="py-16 bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Current Projects</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We're committed to making a positive impact through various initiatives 
                focused on education, business development, and community empowerment across West Africa.
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading projects...</p>
              </div>
            ) : projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    onContribute={handleContribute}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No active projects at the moment.</p>
              </div>
            )}

            <div className="text-center mt-12">
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Want to Contribute?</h3>
                  <p className="text-gray-600 mb-6">
                    Join us in making a difference. Your contribution, no matter the size, 
                    helps us create positive change in communities across Africa.
                  </p>
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                    Contribute to Projects
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

export default Projects;

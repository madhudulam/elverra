import Layout from '@/components/layout/Layout';
import DatabaseTest from '@/components/debug/DatabaseTest';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { toast } from 'sonner';

const Debug = () => {
  const [creating, setCreating] = useState(false);

  const createAdminUser = async () => {
    setCreating(true);
    try {
      // Create admin user
      const { data, error } = await supabase.auth.signUp({
        email: 'admin@elverraglobal.com',
        password: 'Admin123!',
        options: {
          data: {
            full_name: 'Admin User',
            user_type: 'admin'
          }
        }
      });

      if (error) {
        console.error('Error creating admin user:', error);
        toast.error(`Failed to create admin user: ${error.message}`);
        return;
      }

      if (data.user) {
        // Assign admin role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: data.user.id,
            role: 'admin'
          });

        if (roleError) {
          console.error('Error assigning admin role:', roleError);
          toast.error(`Failed to assign admin role: ${roleError.message}`);
        } else {
          toast.success('Admin user created successfully! You can now login with admin@elverraglobal.com / Admin123!');
        }
      }
    } catch (error) {
      console.error('Error in admin user creation:', error);
      toast.error('Failed to create admin user');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Layout>
      <div className="py-16 bg-gradient-to-br from-purple-50 to-purple-100 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8">Database Debug Page</h1>
            
            {/* Admin User Creation */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Admin User Setup</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Create the admin user account with email: admin@elverraglobal.com and password: Admin123!
                  </p>
                  <Button 
                    onClick={createAdminUser} 
                    disabled={creating}
                    className="w-full"
                  >
                    {creating ? 'Creating Admin User...' : 'Create Admin User'}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <DatabaseTest />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Debug;

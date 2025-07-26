import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import PremiumBanner from '@/components/layout/PremiumBanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { QrCode, Copy, Users, DollarSign, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface Agent {
  id: string;
  agent_type: 'individual' | 'business' | 'organization';
  referral_code: string;
  qr_code: string;
  total_commissions: number;
  commissions_withdrawn: number;
  commissions_pending: number;
  is_active: boolean;
}

const Agents = () => {
  const { user } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [agentType, setAgentType] = useState<'individual' | 'business' | 'organization'>('individual');
  const queryClient = useQueryClient();

  const { data: agent, isLoading } = useQuery({
    queryKey: ['agent', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as Agent | null;
    },
    enabled: !!user
  });

  const { data: referrals } = useQuery({
    queryKey: ['referrals', agent?.id],
    queryFn: async () => {
      if (!agent) return [];
      
      const { data, error } = await supabase
        .from('referrals')
        .select(`
          *,
          profiles:referred_user_id (full_name, created_at)
        `)
        .eq('agent_id', agent.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!agent
  });

  const registerAgentMutation = useMutation({
    mutationFn: async (type: 'individual' | 'business' | 'organization') => {
      if (!user) throw new Error('Please login to register as an agent');

      // Provide a placeholder referral_code that the trigger will override
      const { error } = await supabase
        .from('agents')
        .insert({
          user_id: user.id,
          agent_type: type,
          is_active: true,
          referral_code: 'TEMP' // This will be overridden by the database trigger
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Successfully registered as an agent!');
      queryClient.invalidateQueries({ queryKey: ['agent'] });
      setIsRegistering(false);
    },
    onError: (error: any) => {
      toast.error('Failed to register as agent. Please try again.');
      console.error('Agent registration error:', error);
    }
  });

  const withdrawCommissionMutation = useMutation({
    mutationFn: async () => {
      if (!agent) throw new Error('No agent profile found');

      // In a real app, this would integrate with a payment processor
      // For now, we'll just mark commissions as withdrawn
      const { error } = await supabase
        .from('agents')
        .update({
          commissions_withdrawn: agent.commissions_withdrawn + agent.commissions_pending,
          commissions_pending: 0
        })
        .eq('id', agent.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Commission withdrawal request submitted!');
      queryClient.invalidateQueries({ queryKey: ['agent'] });
    },
    onError: (error: any) => {
      toast.error('Failed to withdraw commissions. Please try again.');
      console.error('Withdrawal error:', error);
    }
  });

  const copyReferralLink = () => {
    if (!agent) return;
    
    const referralLink = `${window.location.origin}/register?ref=${agent.referral_code}`;
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied to clipboard!');
  };

  const handleRegisterAgent = () => {
    registerAgentMutation.mutate(agentType);
  };

  if (!user) {
    return (
      <Layout>
        <PremiumBanner
          title="Agent Program"
          description="Join our referral program and earn commissions by promoting Club66 memberships."
          backgroundImage="https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        />
        <div className="py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Please login to access the agent program</h2>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <a href="/login">Login Now</a>
          </Button>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PremiumBanner
        title="Agent Program"
        description="Earn 10% commission on every successful referral. Turn your network into income!"
        backgroundImage="https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      />

      <div className="py-16 bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="container mx-auto px-4">
          {!agent ? (
            /* Agent Registration */
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Become an Agent</CardTitle>
                  <CardDescription>
                    Register as an agent and start earning commissions by referring new members
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!isRegistering ? (
                    <div className="text-center space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 border rounded-lg">
                          <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                          <h3 className="font-medium">Individual Agent</h3>
                          <p className="text-sm text-gray-600">Perfect for individuals</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                          <h3 className="font-medium">Business Agent</h3>
                          <p className="text-sm text-gray-600">For business owners</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <DollarSign className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                          <h3 className="font-medium">Organization Agent</h3>
                          <p className="text-sm text-gray-600">For large scale operations</p>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium text-green-800 mb-2">How it works:</h4>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>• Get your unique referral code and QR code</li>
                          <li>• Share with potential members</li>
                          <li>• Earn CFA 1,000 for each successful registration</li>
                          <li>• Withdraw your commissions anytime</li>
                        </ul>
                      </div>

                      <Button 
                        onClick={() => setIsRegistering(true)}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Start Registration
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="agentType">Select Agent Type</Label>
                        <Select value={agentType} onValueChange={(value: any) => setAgentType(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="individual">Individual Agent</SelectItem>
                            <SelectItem value="business">Business Agent</SelectItem>
                            <SelectItem value="organization">Organization Agent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex space-x-2">
                        <Button 
                          onClick={handleRegisterAgent}
                          disabled={registerAgentMutation.isPending}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          {registerAgentMutation.isPending ? 'Registering...' : 'Complete Registration'}
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => setIsRegistering(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Agent Dashboard */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Stats Cards */}
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <DollarSign className="h-8 w-8 text-green-600" />
                      <div className="ml-3">
                        <p className="text-sm text-gray-600">Total Commissions</p>
                        <p className="text-lg font-semibold">CFA {agent.total_commissions.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <TrendingUp className="h-8 w-8 text-blue-600" />
                      <div className="ml-3">
                        <p className="text-sm text-gray-600">Pending</p>
                        <p className="text-lg font-semibold">CFA {agent.commissions_pending.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <Users className="h-8 w-8 text-purple-600" />
                      <div className="ml-3">
                        <p className="text-sm text-gray-600">Referrals</p>
                        <p className="text-lg font-semibold">{referrals?.length || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <QrCode className="h-8 w-8 text-orange-600" />
                      <div className="ml-3">
                        <p className="text-sm text-gray-600">Agent Type</p>
                        <Badge className="mt-1">{agent.agent_type}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Referral Tools */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Referral Tools</CardTitle>
                    <CardDescription>Share these with potential members</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Referral Code</Label>
                      <div className="flex space-x-2">
                        <Input value={agent.referral_code} readOnly />
                        <Button variant="outline" onClick={copyReferralLink}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label>Referral Link</Label>
                      <div className="flex space-x-2">
                        <Input 
                          value={`${window.location.origin}/register?ref=${agent.referral_code}`}
                          readOnly 
                        />
                        <Button variant="outline" onClick={copyReferralLink}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {agent.commissions_pending > 0 && (
                      <div className="pt-4">
                        <Button 
                          onClick={() => withdrawCommissionMutation.mutate()}
                          disabled={withdrawCommissionMutation.isPending}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {withdrawCommissionMutation.isPending ? 'Processing...' : `Withdraw CFA ${agent.commissions_pending.toLocaleString()}`}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Referrals */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Recent Referrals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {referrals && referrals.length > 0 ? (
                      <div className="space-y-3">
                        {referrals.slice(0, 5).map((referral: any) => (
                          <div key={referral.id} className="flex justify-between items-center p-3 border rounded">
                            <div>
                              <p className="font-medium">{referral.profiles?.full_name || 'New Member'}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(referral.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-green-600">CFA {referral.commission_amount.toLocaleString()}</p>
                              <Badge variant={referral.commission_paid ? 'default' : 'secondary'}>
                                {referral.commission_paid ? 'Paid' : 'Pending'}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-4">No referrals yet</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* QR Code Section */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>QR Code</CardTitle>
                    <CardDescription>Let people scan to register</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="bg-white p-4 rounded-lg inline-block">
                      <QrCode className="h-32 w-32 mx-auto" />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      QR code generation coming soon
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Agents;

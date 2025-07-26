import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, TrendingUp, DollarSign, UserCheck, Search, Eye, CheckCircle, XCircle, MoreHorizontal } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AgentPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState<any>(null);

  // Fetch agents data
  const { data: agents, isLoading: agentsLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch referrals data
  const { data: referrals, isLoading: referralsLoading } = useQuery({
    queryKey: ['referrals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const stats = [
    {
      title: "Total Agents",
      value: agents?.length || 0,
      change: "+5",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Agents",
      value: agents?.filter(agent => agent.is_active)?.length || 0,
      change: "+3",
      icon: UserCheck,
      color: "text-green-600"
    },
    {
      title: "Total Commissions",
      value: `₣${agents?.reduce((sum, agent) => sum + (agent.total_commissions || 0), 0).toLocaleString() || 0}`,
      change: "+12%",
      icon: DollarSign,
      color: "text-purple-600"
    },
    {
      title: "Pending Payouts",
      value: `₣${agents?.reduce((sum, agent) => sum + (agent.commissions_pending || 0), 0).toLocaleString() || 0}`,
      change: "+8%",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  const filteredAgents = agents?.filter(agent => {
    const matchesSearch = agent.referral_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && agent.is_active) ||
                         (statusFilter === 'inactive' && !agent.is_active);
    return matchesSearch && matchesStatus;
  }) || [];

  const handleAgentAction = async (agentId: string, action: 'activate' | 'deactivate') => {
    try {
      const { error } = await supabase
        .from('agents')
        .update({ is_active: action === 'activate' })
        .eq('id', agentId);

      if (error) throw error;
      toast.success(`Agent ${action}d successfully`);
    } catch (error: any) {
      toast.error(error.message || `Failed to ${action} agent`);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Agent Management Panel</h1>
          <p className="text-gray-600">Manage agents, referrals, and commission payouts</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <Badge variant="secondary" className="mt-1">
                        {stat.change}
                      </Badge>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="agents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="commissions">Commissions</TabsTrigger>
          </TabsList>

          {/* Agents Tab */}
          <TabsContent value="agents">
            <Card>
              <CardHeader>
                <CardTitle>Agent Management</CardTitle>
                <CardDescription>Manage agent profiles and status</CardDescription>
                
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search agents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Agents</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {agentsLoading ? (
                  <div className="text-center py-8">Loading agents...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Agent</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Referral Code</TableHead>
                        <TableHead>Total Commission</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAgents.map((agent) => (
                        <TableRow key={agent.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">Agent {agent.referral_code}</div>
                              <div className="text-sm text-gray-500">ID: {agent.id.slice(0, 8)}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {agent.agent_type}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono">{agent.referral_code}</TableCell>
                          <TableCell>₣{agent.total_commissions?.toLocaleString() || 0}</TableCell>
                          <TableCell>
                            <Badge variant={agent.is_active ? "default" : "secondary"}>
                              {agent.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedAgent(agent)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Agent Details</DialogTitle>
                                    <DialogDescription>
                                      Detailed information about Agent {selectedAgent?.referral_code}
                                    </DialogDescription>
                                  </DialogHeader>
                                  {selectedAgent && (
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <label className="text-sm font-medium">Agent ID</label>
                                          <p>{selectedAgent.id}</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium">User ID</label>
                                          <p>{selectedAgent.user_id}</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium">Referral Code</label>
                                          <p>{selectedAgent.referral_code}</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium">Agent Type</label>
                                          <p className="capitalize">{selectedAgent.agent_type}</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium">Total Commissions</label>
                                          <p>₣{selectedAgent.total_commissions?.toLocaleString() || 0}</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium">Pending</label>
                                          <p>₣{selectedAgent.commissions_pending?.toLocaleString() || 0}</p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              
                              {agent.is_active ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAgentAction(agent.id, 'deactivate')}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAgentAction(agent.id, 'activate')}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals">
            <Card>
              <CardHeader>
                <CardTitle>Referral Activity</CardTitle>
                <CardDescription>Track agent referrals and performance</CardDescription>
              </CardHeader>
              <CardContent>
                {referralsLoading ? (
                  <div className="text-center py-8">Loading referrals...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Agent</TableHead>
                        <TableHead>Referral Code</TableHead>
                        <TableHead>Commission</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {referrals?.map((referral) => (
                        <TableRow key={referral.id}>
                          <TableCell>Agent {referral.agent_id.slice(0, 8)}</TableCell>
                          <TableCell className="font-mono">REF-{referral.id.slice(0, 8)}</TableCell>
                          <TableCell>₣{referral.commission_amount?.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={referral.commission_paid ? "default" : "secondary"}>
                              {referral.commission_paid ? "Paid" : "Pending"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(referral.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Commissions Tab */}
          <TabsContent value="commissions">
            <Card>
              <CardHeader>
                <CardTitle>Commission Management</CardTitle>
                <CardDescription>Process commission payments and track earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Commission management features coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AgentPanel;
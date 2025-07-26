
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import DashboardStats from '@/components/dashboard/DashboardStats';
import MembershipStatus from '@/components/dashboard/MembershipStatus';
import MemberDigitalCard from '@/components/dashboard/MemberDigitalCard';
import QuickLinks from '@/components/dashboard/QuickLinks';
import JobCenter from '@/components/dashboard/JobCenter';
import ProjectsAndScholarships from '@/components/dashboard/ProjectsAndScholarships';
import CompetitionParticipation from '@/components/dashboard/CompetitionParticipation';
import DiscountUsage from '@/components/dashboard/DiscountUsage';
import PaymentHistory from '@/components/dashboard/PaymentHistory';
import CurrencyConverterWidget from '@/components/dashboard/CurrencyConverterWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Star, TrendingUp, Briefcase } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useJobApplications } from '@/hooks/useJobs';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const { getUserApplications } = useJobApplications();
  
  const [applications, setApplications] = useState<any[]>([]);
  const [membership, setMembership] = useState<any>(null);
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    interviewsScheduled: 0,
    savedJobs: 0
  });

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch applications
      const applicationsData = await getUserApplications();
      setApplications(applicationsData.slice(0, 5)); // Show only recent 5

      // Calculate stats
      const pending = applicationsData.filter(app => app.status === 'pending').length;
      const interviews = applicationsData.filter(app => app.status === 'interview').length;
      
      // Fetch saved jobs count
      const { data: bookmarks } = await supabase
        .from('job_bookmarks')
        .select('id')
        .eq('user_id', user.id);

      // Fetch membership info
      const { data: membershipData } = await supabase
        .from('memberships')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setMembership(membershipData);
      setStats({
        totalApplications: applicationsData.length,
        pendingApplications: pending,
        interviewsScheduled: interviews,
        savedJobs: bookmarks?.length || 0
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Mock data for components that need props
  const mockCompetitions = [
    { id: '1', name: 'Tech Innovation Challenge', date: '2024-01-15', status: 'Participated' },
    { id: '2', name: 'Business Plan Competition', date: '2024-02-20', status: 'Voted' }
  ];

  const mockDiscountUsage = [
    { id: '1', date: '2024-01-10', merchant: 'Tech Store', discount: '10%', saved: 'CFA 2,500' },
    { id: '2', date: '2024-01-05', merchant: 'Restaurant Mali', discount: '15%', saved: 'CFA 1,800' }
  ];

  const mockPayments = [
    { id: 'PAY001', date: '2024-01-01', description: 'Monthly Membership', amount: 'CFA 5,000', status: 'Paid' as const },
    { id: 'PAY002', date: '2023-12-01', description: 'Monthly Membership', amount: 'CFA 5,000', status: 'Paid' as const }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'interview':
        return <Badge className="bg-blue-500">Interview</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'accepted':
        return <Badge className="bg-green-500">Accepted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffInDays / 30)} month${Math.floor(diffInDays / 30) > 1 ? 's' : ''} ago`;
  };

  if (authLoading || profileLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {profile?.full_name || user.email?.split('@')[0] || 'Member'}!
              </h1>
              <p className="text-gray-600">
                Here's what's happening with your Club66 Global membership and job applications.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Briefcase className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-1">{stats.totalApplications}</div>
                  <div className="text-gray-600">Total Applications</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="bg-yellow-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="text-3xl font-bold text-yellow-600 mb-1">{stats.pendingApplications}</div>
                  <div className="text-gray-600">Pending Reviews</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-1">{stats.interviewsScheduled}</div>
                  <div className="text-gray-600">Interviews</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="bg-purple-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Star className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mb-1">{stats.savedJobs}</div>
                  <div className="text-gray-600">Saved Jobs</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Recent Applications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Recent Job Applications</span>
                      <Button variant="outline" size="sm" asChild>
                        <a href="/job-dashboard/employee">View All</a>
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {applications.length > 0 ? (
                      <div className="space-y-4">
                        {applications.map((application) => (
                          <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <h3 className="font-semibold">{application.jobs?.title}</h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                <span className="flex items-center">
                                  <Briefcase className="h-4 w-4 mr-1" />
                                  {application.jobs?.company}
                                </span>
                                <span className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {application.jobs?.location}
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  Applied {getTimeAgo(application.applied_at)}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(application.status)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Briefcase className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
                        <p className="text-gray-500 mb-4">Start applying to jobs to see your applications here.</p>
                        <Button asChild>
                          <a href="/jobs">Browse Jobs</a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Membership Status */}
                <MembershipStatus 
                  membershipTier={membership?.tier || 'Essential'}
                  memberSince={membership?.start_date ? new Date(membership.start_date).toLocaleDateString() : 'N/A'}
                  expiryDate={membership?.expiry_date ? new Date(membership.expiry_date).toLocaleDateString() : 'N/A'}
                  nextPayment="Next month"
                />

                {/* Projects and Scholarships */}
                <ProjectsAndScholarships />
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Digital Membership Card */}
                <MemberDigitalCard 
                  memberName={profile?.full_name || user.email?.split('@')[0] || 'Member'}
                  memberID={membership?.member_id || 'C66-ML-00000'}
                  expiryDate={membership?.expiry_date ? new Date(membership.expiry_date).toLocaleDateString() : 'N/A'}
                  membershipTier={membership?.tier || 'Essential'}
                  profileImage={profile?.profile_image_url}
                  address={profile?.address || `${profile?.city || ''}, ${profile?.country || ''}`.replace(', ,', '').trim() || 'Address not provided'}
                />

                {/* Job Center Quick Access */}
                <JobCenter />

                {/* Quick Links */}
                <QuickLinks />

                {/* Currency Converter */}
                <CurrencyConverterWidget />

                {/* Competition Participation */}
                <CompetitionParticipation competitions={mockCompetitions} />
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              <DiscountUsage discountUsage={mockDiscountUsage} />
              <PaymentHistory 
                payments={mockPayments}
                nextPaymentDate="February 1, 2024"
                nextPaymentAmount="CFA 5,000"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

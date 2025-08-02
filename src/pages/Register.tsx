import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import PremiumBanner from '@/components/layout/PremiumBanner';
import UserTypeSelector from '@/components/auth/UserTypeSelector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get('ref');
  const planFromUrl = searchParams.get('plan');
  const { signUp } = useAuth();
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Mali',
    password: '',
    confirmPassword: '',
    tier: (planFromUrl || 'essential') as 'essential' | 'premium' | 'vip',
    physical_card_requested: false,
    referral_code: referralCode || '',
    user_type: 'member'
  });

  const membershipTiers = {
    essential: {
      name: 'Essential',
      registration: 10000,
      monthly: 1000,
      discount: 5,
      description: 'Perfect for individuals getting started'
    },
    premium: {
      name: 'Premium',
      registration: 10000,
      monthly: 2000,
      discount: 10,
      description: 'Great for regular users'
    },
    vip: {
      name: 'VIP',
      registration: 10000,
      monthly: 5000,
      discount: 20,
      description: 'Maximum benefits and exclusive access'
    }
  };

  const registerMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      console.log('🚀 Starting registration process...', { email: data.email, user_type: data.user_type });

      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (data.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Generate a unique email if none provided
      const email = data.email.trim() || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}@club66.org`;

      // Sign up the user with additional metadata
      console.log('📝 Calling Supabase signUp...');
      const { data: authData, error: authError } = await signUp(email, data.password, {
        full_name: data.full_name,
        phone: data.phone,
        user_type: data.user_type
      });

      console.log('✅ SignUp result:', {
        success: !authError,
        userId: authData.user?.id,
        email: authData.user?.email,
        error: authError?.message
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Registration failed');

      // Create profile
      console.log('👤 Creating profile for user:', authData.user.id);
      const profileData = {
        id: authData.user.id,
        full_name: data.full_name,
        phone: data.phone,
        address: data.address,
        city: data.city,
        country: data.country
      };

      const { data: insertedProfile, error: profileError } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      console.log('✅ Profile creation result:', {
        success: !profileError,
        profile: insertedProfile,
        error: profileError?.message
      });

      if (profileError) throw profileError;

      // Create membership only for regular members
      if (data.user_type === 'member') {
        console.log('🎫 Creating membership for user:', authData.user.id);
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);

        const membershipData = {
          user_id: authData.user.id,
          tier: data.tier,
          physical_card_requested: data.physical_card_requested,
          expiry_date: expiryDate.toISOString()
        };

        const { data: insertedMembership, error: membershipError } = await supabase
          .from('memberships')
          .insert(membershipData)
          .select()
          .single();

        console.log('✅ Membership creation result:', {
          success: !membershipError,
          membership: insertedMembership,
          error: membershipError?.message
        });

        if (membershipError) throw membershipError;
      }

      console.log('🎉 Registration completed successfully!');
      return { authData, profileData: insertedProfile };

      // Handle referral if provided
      if (data.referral_code) {
        const { data: agent } = await supabase
          .from('agents')
          .select('id')
          .eq('referral_code', data.referral_code)
          .single();

        if (agent) {
          const { error: referralError } = await supabase
            .from('referrals')
            .insert({
              agent_id: agent.id,
              referred_user_id: authData.user.id,
              commission_amount: 1000 // 10% of 10,000 CFA registration fee
            });

          if (referralError) console.error('Referral creation failed:', referralError);
        }
      }

      return authData;
    },
    onSuccess: (data) => {
      toast.success('Registration successful! Please check your email for verification.');
      
      // Always redirect to thank you page after registration
      navigate('/thank-you');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Registration failed. Please try again.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(formData);
  };

  const selectedTier = membershipTiers[formData.tier];
  const totalFirstPayment = selectedTier.registration + selectedTier.monthly;
  const showMembershipOptions = formData.user_type === 'member';

  return (
    <Layout>
      <PremiumBanner
        title="Join Elverra Global"
        description="Become a client and enjoy exclusive discounts, competitions, and networking opportunities."
        backgroundImage="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        variant="compact"
      />

      <div className="py-16 bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="container mx-auto px-4 max-w-full">
          <div className="max-w-7xl mx-auto">
            <Tabs value={formData.user_type} onValueChange={(value) => setFormData(prev => ({ ...prev, user_type: value }))}>
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="member">Regular Client</TabsTrigger>
                <TabsTrigger value="employee">Job Seeker / Employee</TabsTrigger>
                <TabsTrigger value="employer">Employer / Company</TabsTrigger>
                <TabsTrigger value="partner">Business Partner</TabsTrigger>
              </TabsList>

              <TabsContent value={formData.user_type} className="mt-6">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Registration Form */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Create Your Account</CardTitle>
                        <CardDescription>
                          Fill in your details to join Elverra Global
                          {referralCode && (
                            <Badge className="ml-2 bg-green-100 text-green-800">
                              Referral Code: {referralCode}
                            </Badge>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="full_name">Full Name *</Label>
                        <Input
                          id="full_name"
                          value={formData.full_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                          required
                        />
                      </div>
                       <div>
                         <Label htmlFor="email">Email (Optional)</Label>
                         <Input
                           id="email"
                           type="email"
                           value={formData.email}
                           onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                           placeholder="Enter your email address"
                         />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mali">Mali</SelectItem>
                          <SelectItem value="Senegal">Senegal</SelectItem>
                          <SelectItem value="Burkina Faso">Burkina Faso</SelectItem>
                          <SelectItem value="Ivory Coast">Ivory Coast</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="password">Password *</Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    {showMembershipOptions && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="physical_card"
                          checked={formData.physical_card_requested}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, physical_card_requested: checked as boolean }))}
                        />
                        <Label htmlFor="physical_card">
                          Request physical membership card (optional)
                        </Label>
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
                    </Button>

                    <div className="text-center">
                      <span className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-purple-600 hover:underline">
                          Sign in here
                        </Link>
                      </span>
                    </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Membership Selection - Only show for regular members */}
                  {showMembershipOptions && (
                    <div className="lg:col-span-1">
                      <Card>
                        <CardHeader>
                          <CardTitle>Choose Your Membership</CardTitle>
                          <CardDescription>Select the tier that works best for you</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                      {Object.entries(membershipTiers).map(([key, tier]) => (
                        <div
                          key={key}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            formData.tier === key 
                              ? 'border-purple-500 bg-purple-50' 
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                          onClick={() => setFormData(prev => ({ ...prev, tier: key as any }))}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{tier.name}</h4>
                            <Badge className="bg-green-100 text-green-800">
                              {tier.discount}% OFF
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{tier.description}</p>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Registration Fee:</span>
                              <span>CFA {tier.registration.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Monthly Fee:</span>
                              <span>CFA {tier.monthly.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center font-medium">
                          <span>First Payment Total:</span>
                          <span className="text-lg text-purple-600">
                            CFA {totalFirstPayment.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Registration fee + First month
                        </p>
                      </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default Register;
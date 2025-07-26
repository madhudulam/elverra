import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Camera, Save, Edit, CreditCard, History, Settings, Gift, ShoppingBag, Users, Briefcase, HelpCircle,
  Download, Bell, Shield, Eye, EyeOff, Phone, Mail, MessageSquare, Star, TrendingUp, Calendar,
  DollarSign, Percent, Award, RefreshCw, ExternalLink, Lock, Smartphone, Package, Key, 
  CreditCard as CreditCardIcon, AlertCircle, CheckCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';
import ProductManagement from '@/components/products/ProductManagement';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const MyAccount = () => {
  const { user } = useAuth();
  const { profile, loading, updateProfile } = useUserProfile();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: '',
    country: 'Mali'
  });
  const [membership, setMembership] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [cardActivated, setCardActivated] = useState(true);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [showActivationDialog, setShowActivationDialog] = useState(false);
  const [showRenewalDialog, setShowRenewalDialog] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [activationCode, setActivationCode] = useState('');

  // Mock data for demonstration
  const mockData = {
    recentTransactions: [
      { id: '1', date: '2024-01-15', description: 'Monthly Membership', amount: 'CFA 5,000', status: 'Completed' },
      { id: '2', date: '2024-01-10', description: 'Discount at TechMart', amount: 'CFA -2,500', status: 'Completed' }
    ],
    availableRewards: [
      { id: '1', title: '10% Off Electronics', points: 500, category: 'Shopping' },
      { id: '2', title: 'Free Coffee Voucher', points: 200, category: 'Food & Beverage' }
    ],
    totalSavings: 125000,
    rewardsPoints: 1250,
    discountsUsed: 15,
    affiliateStats: {
      referrals: 8,
      earnings: 45000,
      pendingCommission: 12000
    }
  };

  const handleCardRenewal = () => {
    setShowRenewalDialog(true);
  };

  const handleDownloadCard = async () => {
    try {
      // In a real implementation, this would generate and download a PDF card
      toast.success('Card download started. Check your downloads folder.');
      
      // Mock download functionality
      const link = document.createElement('a');
      link.href = 'data:text/plain;charset=utf-8,ZENIKA Digital Card - ' + (profile?.full_name || 'Member');
      link.download = 'zenika-card.txt';
      link.click();
    } catch (error) {
      toast.error('Failed to download card');
    }
  };

  const handleCardActivation = async () => {
    if (!activationCode || activationCode.length < 6) {
      toast.error('Please enter a valid activation code');
      return;
    }

    try {
      // Mock activation process
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCardActivated(true);
      setShowActivationDialog(false);
      setActivationCode('');
      toast.success('Card activated successfully!');
    } catch (error) {
      toast.error('Failed to activate card');
    }
  };

  const handlePinChange = async () => {
    if (!currentPin || !newPin || !confirmPin) {
      toast.error('Please fill in all PIN fields');
      return;
    }

    if (newPin !== confirmPin) {
      toast.error('New PIN and confirmation do not match');
      return;
    }

    if (newPin.length !== 4) {
      toast.error('PIN must be 4 digits');
      return;
    }

    try {
      // Mock PIN change process
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowPinDialog(false);
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
      toast.success('PIN changed successfully!');
    } catch (error) {
      toast.error('Failed to change PIN');
    }
  };

  const handleRenewalRequest = async () => {
    try {
      // Mock renewal process
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowRenewalDialog(false);
      toast.success('Renewal request submitted successfully! You will receive confirmation via email.');
    } catch (error) {
      toast.error('Failed to submit renewal request');
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMembership();
  }, [user, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        country: profile.country || 'Mali'
      });
    }
  }, [profile]);

  const fetchMembership = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('memberships')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        throw error;
      }
      
      setMembership(data);
    } catch (error) {
      console.error('Error fetching membership:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('club66')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('club66')
        .getPublicUrl(filePath);

      await updateProfile({ profile_image_url: publicUrl });
      toast.success('Profile picture updated successfully!');
    } catch (error) {
      toast.error('Error uploading image');
      console.error('Error:', error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600 mt-2">Manage your Elverra Global membership and services</p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-10 overflow-x-auto">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="rewards">Discounts</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="affiliate">Affiliate</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Membership Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {membership ? (
                        <>
                          <p className="text-lg font-semibold">{membership.tier} Member</p>
                          <p className="text-sm text-gray-500">
                            Expires: {new Date(membership.expiry_date).toLocaleDateString()}
                          </p>
                        </>
                      ) : (
                        <p>No active membership</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Rewards Points</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{mockData.rewardsPoints}</div>
                      <p className="text-sm text-gray-500">Points earned from purchases and activities</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Total Savings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">CFA {mockData.totalSavings}</div>
                      <p className="text-sm text-gray-500">Savings from discounts and promotions</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockData.recentTransactions.map(transaction => (
                        <tr key={transaction.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.description}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.amount}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cards Tab - Exact ZENIKA Design */}
          <TabsContent value="cards" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  My ZENIKA Card
                  <div className="flex items-center gap-2">
                    {cardActivated ? (
                      <Badge className="bg-green-500">Active</Badge>
                    ) : (
                      <Badge variant="destructive">Inactive</Badge>
                    )}
                    <Badge variant="outline">{membership?.tier || 'Essential'}</Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* ZENIKA Card - Exact Design from Upload */}
                <div className={`relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-3xl ${
                  membership?.tier === 'Elite' 
                    ? 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600' 
                    : membership?.tier === 'Premium'
                    ? 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600'
                    : 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700'
                }`} style={{
                  border: membership?.tier === 'Elite' 
                    ? '3px solid #22c55e' 
                    : membership?.tier === 'Premium'
                    ? '3px solid #22c55e'
                    : '3px solid #3b82f6',
                  aspectRatio: '1.6/1',
                  maxWidth: '400px'
                }}>
                  {/* Background wave */}
                  <div className="absolute inset-0">
                    <svg viewBox="0 0 400 250" className="w-full h-full">
                      <path d="M0,150 Q100,100 200,120 T400,110 L400,250 L0,250 Z" fill="rgba(255,255,255,0.1)" />
                    </svg>
                  </div>
                  
                  {/* Globe logo */}
                  <div className="absolute top-4 right-4 w-16 h-16">
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 bg-blue-500 rounded-full opacity-80"></div>
                      <div className="absolute top-1 right-1 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 bg-white rounded-full opacity-90"></div>
                      </div>
                    </div>
                  </div>

                  <div className="relative p-6 h-full flex flex-col">
                    {/* ZENIKA Header */}
                    <div className="mb-8">
                      <h2 className="text-3xl font-bold tracking-wider" style={{ 
                        color: membership?.tier === 'Elite' 
                          ? '#277732' 
                          : membership?.tier === 'Premium'
                          ? '#ffcf08'
                          : '#b4121d'
                      }}>
                        ZENIKA
                      </h2>
                    </div>

                    {/* Member Info */}
                    <div className="mt-auto text-white">
                      <div className="mb-4">
                        <h3 className="text-xl font-semibold">
                          {profile?.full_name || 'Member Name'}
                        </h3>
                        <p className="text-sm opacity-90">
                          Status: {membership?.tier || 'Essential'}
                        </p>
                        <p className="text-sm opacity-90">
                          Sokorodji, Bamako, Mali
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm opacity-90">ID: {membership?.member_id || 'ML-2025896550'}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-bold">03/26</span>
                          <div className="w-12 h-12 bg-white rounded border-2 border-black flex items-center justify-center">
                            <div className="w-8 h-8 bg-black opacity-80"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleCardRenewal}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Request Renewal
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleDownloadCard}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Card
                  </Button>
                  
                  {!cardActivated && (
                    <Button 
                      variant="default" 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => setShowActivationDialog(true)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Activate Card
                    </Button>
                  )}
                  
                  {cardActivated && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowPinDialog(true)}
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Change PIN
                    </Button>
                  )}
                </div>

                {/* Card Status Information */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-3">Card Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Card Number:</span>
                      <span className="font-medium">**** **** **** {membership?.member_id?.slice(-4) || '8550'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium ${cardActivated ? 'text-green-600' : 'text-red-600'}`}>
                        {cardActivated ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expiry Date:</span>
                      <span className="font-medium">
                        {membership?.expiry_date ? new Date(membership.expiry_date).toLocaleDateString() : '03/26'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Membership Type:</span>
                      <span className="font-medium">{membership?.tier || 'Essential'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card Activation Dialog */}
            <Dialog open={showActivationDialog} onOpenChange={setShowActivationDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Activate Your ZENIKA Card</DialogTitle>
                  <DialogDescription>
                    Enter the activation code sent to your email or phone number.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="activationCode">Activation Code</Label>
                    <Input
                      id="activationCode"
                      type="text"
                      placeholder="Enter 6-digit activation code"
                      value={activationCode}
                      onChange={(e) => setActivationCode(e.target.value)}
                      maxLength={6}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCardActivation} className="flex-1">
                      Activate Card
                    </Button>
                    <Button variant="outline" onClick={() => setShowActivationDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Didn't receive the code? <Button variant="link" className="p-0 h-auto">Resend Code</Button>
                  </p>
                </div>
              </DialogContent>
            </Dialog>

            {/* PIN Management Dialog */}
            <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Card PIN</DialogTitle>
                  <DialogDescription>
                    Enter your current PIN and choose a new 4-digit PIN for your card.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPin">Current PIN</Label>
                    <Input
                      id="currentPin"
                      type="password"
                      placeholder="Enter current PIN"
                      value={currentPin}
                      onChange={(e) => setCurrentPin(e.target.value)}
                      maxLength={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPin">New PIN</Label>
                    <Input
                      id="newPin"
                      type="password"
                      placeholder="Enter new 4-digit PIN"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      maxLength={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPin">Confirm New PIN</Label>
                    <Input
                      id="confirmPin"
                      type="password"
                      placeholder="Confirm new PIN"
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                      maxLength={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handlePinChange} className="flex-1">
                      Change PIN
                    </Button>
                    <Button variant="outline" onClick={() => setShowPinDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <div className="flex items-start">
                      <AlertCircle className="h-4 w-4 text-yellow-600 mr-2 mt-0.5" />
                      <p className="text-sm text-yellow-800">
                        Your PIN is used for secure transactions and card verification. 
                        Choose a PIN that's easy to remember but hard for others to guess.
                      </p>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Card Renewal Dialog */}
            <Dialog open={showRenewalDialog} onOpenChange={setShowRenewalDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Card Renewal</DialogTitle>
                  <DialogDescription>
                    Submit a request to renew your ZENIKA card membership.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Current Membership Details</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>Membership Type: {membership?.tier || 'Essential'}</p>
                      <p>Expiry Date: {membership?.expiry_date ? new Date(membership.expiry_date).toLocaleDateString() : 'N/A'}</p>
                      <p>Member ID: {membership?.member_id || 'ML-2025896550'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="renewalNotes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="renewalNotes"
                      placeholder="Any special requests or notes for your renewal..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Renewal Benefits</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Extended membership validity for 12 months</li>
                      <li>• Continued access to all member benefits</li>
                      <li>• Updated digital card with new expiry date</li>
                      <li>• Priority customer support during renewal period</li>
                    </ul>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleRenewalRequest} className="flex-1">
                      Submit Renewal Request
                    </Button>
                    <Button variant="outline" onClick={() => setShowRenewalDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    You will receive an email confirmation with payment instructions and renewal timeline.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Discounts and Rewards</CardTitle>
                <CardContent>
                  <p className="text-sm text-gray-500">Explore exclusive offers and promotions</p>
                </CardContent>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockData.availableRewards.map(reward => (
                    <Card key={reward.id}>
                      <CardHeader>
                        <CardTitle>{reward.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500">Points Required: {reward.points}</p>
                        <Button variant="outline">Redeem</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Services and Products</CardTitle>
                <CardContent>
                  <p className="text-sm text-gray-500">Access to various services and products offered by Elverra Global</p>
                </CardContent>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Consulting Services</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">Expert consulting services for your business needs</p>
                      <Button variant="outline">Learn More</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Subscription Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">Subscribe to our premium products for exclusive benefits</p>
                      <Button variant="outline">Subscribe</Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="affiliate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Affiliate Management</CardTitle>
                <CardContent>
                  <p className="text-sm text-gray-500">Information on affiliate programs, including member benefits and commission structures</p>
                </CardContent>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Affiliate Program Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">Referrals: {mockData.affiliateStats.referrals}</p>
                      <p className="text-sm text-gray-500">Earnings: CFA {mockData.affiliateStats.earnings}</p>
                      <p className="text-sm text-gray-500">Pending Commission: CFA {mockData.affiliateStats.pendingCommission}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Join Affiliate Program</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">Become an affiliate and earn commissions by referring new members</p>
                      <Button variant="outline">Join Now</Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockData.recentTransactions.map(transaction => (
                        <tr key={transaction.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.description}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.amount}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardContent>
                  <p className="text-sm text-gray-500">Manage your account preferences and settings</p>
                </CardContent>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      type="text"
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      disabled
                    />
                  </div>
                </div>

                <div className="mt-4">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Button onClick={handleSave}>Save</Button>
                      <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                    </div>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Postings</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Explore job opportunities within Elverra Global and our partner network.</p>
                {/* Implement job listing and application features here */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Product Management Component */}
                <ProductManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Support Center</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Get help and support from our customer service team.</p>
                {/* Implement support ticket submission and tracking features here */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MyAccount;

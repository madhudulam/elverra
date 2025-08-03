import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LockIcon, KeyIcon, Mail, Phone, User } from 'lucide-react';
import OTPVerification from './OTPVerification';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const LoginForm = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (loading) return;

    setLoading(true);

    try {
      const { data, error } = await signIn(emailOrPhone, password);

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive"
        });
        setLoading(false);
      } else if (data.user) {
        toast({
          title: "Login successful!",
          description: "Redirecting to your dashboard..."
        });
        // Don't set loading to false, let the redirect happen
        // The auth context will handle the redirect
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number.",
        variant: "destructive"
      });
      return;
    }
    
    // Send OTP to phone number
    setShowOTPVerification(true);
    
    // In a real app, this would make an API call to send an OTP code
    toast({
      title: "Verification code sent",
      description: `A verification code has been sent to ${phoneNumber}`,
    });
  };
  
  const handleOTPComplete = () => {
    // On successful OTP verification, log the user in
    toast({
      title: "Login successful!",
      description: "Welcome back to Club66."
    });
    
    // Navigate to home page
    navigate('/');
  };
  
  const handleResendOTP = async () => {
    // In a real app, this would make an API call to resend an OTP code
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Verification code resent",
        description: `A new verification code has been sent to ${phoneNumber}`,
      });
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Log in to your account</CardTitle>
        <CardDescription>
          Access your Elverra client benefits
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="credentials" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="credentials" className="flex items-center gap-2 text-xs sm:text-sm">
              <KeyIcon className="h-3 w-3" />
              <span className="hidden sm:inline">Email/Phone</span>
            </TabsTrigger>
            <TabsTrigger value="phone" className="flex items-center gap-2 text-xs sm:text-sm">
              <Phone className="h-3 w-3" />
              <span className="hidden sm:inline">Phone</span>
            </TabsTrigger>
            <TabsTrigger value="faceid" className="flex items-center gap-2 text-xs sm:text-sm">
              <User className="h-3 w-3" />
              <span className="hidden sm:inline">Face ID</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="credentials">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-phone">Email or Phone</Label>
                <Input
                  id="email-phone"
                  type="text"
                  placeholder="john@example.com or +223 XX XX XX XX"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-xs text-club66-purple hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-club66-purple hover:bg-club66-darkpurple"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Log In'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="phone">
            {showOTPVerification ? (
              <OTPVerification 
                phoneNumber={phoneNumber} 
                onVerifyComplete={handleOTPComplete}
                onResendCode={handleResendOTP}
              />
            ) : (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+223 XX XX XX XX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-club66-purple hover:bg-club66-darkpurple"
                >
                  Send Verification Code
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  We'll send a verification code to your registered phone number
                </p>
              </form>
            )}
          </TabsContent>
          
          <TabsContent value="faceid">
            <div className="py-8 text-center space-y-4">
              <div className="bg-gray-100 w-32 h-32 rounded-full mx-auto flex items-center justify-center">
                <User className="h-16 w-16 text-gray-400" />
              </div>
              <p className="text-gray-600">
                This feature requires the Elverra Mobile App
              </p>
              <Button className="bg-club66-purple hover:bg-club66-darkpurple">
                Download Our App
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="relative my-4 w-full">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 w-full">
          <Button variant="outline" className="w-full">
            <Phone className="mr-2 h-4 w-4" />
            Orange Money
          </Button>
          <Button variant="outline" className="w-full">
            <Phone className="mr-2 h-4 w-4" />
            SAMA Money
          </Button>
        </div>
        
        <div className="text-sm text-center mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-club66-purple hover:underline">
            Create account
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
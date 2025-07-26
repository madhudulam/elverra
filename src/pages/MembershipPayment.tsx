
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import MembershipTiers from '@/components/membership/MembershipTiers';
import PaymentForm from '@/components/membership/PaymentForm';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const MembershipPayment = () => {
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const plans = {
    essential: { name: 'Essential', price: '10,000', monthly: '1,000' },
    premium: { name: 'Premium', price: '10,000', monthly: '2,000' },
    elite: { name: 'Elite', price: '10,000', monthly: '5,000' },
  };

  const handleSelectTier = (tier: string) => {
    setSelectedTier(tier);
  };

  const handleProceedToPayment = () => {
    setShowPayment(true);
  };

  const handlePaymentComplete = () => {
    setPaymentComplete(true);
  };

  if (paymentComplete) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center py-16">
          <div className="text-center space-y-6">
            <CheckCircle className="h-24 w-24 text-green-500 mx-auto" />
            <h1 className="text-4xl font-bold text-gray-900">Payment Successful!</h1>
            <p className="text-lg text-gray-600">
              Welcome to Club66 Global {plans[selectedTier as keyof typeof plans]?.name} membership!
            </p>
            <p className="text-gray-600">
              You will receive your digital membership card via email within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-club66-purple hover:bg-club66-darkpurple">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/">Return Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Button asChild variant="ghost" className="mb-4">
              <Link to="/" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <h1 className="text-4xl font-bold mb-4">Choose Your Membership</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select the perfect membership tier for your lifestyle and unlock exclusive benefits.
            </p>
          </div>

          {!showPayment ? (
            <div className="space-y-8">
              <MembershipTiers 
                selectedTier={selectedTier} 
                onSelectTier={handleSelectTier}
              />
              
              {selectedTier && (
                <div className="text-center">
                  <Button 
                    onClick={handleProceedToPayment}
                    size="lg"
                    className="bg-club66-purple hover:bg-club66-darkpurple"
                  >
                    Proceed to Payment
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-center">
              <PaymentForm 
                selectedPlan={plans[selectedTier as keyof typeof plans]}
                onPaymentComplete={handlePaymentComplete}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MembershipPayment;

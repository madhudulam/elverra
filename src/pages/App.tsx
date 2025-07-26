
import { Download, Smartphone, Check, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import PremiumBanner from '@/components/layout/PremiumBanner';
import { Button } from '@/components/ui/button';

const AppPage = () => {
  const features = [
    "Access your digital membership card anytime",
    "View and redeem partner discounts",
    "Track your savings and benefits",
    "Manage your membership and payments",
    "Refer friends and track your commissions",
    "Find nearby partner merchants",
    "Contact customer support",
    "Receive notifications for new offers"
  ];
  
  return (
    <Layout>
      <PremiumBanner
        title="Club66 Mobile App"
        description="Manage your membership, access your benefits, and connect with our community on the go."
        backgroundImage="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      />

      <div className="py-16 bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-16">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl font-bold mb-6">Everything You Need In Your Pocket</h2>
              <p className="text-gray-600 mb-6">
                The Club66 app gives you instant access to your membership benefits, digital card, and exclusive offers. 
                Track your savings, manage your account, and refer friends - all from your smartphone.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-black hover:bg-gray-800 flex items-center justify-center gap-2">
                  <Download className="h-5 w-5" />
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="font-medium">App Store</div>
                  </div>
                </Button>
                <Button className="bg-black hover:bg-gray-800 flex items-center justify-center gap-2">
                  <Download className="h-5 w-5" />
                  <div className="text-left">
                    <div className="text-xs">Get it on</div>
                    <div className="font-medium">Google Play</div>
                  </div>
                </Button>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Mobile App Interface"
                  className="rounded-lg shadow-xl w-80 h-96 object-cover"
                />
              </div>
            </div>
          </div>

          <div className="mt-24 bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">App Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Digital Card</h3>
                <p className="text-gray-600 text-sm">Access your membership card anytime, anywhere with instant QR verification.</p>
              </div>
              
              <div className="text-center p-4">
                <div className="bg-green-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Track Benefits</h3>
                <p className="text-gray-600 text-sm">Monitor your savings and keep track of all the benefits you've used.</p>
              </div>
              
              <div className="text-center p-4">
                <div className="bg-purple-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Secure Access</h3>
                <p className="text-gray-600 text-sm">Login securely with Face ID, phone number, or email authentication.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Experience Club66?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Download our app today and enjoy all the benefits of your Club66 membership on the go.
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700" size="lg" asChild>
              <Link to="/register">Join Club66 Today</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AppPage;

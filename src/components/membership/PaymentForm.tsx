
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Smartphone, DollarSign, QrCode } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentFormProps {
  selectedPlan: {
    name: string;
    price: string;
    monthly: string;
  };
  onPaymentComplete: () => void;
}

const PaymentForm = ({ selectedPlan, onPaymentComplete }: PaymentFormProps) => {
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    phoneNumber: '',
    email: '',
    orangePin: '',
    moovPin: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate payment processing based on method
      switch (paymentMethod) {
        case 'orange':
          await processOrangeMoneyPayment();
          break;
        case 'moov':
          await processMoovMoneyPayment();
          break;
        case 'wave':
          await processWavePayment();
          break;
        case 'card':
          await processStripePayment();
          break;
        default:
          throw new Error('Please select a payment method');
      }

      toast.success('Payment processed successfully!');
      onPaymentComplete();
    } catch (error: any) {
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const processOrangeMoneyPayment = async () => {
    // Simulate Orange Money API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In real implementation, this would call Orange Money API
    if (!formData.phoneNumber || !formData.orangePin) {
      throw new Error('Please provide phone number and PIN');
    }
    
    // Simulate success/failure
    if (Math.random() > 0.1) { // 90% success rate for demo
      return { success: true, transactionId: 'OM' + Date.now() };
    } else {
      throw new Error('Orange Money payment failed. Please check your PIN and balance.');
    }
  };

  const processMoovMoneyPayment = async () => {
    // Simulate Moov Money API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (!formData.phoneNumber || !formData.moovPin) {
      throw new Error('Please provide phone number and PIN');
    }
    
    // Simulate success/failure
    if (Math.random() > 0.1) {
      return { success: true, transactionId: 'MM' + Date.now() };
    } else {
      throw new Error('Moov Money payment failed. Please check your PIN and balance.');
    }
  };

  const processWavePayment = async () => {
    // Simulate Wave API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (!formData.phoneNumber) {
      throw new Error('Please provide phone number');
    }
    
    // Simulate success/failure
    if (Math.random() > 0.1) {
      return { success: true, transactionId: 'WV' + Date.now() };
    } else {
      throw new Error('Wave payment failed. Please try again.');
    }
  };

  const processStripePayment = async () => {
    // Simulate Stripe API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (!formData.cardNumber || !formData.expiryDate || !formData.cvv) {
      throw new Error('Please fill in all card details');
    }
    
    // Basic validation
    if (formData.cardNumber.replace(/\s/g, '').length < 16) {
      throw new Error('Please enter a valid card number');
    }
    
    // Simulate success/failure
    if (Math.random() > 0.1) {
      return { success: true, transactionId: 'ST' + Date.now() };
    } else {
      throw new Error('Card payment failed. Please check your card details.');
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">Complete Payment</CardTitle>
        <div className="text-center">
          <p className="text-lg font-semibold">{selectedPlan.name} Plan</p>
          <p className="text-2xl font-bold text-club66-purple">
            CFA {selectedPlan.price} + {selectedPlan.monthly}/month
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="payment-method">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="orange">
                  <div className="flex items-center">
                    <Smartphone className="h-4 w-4 mr-2 text-orange-500" />
                    Orange Money
                  </div>
                </SelectItem>
                <SelectItem value="moov">
                  <div className="flex items-center">
                    <Smartphone className="h-4 w-4 mr-2 text-blue-500" />
                    Moov Money
                  </div>
                </SelectItem>
                <SelectItem value="wave">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                    Wave
                  </div>
                </SelectItem>
                <SelectItem value="card">
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-gray-600" />
                    Credit/Debit Card (Stripe)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orange Money Fields */}
          {paymentMethod === 'orange' && (
            <>
              <div>
                <Label htmlFor="phone">Orange Money Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+223 XX XX XX XX"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="orange-pin">Orange Money PIN</Label>
                <Input
                  id="orange-pin"
                  type="password"
                  placeholder="Enter your 4-digit PIN"
                  maxLength={4}
                  value={formData.orangePin}
                  onChange={(e) => setFormData({ ...formData, orangePin: e.target.value })}
                  required
                />
              </div>
            </>
          )}

          {/* Moov Money Fields */}
          {paymentMethod === 'moov' && (
            <>
              <div>
                <Label htmlFor="phone">Moov Money Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+223 XX XX XX XX"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="moov-pin">Moov Money PIN</Label>
                <Input
                  id="moov-pin"
                  type="password"
                  placeholder="Enter your 4-digit PIN"
                  maxLength={4}
                  value={formData.moovPin}
                  onChange={(e) => setFormData({ ...formData, moovPin: e.target.value })}
                  required
                />
              </div>
            </>
          )}

          {/* Wave Fields */}
          {paymentMethod === 'wave' && (
            <div>
              <Label htmlFor="phone">Wave Phone Number</Label>
              <Input
                id="phone"
                placeholder="+223 XX XX XX XX"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                You will receive a payment request on your Wave app
              </p>
            </div>
          )}

          {/* Stripe Card Fields */}
          {paymentMethod === 'card' && (
            <>
              <div>
                <Label htmlFor="card-number">Card Number</Label>
                <Input
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) => {
                    // Auto-format card number with spaces
                    const value = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
                    setFormData({ ...formData, cardNumber: value });
                  }}
                  maxLength={19}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={(e) => {
                      // Auto-format expiry date
                      const value = e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
                      setFormData({ ...formData, expiryDate: value });
                    }}
                    maxLength={5}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    type="password"
                    maxLength={4}
                    value={formData.cvv}
                    onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '') })}
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-club66-purple hover:bg-club66-darkpurple"
            disabled={!paymentMethod || isProcessing}
          >
            {isProcessing ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              `Pay CFA ${selectedPlan.price}`
            )}
          </Button>

          {paymentMethod && (
            <div className="text-xs text-gray-500 text-center mt-2">
              Your payment will be processed securely through {
                paymentMethod === 'orange' ? 'Orange Money' :
                paymentMethod === 'moov' ? 'Moov Money' :
                paymentMethod === 'wave' ? 'Wave' :
                'Stripe'
              }
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;

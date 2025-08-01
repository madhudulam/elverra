import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { usePaymentGateways } from '@/hooks/usePaymentGateways';
import { paymentService } from '@/services/paymentService';
import { PaymentService, PaymentRequest } from '@/types/payment';
import { toast } from 'sonner';
import { Loader2, CreditCard, Smartphone, Building, DollarSign } from 'lucide-react';

interface UnifiedPaymentWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (transactionId: string) => void;
  preSelectedService?: string;
}

const UnifiedPaymentWindow = ({ isOpen, onClose, onSuccess, preSelectedService }: UnifiedPaymentWindowProps) => {
  const { gateways, getActiveGateways, getGatewayById } = usePaymentGateways();
  const [selectedService, setSelectedService] = useState(preSelectedService || '');
  const [selectedGateway, setSelectedGateway] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [paymentDetails, setPaymentDetails] = useState({
    pin: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    accountNumber: ''
  });
  const [processing, setProcessing] = useState(false);

  const availableServices: PaymentService[] = [
    {
      id: 'membership_essential',
      name: 'Essential Membership',
      description: 'Registration + First month fee',
      amount: 11000, // 10,000 registration + 1,000 monthly
      currency: 'CFA',
      category: 'membership'
    },
    {
      id: 'membership_premium',
      name: 'Premium Membership',
      description: 'Registration + First month fee',
      amount: 12000, // 10,000 registration + 2,000 monthly
      currency: 'CFA',
      category: 'membership'
    },
    {
      id: 'membership_elite',
      name: 'Elite Membership',
      description: 'Registration + First month fee',
      amount: 15000, // 10,000 registration + 5,000 monthly
      currency: 'CFA',
      category: 'membership'
    },
    {
      id: 'job_posting',
      name: 'Job Posting',
      description: 'Post a job for 30 days',
      amount: 60000,
      currency: 'CFA',
      category: 'job_posting'
    },
    {
      id: 'product_listing',
      name: 'Product Listing',
      description: 'List a product in the marketplace',
      amount: 500,
      currency: 'CFA',
      category: 'product_listing'
    },
    {
      id: 'secours_tokens',
      name: 'Ô Secours Tokens',
      description: 'Emergency assistance tokens',
      amount: 2500,
      currency: 'CFA',
      category: 'tokens'
    }
  ];

  const selectedServiceData = availableServices.find(s => s.id === selectedService);
  const selectedGatewayData = getGatewayById(selectedGateway);

  const totalAmount = selectedServiceData && selectedGatewayData 
    ? paymentService.getTotalAmount(selectedGatewayData, selectedServiceData.amount)
    : 0;

  const fees = selectedServiceData && selectedGatewayData
    ? paymentService.calculateFees(selectedGatewayData, selectedServiceData.amount)
    : 0;

  useEffect(() => {
    if (preSelectedService) {
      setSelectedService(preSelectedService);
    }
  }, [preSelectedService]);

  const handlePayment = async () => {
    if (!selectedService || !selectedGateway || !customerInfo.name || !customerInfo.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!selectedServiceData || !selectedGatewayData) {
      toast.error('Invalid service or payment method selected');
      return;
    }

    setProcessing(true);

    try {
      const paymentRequest: PaymentRequest = {
        serviceId: selectedService,
        gatewayId: selectedGateway,
        amount: selectedServiceData.amount,
        currency: selectedServiceData.currency,
        customerInfo,
        metadata: {
          serviceCategory: selectedServiceData.category,
          paymentDetails: selectedGatewayData.type === 'mobile_money' ? { pin: paymentDetails.pin } :
                          selectedGatewayData.type === 'card' ? { 
                            cardNumber: paymentDetails.cardNumber,
                            expiryDate: paymentDetails.expiryDate,
                            cvv: paymentDetails.cvv 
                          } : {}
        }
      };

      const response = await paymentService.processPayment(selectedGatewayData, paymentRequest);

      if (response.success && response.transactionId) {
        toast.success('Payment completed successfully!');
        onSuccess(response.transactionId);
        onClose();
      } else {
        toast.error(response.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const renderPaymentFields = () => {
    if (!selectedGatewayData) return null;

    switch (selectedGatewayData.type) {
      case 'mobile_money':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+223 XX XX XX XX"
                required
              />
            </div>
            {selectedGatewayData?.id === 'sama_money' ? (
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-700">
                  You will receive a payment request on your SAMA Money account to authorize the transaction.
                </p>
              </div>
            ) : (
              <div>
                <Label htmlFor="pin">PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  value={paymentDetails.pin}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, pin: e.target.value }))}
                  placeholder="Enter your PIN"
                  maxLength={4}
                  required
                />
              </div>
            )}
          </div>
        );

      case 'card':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                value={paymentDetails.cardNumber}
                onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  value={paymentDetails.expiryDate}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, expiryDate: e.target.value }))}
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  value={paymentDetails.cvv}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, cvv: e.target.value }))}
                  placeholder="123"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 'bank_transfer':
        return (
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              Bank transfer instructions will be provided after confirming your payment.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const getGatewayIcon = (type: string) => {
    switch (type) {
      case 'mobile_money':
        return <Smartphone className="h-5 w-5" />;
      case 'card':
        return <CreditCard className="h-5 w-5" />;
      case 'bank_transfer':
        return <Building className="h-5 w-5" />;
      default:
        return <DollarSign className="h-5 w-5" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Unified Payment Window</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Selection */}
          <div>
            <Label htmlFor="service">Select Service</Label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a service to pay for" />
              </SelectTrigger>
              <SelectContent>
                {availableServices.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    <div className="flex justify-between items-center w-full">
                      <span>{service.name}</span>
                      <Badge variant="outline" className="ml-2">
                        {service.amount.toLocaleString()} {service.currency}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedServiceData && (
              <p className="text-sm text-gray-600 mt-1">{selectedServiceData.description}</p>
            )}
          </div>

          {/* Payment Gateway Selection */}
          {selectedService && (
            <div>
              <Label>Payment Method</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                {getActiveGateways().map((gateway) => (
                  <Card
                    key={gateway.id}
                    className={`cursor-pointer transition-all ${
                      selectedGateway === gateway.id
                        ? 'ring-2 ring-blue-500 border-blue-500'
                        : 'hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedGateway(gateway.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        {getGatewayIcon(gateway.type)}
                        <div className="flex-1">
                          <h4 className="font-medium">{gateway.name}</h4>
                          <p className="text-sm text-gray-600">{gateway.description}</p>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-gray-500">
                              Fee: {gateway.fees.percentage}%
                              {gateway.fees.fixed > 0 && ` + ${gateway.fees.fixed} CFA`}
                            </span>
                          </div>
                        </div>
                        <span className="text-2xl">{gateway.icon}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Customer Information */}
          {selectedGateway && (
            <div className="space-y-4">
              <h3 className="font-medium">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Payment Details */}
          {selectedGateway && (
            <div className="space-y-4">
              <h3 className="font-medium">Payment Details</h3>
              {renderPaymentFields()}
            </div>
          )}

          {/* Payment Summary */}
          {selectedServiceData && selectedGatewayData && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span className="font-medium">{selectedServiceData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span>{selectedServiceData.amount.toLocaleString()} {selectedServiceData.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span>{selectedGatewayData.name}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Processing Fee:</span>
                  <span>{fees.toLocaleString()} {selectedServiceData.currency}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-green-600">
                    {totalAmount.toLocaleString()} {selectedServiceData.currency}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={!selectedService || !selectedGateway || processing}
              className="flex-1"
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${totalAmount.toLocaleString()} ${selectedServiceData?.currency || 'CFA'}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UnifiedPaymentWindow;
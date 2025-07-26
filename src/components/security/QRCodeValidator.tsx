
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Check, X, QrCode, Scan, UserCheck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface QRCodeValidatorProps {
  onValidationComplete?: (valid: boolean, memberData?: any) => void;
}

const QRCodeValidator = ({ onValidationComplete }: QRCodeValidatorProps) => {
  const [qrValue, setQrValue] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    status: 'idle' | 'valid' | 'invalid';
    memberData?: {
      name: string;
      memberID: string;
      membershipTier: string;
      expiryDate: string;
    };
  }>({ status: 'idle' });

  const handleValidate = async () => {
    if (!qrValue.trim()) {
      toast({
        title: "Error",
        description: "Please enter a QR code value",
        variant: "destructive"
      });
      return;
    }

    setIsValidating(true);

    try {
      // In a real app, this would make an API call to verify the QR code
      // For now, we'll simulate a successful validation after a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, validate any code that starts with "C66-"
      const isValid = qrValue.startsWith('C66-');
      
      if (isValid) {
        // Mock member data
        const memberData = {
          name: "Ahmed Traore",
          memberID: qrValue,
          membershipTier: "Elite",
          expiryDate: "01/28"
        };
        
        setValidationResult({
          status: 'valid',
          memberData
        });
        
        toast({
          title: "Validation successful",
          description: "Valid Club66 member card"
        });
        
        if (onValidationComplete) {
          onValidationComplete(true, memberData);
        }
      } else {
        setValidationResult({
          status: 'invalid'
        });
        
        toast({
          title: "Validation failed",
          description: "Invalid QR code",
          variant: "destructive"
        });
        
        if (onValidationComplete) {
          onValidationComplete(false);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to validate QR code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleScanQR = () => {
    // In a real app, this would open the device camera
    // For this demo, we'll simulate a successful scan after a delay
    toast({
      title: "Opening camera",
      description: "Scanning QR code..."
    });
    
    setTimeout(() => {
      // Simulate a successful scan
      setQrValue("C66-ML-21058");
      
      toast({
        title: "QR code detected",
        description: "Code scanned successfully"
      });
    }, 2000);
  };

  const resetValidation = () => {
    setValidationResult({ status: 'idle' });
    setQrValue('');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-club66-purple" />
          <span>Member Card Validation</span>
        </CardTitle>
        <CardDescription>
          Verify membership cards by scanning or entering QR code
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {validationResult.status === 'idle' ? (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter QR code value (e.g., C66-ML-21058)"
                value={qrValue}
                onChange={(e) => setQrValue(e.target.value)}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                onClick={handleScanQR}
                className="flex-shrink-0"
              >
                <Scan className="h-4 w-4 mr-2" />
                Scan
              </Button>
            </div>
            
            <div className="text-center">
              <div className="mb-4 p-6 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <QrCode className="h-16 w-16 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">
                Position the QR code in the camera view or enter the code manually above
              </p>
            </div>
          </div>
        ) : validationResult.status === 'valid' ? (
          <div className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <Check className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-green-800">Valid Membership</AlertTitle>
              <AlertDescription className="text-green-700">
                This membership card is valid and active.
              </AlertDescription>
            </Alert>
            
            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Name</span>
                <span className="font-medium">{validationResult.memberData?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Member ID</span>
                <span className="font-medium">{validationResult.memberData?.memberID}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Membership</span>
                <span className="font-medium">{validationResult.memberData?.membershipTier}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Expires</span>
                <span className="font-medium">{validationResult.memberData?.expiryDate}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Alert className="bg-red-50 border-red-200">
              <X className="h-5 w-5 text-red-600" />
              <AlertTitle className="text-red-800">Invalid Membership</AlertTitle>
              <AlertDescription className="text-red-700">
                This QR code is not recognized as a valid Club66 membership card.
              </AlertDescription>
            </Alert>
            
            <div className="text-center py-4">
              <X className="h-16 w-16 mx-auto text-red-500" />
              <p className="mt-2 text-gray-600">The QR code "{qrValue}" is invalid or expired</p>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        {validationResult.status === 'idle' ? (
          <Button 
            className="w-full bg-club66-purple hover:bg-club66-darkpurple"
            onClick={handleValidate}
            disabled={isValidating || !qrValue.trim()}
          >
            {isValidating ? "Validating..." : "Validate Membership"}
          </Button>
        ) : (
          <div className="flex w-full gap-2">
            <Button variant="outline" className="flex-1" onClick={resetValidation}>
              Scan Another
            </Button>
            <Button 
              className="flex-1 bg-club66-purple hover:bg-club66-darkpurple"
              onClick={() => {
                // In a real app, this would confirm the validation in the system
                toast({
                  title: "Verification logged",
                  description: "Member verification has been recorded"
                });
              }}
              disabled={validationResult.status !== 'valid'}
            >
              <UserCheck className="mr-2 h-4 w-4" />
              {validationResult.status === 'valid' ? "Confirm Member" : "Return"}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default QRCodeValidator;

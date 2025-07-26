
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Share2, QrCode, User, Smartphone } from 'lucide-react';
import QRCodeGenerator from '@/components/utilities/QRCodeGenerator';

interface PremiumMemberCardProps {
  memberName: string;
  memberID: string;
  expiryDate: string;
  membershipTier: 'Essential' | 'Premium' | 'Elite';
  profileImage?: string;
  phoneNumber?: string;
  email?: string;
}

const PremiumMemberCard = ({ 
  memberName, 
  memberID, 
  expiryDate, 
  membershipTier,
  profileImage,
  phoneNumber,
  email
}: PremiumMemberCardProps) => {
  const [showQR, setShowQR] = useState(false);
  
  // Create QR data for verification
  const qrData = JSON.stringify({
    memberID,
    name: memberName,
    tier: membershipTier,
    expiry: expiryDate,
    phone: phoneNumber,
    email: email,
    verified: true
  });

  // Get card styling based on membership tier
  const getCardDesign = () => {
    switch (membershipTier) {
      case 'Essential':
        return {
          background: 'bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300',
          accent: 'bg-slate-400',
          textPrimary: 'text-slate-900',
          textSecondary: 'text-slate-600',
          chipColor: 'bg-slate-300'
        };
      case 'Premium':
        return {
          background: 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800',
          accent: 'bg-blue-400',
          textPrimary: 'text-white',
          textSecondary: 'text-blue-100',
          chipColor: 'bg-blue-300'
        };
      case 'Elite':
        return {
          background: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600',
          accent: 'bg-yellow-300',
          textPrimary: 'text-gray-900',
          textSecondary: 'text-gray-700',
          chipColor: 'bg-yellow-200'
        };
      default:
        return {
          background: 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800',
          accent: 'bg-blue-400',
          textPrimary: 'text-white',
          textSecondary: 'text-blue-100',
          chipColor: 'bg-blue-300'
        };
    }
  };

  const cardDesign = getCardDesign();

  const downloadCard = () => {
    // Implementation for downloading card as image
    console.log('Downloading card...');
  };

  const shareCard = () => {
    // Implementation for sharing card
    console.log('Sharing card...');
  };

  if (showQR) {
    return (
      <div className="w-full max-w-md mx-auto">
        <Card className="overflow-hidden shadow-2xl">
          <CardContent className="p-0">
            <div className="bg-white p-6">
              <div className="text-center mb-4">
                <h3 className="font-bold text-xl text-gray-900 mb-2">
                  {membershipTier} Membership
                </h3>
                <p className="text-sm text-gray-600">
                  Scan this QR code for verification and benefits
                </p>
              </div>
              
              <QRCodeGenerator
                data={qrData}
                size={250}
                className="border-0 shadow-none"
                showDownload={false}
                showShare={false}
              />
              
              <div className="mt-6 space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Member ID:</span>
                    <span className="font-medium">{memberID}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Valid Until:</span>
                    <span className="font-medium">{expiryDate}</span>
                  </div>
                </div>
                
                <Button
                  onClick={() => setShowQR(false)}
                  variant="outline"
                  className="w-full"
                >
                  Show Card Front
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="overflow-hidden shadow-2xl border-0">
        <CardContent className="p-0">
          {/* Premium Card Design */}
          <div className={`${cardDesign.background} p-6 relative overflow-hidden`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-white/20"></div>
              <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full bg-white/10"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-white/5"></div>
            </div>
            
            {/* Card Header */}
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className={`text-xs font-semibold uppercase tracking-wider ${cardDesign.textSecondary} mb-1`}>
                    Club66
                  </div>
                  <div className={`text-sm font-medium ${cardDesign.textSecondary}`}>
                    {membershipTier} Member
                  </div>
                </div>
                
                {/* Card Chip */}
                <div className={`w-12 h-8 ${cardDesign.chipColor} rounded-md relative`}>
                  <div className="absolute inset-1 border border-gray-400 rounded-sm"></div>
                  <div className="absolute inset-2 grid grid-cols-2 gap-0.5">
                    <div className="bg-gray-600 rounded-sm"></div>
                    <div className="bg-gray-600 rounded-sm"></div>
                    <div className="bg-gray-600 rounded-sm"></div>
                    <div className="bg-gray-600 rounded-sm"></div>
                  </div>
                </div>
              </div>

              {/* Member Photo and Info */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/30 shadow-lg">
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt={memberName} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/20 flex items-center justify-center">
                      <User className={`h-8 w-8 ${cardDesign.textSecondary}`} />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className={`text-xs font-medium ${cardDesign.textSecondary} mb-1`}>
                    Cardholder Name
                  </div>
                  <div className={`text-lg font-bold ${cardDesign.textPrimary} truncate`}>
                    {memberName}
                  </div>
                </div>
              </div>

              {/* Card Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className={`text-xs font-medium ${cardDesign.textSecondary} mb-1`}>
                    Member ID
                  </div>
                  <div className={`text-sm font-bold ${cardDesign.textPrimary} font-mono`}>
                    {memberID}
                  </div>
                </div>
                <div>
                  <div className={`text-xs font-medium ${cardDesign.textSecondary} mb-1`}>
                    Valid Thru
                  </div>
                  <div className={`text-sm font-bold ${cardDesign.textPrimary} font-mono`}>
                    {expiryDate}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              {(phoneNumber || email) && (
                <div className="space-y-1 mb-6">
                  {phoneNumber && (
                    <div className="flex items-center space-x-2">
                      <Smartphone className={`h-3 w-3 ${cardDesign.textSecondary}`} />
                      <span className={`text-xs ${cardDesign.textSecondary}`}>{phoneNumber}</span>
                    </div>
                  )}
                  {email && (
                    <div className={`text-xs ${cardDesign.textSecondary} truncate`}>
                      {email}
                    </div>
                  )}
                </div>
              )}

              {/* QR Code Button */}
              <Button
                onClick={() => setShowQR(true)}
                variant="secondary"
                className={`w-full ${membershipTier === 'Elite' ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-white/20 text-white hover:bg-white/30'} backdrop-blur-sm border-0`}
              >
                <QrCode className="h-4 w-4 mr-2" />
                Show QR Code
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Actions */}
      <div className="flex space-x-2 mt-4">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={downloadCard}
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={shareCard}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
};

export default PremiumMemberCard;

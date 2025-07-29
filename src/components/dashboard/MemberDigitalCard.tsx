
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share2, QrCode } from 'lucide-react';
import { Card } from '@/components/ui/card';
import QRCodeGenerator from '@/components/utilities/QRCodeGenerator';

interface MemberDigitalCardProps {
  memberName: string;
  memberID: string;
  expiryDate: string;
  membershipTier: 'Essential' | 'Premium' | 'Elite';
  profileImage?: string;
  address?: string;
}

const MemberDigitalCard = ({ 
  memberName, 
  memberID, 
  expiryDate, 
  membershipTier,
  profileImage,
  address
}: MemberDigitalCardProps) => {
  const [showQR, setShowQR] = useState(false);
  
  // Create QR data for the card
  const qrData = JSON.stringify({
    memberID,
    name: memberName,
    tier: membershipTier,
    expiry: expiryDate
  });

  // Get card styling based on membership tier
  const getTierColors = () => {
    switch (membershipTier) {
      case 'Essential':
        return {
          background: 'bg-white',
          statusColor: 'text-gray-800',
          border: 'border-gray-200'
        };
      case 'Premium':
        return {
          background: 'bg-gradient-to-br from-blue-600 to-blue-800',
          statusColor: 'text-white',
          border: 'border-blue-600'
        };
      case 'Elite':
        return {
          background: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
          statusColor: 'text-gray-900',
          border: 'border-yellow-400'
        };
      default:
        return {
          background: 'bg-white',
          statusColor: 'text-gray-800',
          border: 'border-gray-200'
        };
    }
  };

  const colors = getTierColors();

  // Function to download card as image
  const handleDownload = async () => {
    try {
      const cardElement = document.getElementById('member-card');
      if (!cardElement) return;

      // Use html2canvas to capture the card
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `${memberName.replace(' ', '_')}_membership_card.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error downloading card:', error);
      // Fallback: show alert
      alert('Download feature requires html2canvas library. Please contact support.');
    }
  };

  // Mock function to share card
  const handleShare = () => {
    alert('Card sharing functionality would be implemented here.');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-4">
        <h3 className="font-bold text-lg text-gray-900">Your Digital Value Card</h3>
        <p className="text-sm text-gray-500">Present this at participating merchants for discounts</p>
      </div>
      
      <Card id="member-card" className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-200 bg-white">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white px-6 py-3 relative">
          <div className="flex items-center justify-between">
            <img src="/lovable-uploads/el-logo.png" alt="El Global Logo" className="h-12 w-auto brightness-0 invert" />
            <h2 className="text-4xl font-bold text-white">El</h2>
          </div>
        </div>

        {/* Main Card Content */}
        <div className="bg-white p-6 relative">
          <div className="flex items-start space-x-6">
            {/* Profile Image - positioned to overlap with header */}
            <div className="flex-shrink-0 relative -mt-16">
              {profileImage ? (
                <div className="w-24 h-32 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                  <img 
                    src={profileImage} 
                    alt={memberName} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-32 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-2 border-white shadow-lg">
                  <span className="text-3xl font-bold text-gray-600">
                    {memberName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              {/* ID Number under photo */}
              <div className="text-center mt-2">
                <p className="text-xs font-bold text-gray-900">{memberID}</p>
              </div>
            </div>

            {/* Member Details */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {memberName}
              </h3>
              <p className="text-base font-medium text-gray-800 mb-3">
                Statut : {membershipTier}
              </p>
              
              {/* Address and Valid Date with QR Code */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {address && (
                    <p className="text-sm text-gray-700 mb-3">
                      {address}
                    </p>
                  )}
                  
                  <p className="text-sm text-gray-600 mb-2">
                    Valide jusqu'au : {new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                
                {/* QR Code */}
                <div className="flex-shrink-0 ml-4">
                  <div className="w-20 h-20 bg-white border border-gray-300 rounded p-1">
                    <QRCodeGenerator
                      data={qrData}
                      size={76}
                      showDownload={false}
                      showShare={false}
                      showData={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Changing Lives Footer */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-3 px-6">
          <h4 className="text-left italic text-lg" style={{ fontFamily: 'Times New Roman, serif' }}>
            Empowerment and Progress
          </h4>
        </div>
      </Card>
      
      {/* Action Buttons */}
      <div className="flex space-x-2 mt-4">
        <Button 
          variant="outline" 
          className="flex-1 text-sm"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 text-sm"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
};

export default MemberDigitalCard;

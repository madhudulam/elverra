
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface MemberCardProps {
  memberName: string;
  memberID: string;
  expiryDate: string;
  membershipTier: 'Essential' | 'Premium' | 'Elite';
}

const MemberCard = ({ memberName, memberID, expiryDate, membershipTier }: MemberCardProps) => {
  const [showQR, setShowQR] = useState(false);

  // Get card styling based on membership tier
  const getCardStyle = () => {
    switch (membershipTier) {
      case 'Essential':
        return 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-900 border border-slate-300';
      case 'Premium':
        return 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white';
      case 'Elite':
        return 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-gray-900';
      default:
        return 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white';
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mx-auto flip-card">
        <div className={`flip-card-inner ${showQR ? 'is-flipped' : ''}`}>
          {/* Front of card */}
          <div className={`flip-card-front rounded-xl overflow-hidden shadow-lg ${getCardStyle()}`}>
            <div className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className={`text-xs font-medium ${membershipTier === 'Essential' ? 'text-gray-600' : ''}`}>
                    {membershipTier} Member
                  </p>
                  <p className="text-lg font-bold">Club66</p>
                </div>
                <div className={`h-12 w-12 rounded-full ${membershipTier === 'Essential' ? 'bg-gray-300' : 'bg-white/20'} flex items-center justify-center`}>
                  <span className="font-bold">66</span>
                </div>
              </div>
              
              <div className="mt-8 mb-2">
                <div className={`text-xs ${membershipTier === 'Essential' ? 'text-gray-600' : 'text-white/80'}`}>
                  Member Name
                </div>
                <div className="font-medium">{memberName}</div>
              </div>
              
              <div className="mt-4 flex justify-between items-end">
                <div>
                  <div className={`text-xs ${membershipTier === 'Essential' ? 'text-gray-600' : 'text-white/80'}`}>
                    Member ID
                  </div>
                  <div className="text-sm">{memberID}</div>
                </div>
                <div>
                  <div className={`text-xs ${membershipTier === 'Essential' ? 'text-gray-600' : 'text-white/80'}`}>
                    Expires
                  </div>
                  <div className="text-sm">{expiryDate}</div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Button
                  onClick={() => setShowQR(true)}
                  variant={membershipTier === 'Essential' ? 'default' : 'secondary'}
                  className="w-full"
                >
                  Show QR Code
                </Button>
              </div>
            </div>
          </div>
          
          {/* Back of card (QR Code) */}
          <div className="flip-card-back bg-white rounded-xl overflow-hidden shadow-lg">
            <div className="p-6 h-full flex flex-col">
              <h3 className={`text-center font-bold ${membershipTier === 'Essential' ? 'text-gray-900' : 'text-club66-purple'} mb-4`}>
                {membershipTier} Membership
              </h3>
              
              <div className="flex-grow flex flex-col items-center justify-center">
                <div className="bg-gray-100 w-48 h-48 flex items-center justify-center">
                  {/* Placeholder for QR code */}
                  <div className="w-36 h-36 border-2 border-gray-400 grid grid-cols-4 grid-rows-4">
                    {[...Array(16)].map((_, i) => (
                      <div key={i} className="border border-gray-400"></div>
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600 text-center">
                  Present this QR code to receive your member discount
                </p>
              </div>
              
              <div className="mt-4 text-center">
                <Button
                  onClick={() => setShowQR(false)}
                  variant="outline"
                  className="w-full"
                >
                  Show Card
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;

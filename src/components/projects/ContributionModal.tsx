
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContribute: (amount: number) => void;
  project: {
    id: string;
    project_name: string;
    goal_amount: number;
    current_amount: number;
    currency: string;
  };
}

const ContributionModal = ({ isOpen, onClose, project, onContribute }: ContributionModalProps) => {
  const [amount, setAmount] = useState('');
  const [contributorName, setContributorName] = useState('');
  const [contributorEmail, setContributorEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('mobile_money');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    const contributionAmount = parseInt(amount);
    onContribute(contributionAmount);
    onClose();
    
    // Reset form
    setAmount('');
    setContributorName('');
    setContributorEmail('');
    setMessage('');
    setIsAnonymous(false);
    setPaymentMethod('mobile_money');
  };

  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Contribute to {project.project_name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Contribution Amount ({project.currency})</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
            />
            <Label htmlFor="anonymous">Contribute anonymously</Label>
          </div>

          {!isAnonymous && (
            <>
              <div>
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={contributorName}
                  onChange={(e) => setContributorName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={contributorEmail}
                  onChange={(e) => setContributorEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Leave a message of support"
              rows={3}
            />
          </div>

          <div>
            <Label>Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mobile_money" id="mobile_money" />
                <Label htmlFor="mobile_money">Mobile Money</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                <Label htmlFor="bank_transfer">Bank Transfer</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card">Credit/Debit Card</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Processing...' : 'Contribute'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContributionModal;

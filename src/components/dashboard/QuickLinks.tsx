
import React from 'react';
import { Percent, CreditCard as CreditCardIcon, Award, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const QuickLinks = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Quick Links</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <li>
            <Button variant="ghost" className="w-full justify-start">
              <Percent className="h-4 w-4 mr-2" />
              View All Discounts
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start">
              <CreditCardIcon className="h-4 w-4 mr-2" />
              Request Physical Card
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start">
              <Award className="h-4 w-4 mr-2" />
              Current Competitions
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Project & Scholarship Requests
            </Button>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default QuickLinks;

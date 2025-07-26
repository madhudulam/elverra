
import React from 'react';
import { Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Competition {
  id: string;
  name: string;
  date: string;
  status: string;
}

interface CompetitionParticipationProps {
  competitions: Competition[];
}

const CompetitionParticipation = ({ competitions }: CompetitionParticipationProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Award className="h-5 w-5 mr-2" />
          Competition Participation
        </CardTitle>
        <CardDescription>Track competitions you've voted in or participated in</CardDescription>
      </CardHeader>
      <CardContent>
        {competitions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Competition</th>
                  <th className="text-left py-3 px-2">Date</th>
                  <th className="text-left py-3 px-2">Status</th>
                  <th className="text-left py-3 px-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {competitions.map((comp) => (
                  <tr key={comp.id} className="border-b">
                    <td className="py-3 px-2">{comp.name}</td>
                    <td className="py-3 px-2">{comp.date}</td>
                    <td className="py-3 px-2">{comp.status}</td>
                    <td className="py-3 px-2">
                      <Button size="sm" variant="outline">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            No competition participation recorded.
          </div>
        )}
        
        <div className="mt-6">
          <Button className="w-full">
            Browse Active Competitions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompetitionParticipation;


import React from 'react';
import { FileText, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ProjectsAndScholarships = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Project & Scholarship Applications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Submit Your Request</h3>
          <p className="text-gray-500 mb-6">
            Apply for startup capital, scholarships, training sponsorship, and other member benefits.
          </p>
          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-left">
                  <h4 className="font-medium text-blue-800">Contact Your Agent</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Please call your assigned field agent to submit a request. 
                    Agent contact: <strong>+223 76 12 34 56</strong>
                  </p>
                </div>
              </div>
            </div>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to="/project-requests">
                View Request Form
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectsAndScholarships;

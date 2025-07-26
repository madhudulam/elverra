
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MapPin, Calendar, Users } from 'lucide-react';

interface ProjectCardProps {
  project: {
    id: string;
    project_name: string;
    description: string;
    goal_amount: number;
    current_amount: number;
    currency: string;
    end_date: string;
    category: string;
    location?: string;
    image_url?: string;
  };
  onContribute: (projectId: string) => void;
}

const ProjectCard = ({ project, onContribute }: ProjectCardProps) => {
  const progressPercentage = (project.current_amount / project.goal_amount) * 100;
  const daysLeft = Math.ceil((new Date(project.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card className="overflow-hidden">
      {project.image_url && (
        <img 
          src={project.image_url} 
          alt={project.project_name}
          className="w-full h-48 object-cover"
        />
      )}
      <CardHeader>
        <CardTitle className="text-lg">{project.project_name}</CardTitle>
        <div className="text-sm text-gray-500 space-y-1">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {project.location || 'Mali'}
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {daysLeft > 0 ? `${daysLeft} days left` : 'Campaign ended'}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
        
        <div className="space-y-3">
          <Progress value={progressPercentage} className="h-2" />
          
          <div className="flex justify-between text-sm">
            <span className="font-medium">
              {project.currency} {project.current_amount.toLocaleString()}
            </span>
            <span className="text-gray-500">
              {progressPercentage.toFixed(1)}%
            </span>
          </div>
          
          <div className="text-sm text-gray-500">
            Goal: {project.currency} {project.goal_amount.toLocaleString()}
          </div>
          
          {daysLeft > 0 && (
            <Button 
              onClick={() => onContribute(project.id)}
              className="w-full bg-club66-purple hover:bg-club66-darkpurple"
            >
              Contribute Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;

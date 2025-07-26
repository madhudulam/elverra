
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, Save, Plus, MinusCircle } from 'lucide-react';
import { jobListings } from '@/data/jobListings';

interface JobPostingFormProps {
  jobId?: number | null;
  onClose: () => void;
}

const JobPostingForm = ({ jobId, onClose }: JobPostingFormProps) => {
  const { toast } = useToast();
  
  // Find job if editing an existing one
  const existingJob = jobId ? jobListings.find(job => job.id === jobId) : null;
  
  // Form state
  const [formData, setFormData] = useState({
    title: existingJob?.title || '',
    department: existingJob?.department || '',
    location: existingJob?.location || '',
    type: existingJob?.type || 'Full-time',
    description: existingJob?.description || '',
    detailedDescription: existingJob?.detailedDescription || '',
    salary: existingJob?.salary || 0,
    responsibilities: existingJob?.responsibilities || [''],
    requirements: existingJob?.requirements || [''],
    qualifications: existingJob?.qualifications || [''],
    benefits: existingJob?.benefits || [''],
    experience: existingJob?.experience || 'Entry-level',
    certifications: existingJob?.certifications || [''],
    technologies: existingJob?.technologies || [''],
    applicationDeadline: existingJob?.applicationDeadline || '',
    contactEmail: existingJob?.contactEmail || ''
  });
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle array field changes
  const handleArrayChange = (array: string, index: number, value: string) => {
    setFormData(prev => {
      const newArray = [...prev[array as keyof typeof prev] as string[]];
      newArray[index] = value;
      return { ...prev, [array]: newArray };
    });
  };
  
  // Add new item to array fields
  const addArrayItem = (array: string) => {
    setFormData(prev => {
      const newArray = [...prev[array as keyof typeof prev] as string[]];
      newArray.push('');
      return { ...prev, [array]: newArray };
    });
  };
  
  // Remove item from array fields
  const removeArrayItem = (array: string, index: number) => {
    setFormData(prev => {
      const newArray = [...prev[array as keyof typeof prev] as string[]];
      newArray.splice(index, 1);
      return { ...prev, [array]: newArray };
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.department || !formData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would save to the backend
    toast({
      title: existingJob ? "Job Updated" : "Job Posted",
      description: `"${formData.title}" has been ${existingJob ? 'updated' : 'posted'} successfully.`
    });
    
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardHeader className="sticky top-0 bg-white z-10 border-b">
          <div className="flex items-center justify-between">
            <CardTitle>{existingJob ? 'Edit Job Posting' : 'Create New Job Posting'}</CardTitle>
            <Button variant="ghost" onClick={onClose}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Job Title<span className="text-red-500">*</span></Label>
                  <Input 
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="department">Department<span className="text-red-500">*</span></Label>
                  <Input 
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="location">Location<span className="text-red-500">*</span></Label>
                  <Input 
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Job Type<span className="text-red-500">*</span></Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => handleSelectChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="salary">Monthly Salary (USD)</Label>
                  <Input 
                    id="salary"
                    name="salary"
                    type="number"
                    value={formData.salary.toString()}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="experience">Experience Level</Label>
                  <Select 
                    value={formData.experience} 
                    onValueChange={(value) => handleSelectChange('experience', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Entry-level">Entry-level</SelectItem>
                      <SelectItem value="Mid-level">Mid-level</SelectItem>
                      <SelectItem value="Senior-level">Senior-level</SelectItem>
                      <SelectItem value="Executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="description">Short Description<span className="text-red-500">*</span></Label>
                  <Textarea 
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={2}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="detailedDescription">Detailed Description</Label>
                  <Textarea 
                    id="detailedDescription"
                    name="detailedDescription"
                    value={formData.detailedDescription}
                    onChange={handleChange}
                    rows={5}
                  />
                </div>
                
                <div>
                  <Label htmlFor="applicationDeadline">Application Deadline</Label>
                  <Input 
                    id="applicationDeadline"
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleChange}
                    placeholder="e.g., June 30, 2025"
                  />
                </div>
                
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input 
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    placeholder="careers@example.com"
                  />
                </div>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="font-medium mb-4">Requirements & Qualifications</h3>
              
              <div className="space-y-6">
                {/* Responsibilities */}
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Responsibilities</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => addArrayItem('responsibilities')}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                  
                  {formData.responsibilities.map((item, index) => (
                    <div key={`resp-${index}`} className="flex mb-2">
                      <Input 
                        value={item}
                        onChange={(e) => handleArrayChange('responsibilities', index, e.target.value)}
                        className="mr-2"
                      />
                      {formData.responsibilities.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeArrayItem('responsibilities', index)}
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Requirements */}
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Requirements</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => addArrayItem('requirements')}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                  
                  {formData.requirements.map((item, index) => (
                    <div key={`req-${index}`} className="flex mb-2">
                      <Input 
                        value={item}
                        onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                        className="mr-2"
                      />
                      {formData.requirements.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeArrayItem('requirements', index)}
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Qualifications */}
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Qualifications</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => addArrayItem('qualifications')}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                  
                  {formData.qualifications.map((item, index) => (
                    <div key={`qual-${index}`} className="flex mb-2">
                      <Input 
                        value={item}
                        onChange={(e) => handleArrayChange('qualifications', index, e.target.value)}
                        className="mr-2"
                      />
                      {formData.qualifications.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeArrayItem('qualifications', index)}
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Benefits */}
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Benefits</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => addArrayItem('benefits')}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                  
                  {formData.benefits.map((item, index) => (
                    <div key={`ben-${index}`} className="flex mb-2">
                      <Input 
                        value={item}
                        onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                        className="mr-2"
                      />
                      {formData.benefits.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeArrayItem('benefits', index)}
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Technologies */}
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Required Technologies/Skills</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => addArrayItem('technologies')}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                  
                  {formData.technologies.map((item, index) => (
                    <div key={`tech-${index}`} className="flex mb-2">
                      <Input 
                        value={item}
                        onChange={(e) => handleArrayChange('technologies', index, e.target.value)}
                        className="mr-2"
                      />
                      {formData.technologies.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeArrayItem('technologies', index)}
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Certifications */}
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Required Certifications</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => addArrayItem('certifications')}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                  
                  {formData.certifications.map((item, index) => (
                    <div key={`cert-${index}`} className="flex mb-2">
                      <Input 
                        value={item}
                        onChange={(e) => handleArrayChange('certifications', index, e.target.value)}
                        className="mr-2"
                      />
                      {formData.certifications.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeArrayItem('certifications', index)}
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                {existingJob ? 'Update Job' : 'Post Job'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobPostingForm;

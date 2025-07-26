
export interface JobListing {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  posted: string;
  description: string;
  detailedDescription?: string;
  responsibilities?: string[];
  qualifications?: string[];
  benefits?: string[];
  requirements: string[];
  salary: number;
  experience: string;
  certifications: string[];
  technologies: string[];
  featured?: boolean;
  company?: {
    name: string;
    logo?: string;
    description?: string;
  };
  contactEmail?: string;
  applicationDeadline?: string;
}

export const jobListings: JobListing[] = [
  {
    id: 1,
    title: "Field Sales Agent",
    department: "Sales",
    location: "Bamako, Mali",
    type: "Full-time",
    posted: "3 days ago",
    featured: true,
    description: "Join our field sales team to promote Club66 Global memberships and recruit new members across Bamako.",
    detailedDescription: "We are looking for energetic and persuasive Field Sales Agents to join our growing team. As a Field Sales Agent, you will be responsible for promoting Club66 Global memberships, educating potential customers about our services, and signing up new members. You will play a crucial role in expanding our member base and contributing to the growth of Club66 Global in Mali.",
    responsibilities: [
      "Actively promote Club66 Global memberships to individuals and businesses",
      "Educate potential members about our services and benefits",
      "Sign up new members and assist with the application process",
      "Meet and exceed sales targets",
      "Maintain accurate records of sales activities and customer interactions",
      "Identify market trends and opportunities for growth",
      "Participate in training and development programs to enhance sales skills"
    ],
    qualifications: [
      "High school diploma or equivalent",
      "Previous sales experience preferred, but not required",
      "Excellent communication and interpersonal skills",
      "Self-motivated with strong organizational abilities",
      "Fluency in French and Bambara",
      "Knowledge of the local market and culture",
      "Valid driver's license (preferred)"
    ],
    benefits: [
      "Competitive base salary plus commission structure",
      "Full Club66 Global membership benefits",
      "Career advancement opportunities",
      "Regular training and skills development",
      "Phone and transportation allowance",
      "Health insurance coverage"
    ],
    requirements: ["High school diploma", "Excellent communication skills", "Sales experience preferred", "Fluency in French and Bambara"],
    salary: 800,
    experience: "Entry-level",
    certifications: ["Sales Certification"],
    technologies: ["CRM Software"],
    company: {
      name: "Club66 Global",
      description: "Club66 Global is a leading membership organization providing access to financial services, discounts and benefits across Mali and beyond."
    },
    contactEmail: "careers@club66.com",
    applicationDeadline: "June 30, 2025"
  },
  {
    id: 2,
    title: "Customer Support Specialist",
    department: "Customer Service",
    location: "Bamako, Mali",
    type: "Full-time",
    posted: "1 week ago",
    featured: false,
    description: "Handle customer inquiries, membership activation, and provide excellent service to our growing member base.",
    detailedDescription: "As a Customer Support Specialist, you will be the front line of communication with our members. You will handle inquiries, resolve issues, and ensure our members receive the highest level of service. This role requires excellent communication skills, patience, and a genuine desire to help others. You will work as part of our dedicated customer service team in our Bamako headquarters.",
    responsibilities: [
      "Respond to member inquiries via phone, email, and in person",
      "Assist with membership activation and card issuance",
      "Resolve member issues and complaints in a timely and professional manner",
      "Process membership applications and updates",
      "Educate members about services and benefits",
      "Maintain accurate records of member interactions",
      "Identify and escalate complex issues when necessary",
      "Contribute to improving customer service processes and procedures"
    ],
    qualifications: [
      "Bachelor's degree in Business, Communications, or related field",
      "1-2 years of customer service experience",
      "Excellent verbal and written communication skills",
      "Strong problem-solving abilities",
      "Patience and empathy when dealing with difficult situations",
      "Fluency in French and English (Bambara is a plus)",
      "Proficiency with customer service software and tools"
    ],
    benefits: [
      "Competitive salary",
      "Full Club66 Global membership benefits",
      "Health insurance",
      "Performance bonuses",
      "Professional development opportunities",
      "Modern office environment"
    ],
    requirements: ["Bachelor's degree", "Customer service experience", "Strong problem-solving abilities", "Fluency in French and English"],
    salary: 1000,
    experience: "Mid-level",
    certifications: ["Customer Service Certification"],
    technologies: ["Zendesk", "Salesforce"],
    company: {
      name: "Club66 Global",
      description: "Club66 Global is a leading membership organization providing access to financial services, discounts and benefits across Mali and beyond."
    },
    contactEmail: "careers@club66.com",
    applicationDeadline: "June 15, 2025"
  },
  {
    id: 3,
    title: "Marketing Coordinator",
    department: "Marketing",
    location: "Bamako, Mali",
    type: "Full-time",
    posted: "2 weeks ago",
    featured: true,
    description: "Coordinate marketing campaigns, social media, and promotional events for Club66 Global across Mali.",
    requirements: ["Bachelor's degree in Marketing or related field", "2+ years of marketing experience", "Social media expertise", "Graphic design skills a plus"],
    salary: 1200,
    experience: "Mid-level",
    certifications: ["Digital Marketing Certification"],
    technologies: ["Adobe Creative Suite", "HubSpot"]
  },
  {
    id: 4,
    title: "Mobile App Developer",
    department: "Technology",
    location: "Remote",
    type: "Full-time",
    posted: "3 weeks ago",
    featured: false,
    description: "Develop and maintain our mobile applications for iOS and Android platforms.",
    requirements: ["Bachelor's degree in Computer Science", "3+ years of mobile app development", "Experience with React Native", "Backend integration skills"],
    salary: 2500,
    experience: "Senior-level",
    certifications: ["AWS Certification", "Google Developer Certification"],
    technologies: ["React Native", "JavaScript", "Firebase"]
  },
  {
    id: 5,
    title: "Merchant Relations Manager",
    department: "Partnerships",
    location: "Bamako, Mali",
    type: "Full-time",
    posted: "1 month ago",
    featured: false,
    description: "Develop and maintain relationships with merchant partners, negotiate discounts, and expand our partner network.",
    requirements: ["Bachelor's degree in Business", "3+ years in business development", "Strong negotiation skills", "Fluency in French and English"],
    salary: 1800,
    experience: "Senior-level",
    certifications: ["Business Management Certification"],
    technologies: ["CRM Software", "MS Office"]
  },
  {
    id: 6,
    title: "Field Agent Supervisor",
    department: "Sales",
    location: "Segou, Mali",
    type: "Full-time",
    posted: "2 days ago",
    featured: true,
    description: "Supervise a team of field agents, set targets, monitor performance, and provide training and support.",
    requirements: ["Bachelor's degree", "2+ years of sales management", "Leadership abilities", "Fluency in French and Bambara"],
    salary: 1500,
    experience: "Mid-level",
    certifications: ["Sales Management Certification", "Leadership Certification"],
    technologies: ["Sales Analytics Tools", "CRM Software"]
  },
  {
    id: 7,
    title: "Finance Officer",
    department: "Finance",
    location: "Bamako, Mali",
    type: "Full-time",
    posted: "5 days ago",
    featured: false,
    description: "Handle financial operations, payment processing, and reporting for Club66 Global Mali.",
    requirements: ["Bachelor's degree in Finance", "2+ years of finance experience", "Proficiency in accounting software", "Attention to detail"],
    salary: 1600,
    experience: "Mid-level",
    certifications: ["Accounting Certification"],
    technologies: ["QuickBooks", "Excel"]
  },
  {
    id: 8,
    title: "Social Media Assistant",
    department: "Marketing",
    location: "Bamako, Mali",
    type: "Part-time",
    posted: "1 week ago",
    featured: false,
    description: "Create and schedule content for social media platforms, engage with followers, and track metrics.",
    requirements: ["Diploma in Marketing", "Social media management experience", "Creative content creation skills", "Fluency in French"],
    salary: 700,
    experience: "Entry-level",
    certifications: ["Social Media Marketing Certification"],
    technologies: ["Canva", "Hootsuite", "Buffer"]
  }
];

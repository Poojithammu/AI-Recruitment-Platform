export const statsData = [
  { label: 'Active Hiring Jobs', value: '42', trend: '+12%', icon: 'Briefcase' },
  { label: 'Companies Hiring', value: '18', trend: '+5%', icon: 'Building' },
  { label: 'Contacts Found', value: '1,284', trend: '+24%', icon: 'Users' },
  { label: 'Candidates Matched', value: '856', trend: '+18%', icon: 'CheckCircle' },
  { label: 'Outreach Sent', value: '3,420', trend: '+32%', icon: 'Send' },
  { label: 'High Priority Leads', value: '12', trend: '-2%', icon: 'Star' },
  { label: 'Pending Follow Ups', value: '28', trend: '+8%', icon: 'Clock' },
  { label: 'New Notifications', value: '15', trend: 'New', icon: 'Bell' },
];

export const hiringJobs = [
  {
    id: '1',
    role: 'Senior Full Stack Engineer',
    company: 'TechFlow Solutions',
    skills: ['React', 'Node.js', 'AWS'],
    experience: '5-8 years',
    location: 'Remote',
    postedDate: '2024-05-10',
    status: 'Active',
    matchScore: 94,
  },
  {
    id: '2',
    role: 'AI Research Scientist',
    company: 'NeuralNet AI',
    skills: ['Python', 'PyTorch', 'NLP'],
    experience: '3-5 years',
    location: 'San Francisco, CA',
    postedDate: '2024-05-11',
    status: 'Active',
    matchScore: 88,
  },
  {
    id: '3',
    role: 'Product Designer',
    company: 'Creative Studio',
    skills: ['Figma', 'UI/UX', 'Prototyping'],
    experience: '2-4 years',
    location: 'New York, NY',
    postedDate: '2024-05-08',
    status: 'Closed',
    matchScore: 76,
  },
  {
    id: '4',
    role: 'DevOps Architect',
    company: 'CloudScale',
    skills: ['Kubernetes', 'Terraform', 'Go'],
    experience: '8+ years',
    location: 'Austin, TX',
    postedDate: '2024-05-09',
    status: 'Interviewing',
    matchScore: 92,
  },
];

export const candidates = [
  {
    id: 'c1',
    name: 'Alex Rivera',
    role: 'Senior React Developer',
    skills: ['React', 'TypeScript', 'Redux'],
    experience: '6 years',
    atsScore: 92,
    matchScore: 95,
    status: 'New Lead',
    availability: 'Immediate',
  },
  {
    id: 'c2',
    name: 'Sarah Chen',
    role: 'Backend Engineer',
    skills: ['Node.js', 'PostgreSQL', 'Docker'],
    experience: '4 years',
    atsScore: 88,
    matchScore: 82,
    status: 'Contacted',
    availability: '2 weeks',
  },
  {
    id: 'c3',
    name: 'Marcus Thorne',
    role: 'Full Stack Engineer',
    skills: ['Vue', 'Express', 'MongoDB'],
    experience: '5 years',
    atsScore: 85,
    matchScore: 78,
    status: 'Interview Scheduled',
    availability: '1 month',
  },
];

export const companies = [
  {
    id: 'comp1',
    name: 'TechFlow Solutions',
    industry: 'Software',
    hiringTrend: 'Increasing',
    hiringScore: 92,
    recruiters: 5,
    website: 'https://techflow.io',
    activeJobs: 12,
  },
  {
    id: 'comp2',
    name: 'NeuralNet AI',
    industry: 'Artificial Intelligence',
    hiringTrend: 'Rapid Growth',
    hiringScore: 98,
    recruiters: 8,
    website: 'https://neuralnet.ai',
    activeJobs: 24,
  },
];

export const outreachLogs = [
  { id: 'o1', type: 'Email', status: 'Sent', date: '2024-05-12', openRate: '65%', replies: 2 },
  { id: 'o2', type: 'LinkedIn', status: 'Opened', date: '2024-05-12', openRate: 'N/A', replies: 1 },
];

export const notifications = [
  { id: 'n1', type: 'AI extraction completed', message: 'JD for "Senior Backend Engineer" has been processed.', time: '5 mins ago', read: false },
  { id: 'n2', type: 'candidate matched', message: 'New match found for "Product Designer" (92% match).', time: '2 hours ago', read: false },
  { id: 'n3', type: 'outreach reply', message: 'Alex Rivera replied to your LinkedIn message.', time: '1 day ago', read: true },
];

export const leadScores = [
  { id: 'ls1', company: 'Google', score: 98, trend: 'up', signals: ['Large funding', 'Tech expansion'] },
  { id: 'ls2', company: 'Meta', score: 95, trend: 'up', signals: ['AI focused hiring'] },
];

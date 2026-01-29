import { Service, ServiceCategory } from '@/types';

export const mockServices: Service[] = [
  // Power Point
  {
    id: 'SRV-001',
    name: 'Corporate Presentation Design',
    description: 'Professional PowerPoint presentation with custom template and graphics',
    basePrice: 2000,
    estimatedHours: 8,
    category: 'powerpoint',
    active: true,
  },
  {
    id: 'SRV-002',
    name: 'Pitch Deck Design',
    description: 'Investor pitch deck with data visualization and storytelling',
    basePrice: 5000,
    estimatedHours: 20,
    category: 'powerpoint',
    active: true,
  },

  // Video
  {
    id: 'SRV-003',
    name: 'Explainer Video (60s)',
    description: '60-second animated explainer video with voiceover',
    basePrice: 12000,
    estimatedHours: 48,
    category: 'video',
    active: true,
  },
  {
    id: 'SRV-004',
    name: 'Corporate Video (2-3 min)',
    description: 'Company profile or promotional video with motion graphics',
    basePrice: 20000,
    estimatedHours: 80,
    category: 'video',
    active: true,
  },

  // Branding
  {
    id: 'SRV-005',
    name: 'Logo Design',
    description: 'Complete logo design with 3 concepts, revisions, and final files',
    basePrice: 5000,
    estimatedHours: 20,
    category: 'branding',
    active: true,
  },
  {
    id: 'SRV-006',
    name: 'Brand Identity Package',
    description: 'Full brand identity: logo, colors, typography, brand guidelines',
    basePrice: 15000,
    estimatedHours: 60,
    category: 'branding',
    active: true,
  },
];

// Get service by ID
export const getServiceById = (id: string): Service | undefined => {
  return mockServices.find((s) => s.id === id);
};

// Get services by category
export const getServicesByCategory = (category: ServiceCategory): Service[] => {
  return mockServices.filter((s) => s.category === category && s.active);
};

// Get active services
export const getActiveServices = (): Service[] => {
  return mockServices.filter((s) => s.active);
};

// Search services
export const searchServices = (query: string): Service[] => {
  const lowerQuery = query.toLowerCase();
  return mockServices.filter(
    (s) =>
      s.name.toLowerCase().includes(lowerQuery) ||
      s.description.toLowerCase().includes(lowerQuery) ||
      s.category.toLowerCase().includes(lowerQuery)
  );
};

// Category labels for display
export const serviceCategoryLabels: Record<ServiceCategory, string> = {
  powerpoint: 'Power Point',
  video: 'Video',
  branding: 'Branding',
};

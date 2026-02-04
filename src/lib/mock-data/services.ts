import { Service, ServiceCategory } from '@/types';

// Mock categories (matching service_categories table)
const mockCategories: Record<string, ServiceCategory> = {
  powerpoint: { id: 'cat-ppt', name: 'PowerPoint', sortOrder: 1 },
  video: { id: 'cat-video', name: 'Video', sortOrder: 2 },
  branding: { id: 'cat-branding', name: 'Branding', sortOrder: 3 },
};

export const mockServices: Service[] = [
  // Power Point
  {
    id: 'SRV-001',
    name: 'Corporate Presentation Design',
    description: 'Professional PowerPoint presentation with custom template and graphics',
    estimatedHours: 8,
    categoryId: mockCategories.powerpoint.id,
    category: mockCategories.powerpoint,
    active: true,
  },
  {
    id: 'SRV-002',
    name: 'Pitch Deck Design',
    description: 'Investor pitch deck with data visualization and storytelling',
    estimatedHours: 20,
    categoryId: mockCategories.powerpoint.id,
    category: mockCategories.powerpoint,
    active: true,
  },

  // Video
  {
    id: 'SRV-003',
    name: 'Explainer Video (60s)',
    description: '60-second animated explainer video with voiceover',
    estimatedHours: 48,
    categoryId: mockCategories.video.id,
    category: mockCategories.video,
    active: true,
  },
  {
    id: 'SRV-004',
    name: 'Corporate Video (2-3 min)',
    description: 'Company profile or promotional video with motion graphics',
    estimatedHours: 80,
    categoryId: mockCategories.video.id,
    category: mockCategories.video,
    active: true,
  },

  // Branding
  {
    id: 'SRV-005',
    name: 'Logo Design',
    description: 'Complete logo design with 3 concepts, revisions, and final files',
    estimatedHours: 20,
    categoryId: mockCategories.branding.id,
    category: mockCategories.branding,
    active: true,
  },
  {
    id: 'SRV-006',
    name: 'Brand Identity Package',
    description: 'Full brand identity: logo, colors, typography, brand guidelines',
    estimatedHours: 60,
    categoryId: mockCategories.branding.id,
    category: mockCategories.branding,
    active: true,
  },
];

// Get service by ID
export const getServiceById = (id: string): Service | undefined => {
  return mockServices.find((s) => s.id === id);
};

// Get services by category ID
export const getServicesByCategoryId = (categoryId: string): Service[] => {
  return mockServices.filter((s) => s.categoryId === categoryId && s.active);
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
      (s.category?.name.toLowerCase().includes(lowerQuery) ?? false)
  );
};

// Category labels for display
export const serviceCategoryLabels: Record<string, string> = {
  powerpoint: 'PowerPoint',
  video: 'Video',
  branding: 'Branding',
};

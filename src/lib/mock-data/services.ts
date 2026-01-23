import { Service, ServiceCategory } from '@/types';

export const mockServices: Service[] = [
  // Social Media
  {
    id: 'SRV-001',
    name: 'Social Media Post Design',
    description: 'Single post design with creative design, brand reflection style, infographic feel, and unique layouts',
    basePrice: 500,
    estimatedHours: 2,
    category: 'social',
    active: true,
  },
  {
    id: 'SRV-002',
    name: 'Social Media Package (25 Posts)',
    description: 'Monthly package: 25 posts with creative design, brand reflection style, text design and layout style',
    basePrice: 5700,
    estimatedHours: 40,
    category: 'social',
    active: true,
  },
  {
    id: 'SRV-003',
    name: 'Story/Reel Design',
    description: 'Instagram/TikTok story or reel design with animations',
    basePrice: 350,
    estimatedHours: 1.5,
    category: 'social',
    active: true,
  },
  {
    id: 'SRV-004',
    name: 'Social Media Campaign',
    description: 'Multi-post campaign with unified visual identity and messaging',
    basePrice: 3500,
    estimatedHours: 16,
    category: 'social',
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
  {
    id: 'SRV-007',
    name: 'Brand Guidelines Document',
    description: 'Comprehensive brand guidelines document (20-30 pages)',
    basePrice: 4000,
    estimatedHours: 16,
    category: 'branding',
    active: true,
  },
  {
    id: 'SRV-008',
    name: 'Stationery Design',
    description: 'Business cards, letterhead, envelope, email signature',
    basePrice: 2500,
    estimatedHours: 10,
    category: 'branding',
    active: true,
  },

  // Motion/Video
  {
    id: 'SRV-009',
    name: 'Logo Reveal Animation (30-50s)',
    description: 'Innovative & modern logo reveal with particle effects, brand reflection style, abstract motion',
    basePrice: 6000,
    estimatedHours: 24,
    category: 'motion',
    active: true,
  },
  {
    id: 'SRV-010',
    name: 'Explainer Video (60s)',
    description: '60-second animated explainer video with voiceover',
    basePrice: 12000,
    estimatedHours: 48,
    category: 'motion',
    active: true,
  },
  {
    id: 'SRV-011',
    name: 'Social Media Video (15-30s)',
    description: 'Short promotional video for social media',
    basePrice: 3000,
    estimatedHours: 12,
    category: 'motion',
    active: true,
  },
  {
    id: 'SRV-012',
    name: 'Corporate Video (2-3 min)',
    description: 'Company profile or promotional video with motion graphics',
    basePrice: 20000,
    estimatedHours: 80,
    category: 'motion',
    active: true,
  },

  // Print
  {
    id: 'SRV-013',
    name: 'Brochure Design (Tri-fold)',
    description: 'Tri-fold brochure design, print-ready',
    basePrice: 1500,
    estimatedHours: 6,
    category: 'print',
    active: true,
  },
  {
    id: 'SRV-014',
    name: 'Company Profile (20 pages)',
    description: 'Corporate company profile booklet design',
    basePrice: 8000,
    estimatedHours: 32,
    category: 'print',
    active: true,
  },
  {
    id: 'SRV-015',
    name: 'Flyer Design',
    description: 'Single page flyer design (A4/A5)',
    basePrice: 800,
    estimatedHours: 3,
    category: 'print',
    active: true,
  },
  {
    id: 'SRV-016',
    name: 'Annual Report Design',
    description: 'Full annual report design with infographics and data visualization',
    basePrice: 25000,
    estimatedHours: 100,
    category: 'print',
    active: true,
  },
  {
    id: 'SRV-017',
    name: 'Magazine/Catalogue Design',
    description: 'Multi-page magazine or product catalogue design',
    basePrice: 15000,
    estimatedHours: 60,
    category: 'print',
    active: true,
  },

  // Web
  {
    id: 'SRV-018',
    name: 'Website UI Design',
    description: 'Complete website UI design (up to 10 pages)',
    basePrice: 12000,
    estimatedHours: 48,
    category: 'web',
    active: true,
  },
  {
    id: 'SRV-019',
    name: 'Landing Page Design',
    description: 'Single landing page UI design',
    basePrice: 3000,
    estimatedHours: 12,
    category: 'web',
    active: true,
  },
  {
    id: 'SRV-020',
    name: 'Mobile App UI Design',
    description: 'Mobile app UI design (iOS/Android)',
    basePrice: 15000,
    estimatedHours: 60,
    category: 'web',
    active: true,
  },

  // Packaging
  {
    id: 'SRV-021',
    name: 'Product Packaging Design',
    description: 'Single product packaging design with 3D mockups',
    basePrice: 4000,
    estimatedHours: 16,
    category: 'packaging',
    active: true,
  },
  {
    id: 'SRV-022',
    name: 'Product Line Packaging',
    description: 'Packaging design for product line (3-5 products)',
    basePrice: 12000,
    estimatedHours: 48,
    category: 'packaging',
    active: true,
  },

  // Signage
  {
    id: 'SRV-023',
    name: 'Signage Design',
    description: 'Indoor/outdoor signage design',
    basePrice: 2000,
    estimatedHours: 8,
    category: 'signage',
    active: true,
  },
  {
    id: 'SRV-024',
    name: 'Exhibition Stand Design',
    description: 'Trade show/exhibition stand design with 3D visualization',
    basePrice: 8000,
    estimatedHours: 32,
    category: 'signage',
    active: true,
  },
  {
    id: 'SRV-025',
    name: 'Vehicle Wrap Design',
    description: 'Full vehicle wrap design with mockups',
    basePrice: 3500,
    estimatedHours: 14,
    category: 'signage',
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
  social: 'Social Media',
  print: 'Print Design',
  branding: 'Branding',
  video: 'Video Production',
  web: 'Web & Digital',
  packaging: 'Packaging',
  signage: 'Signage & Environmental',
  motion: 'Motion Graphics',
};

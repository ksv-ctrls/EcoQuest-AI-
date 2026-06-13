import type { SDGGoal } from '@/types/sdg'

export const mockSdgGoals: SDGGoal[] = [
  {
    id: 'sdg-1',
    number: 1,
    title: 'No Poverty',
    shortDescription: 'End poverty in all its forms everywhere.',
    description:
      'Goal 1 aims to eradicate extreme poverty and ensure equal access to economic resources, basic services, and social protection for all people.',
    color: '#E5243B',
    category: 'people',
    relatedLessonIds: [],
    relatedGameIds: ['family-budget'],
    keywords: ['poverty', 'income', 'social protection', 'equality'],
  },
  {
    id: 'sdg-2',
    number: 2,
    title: 'Zero Hunger',
    shortDescription: 'End hunger and promote sustainable agriculture.',
    description:
      'Goal 2 focuses on ending hunger, achieving food security, improving nutrition, and promoting sustainable food production systems.',
    color: '#DDA63A',
    category: 'people',
    relatedLessonIds: [],
    relatedGameIds: [],
    keywords: ['hunger', 'food', 'agriculture', 'nutrition'],
  },
  {
    id: 'sdg-3',
    number: 3,
    title: 'Good Health and Well-Being',
    shortDescription: 'Ensure healthy lives for all at every age.',
    description:
      'Goal 3 seeks to ensure healthy lives and promote well-being for everyone, including reducing pollution-related health risks tied to environmental degradation.',
    color: '#4C9F38',
    category: 'people',
    relatedLessonIds: [],
    relatedGameIds: [],
    keywords: ['health', 'well-being', 'pollution', 'wellness'],
  },
  {
    id: 'sdg-4',
    number: 4,
    title: 'Quality Education',
    shortDescription: 'Inclusive, equitable quality education for all.',
    description:
      'Goal 4 promotes lifelong learning opportunities for all, including education for sustainable development and climate literacy.',
    color: '#C5192D',
    category: 'people',
    relatedLessonIds: ['climate-basics', 'biodiversity-conservation'],
    relatedGameIds: [],
    keywords: ['education', 'learning', 'literacy', 'skills'],
  },
  {
    id: 'sdg-5',
    number: 5,
    title: 'Gender Equality',
    shortDescription: 'Achieve gender equality and empower all women and girls.',
    description:
      'Goal 5 aims to end discrimination and violence while ensuring equal participation in environmental decision-making and green jobs.',
    color: '#FF3A21',
    category: 'people',
    relatedLessonIds: [],
    relatedGameIds: [],
    keywords: ['gender', 'equality', 'empowerment', 'inclusion'],
  },
  {
    id: 'sdg-6',
    number: 6,
    title: 'Clean Water and Sanitation',
    shortDescription: 'Ensure availability of water and sanitation for all.',
    description:
      'Goal 6 ensures access to safe water and sanitation while protecting freshwater ecosystems and reducing water pollution.',
    color: '#26BDE2',
    category: 'planet',
    relatedLessonIds: ['water-conservation'],
    relatedGameIds: [],
    keywords: ['water', 'sanitation', 'rivers', 'conservation'],
  },
  {
    id: 'sdg-7',
    number: 7,
    title: 'Affordable and Clean Energy',
    shortDescription: 'Ensure access to sustainable, modern energy for all.',
    description:
      'Goal 7 expands renewable energy access, improves efficiency, and supports the transition away from fossil fuels.',
    color: '#FCC30B',
    category: 'planet',
    relatedLessonIds: ['renewable-energy'],
    relatedGameIds: ['carbon-dash'],
    keywords: ['energy', 'renewable', 'solar', 'efficiency'],
  },
  {
    id: 'sdg-8',
    number: 8,
    title: 'Decent Work and Economic Growth',
    shortDescription: 'Promote inclusive, sustainable economic growth.',
    description:
      'Goal 8 encourages green jobs, sustainable tourism, and resource-efficient growth that respects planetary boundaries.',
    color: '#A21942',
    category: 'prosperity',
    relatedLessonIds: [],
    relatedGameIds: ['family-budget'],
    keywords: ['jobs', 'economy', 'growth', 'green jobs'],
  },
  {
    id: 'sdg-9',
    number: 9,
    title: 'Industry, Innovation and Infrastructure',
    shortDescription: 'Build resilient, sustainable infrastructure.',
    description:
      'Goal 9 supports clean technologies, sustainable industrialization, and innovation for climate-resilient infrastructure.',
    color: '#FD6925',
    category: 'prosperity',
    relatedLessonIds: [],
    relatedGameIds: ['city-sim'],
    keywords: ['innovation', 'infrastructure', 'technology', 'industry'],
  },
  {
    id: 'sdg-10',
    number: 10,
    title: 'Reduced Inequalities',
    shortDescription: 'Reduce inequality within and among countries.',
    description:
      'Goal 10 addresses disparities in climate vulnerability, ensuring marginalized communities are included in sustainability transitions.',
    color: '#DD1367',
    category: 'prosperity',
    relatedLessonIds: [],
    relatedGameIds: [],
    keywords: ['inequality', 'inclusion', 'justice', 'equity'],
  },
  {
    id: 'sdg-11',
    number: 11,
    title: 'Sustainable Cities and Communities',
    shortDescription: 'Make cities inclusive, safe, and sustainable.',
    description:
      'Goal 11 promotes affordable housing, green public spaces, sustainable transport, and disaster-resilient urban planning.',
    color: '#FD9D24',
    category: 'prosperity',
    relatedLessonIds: ['sustainable-cities'],
    relatedGameIds: ['city-sim'],
    keywords: ['cities', 'urban', 'transport', 'communities'],
  },
  {
    id: 'sdg-12',
    number: 12,
    title: 'Responsible Consumption and Production',
    shortDescription: 'Ensure sustainable consumption and production patterns.',
    description:
      'Goal 12 encourages waste reduction, circular economy practices, and sustainable lifestyles across supply chains.',
    color: '#BF8B2E',
    category: 'prosperity',
    relatedLessonIds: ['waste-management'],
    relatedGameIds: ['waste-sorting', 'family-budget'],
    keywords: ['consumption', 'waste', 'recycling', 'circular economy'],
  },
  {
    id: 'sdg-13',
    number: 13,
    title: 'Climate Action',
    shortDescription: 'Take urgent action to combat climate change.',
    description:
      'Goal 13 strengthens resilience to climate impacts, integrates climate measures into policy, and improves education and awareness.',
    color: '#3F7E44',
    category: 'planet',
    relatedLessonIds: ['climate-basics', 'carbon-footprint'],
    relatedGameIds: ['carbon-dash'],
    keywords: ['climate', 'emissions', 'carbon', 'global warming'],
  },
  {
    id: 'sdg-14',
    number: 14,
    title: 'Life Below Water',
    shortDescription: 'Conserve and sustainably use oceans and marine resources.',
    description:
      'Goal 14 protects marine ecosystems, reduces ocean pollution, and supports sustainable fisheries and coastal habitats.',
    color: '#0A97D9',
    category: 'planet',
    relatedLessonIds: ['biodiversity-conservation'],
    relatedGameIds: [],
    keywords: ['ocean', 'marine', 'coral', 'fisheries'],
  },
  {
    id: 'sdg-15',
    number: 15,
    title: 'Life on Land',
    shortDescription: 'Protect terrestrial ecosystems and halt biodiversity loss.',
    description:
      'Goal 15 focuses on forests, desertification, land degradation, and protecting biodiversity and endangered species.',
    color: '#56C02B',
    category: 'planet',
    relatedLessonIds: ['biodiversity-conservation', 'wildlife-india'],
    relatedGameIds: ['biodiversity-quest'],
    keywords: ['biodiversity', 'forests', 'wildlife', 'habitats'],
  },
  {
    id: 'sdg-16',
    number: 16,
    title: 'Peace, Justice and Strong Institutions',
    shortDescription: 'Promote peaceful, inclusive societies.',
    description:
      'Goal 16 builds effective, accountable institutions and ensures access to justice — foundations for environmental governance.',
    color: '#00689D',
    category: 'peace',
    relatedLessonIds: [],
    relatedGameIds: [],
    keywords: ['peace', 'justice', 'governance', 'institutions'],
  },
  {
    id: 'sdg-17',
    number: 17,
    title: 'Partnerships for the Goals',
    shortDescription: 'Strengthen global partnerships for sustainable development.',
    description:
      'Goal 17 mobilizes finance, technology, and multi-stakeholder partnerships needed to achieve all other SDGs.',
    color: '#19486A',
    category: 'partnership',
    relatedLessonIds: [],
    relatedGameIds: [],
    keywords: ['partnerships', 'cooperation', 'finance', 'global'],
  },
]

export function getSdgByNumber(number: number): SDGGoal | undefined {
  return mockSdgGoals.find((goal) => goal.number === number)
}

export function getSdgById(id: string): SDGGoal | undefined {
  return mockSdgGoals.find((goal) => goal.id === id)
}

export const mockGameTitles: Record<string, string> = {
  'family-budget': 'Eco Family Budget Challenge',
  'carbon-dash': 'Carbon Footprint Dash',
  'waste-sorting': 'Zero-Waste Sorting Lab',
  'city-sim': 'City of Tomorrow Simulator',
  'biodiversity-quest': 'Biodiversity Rescue Quest',
}

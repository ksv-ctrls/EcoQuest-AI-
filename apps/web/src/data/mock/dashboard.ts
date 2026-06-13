import type { DashboardData } from '@/types/dashboard'

export const mockDashboardData: DashboardData = {
  stats: {
    ecoPoints: 1250,
    lessonsCompleted: 18,
    totalLessons: 30,
    quizzesCompleted: 12,
    gamesPlayed: 6,
  },
  lessonProgress: [
    {
      id: 'climate-basics',
      title: 'Climate Change Basics',
      status: 'completed',
      sdgIds: [13],
    },
    {
      id: 'biodiversity-conservation',
      title: 'Biodiversity & Habitat Conservation',
      status: 'in_progress',
      sdgIds: [14, 15],
    },
    {
      id: 'waste-management',
      title: 'Waste Management Techniques',
      status: 'not_started',
      sdgIds: [12],
    },
    {
      id: 'water-conservation',
      title: 'Water Conservation Strategies',
      status: 'completed',
      sdgIds: [6],
    },
    {
      id: 'renewable-energy',
      title: 'Renewable Energy Sources',
      status: 'completed',
      sdgIds: [7],
    },
    {
      id: 'sustainable-cities',
      title: 'Sustainable Cities & Communities',
      status: 'in_progress',
      sdgIds: [11],
    },
  ],
  challenges: [
    {
      id: 'water-week',
      title: 'Water Conservation Week',
      description: 'Track and reduce your water usage for 7 days',
      difficulty: 'easy',
      points: 150,
    },
    {
      id: 'plastic-free',
      title: 'Plastic-Free Campus Challenge',
      description: 'Organize a plastic-free day in your school',
      difficulty: 'medium',
      points: 300,
    },
    {
      id: 'wildlife-doc',
      title: 'Local Wildlife Documentation',
      description: 'Document 10 local species and their habitats',
      difficulty: 'medium',
      points: 200,
    },
  ],
  badges: [
    {
      id: 'water-warrior',
      emoji: '💧',
      title: 'Water Warrior',
      description: 'Completed 5 water conservation challenges',
      earned: true,
    },
    {
      id: 'eco-explorer',
      emoji: '🌱',
      title: 'Eco Explorer',
      description: 'Documented 50 local species',
      earned: true,
    },
    {
      id: 'waste-fighter',
      emoji: '♻️',
      title: 'Waste Fighter',
      description: 'Reduced waste by 50%',
      earned: false,
    },
    {
      id: 'green-leader',
      emoji: '🏅',
      title: 'Green Leader',
      description: 'Led 3 environmental initiatives',
      earned: false,
    },
  ],
  weeklyGoal: {
    label: 'Complete 3 challenges',
    current: 2,
    target: 3,
  },
  levelProgress: {
    currentLevel: 8,
    nextLevel: 9,
    progressPercent: 65,
    pointsToNext: 350,
  },
}

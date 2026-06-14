import type { BadgeDefinition } from '@/types/gamification'

export const badgeDefinitions: BadgeDefinition[] = [
  {
    id: 'green_beginner',
    name: 'Green Beginner',
    icon: '🌱',
    description: 'Reach Level 2 or earn your first achievement.',
    category: 'beginner',
  },
  {
    id: 'water_guardian',
    name: 'Water Guardian',
    icon: '💧',
    description: 'Complete a water challenge or mission.',
    category: 'water',
  },
  {
    id: 'climate_defender',
    name: 'Climate Defender',
    icon: '🌍',
    description: 'Finish a climate action mission or quiz.',
    category: 'climate',
  },
  {
    id: 'forest_protector',
    name: 'Forest Protector',
    icon: '🌳',
    description: 'Complete a nature-focused mission or lesson.',
    category: 'forest',
  },
  {
    id: 'sustainability_champion',
    name: 'Sustainability Champion',
    icon: '🏆',
    description: 'Collect multiple badges and show strong EcoQuest progress.',
    category: 'champion',
  },
]

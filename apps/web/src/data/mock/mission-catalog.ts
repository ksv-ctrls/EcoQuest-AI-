import { mockSdgGoals } from '@/data/mock/sdg'
import type {
  Mission,
  MissionDifficulty,
  MissionProgressMap,
  MissionProgressStats,
  MissionState,
  SDGMissionCatalog,
  SDGMissionStats,
} from '@/types/mission'

const difficultyRank: Record<MissionDifficulty, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
}

function aggregateDifficulty(missions: Mission[]): MissionDifficulty {
  const max = missions.reduce(
    (acc, m) => Math.max(acc, difficultyRank[m.difficulty]),
    1,
  )
  return (Object.entries(difficultyRank).find(([, r]) => r === max)?.[0] ??
    'beginner') as MissionDifficulty
}

export const allMissions: Mission[] = [
  ...fullSdg6Missions(),
  ...fullSdg11Missions(),
  ...fullSdg13Missions(),
  ...fullSdg15Missions(),
  ...placeholderMissions(),
]

export function getMissionById(id: string): Mission | undefined {
  return allMissions.find((m) => m.id === id)
}

export function getMissionsBySdgId(sdgId: string): Mission[] {
  return allMissions.filter((m) => m.sdgId === sdgId)
}

export function getSdgMissionCatalog(sdgId: string): SDGMissionCatalog | undefined {
  const sdg = mockSdgGoals.find((g) => g.id === sdgId)
  if (!sdg) return undefined
  return {
    sdgId: sdg.id,
    sdgNumber: sdg.number,
    title: sdg.title,
    overview: sdg.description,
    color: sdg.color,
    missions: getMissionsBySdgId(sdgId),
  }
}

export function getAllSdgMissionCatalogs(): SDGMissionCatalog[] {
  return mockSdgGoals.map((sdg) => ({
    sdgId: sdg.id,
    sdgNumber: sdg.number,
    title: sdg.title,
    overview: sdg.description,
    color: sdg.color,
    missions: getMissionsBySdgId(sdg.id),
  }))
}

export function getMissionState(
  missionId: string,
  progress: MissionProgressMap,
  mission: Mission,
): MissionState {
  return progress[missionId]?.state ?? (mission.isPlaceholder ? 'locked' : 'available')
}

export function getSdgMissionStats(
  sdgId: string,
  progress: MissionProgressMap,
): SDGMissionStats | undefined {
  const catalog = getSdgMissionCatalog(sdgId)
  if (!catalog) return undefined

  const completedCount = catalog.missions.filter(
    (m) => getMissionState(m.id, progress, m) === 'completed',
  ).length

  return {
    sdgId,
    missionCount: catalog.missions.length,
    completionPercent:
      catalog.missions.length === 0
        ? 0
        : Math.round((completedCount / catalog.missions.length) * 100),
    difficulty: aggregateDifficulty(catalog.missions),
    estimatedMinutes: catalog.missions.reduce((s, m) => s + m.estimatedMinutes, 0),
    completedCount,
  }
}

export function getMissionProgressStats(
  progress: MissionProgressMap,
): MissionProgressStats {
  let completedMissions = 0
  let activeCount = 0
  let environmentalImpactScore = 0
  let totalXpEarned = 0
  let totalEcoCoinsEarned = 0

  for (const mission of allMissions) {
    const state = getMissionState(mission.id, progress, mission)
    if (state === 'completed') {
      completedMissions += 1
      environmentalImpactScore += mission.impactMetric.targetValue
      totalXpEarned += mission.xpReward
      totalEcoCoinsEarned += mission.ecoCoinReward
    } else if (
      state === 'in_progress' ||
      state === 'submitted' ||
      state === 'approved'
    ) {
      activeCount += 1
    }
  }

  return {
    totalMissions: allMissions.length,
    completedMissions,
    completionRate:
      allMissions.length === 0
        ? 0
        : Math.round((completedMissions / allMissions.length) * 100),
    currentStreak: calculateMissionStreak(progress),
    environmentalImpactScore,
    activeCount,
    totalXpEarned,
    totalEcoCoinsEarned,
  }
}

function calculateMissionStreak(progress: MissionProgressMap): number {
  const dates = Object.values(progress)
    .map((e) => e.updatedAt.slice(0, 10))
    .filter(Boolean)
  const unique = [...new Set(dates)].sort().reverse()
  if (unique.length === 0) return 0

  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < unique.length; i++) {
    const expected = new Date(today)
    expected.setDate(expected.getDate() - i)
    if (unique.includes(expected.toISOString().slice(0, 10))) {
      streak += 1
    } else if (i === 0) {
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      if (unique[0] === yesterday.toISOString().slice(0, 10)) streak = 1
      break
    } else break
  }
  return streak
}

/** @deprecated Use getMissionById — kept for quiz result compatibility */
export function getMissionForSdg(sdgId: string): Mission | undefined {
  return allMissions.find((m) => m.sdgId === sdgId && !m.isPlaceholder)
}

function fullSdg6Missions(): Mission[] {
  return [
    {
      id: 'water-week',
      sdgId: 'sdg-6',
      sdgNumber: 6,
      title: 'Water Conservation Week',
      description:
        'Track and reduce your household or school water usage for 7 days with measurable goals.',
      difficulty: 'beginner',
      estimatedMinutes: 420,
      xpReward: 150,
      ecoCoinReward: 75,
      impactMetric: {
        label: 'Water saved',
        unit: 'litres',
        targetValue: 350,
        description: 'Estimated litres saved through conservation actions over one week.',
      },
      objectives: [
        'Establish a baseline daily water usage estimate.',
        'Implement at least 3 conservation habits for 7 days.',
        'Document results with photos or a simple log.',
      ],
      instructions: [
        'Day 1: Audit taps, showers, and leaks. Fix any dripping fixtures.',
        'Days 2–6: Apply habits — shorter showers, full laundry loads, reuse rinse water for plants.',
        'Day 7: Calculate estimated savings and submit your log with a photo of one action.',
      ],
      environmentalImpact:
        'Reducing water demand eases pressure on rivers, aquifers, and municipal systems — directly supporting SDG 6 clean water targets.',
      relatedLessonId: 'water-conservation',
      relatedQuizId: 'water-conservation-quiz',
    },
    {
      id: 'river-watch',
      sdgId: 'sdg-6',
      sdgNumber: 6,
      title: 'River Health Watch',
      description:
        'Observe a local river, lake, or stream and document signs of health or pollution.',
      difficulty: 'intermediate',
      estimatedMinutes: 90,
      xpReward: 180,
      ecoCoinReward: 90,
      impactMetric: {
        label: 'Water bodies monitored',
        unit: 'sites',
        targetValue: 1,
        description: 'Local freshwater site assessed and documented.',
      },
      objectives: [
        'Visit a nearby freshwater body safely with an adult if needed.',
        'Record observations: clarity, litter, wildlife, vegetation.',
        'Propose one community action to improve water quality.',
      ],
      instructions: [
        'Choose a safe, accessible water body. Never enter unsafe or private areas.',
        'Use the observation checklist: colour/odour, litter type, plants, birds, fish signs.',
        'Take a photo (from a safe distance) and write 3 observations plus 1 recommended action.',
        'Submit your field notes and photo through the mission form.',
      ],
      environmentalImpact:
        'Community monitoring builds accountability for freshwater protection and early detection of pollution.',
      relatedLessonId: 'water-quality-protection',
      relatedQuizId: 'water-quality-protection-quiz',
    },
  ]
}

function fullSdg11Missions(): Mission[] {
  return [
    {
      id: 'urban-green',
      sdgId: 'sdg-11',
      sdgNumber: 11,
      title: 'Green Your Block',
      description:
        'Identify and propose one improvement for green space, trees, or safe walking/cycling near your home or school.',
      difficulty: 'intermediate',
      estimatedMinutes: 120,
      xpReward: 220,
      ecoCoinReward: 110,
      impactMetric: {
        label: 'Green improvements proposed',
        unit: 'proposals',
        targetValue: 1,
        description: 'Actionable proposal submitted for local urban sustainability.',
      },
      objectives: [
        'Map one area lacking green space or safe active transport.',
        'Research one proven solution (tree planting, parklet, bike rack, crossing).',
        'Create a simple proposal with photo and rationale.',
      ],
      instructions: [
        'Walk your neighbourhood and note heat, noise, lack of shade, or unsafe crossings.',
        'Draft a one-page proposal: problem, solution, who benefits, estimated impact.',
        'Optional: share with a teacher or local councillor.',
        'Submit your proposal summary and a supporting photo.',
      ],
      environmentalImpact:
        'Urban greening reduces heat islands, improves air quality, and makes cities more livable under SDG 11.',
      relatedLessonId: 'sustainable-cities',
      relatedQuizId: 'sustainable-cities-quiz',
    },
    {
      id: 'carbon-challenge',
      sdgId: 'sdg-11',
      sdgNumber: 11,
      title: 'Low-Carbon Commute Challenge',
      description:
        'Use walking, cycling, or public transport instead of solo car trips for 5 school days.',
      difficulty: 'beginner',
      estimatedMinutes: 300,
      xpReward: 175,
      ecoCoinReward: 85,
      impactMetric: {
        label: 'CO₂ avoided',
        unit: 'kg CO₂e',
        targetValue: 12,
        description: 'Estimated emissions avoided by shifting low-carbon commutes.',
      },
      objectives: [
        'Log each commute mode for 5 days.',
        'Aim for at least 4 low-carbon trips.',
        'Reflect on barriers and what would make active travel easier.',
      ],
      instructions: [
        'Before starting: note your usual commute mode and distance.',
        'Each day: record walk, bike, bus, carpool, or car alone.',
        'Use an online calculator or estimate ~0.2 kg CO₂/km saved vs solo car.',
        'Submit your 5-day log and total estimated CO₂ avoided.',
      ],
      environmentalImpact:
        'Transport is a major urban emissions source — modal shift cuts air pollution and congestion.',
      relatedLessonId: 'green-transport',
      relatedQuizId: 'green-transport-quiz',
    },
  ]
}

function fullSdg13Missions(): Mission[] {
  return [
    {
      id: 'climate-action-week',
      sdgId: 'sdg-13',
      sdgNumber: 13,
      title: 'Climate Action Week',
      description:
        'Complete 5 personal carbon-reduction actions over 7 days and document your impact.',
      difficulty: 'intermediate',
      estimatedMinutes: 360,
      xpReward: 200,
      ecoCoinReward: 100,
      impactMetric: {
        label: 'Climate actions completed',
        unit: 'actions',
        targetValue: 5,
        description: 'Verified personal actions reducing carbon footprint.',
      },
      objectives: [
        'Choose 5 high-impact actions from the climate action menu.',
        'Complete each action and record evidence.',
        'Calculate approximate combined impact.',
      ],
      instructions: [
        'Pick 5 from: meat-free day, unplug standby power, line-dry laundry, short shower, walk/cycle trip, LED swap, waste-free lunch.',
        'Execute one action per day (or batch across the week).',
        'Photo or note each action.',
        'Submit your action log with total estimated impact.',
      ],
      environmentalImpact:
        'Individual actions scale through habit change and community influence — essential for SDG 13 climate literacy.',
      relatedLessonId: 'climate-basics',
      relatedQuizId: 'climate-basics-quiz',
    },
    {
      id: 'home-energy-audit',
      sdgId: 'sdg-13',
      sdgNumber: 13,
      title: 'Home Energy Audit',
      description:
        'Conduct a simple home or classroom energy audit and implement two efficiency fixes.',
      difficulty: 'beginner',
      estimatedMinutes: 90,
      xpReward: 160,
      ecoCoinReward: 80,
      impactMetric: {
        label: 'Energy fixes applied',
        unit: 'fixes',
        targetValue: 2,
        description: 'Practical efficiency improvements implemented.',
      },
      objectives: [
        'Identify top energy uses: lighting, AC, standby devices, heating.',
        'Implement two low-cost fixes immediately.',
        'Estimate monthly savings.',
      ],
      instructions: [
        'Walk through each room: count lights left on, feel for drafts, check standby LEDs.',
        'Fixes: switch to LED, seal a draft, unplug unused chargers, adjust thermostat.',
        'Document before/after with photos.',
        'Submit audit summary and fixes completed.',
      ],
      environmentalImpact:
        'Energy efficiency reduces fossil fuel demand and household emissions — a direct climate action.',
      relatedLessonId: 'carbon-footprint',
      relatedQuizId: 'carbon-footprint-quiz',
    },
  ]
}

function fullSdg15Missions(): Mission[] {
  return [
    {
      id: 'wildlife-doc',
      sdgId: 'sdg-15',
      sdgNumber: 15,
      title: 'Local Wildlife Documentation',
      description:
        'Document 10 local species (plants, insects, birds, or mammals) and their habitats in your area.',
      difficulty: 'intermediate',
      estimatedMinutes: 180,
      xpReward: 200,
      ecoCoinReward: 100,
      impactMetric: {
        label: 'Species documented',
        unit: 'species',
        targetValue: 10,
        description: 'Local biodiversity records contributing to habitat awareness.',
      },
      objectives: [
        'Safely observe and identify 10 species using guides or apps.',
        'Note habitat type for each species.',
        'Identify one local threat to biodiversity.',
      ],
      instructions: [
        'Visit a park, garden, or green corridor with an adult if needed.',
        'Use iNaturalist, field guides, or school resources to identify species.',
        'Record: name, habitat, date, one behaviour observed.',
        'Submit your species list with at least 3 photos.',
      ],
      environmentalImpact:
        'Citizen science builds biodiversity baselines and motivates habitat protection under SDG 15.',
      relatedLessonId: 'wildlife-india',
      relatedQuizId: 'wildlife-india-quiz',
    },
    {
      id: 'habitat-guardian',
      sdgId: 'sdg-15',
      sdgNumber: 15,
      title: 'Habitat Guardian Mission',
      description:
        'Identify a small local habitat patch and take one protective or restorative action.',
      difficulty: 'advanced',
      estimatedMinutes: 240,
      xpReward: 250,
      ecoCoinReward: 125,
      impactMetric: {
        label: 'Habitat area protected',
        unit: 'm²',
        targetValue: 50,
        description: 'Approximate area where a protective action was taken.',
      },
      objectives: [
        'Map a habitat patch (school garden, roadside trees, wetland edge).',
        'Assess threats: litter, trampling, invasive plants, pollution.',
        'Execute one restoration action: litter pick, native planting, signage.',
      ],
      instructions: [
        'Get permission from landowner or school before acting.',
        'Document the site with photos before intervention.',
        'Complete one action: remove invasive species, plant native seedlings, install simple protection.',
        'Submit before/after photos and a short impact statement.',
      ],
      environmentalImpact:
        'Small-scale habitat stewardship connects learners to land protection and species recovery.',
      relatedLessonId: 'biodiversity-conservation',
      relatedQuizId: 'biodiversity-conservation-quiz',
    },
  ]
}

function placeholderMission(
  sdgId: string,
  sdgNumber: number,
  id: string,
  title: string,
  description: string,
  difficulty: MissionDifficulty,
  minutes: number,
): Mission {
  return {
    id,
    sdgId,
    sdgNumber,
    title,
    description,
    difficulty,
    estimatedMinutes: minutes,
    xpReward: 100,
    ecoCoinReward: 50,
    impactMetric: {
      label: 'Impact pending',
      unit: 'units',
      targetValue: 1,
      description: 'Full mission details coming in a future update.',
    },
    objectives: ['Mission objectives will be published soon.'],
    instructions: ['Check back after completing related lessons.'],
    environmentalImpact: 'Environmental impact details coming soon.',
    isPlaceholder: true,
  }
}

function placeholderMissions(): Mission[] {
  const stubs: Array<[string, number, string, string, string, MissionDifficulty, number]> = [
    ['sdg-1', 1, 'sdg1-community-support', 'Community Support Drive', 'Support local poverty-reduction initiatives.', 'beginner', 120],
    ['sdg-2', 2, 'sdg2-food-garden', 'School Food Garden', 'Start or maintain a small sustainable food garden.', 'beginner', 180],
    ['sdg-3', 3, 'sdg3-clean-air', 'Clean Air Awareness', 'Monitor and improve air quality around your school.', 'beginner', 90],
    ['sdg-4', 4, 'sdg4-education-peer', 'Peer Education Session', 'Teach classmates one SDG topic you learned.', 'beginner', 60],
    ['sdg-5', 5, 'sdg5-inclusive-action', 'Inclusive Green Action', 'Ensure an environmental project includes all voices.', 'intermediate', 120],
    ['sdg-7', 7, 'sdg7-energy-switch', 'Renewable Energy Awareness', 'Survey renewable energy use in your community.', 'beginner', 90],
    ['sdg-8', 8, 'sdg8-green-jobs', 'Green Jobs Explorer', 'Interview someone in a sustainability-related role.', 'intermediate', 60],
    ['sdg-9', 9, 'sdg9-innovation-lab', 'Eco Innovation Sketch', 'Design a simple clean-tech solution for a local problem.', 'intermediate', 120],
    ['sdg-10', 10, 'sdg10-climate-justice', 'Climate Justice Forum', 'Discuss how climate impacts affect different groups.', 'intermediate', 90],
    ['sdg-12', 12, 'plastic-free', 'Plastic-Free Campus Challenge', 'Organize a plastic-free day at school.', 'intermediate', 240],
    ['sdg-14', 14, 'sdg14-beach-clean', 'Coastal Cleanup', 'Participate in or organize a shoreline litter collection.', 'beginner', 120],
    ['sdg-16', 16, 'sdg16-governance', 'Environmental Governance Letter', 'Write to a local leader about an environmental issue.', 'intermediate', 60],
    ['sdg-17', 17, 'sdg17-partnership', 'SDG Partnership Project', 'Collaborate with another class on a joint SDG action.', 'intermediate', 180],
  ]

  return stubs.map(([sdgId, num, id, title, desc, diff, min]) =>
    placeholderMission(sdgId, num, id, title, desc, diff, min),
  )
}

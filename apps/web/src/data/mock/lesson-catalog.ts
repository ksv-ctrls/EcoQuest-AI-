import type {
  Lesson,
  LessonContent,
  LessonDifficulty,
  LessonProgressMap,
  LessonStatus,
  LearningStats,
  SDGCatalogStats,
  SDGLessonCatalog,
} from '@/types/lesson'
import { mockSdgGoals } from '@/data/mock/sdg'

const difficultyRank: Record<LessonDifficulty, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
}

function aggregateDifficulty(lessons: Lesson[]): LessonDifficulty {
  const max = lessons.reduce(
    (acc, lesson) => Math.max(acc, difficultyRank[lesson.difficulty]),
    1,
  )
  return (Object.entries(difficultyRank).find(([, rank]) => rank === max)?.[0] ??
    'beginner') as LessonDifficulty
}

export function getLessonById(lessonId: string): Lesson | undefined {
  return allLessons.find((lesson) => lesson.id === lessonId)
}

export function getLessonsBySdgId(sdgId: string): Lesson[] {
  return allLessons
    .filter((lesson) => lesson.sdgId === sdgId)
    .sort((a, b) => a.order - b.order)
}

export function getSdgCatalog(sdgId: string): SDGLessonCatalog | undefined {
  const sdg = mockSdgGoals.find((goal) => goal.id === sdgId)
  if (!sdg) return undefined

  return {
    sdgId: sdg.id,
    sdgNumber: sdg.number,
    title: sdg.title,
    overview: sdg.description,
    color: sdg.color,
    lessons: getLessonsBySdgId(sdgId),
  }
}

export function getAllSdgCatalogs(): SDGLessonCatalog[] {
  return mockSdgGoals.map((sdg) => ({
    sdgId: sdg.id,
    sdgNumber: sdg.number,
    title: sdg.title,
    overview: sdg.description,
    color: sdg.color,
    lessons: getLessonsBySdgId(sdg.id),
  }))
}

export function getLessonStatus(
  lessonId: string,
  progress: LessonProgressMap,
): LessonStatus {
  return progress[lessonId]?.status ?? 'not_started'
}

export function getSdgCatalogStats(
  sdgId: string,
  progress: LessonProgressMap,
): SDGCatalogStats | undefined {
  const catalog = getSdgCatalog(sdgId)
  if (!catalog) return undefined

  const completedCount = catalog.lessons.filter(
    (lesson) => getLessonStatus(lesson.id, progress) === 'completed',
  ).length

  return {
    sdgId,
    lessonCount: catalog.lessons.length,
    completionPercent:
      catalog.lessons.length === 0
        ? 0
        : Math.round((completedCount / catalog.lessons.length) * 100),
    difficulty: aggregateDifficulty(catalog.lessons),
    estimatedMinutes: catalog.lessons.reduce(
      (sum, lesson) => sum + lesson.durationMinutes,
      0,
    ),
    completedCount,
  }
}

export function getLearningStats(progress: LessonProgressMap): LearningStats {
  const catalogs = getAllSdgCatalogs()
  const totalLessons = allLessons.length

  let completedLessons = 0
  let inProgressLessons = 0
  let totalMinutesLearned = 0

  for (const lesson of allLessons) {
    const status = getLessonStatus(lesson.id, progress)

    if (status === 'completed') {
      completedLessons += 1
      totalMinutesLearned += lesson.durationMinutes
    } else if (status === 'in_progress' || status === 'started') {
      inProgressLessons += 1
      totalMinutesLearned += Math.round(lesson.durationMinutes * 0.35)
    }
  }

  return {
    lessonCompletionPercent:
      totalLessons === 0
        ? 0
        : Math.round((completedLessons / totalLessons) * 100),
    totalLessons,
    completedLessons,
    inProgressLessons,
    totalLearningHours: Math.round((totalMinutesLearned / 60) * 10) / 10,
    sdgStats: catalogs.map(
      (catalog) => getSdgCatalogStats(catalog.sdgId, progress)!,
    ),
  }
}

/** Backward-compatible helper for SDG Explorer cross-references. */
export function getLessonsBySdgNumber(sdgNumber: number): Lesson[] {
  return allLessons.filter((lesson) => lesson.sdgNumber === sdgNumber)
}

export const allLessons: Lesson[] = buildLessonCatalog()

function placeholderLesson(
  sdgId: string,
  sdgNumber: number,
  id: string,
  title: string,
  description: string,
  difficulty: LessonDifficulty,
  durationMinutes: number,
  order: number,
): Lesson {
  return {
    id,
    sdgId,
    sdgNumber,
    title,
    description,
    difficulty,
    durationMinutes,
    order,
  }
}

function buildLessonCatalog(): Lesson[] {
  return [
    ...sdg6Lessons(),
    ...sdg11Lessons(),
    ...sdg13Lessons(),
    ...sdg15Lessons(),
    ...placeholderLessons(),
  ]
}

function sdg6Lessons(): Lesson[] {
  return [
    {
      id: 'water-conservation',
      sdgId: 'sdg-6',
      sdgNumber: 6,
      title: 'Water Conservation Strategies',
      description:
        'Learn why fresh water is limited and discover practical ways to save water at home and school.',
      difficulty: 'beginner',
      durationMinutes: 12,
      order: 1,
      content: {
        heroSubtitle: 'SDG 6 · Clean Water & Sanitation',
        summary:
          'Fresh water is one of Earth\'s most precious resources. This lesson explores why water scarcity matters and how everyday choices can protect rivers, lakes, and groundwater.',
        objectives: [
          'Explain why usable fresh water is a limited resource.',
          'Identify common ways households and schools waste water.',
          'Apply at least three water-saving strategies to daily life.',
        ],
        keyConcepts: [
          {
            term: 'Fresh water',
            definition:
              'Water with low salt content that humans can drink and use for farming — only a tiny fraction of Earth\'s water fits this category.',
          },
          {
            term: 'Water footprint',
            definition:
              'The total volume of fresh water used to produce the goods and services you consume.',
          },
          {
            term: 'Rainwater harvesting',
            definition:
              'Collecting and storing rain from rooftops or surfaces to reduce pressure on municipal and groundwater supplies.',
          },
        ],
        knowledgeCards: [
          {
            id: 'kc-6-1',
            emoji: '🚰',
            title: 'Hidden water use',
            body: 'It takes about 15,000 litres of water to produce 1 kg of beef — far more than growing vegetables. Food choices affect water use globally.',
          },
          {
            id: 'kc-6-2',
            emoji: '💧',
            title: 'The leaking tap',
            body: 'A tap dripping once per second can waste over 10,000 litres per year — enough for many families\' basic needs.',
          },
          {
            id: 'kc-6-3',
            emoji: '🏫',
            title: 'School action',
            body: 'Greywater systems and low-flow fixtures in schools can cut water use by 30% while teaching students conservation habits.',
          },
        ],
        infographics: [
          {
            id: 'inf-6-1',
            title: 'Where Earth\'s water goes',
            caption:
              'Placeholder — visual breakdown: oceans 97%, ice 2%, fresh water ~1% (most locked in glaciers).',
          },
          {
            id: 'inf-6-2',
            title: 'Home water audit checklist',
            caption:
              'Placeholder — step-by-step infographic for tracking taps, showers, leaks, and outdoor use.',
          },
        ],
        reflectionQuestions: [
          'Where do you think your community wastes the most water?',
          'Which one water-saving habit could you start this week?',
          'How does clean water access connect to health and education?',
        ],
        keyTakeaways: [
          'Most of Earth\'s water is not easily usable — conservation is essential.',
          'Small daily habits (shorter showers, fixing leaks) add up quickly.',
          'Structural solutions like rainwater harvesting multiply impact at scale.',
        ],
      },
    },
    {
      id: 'water-quality-protection',
      sdgId: 'sdg-6',
      sdgNumber: 6,
      title: 'Protecting Rivers & Drinking Water',
      description:
        'Understand pollution sources and how wastewater treatment keeps ecosystems and communities safe.',
      difficulty: 'intermediate',
      durationMinutes: 14,
      order: 2,
      content: {
        heroSubtitle: 'SDG 6 · Pollution & Protection',
        summary:
          'Clean water depends on healthy watersheds. Explore how pollution enters rivers and lakes, and why treatment and regulation matter for SDG 6.',
        objectives: [
          'Describe two major sources of freshwater pollution.',
          'Explain why wastewater treatment protects drinking water supplies.',
          'Connect local river health to community well-being.',
        ],
        keyConcepts: [
          {
            term: 'Watershed',
            definition:
              'The land area where rainfall drains into a common river, lake, or aquifer.',
          },
          {
            term: 'Eutrophication',
            definition:
              'Excess nutrients in water causing algae blooms that deplete oxygen and harm aquatic life.',
          },
          {
            term: 'Wastewater treatment',
            definition:
              'Processes that remove contaminants from sewage and industrial water before release into the environment.',
          },
        ],
        knowledgeCards: [
          {
            id: 'kc-6-4',
            emoji: '🏭',
            title: 'Point vs non-point pollution',
            body: 'Factories discharge at specific points, but farm runoff and urban stormwater spread pollution across entire watersheds — harder to trace and control.',
          },
          {
            id: 'kc-6-5',
            emoji: '🐟',
            title: 'Living indicators',
            body: 'Sensitive fish and insect species disappear when water quality drops — they act as early warning systems for ecosystems.',
          },
        ],
        infographics: [
          {
            id: 'inf-6-3',
            title: 'Journey of a raindrop to your tap',
            caption:
              'Placeholder — flow diagram from catchment → treatment → distribution → wastewater cycle.',
          },
        ],
        reflectionQuestions: [
          'Is there a river or lake near you that faces pollution pressure?',
          'Who is responsible for protecting water quality in your area?',
        ],
        keyTakeaways: [
          'Pollution prevention is cheaper and safer than cleanup after damage.',
          'Healthy watersheds support biodiversity, farming, and reliable drinking water.',
          'Community monitoring builds accountability for SDG 6 targets.',
        ],
      },
    },
  ]
}

function sdg11Lessons(): Lesson[] {
  return [
    {
      id: 'sustainable-cities',
      sdgId: 'sdg-11',
      sdgNumber: 11,
      title: 'Sustainable Cities & Communities',
      description:
        'Discover how urban planning, green spaces, and inclusive design make cities livable and low-carbon.',
      difficulty: 'intermediate',
      durationMinutes: 18,
      order: 1,
      content: {
        heroSubtitle: 'SDG 11 · Urban Futures',
        summary:
          'More than half the world lives in cities. Learn how sustainable urban design balances housing, transport, nature, and resilience.',
        objectives: [
          'Define what makes a city "sustainable" in SDG 11 terms.',
          'Identify three features of climate-resilient urban planning.',
          'Propose one improvement for your own neighbourhood or school area.',
        ],
        keyConcepts: [
          {
            term: 'Urban sprawl',
            definition:
              'Spreading low-density development outward, increasing car dependence and habitat loss.',
          },
          {
            term: 'Green infrastructure',
            definition:
              'Networks of parks, trees, wetlands, and green roofs that manage heat, floods, and air quality.',
          },
          {
            term: '15-minute city',
            definition:
              'An urban model where essential services are reachable within a short walk or bike ride.',
          },
        ],
        knowledgeCards: [
          {
            id: 'kc-11-1',
            emoji: '🏙️',
            title: 'Urban heat islands',
            body: 'Concrete and asphalt absorb heat — cities can be 5°C hotter than surrounding areas. Trees and reflective surfaces cool neighbourhoods.',
          },
          {
            id: 'kc-11-2',
            emoji: '🚌',
            title: 'People-first streets',
            body: 'When walking and cycling are safe, cities cut emissions, noise, and traffic injuries while improving public health.',
          },
          {
            id: 'kc-11-3',
            emoji: '🏘️',
            title: 'Affordable housing',
            body: 'SDG 11 requires inclusive cities — without affordable homes near jobs and services, commutes and emissions rise.',
          },
        ],
        infographics: [
          {
            id: 'inf-11-1',
            title: 'Layers of a sustainable neighbourhood',
            caption:
              'Placeholder — cross-section showing housing, transit, parks, and flood buffers.',
          },
        ],
        reflectionQuestions: [
          'What makes your city or town easy or hard to live in sustainably?',
          'Where could your school community add green space or safer routes?',
        ],
        keyTakeaways: [
          'Sustainable cities integrate transport, housing, nature, and disaster planning.',
          'Inclusive design ensures vulnerable communities are not left behind.',
          'Local participation improves urban decisions and long-term trust.',
        ],
      },
    },
    {
      id: 'green-transport',
      sdgId: 'sdg-11',
      sdgNumber: 11,
      title: 'Green Transport & Clean Air',
      description:
        'Compare transport modes by emissions and explore policies that reduce urban air pollution.',
      difficulty: 'beginner',
      durationMinutes: 10,
      order: 2,
      content: {
        heroSubtitle: 'SDG 11 · Mobility',
        summary:
          'Transport is a major source of urban emissions. This lesson compares mobility choices and highlights clean alternatives.',
        objectives: [
          'Rank common transport modes by typical carbon impact.',
          'Explain how electric public transport supports SDG 11 and SDG 13.',
          'Name one personal mobility shift with high impact.',
        ],
        keyConcepts: [
          {
            term: 'Modal shift',
            definition:
              'Moving travellers from private cars to public transit, cycling, or walking.',
          },
          {
            term: 'Last-mile connectivity',
            definition:
              'How people complete the final leg of a journey from a transit hub to their destination.',
          },
        ],
        knowledgeCards: [
          {
            id: 'kc-11-4',
            emoji: '🚲',
            title: 'The cycling multiplier',
            body: 'Protected bike lanes increase cycling rates sharply — one lane can replace hundreds of short car trips daily.',
          },
        ],
        infographics: [
          {
            id: 'inf-11-2',
            title: 'Carbon per passenger-km',
            caption:
              'Placeholder — chart comparing walk, bike, bus, train, car, and flight.',
          },
        ],
        reflectionQuestions: [
          'What is the most common trip you take, and how could it be greener?',
        ],
        keyTakeaways: [
          'Clean public transport and active mobility cut both emissions and congestion.',
          'Air quality improvements benefit health, especially for children and elders.',
        ],
      },
    },
  ]
}

function sdg13Lessons(): Lesson[] {
  return [
    {
      id: 'climate-basics',
      sdgId: 'sdg-13',
      sdgNumber: 13,
      title: 'Climate Change Basics',
      description:
        'Understand the greenhouse effect, human causes of warming, and why urgent action matters.',
      difficulty: 'beginner',
      durationMinutes: 15,
      order: 1,
      content: {
        heroSubtitle: 'SDG 13 · Climate Action',
        summary:
          'Climate change is reshaping weather, ecosystems, and livelihoods worldwide. Build a clear foundation on causes, impacts, and solutions.',
        objectives: [
          'Distinguish weather from climate.',
          'Identify major human sources of greenhouse gas emissions.',
          'Describe two climate impacts relevant to your region.',
        ],
        keyConcepts: [
          {
            term: 'Greenhouse effect',
            definition:
              'Natural process where gases in the atmosphere trap heat — amplified by human emissions of CO₂ and methane.',
          },
          {
            term: 'Carbon dioxide (CO₂)',
            definition:
              'Primary greenhouse gas from burning fossil fuels, deforestation, and industrial processes.',
          },
          {
            term: 'Climate resilience',
            definition:
              'Capacity of communities and ecosystems to prepare for, respond to, and recover from climate impacts.',
          },
        ],
        knowledgeCards: [
          {
            id: 'kc-13-1',
            emoji: '🌡️',
            title: '1.1°C and rising',
            body: 'Global average temperature has already risen about 1.1°C above pre-industrial levels — every fraction of a degree increases extreme weather risk.',
          },
          {
            id: 'kc-13-2',
            emoji: '🔥',
            title: 'Feedback loops',
            body: 'Melting ice reduces reflectivity, absorbing more heat — one of several feedbacks that can accelerate warming.',
          },
          {
            id: 'kc-13-3',
            emoji: '🌾',
            title: 'Farmers on the front line',
            body: 'Changing monsoons and droughts affect crop yields — climate action protects food security linked to SDG 2.',
          },
        ],
        infographics: [
          {
            id: 'inf-13-1',
            title: 'Sources of global emissions',
            caption:
              'Placeholder — pie chart: energy, agriculture, industry, transport, buildings.',
          },
        ],
        reflectionQuestions: [
          'Which climate impact have you noticed or heard about locally?',
          'Why is climate action also an equity issue between countries?',
        ],
        keyTakeaways: [
          'Human activities — especially fossil fuels — drive current warming.',
          'Climate change affects health, water, food, and biodiversity across SDGs.',
          'Rapid emission cuts plus adaptation are both required.',
        ],
      },
    },
    {
      id: 'carbon-footprint',
      sdgId: 'sdg-13',
      sdgNumber: 13,
      title: 'Reducing Your Carbon Footprint',
      description:
        'Measure everyday emissions and prioritize high-impact personal climate actions.',
      difficulty: 'intermediate',
      durationMinutes: 8,
      order: 2,
      content: {
        heroSubtitle: 'SDG 13 · Personal Action',
        summary:
          'Individual choices matter when scaled across communities. Learn which actions cut emissions most effectively.',
        objectives: [
          'Define personal carbon footprint.',
          'Compare high- vs low-impact lifestyle changes.',
          'Design a one-week low-carbon challenge for yourself.',
        ],
        keyConcepts: [
          {
            term: 'Carbon footprint',
            definition:
              'Total greenhouse gases caused directly and indirectly by your activities, often expressed in CO₂ equivalents.',
          },
          {
            term: 'Scope 3 emissions',
            definition:
              'Indirect emissions from products and services you buy — often the largest share of personal footprints.',
          },
        ],
        knowledgeCards: [
          {
            id: 'kc-13-4',
            emoji: '✈️',
            title: 'Flight impact',
            body: 'One long-haul return flight can exceed a year of driving emissions — transport choices vary enormously in impact.',
          },
          {
            id: 'kc-13-5',
            emoji: '🥗',
            title: 'Plate power',
            body: 'Shifting toward plant-rich meals reduces food-related emissions without requiring perfection.',
          },
        ],
        infographics: [
          {
            id: 'inf-13-2',
            title: 'Impact hierarchy of actions',
            caption:
              'Placeholder — ranked list from aviation, car use, diet, home energy, to recycling.',
          },
        ],
        reflectionQuestions: [
          'Which part of your footprint surprised you most?',
          'How can schools amplify individual actions into community impact?',
        ],
        keyTakeaways: [
          'Focus on high-impact changes: transport, energy, and diet.',
          'Systemic policy change and personal action work together.',
          'Tracking progress builds motivation and accountability.',
        ],
      },
    },
  ]
}

function sdg15Lessons(): Lesson[] {
  return [
    {
      id: 'biodiversity-conservation',
      sdgId: 'sdg-15',
      sdgNumber: 15,
      title: 'Biodiversity & Habitat Conservation',
      description:
        'Explore the variety of life on Earth and why protecting habitats safeguards ecosystems we depend on.',
      difficulty: 'intermediate',
      durationMinutes: 20,
      order: 1,
      content: {
        heroSubtitle: 'SDG 15 · Life on Land',
        summary:
          'Biodiversity loss threatens food, medicine, climate stability, and cultural identity. Learn causes, consequences, and conservation strategies.',
        objectives: [
          'Define biodiversity and ecosystem services.',
          'List three major drivers of biodiversity loss.',
          'Explain how protected areas support species recovery.',
        ],
        keyConcepts: [
          {
            term: 'Biodiversity',
            definition:
              'Variety of life at genetic, species, and ecosystem levels — the web that keeps Earth resilient.',
          },
          {
            term: 'Ecosystem services',
            definition:
              'Benefits nature provides: pollination, clean water, soil fertility, climate regulation, and more.',
          },
          {
            term: 'Habitat fragmentation',
            definition:
              'Breaking continuous habitat into isolated patches, making species migration and breeding harder.',
          },
        ],
        knowledgeCards: [
          {
            id: 'kc-15-1',
            emoji: '🦋',
            title: 'Keystone species',
            body: 'Species like bees or wolves disproportionately shape ecosystems — losing them triggers cascading effects.',
          },
          {
            id: 'kc-15-2',
            emoji: '🌳',
            title: 'Forests as carbon banks',
            body: 'Old-growth forests store vast carbon — deforestation releases it and destroys unique species habitats.',
          },
        ],
        infographics: [
          {
            id: 'inf-15-1',
            title: 'Drivers of biodiversity loss',
            caption:
              'Placeholder — habitat loss, overexploitation, pollution, invasive species, climate change.',
          },
        ],
        reflectionQuestions: [
          'Which local species or habitats are you most motivated to protect?',
          'How do indigenous and local communities contribute to conservation?',
        ],
        keyTakeaways: [
          'Biodiversity underpins food, water, health, and climate goals.',
          'Protected areas and restoration must pair with sustainable land use.',
          'Everyone can support habitat protection locally and globally.',
        ],
      },
    },
    {
      id: 'wildlife-india',
      sdgId: 'sdg-15',
      sdgNumber: 15,
      title: 'Wildlife Threats in India',
      description:
        'Study endangered Indian species, human-wildlife conflict, and community-led conservation success stories.',
      difficulty: 'intermediate',
      durationMinutes: 12,
      order: 2,
      content: {
        heroSubtitle: 'SDG 15 · Regional Focus',
        summary:
          'India hosts exceptional biodiversity — tigers, elephants, gharials, and hundreds of bird species — yet faces poaching, habitat loss, and conflict.',
        objectives: [
          'Identify two major threats to wildlife in India.',
          'Describe how corridor projects help large mammals migrate safely.',
          'Reflect on balancing development with species protection.',
        ],
        keyConcepts: [
          {
            term: 'Human-wildlife conflict',
            definition:
              'Negative interactions when animals damage crops or livestock, or threaten human safety — often intensified by habitat shrinkage.',
          },
          {
            term: 'Wildlife corridor',
            definition:
              'Connected habitat allowing animals to move between protected areas for food, mates, and seasonal migration.',
          },
        ],
        knowledgeCards: [
          {
            id: 'kc-15-3',
            emoji: '🐅',
            title: 'Project Tiger',
            body: 'India\'s tiger reserves helped recover tiger numbers — a flagship example of targeted species conservation with habitat protection.',
          },
          {
            id: 'kc-15-4',
            emoji: '🐘',
            title: 'Elephant corridors',
            body: 'Rail and road crossings through forests require bridges and underpasses — without them, elephant herds face deadly barriers.',
          },
        ],
        infographics: [
          {
            id: 'inf-15-2',
            title: 'India biodiversity hotspots',
            caption:
              'Placeholder — map highlighting Western Ghats, Himalaya, and northeast forest regions.',
          },
        ],
        reflectionQuestions: [
          'Why is protecting wildlife important even if you live in a city?',
          'How could schools raise awareness about local endangered species?',
        ],
        keyTakeaways: [
          'India\'s biodiversity is globally significant and urgently threatened.',
          'Conservation works best with community benefits and enforcement.',
          'Infrastructure planning must include wildlife movement needs.',
        ],
      },
    },
  ]
}

function placeholderLessons(): Lesson[] {
  const stubs: Array<{
    sdgId: string
    number: number
    lessons: Array<[string, string, string, LessonDifficulty, number]>
  }> = [
    {
      sdgId: 'sdg-1',
      number: 1,
      lessons: [
        [
          'sdg1-intro',
          'Introduction to No Poverty',
          'Explore links between poverty, environment, and sustainable livelihoods.',
          'beginner',
          10,
        ],
      ],
    },
    {
      sdgId: 'sdg-2',
      number: 2,
      lessons: [
        [
          'sdg2-intro',
          'Zero Hunger & Sustainable Food',
          'Overview of food systems, nutrition, and sustainable agriculture.',
          'beginner',
          12,
        ],
      ],
    },
    {
      sdgId: 'sdg-3',
      number: 3,
      lessons: [
        [
          'sdg3-intro',
          'Health & the Environment',
          'How clean air, water, and ecosystems support human health.',
          'beginner',
          11,
        ],
      ],
    },
    {
      sdgId: 'sdg-4',
      number: 4,
      lessons: [
        [
          'sdg4-intro',
          'Education for Sustainable Development',
          'Why quality education drives every SDG, especially climate literacy.',
          'beginner',
          10,
        ],
      ],
    },
    {
      sdgId: 'sdg-5',
      number: 5,
      lessons: [
        [
          'sdg5-intro',
          'Gender Equality & Sustainability',
          'Inclusive environmental action and equal access to green opportunities.',
          'intermediate',
          12,
        ],
      ],
    },
    {
      sdgId: 'sdg-7',
      number: 7,
      lessons: [
        [
          'renewable-energy',
          'Renewable Energy Sources',
          'Solar, wind, and hydro — clean power for a low-carbon future.',
          'beginner',
          10,
        ],
      ],
    },
    {
      sdgId: 'sdg-8',
      number: 8,
      lessons: [
        [
          'sdg8-intro',
          'Green Jobs & Fair Growth',
          'Decent work in the transition to sustainable economies.',
          'intermediate',
          11,
        ],
      ],
    },
    {
      sdgId: 'sdg-9',
      number: 9,
      lessons: [
        [
          'sdg9-intro',
          'Innovation for Sustainability',
          'Clean technology, resilient infrastructure, and inclusive industry.',
          'intermediate',
          13,
        ],
      ],
    },
    {
      sdgId: 'sdg-10',
      number: 10,
      lessons: [
        [
          'sdg10-intro',
          'Reducing Inequalities',
          'Climate justice and fair access to environmental benefits.',
          'intermediate',
          10,
        ],
      ],
    },
    {
      sdgId: 'sdg-12',
      number: 12,
      lessons: [
        [
          'waste-management',
          'Waste Management Techniques',
          'Reduce, reuse, recycle, and rethink consumption patterns.',
          'beginner',
          14,
        ],
      ],
    },
    {
      sdgId: 'sdg-14',
      number: 14,
      lessons: [
        [
          'sdg14-intro',
          'Life Below Water',
          'Ocean health, marine pollution, and sustainable fisheries.',
          'beginner',
          12,
        ],
        [
          'marine-biodiversity',
          'Coral Reefs & Marine Ecosystems',
          'Protecting underwater biodiversity and coastal communities.',
          'intermediate',
          15,
        ],
      ],
    },
    {
      sdgId: 'sdg-16',
      number: 16,
      lessons: [
        [
          'sdg16-intro',
          'Peace & Environmental Governance',
          'Institutions, justice, and accountability for environmental protection.',
          'advanced',
          11,
        ],
      ],
    },
    {
      sdgId: 'sdg-17',
      number: 17,
      lessons: [
        [
          'sdg17-intro',
          'Partnerships for the Goals',
          'Global cooperation, finance, and technology for the SDGs.',
          'intermediate',
          10,
        ],
      ],
    },
  ]

  return stubs.flatMap(({ sdgId, number, lessons }) =>
    lessons.map(([id, title, description, difficulty, durationMinutes], index) =>
      placeholderLesson(
        sdgId,
        number,
        id,
        title,
        description,
        difficulty,
        durationMinutes,
        index + 1,
      ),
    ),
  )
}

export type { LessonContent }

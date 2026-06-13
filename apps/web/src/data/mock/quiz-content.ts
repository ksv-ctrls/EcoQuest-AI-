import type { QuizQuestion } from '@/types/quiz'

export const fullQuizQuestions: Record<string, QuizQuestion[]> = {
  'water-conservation-quiz': [
    {
      id: 'q1',
      type: 'multiple_choice',
      topic: 'Fresh water availability',
      text: 'Why is fresh water considered a limited resource?',
      options: [
        'Most water on Earth is salty or locked in ice',
        'Rainfall is increasing everywhere equally',
        'Oceans provide unlimited drinking water',
        'Groundwater never runs out',
      ],
      correctIndex: 0,
      explanation:
        'Only a small fraction of Earth\'s water is easily usable fresh water — most is saline or frozen.',
    },
    {
      id: 'q2',
      type: 'true_false',
      topic: 'Household conservation',
      text: 'Fixing a dripping tap can save thousands of litres of water per year.',
      correctAnswer: true,
      explanation:
        'Even small leaks waste significant water over time — a common and fixable problem.',
    },
    {
      id: 'q3',
      type: 'match',
      topic: 'Water-saving methods',
      text: 'Match each action with its primary benefit:',
      pairs: [
        { id: 'm1', left: 'Rainwater harvesting', right: 'Reduces demand on municipal supply' },
        { id: 'm2', left: 'Low-flow showerhead', right: 'Cuts water use while bathing' },
        { id: 'm3', left: 'Mulching garden beds', right: 'Reduces evaporation from soil' },
      ],
      explanation:
        'Structural and behavioural changes work together to conserve water at different scales.',
    },
    {
      id: 'q4',
      type: 'scenario',
      topic: 'School water audit',
      scenario:
        'Your school notices high water bills during summer. The principal asks students to propose quick wins.',
      text: 'Which action would likely save the most water fastest?',
      options: [
        'Install low-flow taps and fix visible leaks',
        'Paint all pipes blue for awareness',
        'Remove all plants from the campus',
        'Run sprinklers all day to keep grass green',
      ],
      correctIndex: 0,
      explanation:
        'Fixing leaks and reducing flow at high-use points delivers immediate, measurable savings.',
    },
    {
      id: 'q5',
      type: 'multiple_choice',
      topic: 'SDG 6 connection',
      text: 'Water conservation directly supports SDG 6 because it:',
      options: [
        'Ensures sustainable management of freshwater resources',
        'Eliminates the need for wastewater treatment',
        'Only benefits rural communities',
        'Replaces the need for sanitation systems',
      ],
      correctIndex: 0,
      explanation:
        'SDG 6 covers availability, sustainable management, and protection of water ecosystems.',
    },
  ],

  'water-quality-protection-quiz': [
    {
      id: 'q1',
      type: 'true_false',
      topic: 'Watershed protection',
      text: 'A watershed is the area where rainfall drains into a shared river or lake.',
      correctAnswer: true,
      explanation: 'Protecting entire watersheds prevents pollution from reaching drinking water sources.',
    },
    {
      id: 'q2',
      type: 'multiple_choice',
      topic: 'Pollution sources',
      text: 'Which practice best protects rivers used for drinking water?',
      options: [
        'Treating wastewater before discharge',
        'Dumping waste directly into streams',
        'Removing all riverside vegetation',
        'Using more chemical fertilizers near banks',
      ],
      correctIndex: 0,
      explanation: 'Wastewater treatment removes contaminants before they enter freshwater ecosystems.',
    },
    {
      id: 'q3',
      type: 'match',
      topic: 'Pollution types',
      text: 'Match the pollution type with its example:',
      pairs: [
        { id: 'm1', left: 'Point source', right: 'Factory pipe discharge' },
        { id: 'm2', left: 'Non-point source', right: 'Farm runoff after rain' },
        { id: 'm3', left: 'Nutrient pollution', right: 'Algae blooms from excess fertilizer' },
      ],
      explanation: 'Different pollution types require different monitoring and control strategies.',
    },
    {
      id: 'q4',
      type: 'scenario',
      topic: 'Community response',
      scenario:
        'Residents notice fish dying in a neighbourhood lake after heavy rains.',
      text: 'What is the most likely first step for the community?',
      options: [
        'Report to environmental authorities and test water quality',
        'Add more fish from a pet store',
        'Drain the entire lake immediately',
        'Ignore it — rain will fix the problem',
      ],
      correctIndex: 0,
      explanation: 'Water testing and official reporting identify causes and trigger proper remediation.',
    },
  ],

  'sustainable-cities-quiz': [
    {
      id: 'q1',
      type: 'multiple_choice',
      topic: 'Urban sustainability',
      text: 'Which feature best defines a sustainable city under SDG 11?',
      options: [
        'Inclusive, safe housing with green public spaces',
        'Maximum parking for private cars downtown',
        'Removing all public transport to reduce costs',
        'Building only on floodplains for flat land',
      ],
      correctIndex: 0,
      explanation: 'SDG 11 emphasises inclusive, safe, resilient, and sustainable human settlements.',
    },
    {
      id: 'q2',
      type: 'true_false',
      topic: 'Urban heat',
      text: 'Urban heat islands occur when cities are significantly warmer than surrounding rural areas.',
      correctAnswer: true,
      explanation: 'Dense surfaces absorb heat — trees and green roofs help cool neighbourhoods.',
    },
    {
      id: 'q3',
      type: 'match',
      topic: 'City planning',
      text: 'Match each concept with its benefit:',
      pairs: [
        { id: 'm1', left: '15-minute city', right: 'Daily needs reachable by short walk or bike' },
        { id: 'm2', left: 'Green infrastructure', right: 'Manages floods and improves air quality' },
        { id: 'm3', left: 'Affordable housing', right: 'Reduces long commutes and sprawl' },
      ],
      explanation: 'Integrated planning connects mobility, housing, and nature in urban areas.',
    },
    {
      id: 'q4',
      type: 'scenario',
      topic: 'Neighbourhood design',
      scenario:
        'A city plans a new residential area and wants to minimise emissions and improve livability.',
      text: 'Which design choice best supports SDG 11?',
      options: [
        'Mixed-use blocks with transit, parks, and safe sidewalks',
        'Single-use zoning with no sidewalks or bike lanes',
        'Maximum road width for solo car commuting',
        'No green space to maximise building footprint',
      ],
      correctIndex: 0,
      explanation: 'Mixed-use, walkable neighbourhoods reduce car dependence and improve quality of life.',
    },
    {
      id: 'q5',
      type: 'scenario',
      topic: 'Disaster resilience',
      scenario:
        'A coastal city faces increasing flood risk from storms and sea-level rise.',
      text: 'Which measure improves climate resilience?',
      options: [
        'Restoring mangroves and improving drainage systems',
        'Paving all wetlands for development',
        'Removing flood warning systems to save money',
        'Building only at the lowest elevation points',
      ],
      correctIndex: 0,
      explanation: 'Natural buffers and upgraded drainage reduce flood damage and protect communities.',
    },
  ],

  'green-transport-quiz': [
    {
      id: 'q1',
      type: 'multiple_choice',
      topic: 'Transport emissions',
      text: 'Which transport mode typically has the lowest carbon footprint per passenger?',
      options: ['Walking or cycling', 'Solo car trip', 'Domestic flight', 'Large diesel truck'],
      correctIndex: 0,
      explanation: 'Active transport produces minimal direct emissions for short trips.',
    },
    {
      id: 'q2',
      type: 'true_false',
      topic: 'Public transport',
      text: 'Electric buses can reduce urban air pollution compared to diesel fleets.',
      correctAnswer: true,
      explanation: 'Electric public transport cuts tailpipe emissions and improves city air quality.',
    },
    {
      id: 'q3',
      type: 'match',
      topic: 'Mobility concepts',
      text: 'Match the term with its meaning:',
      pairs: [
        { id: 'm1', left: 'Modal shift', right: 'Moving trips from cars to transit or bikes' },
        { id: 'm2', left: 'Last-mile connectivity', right: 'Final leg from hub to destination' },
        { id: 'm3', left: 'Protected bike lane', right: 'Separated space safe for cyclists' },
      ],
      explanation: 'Good mobility systems combine infrastructure with convenient options.',
    },
    {
      id: 'q4',
      type: 'scenario',
      topic: 'School commute',
      scenario:
        'Your school wants to reduce traffic congestion and emissions at drop-off time.',
      text: 'What policy would have the greatest impact?',
      options: [
        'Safe walking routes and a school bus or carpool programme',
        'Banning all students from arriving before noon',
        'Requiring every student to be driven alone by car',
        'Removing all crosswalks near the school',
      ],
      correctIndex: 0,
      explanation: 'Safe active travel and shared rides reduce single-occupancy car trips effectively.',
    },
  ],

  'climate-basics-quiz': [
    {
      id: 'q1',
      type: 'multiple_choice',
      topic: 'Climate fundamentals',
      text: 'What is the main human cause of increased greenhouse gas concentrations?',
      options: [
        'Burning fossil fuels for energy and transport',
        'Increased volcanic activity alone',
        'Earth\'s orbit changes in the last decade',
        'Planting too many trees',
      ],
      correctIndex: 0,
      explanation: 'Fossil fuel combustion releases CO₂ and other greenhouse gases that trap heat.',
    },
    {
      id: 'q2',
      type: 'true_false',
      topic: 'Weather vs climate',
      text: 'A single cold winter day disproves long-term global warming trends.',
      correctAnswer: false,
      explanation: 'Weather is short-term; climate is long-term patterns — one cold day does not negate warming trends.',
    },
    {
      id: 'q3',
      type: 'match',
      topic: 'Greenhouse gases & impacts',
      text: 'Match each item correctly:',
      pairs: [
        { id: 'm1', left: 'CO₂', right: 'Major gas from fossil fuel burning' },
        { id: 'm2', left: 'Methane', right: 'Potent gas from agriculture and leaks' },
        { id: 'm3', left: 'Sea-level rise', right: 'Impact from melting ice and thermal expansion' },
      ],
      explanation: 'Different gases and impacts connect to sectors like energy, farming, and oceans.',
    },
    {
      id: 'q4',
      type: 'scenario',
      topic: 'Regional impacts',
      scenario:
        'Farmers in a region report shifting monsoon patterns and more frequent droughts.',
      text: 'This situation best illustrates:',
      options: [
        'Climate change affecting agriculture and water security',
        'Weather that never changes over time',
        'Proof that rainfall is always increasing',
        'Unrelated natural cycles with no human link',
      ],
      correctIndex: 0,
      explanation: 'Changing rainfall patterns threaten crops, livelihoods, and food systems linked to multiple SDGs.',
    },
    {
      id: 'q5',
      type: 'multiple_choice',
      topic: 'Climate action',
      text: 'Which action most directly reduces CO₂ emissions driving climate change?',
      options: [
        'Switching from coal power to solar and wind',
        'Using more single-use plastic bags',
        'Leaving all lights on continuously',
        'Increasing deforestation for fuel',
      ],
      correctIndex: 0,
      explanation: 'Clean energy replaces high-carbon electricity generation — a core SDG 13 strategy.',
    },
  ],

  'carbon-footprint-quiz': [
    {
      id: 'q1',
      type: 'true_false',
      topic: 'Personal footprint',
      text: 'Your carbon footprint includes emissions from products and services you buy, not just direct energy use.',
      correctAnswer: true,
      explanation: 'Scope 3 / indirect emissions often dominate personal footprints through consumption choices.',
    },
    {
      id: 'q2',
      type: 'multiple_choice',
      topic: 'High-impact actions',
      text: 'Which choice typically reduces personal carbon footprint the most?',
      options: [
        'Using public transport instead of driving alone for daily commutes',
        'Buying more fast fashion each month',
        'Leaving chargers plugged in when unused only',
        'Using disposable cups once per year',
      ],
      correctIndex: 0,
      explanation: 'Transport is a major emissions source — shifting modes has large cumulative impact.',
    },
    {
      id: 'q3',
      type: 'match',
      topic: 'Action impact',
      text: 'Match the action with its typical impact level:',
      pairs: [
        { id: 'm1', left: 'Long-haul flight', right: 'Very high emissions per trip' },
        { id: 'm2', left: 'Plant-rich diet shift', right: 'Moderate ongoing reduction' },
        { id: 'm3', left: 'Home insulation upgrade', right: 'Moderate long-term savings' },
      ],
      explanation: 'Prioritising high-impact changes makes personal climate action more effective.',
    },
    {
      id: 'q4',
      type: 'scenario',
      topic: 'Weekly challenge',
      scenario:
        'You design a one-week low-carbon challenge for your class.',
      text: 'Which plan is most realistic and impactful?',
      options: [
        'Walk, bike, or bus for trips under 3 km and track results',
        'Require everyone to stop eating entirely',
        'Ignore transport and only change phone wallpaper',
        'Burn more wood to avoid electricity',
      ],
      correctIndex: 0,
      explanation: 'Achievable transport shifts build habits and measurable emission reductions.',
    },
  ],

  'biodiversity-conservation-quiz': [
    {
      id: 'q1',
      type: 'multiple_choice',
      topic: 'Biodiversity basics',
      text: 'Biodiversity refers to:',
      options: [
        'Variety of life at genetic, species, and ecosystem levels',
        'Only the number of large mammals in a forest',
        'How many parks exist in a city',
        'The price of organic food',
      ],
      correctIndex: 0,
      explanation: 'Biodiversity spans genes, species, and ecosystems — all essential for resilience.',
    },
    {
      id: 'q2',
      type: 'true_false',
      topic: 'Ecosystem services',
      text: 'Healthy ecosystems provide services like pollination, clean water, and climate regulation.',
      correctAnswer: true,
      explanation: 'These free services underpin agriculture, health, and economic stability.',
    },
    {
      id: 'q3',
      type: 'match',
      topic: 'Threats to biodiversity',
      text: 'Match each threat with its description:',
      pairs: [
        { id: 'm1', left: 'Habitat loss', right: 'Forests converted to farms or cities' },
        { id: 'm2', left: 'Overexploitation', right: 'Taking species faster than they recover' },
        { id: 'm3', left: 'Invasive species', right: 'Non-native organisms disrupting ecosystems' },
      ],
      explanation: 'Multiple drivers interact — addressing one alone is rarely sufficient.',
    },
    {
      id: 'q4',
      type: 'scenario',
      topic: 'Protected areas',
      scenario:
        'A region wants to protect an endangered orangutan population.',
      text: 'Which strategy is most effective?',
      options: [
        'Create and enforce protected forest areas stopping deforestation',
        'Clear more forest for palm plantations',
        'Build roads through core habitat to increase access',
        'Remove all legal protections to encourage development',
      ],
      correctIndex: 0,
      explanation: 'Protected areas with enforcement keep habitat intact for endangered species.',
    },
    {
      id: 'q5',
      type: 'scenario',
      topic: 'Local action',
      scenario:
        'Your community has a small wetland that filters water and hosts migratory birds.',
      text: 'What action best supports SDG 15 locally?',
      options: [
        'Advocate to protect the wetland from filling or pollution',
        'Drain it to build a parking lot',
        'Introduce non-native predators for "pest control"',
        'Dump waste at the edge to "fill it in gradually"',
      ],
      correctIndex: 0,
      explanation: 'Local habitat protection maintains biodiversity and ecosystem services.',
    },
  ],

  'wildlife-india-quiz': [
    {
      id: 'q1',
      type: 'multiple_choice',
      topic: 'Indian wildlife',
      text: 'Project Tiger in India primarily aims to:',
      options: [
        'Protect tiger habitats through dedicated reserves',
        'Increase tiger numbers in zoos only',
        'Replace all forests with farmland',
        'Allow unlimited hunting in reserves',
      ],
      correctIndex: 0,
      explanation: 'Tiger reserves protect habitat — the foundation for species recovery in the wild.',
    },
    {
      id: 'q2',
      type: 'true_false',
      topic: 'Human-wildlife conflict',
      text: 'Human-wildlife conflict often increases when animal habitats shrink or fragment.',
      correctAnswer: true,
      explanation: 'As habitats shrink, animals and people interact more — requiring thoughtful management.',
    },
    {
      id: 'q3',
      type: 'match',
      topic: 'Conservation tools',
      text: 'Match each tool with its purpose:',
      pairs: [
        { id: 'm1', left: 'Wildlife corridor', right: 'Safe movement between habitats' },
        { id: 'm2', left: 'Eco-development programme', right: 'Support communities near protected areas' },
        { id: 'm3', left: 'Anti-poaching patrols', right: 'Reduce illegal hunting and trade' },
      ],
      explanation: 'Effective conservation combines habitat, community benefits, and enforcement.',
    },
    {
      id: 'q4',
      type: 'scenario',
      topic: 'Infrastructure planning',
      scenario:
        'A new railway line is proposed through an elephant migration route.',
      text: 'What is the best mitigation approach?',
      options: [
        'Build wildlife underpasses or overpasses along migration paths',
        'Run trains at maximum speed through forests at night only',
        'Remove all elephants from the region',
        'Ignore migration routes to save construction costs',
      ],
      correctIndex: 0,
      explanation: 'Crossings maintain connectivity — critical for elephants and other wide-ranging species.',
    },
  ],
}

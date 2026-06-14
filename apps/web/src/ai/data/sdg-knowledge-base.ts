import type { SdgKnowledgeEntry } from '@/ai/types/tutor'

export const SDG_KNOWLEDGE_BASE: SdgKnowledgeEntry[] = [
  {
    id: 'sdg-1',
    number: 1,
    title: 'No Poverty',
    overview: 'SDG 1 focuses on ending poverty in all forms by improving income security, access to services, resilience, and opportunity.',
    keywords: ['poverty', 'income', 'livelihood', 'social protection', 'basic services'],
    keyFacts: [
      'Poverty is about more than income; it includes limited access to health, education, safety, and opportunity.',
      'Climate shocks can push vulnerable families deeper into poverty.',
      'Social protection and fair access to resources help communities recover from crises.',
    ],
    commonQuestions: [
      'Why does poverty connect to sustainability?',
      'How does climate change affect low-income communities?',
      'What can students do to support poverty reduction?',
    ],
    studentActions: [
      'Support a community donation or school supply drive.',
      'Learn about local poverty-reduction organizations.',
      'Design a poster showing how clean water, education, and jobs reduce poverty together.',
    ],
  },
  {
    id: 'sdg-2',
    number: 2,
    title: 'Zero Hunger',
    overview: 'SDG 2 aims to end hunger, improve nutrition, and build sustainable food systems that protect soil, water, and farmers.',
    keywords: ['hunger', 'food', 'nutrition', 'agriculture', 'farming', 'food waste'],
    keyFacts: [
      'Food security means people have reliable access to enough safe and nutritious food.',
      'Sustainable agriculture protects soil health, water, and biodiversity.',
      'Reducing food waste makes food systems more efficient and lowers emissions.',
    ],
    commonQuestions: [
      'What is sustainable agriculture?',
      'How does food waste affect hunger?',
      'How can schools support Zero Hunger?',
    ],
    studentActions: [
      'Track cafeteria food waste for one week.',
      'Start or support a school garden.',
      'Choose balanced meals and learn where your food comes from.',
    ],
  },
  {
    id: 'sdg-3',
    number: 3,
    title: 'Good Health and Well-Being',
    overview: 'SDG 3 promotes healthy lives and well-being, including cleaner air, safer water, disease prevention, and mental health support.',
    keywords: ['health', 'wellbeing', 'well-being', 'air quality', 'pollution', 'disease'],
    keyFacts: [
      'Clean air and safe water are foundations of public health.',
      'Pollution increases risks for respiratory and waterborne diseases.',
      'Healthy communities are more resilient during heat waves, floods, and other shocks.',
    ],
    commonQuestions: [
      'How does pollution affect health?',
      'Why is clean water a health issue?',
      'What habits improve community well-being?',
    ],
    studentActions: [
      'Create a clean-air awareness campaign.',
      'Practice safe hygiene and share reliable health information.',
      'Map health-supporting spaces around school, such as shade, water points, and play areas.',
    ],
  },
  {
    id: 'sdg-4',
    number: 4,
    title: 'Quality Education',
    overview: 'SDG 4 supports inclusive, equitable education and lifelong learning, including climate literacy and sustainability skills.',
    keywords: ['education', 'learning', 'school', 'literacy', 'skills', 'teacher'],
    keyFacts: [
      'Education helps people understand risks and choose sustainable solutions.',
      'Climate and SDG literacy prepare students for future green jobs.',
      'Inclusive classrooms make sure every learner can participate.',
    ],
    commonQuestions: [
      'Why is education important for every SDG?',
      'What is education for sustainable development?',
      'How can students teach others about the SDGs?',
    ],
    studentActions: [
      'Lead a peer learning session about one SDG.',
      'Make a short explainer for younger students.',
      'Ask your class to connect one subject lesson to sustainability.',
    ],
  },
  {
    id: 'sdg-5',
    number: 5,
    title: 'Gender Equality',
    overview: 'SDG 5 works toward equal rights, safety, leadership, and opportunity for women and girls in every part of society.',
    keywords: ['gender', 'equality', 'women', 'girls', 'inclusion', 'empowerment'],
    keyFacts: [
      'Equal participation improves decisions in schools, communities, and environmental planning.',
      'Girls education is strongly linked with health, income, and climate resilience.',
      'Gender equality means removing barriers, stereotypes, and discrimination.',
    ],
    commonQuestions: [
      'How does gender equality support sustainability?',
      'Why should environmental projects include all voices?',
      'What does empowerment mean?',
    ],
    studentActions: [
      'Make sure project teams share leadership fairly.',
      'Highlight women environmental leaders in class.',
      'Challenge stereotypes when choosing roles in group activities.',
    ],
  },
  {
    id: 'sdg-6',
    number: 6,
    title: 'Clean Water and Sanitation',
    overview: 'SDG 6 protects safe drinking water, sanitation, hygiene, wastewater treatment, and freshwater ecosystems.',
    keywords: ['water', 'sanitation', 'river', 'lake', 'freshwater', 'hygiene', 'save water'],
    keyFacts: [
      'Usable freshwater is limited, so conservation matters every day.',
      'Sanitation and wastewater treatment prevent disease and protect rivers.',
      'Healthy wetlands, lakes, and aquifers support people and biodiversity.',
    ],
    commonQuestions: [
      'How can I save water?',
      'Why are rivers polluted?',
      'What is sanitation?',
    ],
    studentActions: [
      'Fix or report leaking taps.',
      'Take shorter showers and turn taps off while brushing.',
      'Run a school water audit and share the results.',
    ],
  },
  {
    id: 'sdg-7',
    number: 7,
    title: 'Affordable and Clean Energy',
    overview: 'SDG 7 expands access to reliable, affordable, renewable, and efficient energy for homes, schools, and communities.',
    keywords: ['energy', 'renewable', 'solar', 'wind', 'electricity', 'efficiency'],
    keyFacts: [
      'Clean energy reduces air pollution and greenhouse gas emissions.',
      'Energy efficiency is often the fastest way to lower energy use.',
      'Reliable electricity supports education, health, and economic opportunity.',
    ],
    commonQuestions: [
      'What is renewable energy?',
      'How do solar panels help the climate?',
      'Why does energy access matter?',
    ],
    studentActions: [
      'Switch off unused lights and fans.',
      'Survey where your school could save electricity.',
      'Compare renewable energy sources in your region.',
    ],
  },
  {
    id: 'sdg-8',
    number: 8,
    title: 'Decent Work and Economic Growth',
    overview: 'SDG 8 promotes decent jobs, fair working conditions, inclusive growth, and more sustainable economies.',
    keywords: ['jobs', 'work', 'economy', 'green jobs', 'growth', 'employment'],
    keyFacts: [
      'Green jobs help protect the environment while supporting livelihoods.',
      'Decent work includes safety, fair pay, dignity, and opportunity.',
      'Sustainable growth uses resources wisely instead of wasting them.',
    ],
    commonQuestions: [
      'What are green jobs?',
      'Can economic growth be sustainable?',
      'How do worker rights connect to the SDGs?',
    ],
    studentActions: [
      'Interview someone with a sustainability-related job.',
      'Research one future green career.',
      'Support fair and responsible products when possible.',
    ],
  },
  {
    id: 'sdg-9',
    number: 9,
    title: 'Industry, Innovation and Infrastructure',
    overview: 'SDG 9 supports resilient infrastructure, inclusive industry, and innovation that solves real social and environmental problems.',
    keywords: ['innovation', 'infrastructure', 'industry', 'technology', 'transport', 'resilience'],
    keyFacts: [
      'Resilient infrastructure can withstand climate and disaster risks.',
      'Clean technology helps industries reduce pollution and waste.',
      'Innovation works best when it is accessible and solves local needs.',
    ],
    commonQuestions: [
      'What is sustainable infrastructure?',
      'How can technology help the SDGs?',
      'Why does innovation matter for climate action?',
    ],
    studentActions: [
      'Sketch an eco innovation for your school.',
      'Audit how safe, accessible, and efficient a campus pathway is.',
      'Build a simple prototype from reused materials.',
    ],
  },
  {
    id: 'sdg-10',
    number: 10,
    title: 'Reduced Inequalities',
    overview: 'SDG 10 works to reduce unfair gaps in income, opportunity, safety, and access within and between countries.',
    keywords: ['inequality', 'equity', 'justice', 'inclusion', 'access', 'fairness'],
    keyFacts: [
      'Inequality affects who is most exposed to pollution, heat, and disasters.',
      'Inclusive policies help more people benefit from education, services, and green opportunities.',
      'Listening to affected communities leads to better sustainability decisions.',
    ],
    commonQuestions: [
      'What is climate justice?',
      'Why do inequalities affect sustainability?',
      'How can students make projects more inclusive?',
    ],
    studentActions: [
      'Check whether a project includes different voices and needs.',
      'Map accessibility barriers around school.',
      'Discuss how climate impacts affect groups differently.',
    ],
  },
  {
    id: 'sdg-11',
    number: 11,
    title: 'Sustainable Cities and Communities',
    overview: 'SDG 11 makes cities and communities inclusive, safe, resilient, and sustainable through housing, transport, planning, and green spaces.',
    keywords: ['city', 'cities', 'urban', 'transport', 'community', 'housing', 'pollution'],
    keyFacts: [
      'Green spaces reduce heat, support health, and create habitat.',
      'Public transport, walking, and cycling lower emissions and congestion.',
      'Disaster-ready planning protects communities from floods, heat, and other risks.',
    ],
    commonQuestions: [
      'What makes a city sustainable?',
      'How can students reduce pollution?',
      'Why do cities get hotter than nearby areas?',
    ],
    studentActions: [
      'Choose walking, cycling, bus, or carpooling when safe.',
      'Propose more shade, trees, or safe routes near school.',
      'Organize a local litter or air-quality awareness activity.',
    ],
  },
  {
    id: 'sdg-12',
    number: 12,
    title: 'Responsible Consumption and Production',
    overview: 'SDG 12 encourages reducing waste, reusing materials, recycling correctly, and designing products that use fewer resources.',
    keywords: ['waste', 'recycling', 'plastic', 'consumption', 'production', 'circular'],
    keyFacts: [
      'The circular economy keeps materials in use for longer.',
      'Reducing and reusing usually save more resources than recycling alone.',
      'Food waste, plastic waste, and overconsumption all increase environmental pressure.',
    ],
    commonQuestions: [
      'How can students reduce pollution?',
      'What is responsible consumption?',
      'Why is plastic waste harmful?',
    ],
    studentActions: [
      'Carry a reusable bottle and lunch container.',
      'Sort waste correctly and teach others the system.',
      'Run a plastic-free or low-waste day at school.',
    ],
  },
  {
    id: 'sdg-13',
    number: 13,
    title: 'Climate Action',
    overview: 'SDG 13 calls for urgent action to reduce greenhouse gas emissions, adapt to climate impacts, and improve climate education.',
    keywords: ['climate', 'climate change', 'global warming', 'carbon', 'emissions', 'weather'],
    keyFacts: [
      'Human activities such as burning fossil fuels are the main driver of recent warming.',
      'Climate change increases risks from heat waves, floods, droughts, and stronger storms.',
      'Mitigation lowers emissions, while adaptation prepares people for impacts already happening.',
    ],
    commonQuestions: [
      'What is climate change?',
      'What is the greenhouse effect?',
      'How can students take climate action?',
    ],
    studentActions: [
      'Save energy and track your carbon-saving habits.',
      'Choose lower-carbon transport when safe.',
      'Create a climate action plan for your class or home.',
    ],
  },
  {
    id: 'sdg-14',
    number: 14,
    title: 'Life Below Water',
    overview: 'SDG 14 protects oceans, coasts, marine biodiversity, fisheries, and the communities that depend on them.',
    keywords: ['ocean', 'marine', 'fish', 'coral', 'coast', 'plastic pollution'],
    keyFacts: [
      'Oceans regulate climate and support food, jobs, and biodiversity.',
      'Plastic pollution, overfishing, and warming threaten marine ecosystems.',
      'Healthy coastal habitats protect communities from storms and erosion.',
    ],
    commonQuestions: [
      'Why are oceans important?',
      'How does plastic reach the ocean?',
      'What can students do for marine life?',
    ],
    studentActions: [
      'Reduce single-use plastics.',
      'Join or organize a safe cleanup near drains, rivers, or coasts.',
      'Learn about sustainable seafood and marine protected areas.',
    ],
  },
  {
    id: 'sdg-15',
    number: 15,
    title: 'Life on Land',
    overview: 'SDG 15 protects forests, soil, wildlife, habitats, and biodiversity on land.',
    keywords: ['biodiversity', 'forest', 'wildlife', 'habitat', 'species', 'land'],
    keyFacts: [
      'Biodiversity makes ecosystems more resilient and supports food, medicine, and clean water.',
      'Habitat loss, pollution, invasive species, overuse, and climate change drive biodiversity loss.',
      'Restoration and protected areas help species recover when communities are involved.',
    ],
    commonQuestions: [
      'Explain biodiversity.',
      'Why are forests important?',
      'How can students protect wildlife?',
    ],
    studentActions: [
      'Plant native species where appropriate and permitted.',
      'Document local plants, insects, and birds.',
      'Protect habitats by reducing litter and avoiding disturbance.',
    ],
  },
  {
    id: 'sdg-16',
    number: 16,
    title: 'Peace, Justice and Strong Institutions',
    overview: 'SDG 16 promotes peaceful societies, access to justice, accountable institutions, and participation in decisions.',
    keywords: ['peace', 'justice', 'governance', 'rights', 'institutions', 'accountability'],
    keyFacts: [
      'Strong institutions help enforce environmental laws fairly.',
      'Peace and safety make long-term development possible.',
      'Participation and transparency build trust in public decisions.',
    ],
    commonQuestions: [
      'How does justice connect to the environment?',
      'Why do institutions matter for the SDGs?',
      'How can students participate in community decisions?',
    ],
    studentActions: [
      'Write a respectful letter about a local environmental issue.',
      'Practice evidence-based discussion and peaceful problem solving.',
      'Learn how local decisions are made in your area.',
    ],
  },
  {
    id: 'sdg-17',
    number: 17,
    title: 'Partnerships for the Goals',
    overview: 'SDG 17 focuses on cooperation, finance, technology, data, and partnerships needed to achieve all goals together.',
    keywords: ['partnership', 'cooperation', 'global', 'finance', 'collaboration', 'data'],
    keyFacts: [
      'No single person, school, company, or country can achieve the SDGs alone.',
      'Partnerships share knowledge, funding, technology, and responsibility.',
      'Good data helps communities track progress and improve decisions.',
    ],
    commonQuestions: [
      'Why are partnerships important?',
      'How do the SDGs connect to each other?',
      'How can students collaborate across schools?',
    ],
    studentActions: [
      'Partner with another class on an SDG project.',
      'Invite a local expert to discuss sustainability.',
      'Share project results so others can learn from them.',
    ],
  },
]

export function getSdgKnowledgeById(id: string) {
  return SDG_KNOWLEDGE_BASE.find((entry) => entry.id === id)
}

import { allLessons } from '@/data/mock/lesson-catalog'
import { allMissions } from '@/data/mock/mission-catalog'
import { allQuizzes } from '@/data/mock/quiz-catalog'
import { GAMES_METADATA } from '@/games/configs'
import { DEFAULT_AI_TUTOR_PROMPTS } from '@/ai/data/suggested-prompts'
import { SDG_KNOWLEDGE_BASE, getSdgKnowledgeById } from '@/ai/data/sdg-knowledge-base'
import type {
  AiTutorEngineInput,
  AiTutorEngineResponse,
  AiTutorResource,
  SdgKnowledgeEntry,
} from '@/ai/types/tutor'

const topicAliases: Record<string, string[]> = {
  'sdg-6': ['save water', 'water conservation', 'clean water', 'sanitation'],
  'sdg-11': ['reduce pollution', 'pollution', 'city', 'transport', 'urban'],
  'sdg-12': ['waste', 'recycle', 'plastic', 'pollution', 'consumption'],
  'sdg-13': ['climate change', 'global warming', 'greenhouse', 'carbon'],
  'sdg-15': ['biodiversity', 'wildlife', 'forest', 'habitat'],
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ')
}

function scoreEntry(query: string, entry: SdgKnowledgeEntry) {
  const normalizedTitle = normalize(entry.title)
  const sdgLabel = `sdg ${entry.number}`
  const exactSdgLabel = `sdg-${entry.number}`
  let score = 0

  if (query.includes(sdgLabel) || query.includes(exactSdgLabel)) score += 8
  if (query.includes(normalizedTitle)) score += 5

  for (const keyword of entry.keywords) {
    if (query.includes(normalize(keyword))) score += 3
  }

  for (const alias of topicAliases[entry.id] ?? []) {
    if (query.includes(alias)) score += 4
  }

  return score
}

function detectSdgIds(query: string, preferredSdgIds: string[]) {
  const normalizedQuery = normalize(query)
  const scored = SDG_KNOWLEDGE_BASE.map((entry) => ({
    id: entry.id,
    score: scoreEntry(normalizedQuery, entry),
  }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)

  if (normalizedQuery.includes('what sdg should i focus on') && preferredSdgIds.length > 0) {
    return preferredSdgIds.slice(0, 2)
  }

  if (scored.length > 0) {
    return scored.slice(0, 2).map((entry) => entry.id)
  }

  return preferredSdgIds.slice(0, 1)
}

function lessonResource(lesson: (typeof allLessons)[number]): AiTutorResource {
  return {
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    path: `/lessons/${lesson.sdgId}/${lesson.id}`,
    sdgId: lesson.sdgId,
  }
}

function quizResource(quiz: (typeof allQuizzes)[number]): AiTutorResource {
  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    path: `/quizzes/${quiz.sdgId}/${quiz.id}`,
    sdgId: quiz.sdgId,
  }
}

function missionResource(mission: (typeof allMissions)[number]): AiTutorResource {
  return {
    id: mission.id,
    title: mission.title,
    description: mission.description,
    path: `/missions/${mission.sdgId}/${mission.id}`,
    sdgId: mission.sdgId,
  }
}

function gameResource(game: (typeof GAMES_METADATA)[number]): AiTutorResource {
  const sdgId = game.sdgIds[0] ? `sdg-${game.sdgIds[0]}` : undefined
  return {
    id: game.id,
    title: game.title,
    description: game.description,
    path: `/games/${game.id}`,
    sdgId,
  }
}

function getRelatedResources(sdgIds: string[]) {
  const sdgNumbers = new Set(sdgIds.map((id) => id.replace('sdg-', '')))

  return {
    relatedLessons: allLessons
      .filter((lesson) => sdgIds.includes(lesson.sdgId))
      .slice(0, 3)
      .map(lessonResource),
    relatedQuizzes: allQuizzes
      .filter((quiz) => sdgIds.includes(quiz.sdgId))
      .slice(0, 3)
      .map(quizResource),
    relatedMissions: allMissions
      .filter((mission) => sdgIds.includes(mission.sdgId))
      .slice(0, 3)
      .map(missionResource),
    relatedGames: GAMES_METADATA
      .filter((game) => game.sdgIds.some((id) => sdgNumbers.has(id)))
      .slice(0, 3)
      .map(gameResource),
  }
}

function getLearningStyleLine(input: AiTutorEngineInput) {
  const learningStyle = input.profile?.learningStyle

  if (learningStyle === 'visual') {
    return 'Since you prefer visual learning, try turning the idea into a diagram, mind map, or before-and-after sketch.'
  }
  if (learningStyle === 'interactive') {
    return 'Because you like interactive learning, start with a small experiment, game, or mission after reading the basics.'
  }
  if (learningStyle === 'video') {
    return 'Since videos work well for you, watch a short explainer first, then use a quiz to check what stuck.'
  }
  if (learningStyle === 'reading') {
    return 'Because reading works well for you, begin with the lesson summary and key facts before trying a quiz.'
  }

  return 'Start with one clear concept, then apply it through a quiz, mission, or game.'
}

function getInterestLine(input: AiTutorEngineInput, sdgIds: string[]) {
  const overlappingInterest = input.profile?.impactAreas.find((id) => sdgIds.includes(id))
  if (overlappingInterest) {
    const entry = getSdgKnowledgeById(overlappingInterest)
    if (entry) {
      return `This also matches your impact interests, especially SDG ${entry.number}: ${entry.title}.`
    }
  }

  if (input.ecoProfile) {
    return `Your Eco Profile points toward ${input.ecoProfile.primarySdgTitle}, so I would connect this topic back to that focus when you choose your next activity.`
  }

  return 'Once your Eco Profile is complete, this mentor can tune suggestions more closely to your interests.'
}

function buildResponseText(input: AiTutorEngineInput, entries: SdgKnowledgeEntry[]) {
  const primary = entries[0]
  const question = normalize(input.query)

  if (!primary) {
    return [
      'I can help with SDG concepts, climate action, water, biodiversity, pollution, lessons, quizzes, missions, and games.',
      getLearningStyleLine(input),
      'Try asking about one issue you see around your school or community, and I will connect it to an SDG.',
    ].join('\n\n')
  }

  const intro = question.includes('what sdg should i focus on')
    ? `Based on your profile, I would start with SDG ${primary.number}: ${primary.title}.`
    : `This connects most strongly to SDG ${primary.number}: ${primary.title}.`

  const facts = primary.keyFacts.slice(0, 2).map((fact) => `- ${fact}`).join('\n')
  const actions = primary.studentActions.slice(0, 2).map((action) => `- ${action}`).join('\n')

  return [
    intro,
    primary.overview,
    `Key ideas:\n${facts}`,
    `Student actions:\n${actions}`,
    getLearningStyleLine(input),
    getInterestLine(input, entries.map((entry) => entry.id)),
  ].join('\n\n')
}

function buildSuggestedPrompts(entries: SdgKnowledgeEntry[]) {
  const contextual = entries.flatMap((entry) => entry.commonQuestions).slice(0, 3)
  return [...contextual, ...DEFAULT_AI_TUTOR_PROMPTS]
    .filter((prompt, index, prompts) => prompts.indexOf(prompt) === index)
    .slice(0, 5)
}

export function generateAiTutorResponse(input: AiTutorEngineInput): AiTutorEngineResponse {
  const detectedSdgIds = detectSdgIds(input.query, input.preferredSdgIds)
  const entries = detectedSdgIds
    .map((id) => getSdgKnowledgeById(id))
    .filter((entry): entry is SdgKnowledgeEntry => Boolean(entry))
  const resources = getRelatedResources(detectedSdgIds)

  return {
    content: buildResponseText(input, entries),
    detectedSdgIds,
    suggestedPrompts: buildSuggestedPrompts(entries),
    ...resources,
  }
}

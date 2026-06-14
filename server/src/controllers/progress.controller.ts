import { AchievementModel } from '../models/Achievement.js'
import { GameProgressModel } from '../models/GameProgress.js'
import { UserModel } from '../models/User.js'
import { ImpactRecordModel } from '../models/ImpactRecord.js'
import { LessonProgressModel } from '../models/LessonProgress.js'
import { MissionSubmissionModel } from '../models/MissionSubmission.js'
import { QuizResultModel } from '../models/QuizResult.js'
import { asyncHandler } from '../utils/async-handler.js'
import { createHttpError } from '../utils/http-error.js'

function requireUserId(req: Express.Request) {
  if (!req.user) {
    throw createHttpError(401, 'Authentication is required.')
  }
  return req.user.mongoId
}

export const getProgressSummary = asyncHandler(async (req, res) => {
  const userId = requireUserId(req)
  const [
    lessons,
    quizzes,
    missions,
    games,
    achievements,
    impactRecords,
  ] = await Promise.all([
    LessonProgressModel.find({ userId }).sort({ updatedAt: -1 }),
    QuizResultModel.find({ userId }).sort({ createdAt: -1 }),
    MissionSubmissionModel.find({ userId }).sort({ createdAt: -1 }),
    GameProgressModel.find({ userId }).sort({ updatedAt: -1 }),
    AchievementModel.find({ userId }).sort({ unlockedAt: -1 }),
    ImpactRecordModel.find({ userId }).sort({ createdAt: -1 }),
  ])

  res.json({ lessons, quizzes, missions, games, achievements, impactRecords })
})

export const upsertLessonProgress = asyncHandler(async (req, res) => {
  const userId = requireUserId(req)
  const { lessonId, completed } = req.body
  if (typeof lessonId !== 'string') {
    throw createHttpError(400, 'lessonId is required.')
  }

  const record = await LessonProgressModel.findOneAndUpdate(
    { userId, lessonId },
    {
      completed: Boolean(completed),
      completedAt: completed ? new Date() : undefined,
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  )

  res.json({ lessonProgress: record })
})

export const createQuizResult = asyncHandler(async (req, res) => {
  const userId = requireUserId(req)
  const { quizId, score, accuracy, timeTaken } = req.body
  if (typeof quizId !== 'string') {
    throw createHttpError(400, 'quizId is required.')
  }

  const result = await QuizResultModel.create({
    userId,
    quizId,
    score: Number(score ?? 0),
    accuracy: Number(accuracy ?? 0),
    timeTaken: Number(timeTaken ?? 0),
  })

  res.status(201).json({ quizResult: result })
})

export const submitMission = asyncHandler(async (req, res) => {
  const userId = requireUserId(req)
  const { missionId, notes } = req.body
  if (typeof missionId !== 'string' || typeof notes !== 'string') {
    throw createHttpError(400, 'missionId and notes are required.')
  }

  const imageUrl = req.file ? `/uploads/${req.file.originalname}` : req.body.imageUrl ?? ''
  const submission = await MissionSubmissionModel.create({
    userId,
    missionId,
    notes,
    imageUrl,
    status: 'submitted',
  })

  res.status(201).json({ missionSubmission: submission })
})

export const upsertGameProgress = asyncHandler(async (req, res) => {
  const userId = requireUserId(req)
  const {
    gameId,
    score,
    completed,
    completionTime,
    isUnlocked,
    isCompleted,
    bestScore,
    lastPlayedAt,
    progressValue,
    timesPlayed,
    completionCount,
    averageScore,
  } = req.body

  if (typeof gameId !== 'string') {
    throw createHttpError(400, 'gameId is required.')
  }

  const updateFields: any = {
    score: Number(score ?? 0),
    completed: Boolean(completed),
    completionTime: Number(completionTime ?? 0),
  }

  if (typeof isUnlocked === 'boolean') updateFields.isUnlocked = isUnlocked
  if (typeof isCompleted === 'boolean') updateFields.isCompleted = isCompleted
  if (typeof bestScore === 'number') updateFields.bestScore = bestScore
  if (lastPlayedAt) updateFields.lastPlayedAt = new Date(lastPlayedAt)
  if (typeof progressValue === 'number') updateFields.progressValue = progressValue
  if (typeof timesPlayed === 'number') updateFields.timesPlayed = timesPlayed
  if (typeof completionCount === 'number') updateFields.completionCount = completionCount
  if (typeof averageScore === 'number') updateFields.averageScore = averageScore

  const record = await GameProgressModel.findOneAndUpdate(
    { userId, gameId },
    updateFields,
    { new: true, upsert: true, setDefaultsOnInsert: true },
  )

  res.json({ gameProgress: record })
})

export const unlockAchievement = asyncHandler(async (req, res) => {
  const userId = requireUserId(req)
  const { achievementId } = req.body
  if (typeof achievementId !== 'string') {
    throw createHttpError(400, 'achievementId is required.')
  }

  const achievement = await AchievementModel.findOneAndUpdate(
    { userId, achievementId },
    { unlockedAt: new Date() },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  )

  res.json({ achievement })
})

export const createImpactRecord = asyncHandler(async (req, res) => {
  const userId = requireUserId(req)
  const record = await ImpactRecordModel.create({
    userId,
    waterSaved: Number(req.body.waterSaved ?? 0),
    treesPlanted: Number(req.body.treesPlanted ?? 0),
    co2Reduced: Number(req.body.co2Reduced ?? 0),
    plasticAvoided: Number(req.body.plasticAvoided ?? 0),
  })

  res.status(201).json({ impactRecord: record })
})

export const getImpactRecords = asyncHandler(async (req, res) => {
  const userId = requireUserId(req)
  const records = await ImpactRecordModel.find({ userId }).sort({ createdAt: -1 })
  res.json({ impactRecords: records })
})


export const updateUserGamification = asyncHandler(async (req, res) => {
  const userId = requireUserId(req)
  const { xp, level, ecoCoins } = req.body

  const user = await UserModel.findById(userId)
  if (!user) {
    throw createHttpError(404, 'User not found.')
  }

  if (typeof xp === 'number') user.xp = xp
  if (typeof level === 'number') user.level = level
  if (typeof ecoCoins === 'number') user.ecoCoins = ecoCoins

  await user.save()
  res.json({ user: user.toJSON() })
})

export const getRecommendations = asyncHandler(async (req, res) => {
  const userId = requireUserId(req)
  const user = await UserModel.findById(userId)
  if (!user) {
    throw createHttpError(404, 'User not found.')
  }

  const profile = user.profile as any
  const primarySdg = profile?.primarySdgFocusId ?? 'sdg-13'

  res.json({
    recommendedSdgId: primarySdg,
    recommendedLessonId: primarySdg === 'sdg-13' ? 'climate-basics' : 'water-conservation',
    recommendedQuizId: primarySdg === 'sdg-13' ? 'climate-basics-quiz' : 'water-conservation-quiz',
    recommendedMissionId: primarySdg === 'sdg-13' ? 'climate-action-week' : 'water-week',
    recommendedGameId: primarySdg === 'sdg-13' ? 'carbon-dash' : 'waste-sorting',
  })
})



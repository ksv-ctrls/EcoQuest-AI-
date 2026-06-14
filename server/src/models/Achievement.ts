import mongoose, { Schema, type InferSchemaType } from 'mongoose'

const achievementSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    achievementId: { type: String, required: true, trim: true },
    unlockedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

achievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true })

export type Achievement = InferSchemaType<typeof achievementSchema>
export const AchievementModel = mongoose.model('Achievement', achievementSchema)

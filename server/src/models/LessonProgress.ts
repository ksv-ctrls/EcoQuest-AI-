import mongoose, { Schema, type InferSchemaType } from 'mongoose'

const lessonProgressSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    lessonId: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
  },
  { timestamps: true },
)

lessonProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true })

export type LessonProgress = InferSchemaType<typeof lessonProgressSchema>
export const LessonProgressModel = mongoose.model('LessonProgress', lessonProgressSchema)

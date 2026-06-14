import mongoose, { Schema, type InferSchemaType } from 'mongoose'

const impactRecordSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    waterSaved: { type: Number, default: 0, min: 0 },
    treesPlanted: { type: Number, default: 0, min: 0 },
    co2Reduced: { type: Number, default: 0, min: 0 },
    plasticAvoided: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
)

impactRecordSchema.index({ userId: 1, createdAt: -1 })

export type ImpactRecord = InferSchemaType<typeof impactRecordSchema>
export const ImpactRecordModel = mongoose.model('ImpactRecord', impactRecordSchema)

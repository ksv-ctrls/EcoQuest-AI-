import mongoose, { Schema, type InferSchemaType } from 'mongoose'

const missionSubmissionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    missionId: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: '' },
    notes: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['submitted', 'approved', 'rejected', 'completed'],
      default: 'submitted',
      index: true,
    },
  },
  { timestamps: true },
)

missionSubmissionSchema.index({ userId: 1, missionId: 1, createdAt: -1 })

export type MissionSubmission = InferSchemaType<typeof missionSubmissionSchema>
export const MissionSubmissionModel = mongoose.model('MissionSubmission', missionSubmissionSchema)

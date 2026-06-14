import mongoose, { Schema, type InferSchemaType, type HydratedDocument } from 'mongoose'

const userProfileSchema = new Schema(
  {
    displayName: { type: String, default: '' },
    fullName: { type: String, default: '' },
    age: { type: Number, default: 0 },
    education: { type: String, default: 'other' },
    learningStyle: { type: String, default: 'interactive' },
    personalityType: { type: String, default: 'explorer' },
    impactAreas: { type: [String], default: [] },
    sustainabilityHabits: { type: [String], default: [] },
  },
  { _id: false }
)

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true, select: false },
    profile: { type: userProfileSchema, default: () => ({}) },
    level: { type: Number, default: 1, min: 1 },
    xp: { type: Number, default: 0, min: 0 },
    ecoCoins: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
)


userSchema.set('toJSON', {
  transform(_doc, ret) {
    const record = ret as Record<string, unknown> & { _id?: { toString: () => string } }
    record.id = record._id?.toString()
    delete record._id
    delete record.__v
    delete record.password
    return record
  },
})

export type User = InferSchemaType<typeof userSchema>
export type UserDocument = HydratedDocument<User>

export const UserModel = mongoose.model('User', userSchema)
